import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";

import { CognitoConstruct } from "../Cognito/cognito";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { DynamoTablesConstruct } from "../DynamoDb/tables";


interface ListingsFeatureProps {
  tables: DynamoTablesConstruct;
  api: CRUDGatewayConstruct;
  auth: CognitoConstruct;
}

export class ListingsFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ListingsFeatureProps) {
    super(scope, id);

    // --- Helper to create lambdas ---
    const createLambda = (name: string, handler: string) =>
      new lambda.Function(this, name, {
        runtime: lambda.Runtime.PYTHON_3_11,
        handler,
        code: lambda.Code.fromAsset("lambdas/userListingCRUD"),
        environment: {
          LISTINGS_TABLE: props.tables.listingsTable.tableName,
          USER_POOL_ID: props.auth.userPool.userPoolId,
        },
      });

    // --- Cognito authorizer ---
    const userAuthorizer = new apigw.CognitoUserPoolsAuthorizer(this, "UserPoolAuthorizer", {
      cognitoUserPools: [props.auth.userPool],
    });

    // --- Single Lambda for all CUD operations ---
    const listingCUDLambda = createLambda("listingCUDLambda", "listing_cud.lambda_handler");
    props.tables.listingsTable.grantReadWriteData(listingCUDLambda);

    // --- /user/listings resource ---
    const listingsResource = props.api.userResource.addResource("listings");

    // POST /user/listings — Create a new listing
    listingsResource.addMethod("POST", new apigw.LambdaIntegration(listingCUDLambda), {
      authorizer: userAuthorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    });

    // PATCH /user/listings — Update an existing listing
    listingsResource.addMethod("PATCH", new apigw.LambdaIntegration(listingCUDLambda), {
      authorizer: userAuthorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    });

    // DELETE /user/listings — Delete a listing
    listingsResource.addMethod("DELETE", new apigw.LambdaIntegration(listingCUDLambda), {
      authorizer: userAuthorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    });
  }
}
