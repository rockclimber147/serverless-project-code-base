import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as apigw from "aws-cdk-lib/aws-apigateway";

import { DynamoTablesConstruct } from "../DynamoDb/tables";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { CognitoConstruct } from "../Cognito/cognito";

interface SearchListingsProps {
  api: CRUDGatewayConstruct;
  tables: DynamoTablesConstruct;
  auth: CognitoConstruct;
}

export class SearchListingsFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: SearchListingsProps) {
    super(scope, id);

    const userAuthorizer = new apigw.CognitoUserPoolsAuthorizer(this, "UserPoolAuthorizer", {
      cognitoUserPools: [props.auth.userPool],
    });

    // Lambda for searching listings
    const searchLambda = new lambda.Function(this, "SearchListingsLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "search.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/searchListings"),
      environment: {
        LISTINGS_TABLE: props.tables.listingsTable.tableName,
      },
    });

    props.tables.listingsTable.grantReadData(searchLambda);

    const search = props.api.publicResource.addResource("search");
    search.addMethod("GET", new apigateway.LambdaIntegration(searchLambda), {
      authorizationType: apigateway.AuthorizationType.NONE,
    });

    // Lambda for getting all of a user's listings
    const userListingsLambda = new lambda.Function(this, "userListingsLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "get_user_listings.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/searchListings"),
      environment: {
        LISTINGS_TABLE: props.tables.listingsTable.tableName,
      },
    });
    
    props.tables.listingsTable.grantReadData(userListingsLambda);
    const userListings = props.api.publicResource.addResource("userListings");
    userListings.addMethod("GET", new apigateway.LambdaIntegration(userListingsLambda), {
      authorizationType: apigateway.AuthorizationType.NONE,
    });

    // Lambda for getting all of logged in user's favourited listings
    const favouritedListingsLambda = new lambda.Function(this, "favouritedListingsLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "get_user_favourited_listings.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/searchListings"),
      environment: {
        LISTINGS_TABLE: props.tables.listingsTable.tableName,
        FAVOURITES_TABLE: props.tables.favouritesTable.tableName
      },
    });
    
    props.tables.listingsTable.grantReadData(favouritedListingsLambda);
    props.tables.favouritesTable.grantReadData(favouritedListingsLambda);
    const favouritedListings = props.api.userResource.addResource("favouritedListings");
    this.addMethodWithAuthorizer(favouritedListings, "GET", favouritedListingsLambda, userAuthorizer);
    favouritedListings.addCorsPreflight({
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["OPTIONS", "GET"],
    });

    // Lambda for getting listing by id
    const getListingByIdLambda = new lambda.Function(
      this,
      "GetListingByIdLambda",
      {
        runtime: lambda.Runtime.PYTHON_3_11,
        handler: "get_listing_by_id.lambda_handler",
        code: lambda.Code.fromAsset("lambdas/searchListings"),
        environment: {
          LISTINGS_TABLE: props.tables.listingsTable.tableName,
        },
      }
    );

    props.tables.listingsTable.grantReadData(getListingByIdLambda);

    const getListingById = props.api.publicResource.addResource("listing");
    getListingById.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getListingByIdLambda),
      {
        authorizationType: apigateway.AuthorizationType.NONE,
      }
    );


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
