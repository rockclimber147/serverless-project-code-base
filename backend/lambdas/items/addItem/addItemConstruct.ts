import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

interface AddItemLambdaProps {
    tableName: string;
}

export class AddItemLambda extends Construct {
    public readonly lambdaFunction: lambda.Function;

    constructor(scope: Construct, id: string, props: AddItemLambdaProps) {
        super(scope, id);

        this.lambdaFunction = new lambda.Function(this, 'AddItemLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            code: lambda.Code.fromAsset(path.join(__dirname)), // points to folder containing handler.mjs
            handler: 'handler.handler', // filename + export
            environment: {
                TABLE_NAME: props.tableName,
            },
        });
    }
}
