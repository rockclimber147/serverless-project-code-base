import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // PoC only
    });

    // GET Lambda
    const getItemsLambda = new lambda.Function(this, 'GetItemsLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambdas'),
      handler: 'getItems.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // POST Lambda
    const addItemLambda = new lambda.Function(this, 'AddItemLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambdas'),
      handler: 'addItem.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Give both Lambdas access to DynamoDB
    table.grantReadData(getItemsLambda);
    table.grantWriteData(addItemLambda);

    // API Gateway
    const api = new apigw.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service',
      deployOptions: { stageName: 'prod' },
    });

    const items = api.root.addResource('items');

    items.addMethod('GET', new apigw.LambdaIntegration(getItemsLambda));
    items.addMethod('POST', new apigw.LambdaIntegration(addItemLambda));

    // 5️⃣ Outputs
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
  }
}
