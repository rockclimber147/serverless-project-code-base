import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { DynamoTablesConstruct } from "../DynamoDb/tables";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";

interface SearchListingsProps {
  api: CRUDGatewayConstruct;
  tables: DynamoTablesConstruct;
}

export class SearchListingsFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: SearchListingsProps) {
    super(scope, id);

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
}
