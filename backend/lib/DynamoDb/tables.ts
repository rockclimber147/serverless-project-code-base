import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DynamoTableConstruct extends Construct {
  public static readonly USER_TABLE_NAME = "UserTable";
  public readonly userTable: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userTable = new dynamodb.Table(
      this,
      DynamoTableConstruct.USER_TABLE_NAME,
      {
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY, // for PoC
      }
    );

    this.userTable.addGlobalSecondaryIndex({
      indexName: "email-index",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
