import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { API_ENDPOINTS } from './endpoints';

export interface ApiGatewayProps {
  stageName?: string;
}

export class CRUDGatewayConstruct extends Construct {
  public readonly api: apigw.RestApi;
  public readonly publicResource: apigw.Resource;
  public readonly authResource: apigw.Resource;
  public readonly userResource: apigw.Resource;
  public readonly adminResource: apigw.Resource;

  constructor(scope: Construct, id: string, props?: ApiGatewayProps) {
    super(scope, id);

    this.api = new apigw.RestApi(this, 'CRUDApi', {
      restApiName: 'CRUD API',
      deployOptions: { stageName: props?.stageName ?? 'prod' },
    });

    this.publicResource = this.api.root.addResource(API_ENDPOINTS.public.value);
    this.authResource = this.api.root.addResource(API_ENDPOINTS.auth.value);
    this.userResource = this.api.root.addResource(API_ENDPOINTS.user.value);
    this.adminResource = this.api.root.addResource(API_ENDPOINTS.admin.value);
  }
}