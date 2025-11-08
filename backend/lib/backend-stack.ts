import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { CRUDGatewayConstruct as CRUDGateway } from './ApiGateway/gateway';
import { ItemsTable } from '../dynamo/itemsTable';
import { ItemsFeature } from '../lambdas/items/itemsIntegrationConstruct';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const itemsTable = new ItemsTable(this, "ItemsTable");
    const crudGateway = new CRUDGateway(this, "CRUDGateway");

    // Create the Items feature (table + lambdas + permissions)
    const itemsFeature = new ItemsFeature(this, 'ItemsFeature', {table: itemsTable, crudGateway: crudGateway});

    // Optional outputs
    new cdk.CfnOutput(this, 'ApiUrl', { value: crudGateway.api.url });
    new cdk.CfnOutput(this, 'TableName', { value: itemsFeature.table.table.tableName });
  }
}