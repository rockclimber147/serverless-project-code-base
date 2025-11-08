import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export interface ApiGatewayProps {
  stageName?: string;
}

export class CRUDGatewayConstruct extends Construct {
  public readonly api: apigw.RestApi;

  constructor(scope: Construct, id: string, props?: ApiGatewayProps) {
    super(scope, id);

    this.api = new apigw.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service',
      deployOptions: { stageName: props?.stageName ?? 'prod' },
    });
  }
}