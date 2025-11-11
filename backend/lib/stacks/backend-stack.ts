import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoConstruct } from "../Cognito/cognito";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { DynamoTablesConstruct } from "../DynamoDb/tables";
import { ListingsFeatureConstruct } from "../features/UserListingCRUD";

export class ProductionStack extends cdk.Stack {
  public readonly cognitoConstruct: CognitoConstruct;
  public readonly gatewayConstruct: CRUDGatewayConstruct;
  public readonly dynamoTable: DynamoTablesConstruct;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.cognitoConstruct = new CognitoConstruct(this, "Cognito", {
      userPoolArn:
        "arn:aws:cognito-idp:us-west-2:552256739229:userpool/us-west-2_E7ZiSeuwQ",
      adminPoolArn:
        "arn:aws:cognito-idp:us-west-2:552256739229:userpool/us-west-2_nlyMhwOlw",
    });

    this.gatewayConstruct = new CRUDGatewayConstruct(this, "CrudGateway");

    this.dynamoTable = new DynamoTablesConstruct(
      this,
      "DynamoTables",
      "arn:aws:dynamodb:us-west-2:552256739229:table/usertable"
    );

    const listingFeature = new ListingsFeatureConstruct(this, "ListingFeature", {
      tables: this.dynamoTable,
      auth: this.cognitoConstruct,
      api: this.gatewayConstruct,
    })
  }
}
