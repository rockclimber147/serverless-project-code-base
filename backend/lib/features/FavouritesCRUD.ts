import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { DynamoTablesConstruct } from "../DynamoDb/tables";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { CognitoConstruct } from "../Cognito/cognito";

interface FavouritesProps {
  api: CRUDGatewayConstruct;
  tables: DynamoTablesConstruct;
  auth: CognitoConstruct;
}

export class FavouritesFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: FavouritesProps) {
    super(scope, id);

    const userAuthorizer = new apigw.CognitoUserPoolsAuthorizer(this, "UserPoolAuthorizer", {
          cognitoUserPools: [props.auth.userPool],
    });

    const favouritesLambda = new lambda.Function(this, "FavouritesCRUDLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "favourites.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/favourites"),
      environment: {
        FAVOURITES_TABLE: props.tables.favouritesTable.tableName,
      },
    });

    props.tables.favouritesTable.grantReadWriteData(favouritesLambda);

    const favouritesResource = props.api.userResource.addResource("favourites");
    this.addMethodWithAuthorizer(favouritesResource, "POST", favouritesLambda, userAuthorizer);
    this.addMethodWithAuthorizer(favouritesResource, "DELETE", favouritesLambda, userAuthorizer);
    this.addMethodWithAuthorizer(favouritesResource, "GET", favouritesLambda, userAuthorizer);
    favouritesResource.addCorsPreflight({
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["OPTIONS", "POST", "GET", "DELETE"],
    });
  }

private addMethodWithAuthorizer(
      resource: apigw.IResource,
      method: string,
      lambdaFn: lambda.IFunction,
      authorizer: apigw.IAuthorizer
    ) {
      resource.addMethod(method, new apigw.LambdaIntegration(lambdaFn), {
        authorizer,
        authorizationType: apigw.AuthorizationType.COGNITO,
      });
    }
}
