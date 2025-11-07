import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

interface GetItemsLambdaProps {
    tableName: string;
}

export class GetItemsLambda extends Construct {
    public readonly lambdaFunction: lambda.Function;

    constructor(scope: Construct, id: string, props: GetItemsLambdaProps) {
        super(scope, id);

        this.lambdaFunction = new lambda.Function(this, 'GetItemsLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            code: lambda.Code.fromAsset(path.join(__dirname)), // folder containing handler.mjs
            handler: 'handler.handler', // filename + exported function
            environment: {
                TABLE_NAME: props.tableName,
            },
        });
    }
}
