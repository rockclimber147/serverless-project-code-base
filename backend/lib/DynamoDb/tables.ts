import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DynamoTablesConstruct extends Construct {
  public readonly userTable: dynamodb.ITable;
  public readonly listingsTable: dynamodb.Table;
  public readonly chatTable: dynamodb.Table;
  public readonly favouritesTable: dynamodb.Table;

  constructor(scope: Construct, id: string, usersTableArn: string) {
    super(scope, id);

    this.userTable = dynamodb.Table.fromTableArn(this, "UserTable", usersTableArn);

    const tableName = `Listings-${cdk.Stack.of(this).account}-${cdk.Stack.of(this).region}`;
    this.listingsTable = new dynamodb.Table(this, "ListingsTable", {
      tableName: tableName,
      partitionKey: { name: "listing_id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.listingsTable.addGlobalSecondaryIndex({
      indexName: "owner-id-index",
      partitionKey: { name: "owner_id", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const chatTableName = `LiveChat-${cdk.Stack.of(this).account}-${cdk.Stack.of(this).region}`;
    this.chatTable = new dynamodb.Table(this, "ChatTable", {
      tableName: chatTableName,
      partitionKey: { name: "chatId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const favouritesTableName = `Favourites-${cdk.Stack.of(this).account}-${cdk.Stack.of(this).region}`;
    this.favouritesTable = new dynamodb.Table(this, "FavouritesTable", {
      tableName: favouritesTableName,
      partitionKey: { name: "user_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "listing_id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
