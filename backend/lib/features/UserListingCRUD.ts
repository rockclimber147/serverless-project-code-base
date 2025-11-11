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
  public readonly createListingLambda: lambda.Function;
  public readonly getListingsLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: ListingsFeatureProps) {
    super(scope, id);

    // --- Helper to create Lambdas ---
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
  }
}
