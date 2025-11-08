import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ItemsTable extends Construct {
    public readonly table: dynamodb.Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.table = new dynamodb.Table(this, 'ItemsTable', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY, // for PoC
        });
    }
}