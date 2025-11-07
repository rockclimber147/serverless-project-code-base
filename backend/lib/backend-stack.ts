import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { ItemsFeature } from '../lambdas/items/itemsIntegrationConstruct';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Items feature (table + lambdas + permissions)
    const itemsFeature = new ItemsFeature(this, 'ItemsFeature');

    // API Gateway
    const api = new apigw.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service',
      deployOptions: { stageName: 'prod' },
    });

    // Add /items resource
    const items = api.root.addResource('items');
    items.addMethod('GET', new apigw.LambdaIntegration(itemsFeature.getItemLambda.lambdaFunction));
    items.addMethod('POST', new apigw.LambdaIntegration(itemsFeature.addItemLambda.lambdaFunction));

    // Optional outputs
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'TableName', { value: itemsFeature.table.table.tableName });
  }
}