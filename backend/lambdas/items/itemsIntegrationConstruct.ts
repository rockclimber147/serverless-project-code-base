import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { ItemsTable } from '../../lib/DynamoDb/itemsTable';
import { CRUDGatewayConstruct } from '../../lib/ApiGateway/gateway';
import { AddItemLambda } from './addItem/addItemConstruct';
import { GetItemsLambda } from './getItems/getItemsConstruct';


interface ItemsFeatureProps {
  table: ItemsTable;
  crudGateway: CRUDGatewayConstruct;
}

export class ItemsFeature extends Construct {
  public readonly addItemLambda: AddItemLambda;
  public readonly getItemLambda: GetItemsLambda;
  public readonly table: ItemsTable;
  public readonly crudGateway: CRUDGatewayConstruct;

  constructor(scope: Construct, id: string, props: ItemsFeatureProps) {
    super(scope, id);

    // Use the passed-in table
    this.table = props.table;
    this.crudGateway = props.crudGateway;

    // Create lambdas
    this.addItemLambda = new AddItemLambda(this, 'AddItemLambda', {
      tableName: this.table.table.tableName,
    });
    this.getItemLambda = new GetItemsLambda(this, 'GetItemLambda', {
      tableName: this.table.table.tableName,
    });

    // Grant permissions
    this.table.table.grantReadData(this.getItemLambda.lambdaFunction);
    this.table.table.grantWriteData(this.addItemLambda.lambdaFunction);

    // Wire the API Gateway
    const itemsResource = this.crudGateway.api.root.addResource('items');
    itemsResource.addMethod('GET', new apigw.LambdaIntegration(this.getItemLambda.lambdaFunction));
    itemsResource.addMethod('POST', new apigw.LambdaIntegration(this.addItemLambda.lambdaFunction));
  }
}
