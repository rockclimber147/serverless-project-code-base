import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ItemsTable } from '../../dynamo/itemsTable';
import { AddItemLambda } from './addItem/addItemConstruct';
import { GetItemsLambda } from './getItems/getItemsConstruct';


export class ItemsFeature extends Construct {
    public readonly addItemLambda: AddItemLambda;
    public readonly getItemLambda: GetItemsLambda;
    public readonly table: ItemsTable;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Create table
        this.table = new ItemsTable(this, 'ItemsTable');

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
    }
}
