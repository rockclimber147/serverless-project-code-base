import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DynamoTablesConstruct extends Construct {
  public readonly userTable: dynamodb.ITable;
  public readonly listingsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, usersTableArn: string) {
    super(scope, id);

    this.userTable = dynamodb.Table.fromTableArn(this, "UserTable", usersTableArn);

    const tableName = `Listings-${cdk.Stack.of(this).account}-${cdk.Stack.of(this).region}`;
    this.listingsTable = new dynamodb.Table(this, "ListingsTable", {
      tableName: tableName,
      partitionKey: { name: "listing_id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // safe for PoC
    });

    this.listingsTable.addGlobalSecondaryIndex({
      indexName: "owner-id-index",
      partitionKey: { name: "owner_id", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
