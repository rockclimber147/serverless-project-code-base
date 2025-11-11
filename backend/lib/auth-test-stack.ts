import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { CognitoConstruct } from './Cognito/cognito';
import { CRUDGatewayConstruct } from './ApiGateway/gateway';
import { DynamoTableConstruct } from './DynamoDb/tables';
import { SecretsManagerConstruct } from './Cognito/secretsManager';
import { UserSignupFeatureConstruct } from './features/UserAccountFeature';

export interface AuthApiStackProps extends cdk.StackProps {
  readonly cognitoConstruct: CognitoConstruct;
  readonly gatewayConstruct: CRUDGatewayConstruct;
  readonly dynamoTable: DynamoTableConstruct;
  readonly secretManager: SecretsManagerConstruct;
}

export class AuthApiStack extends cdk.Stack {
  public readonly userAccountFeature: UserSignupFeatureConstruct;

  constructor(scope: Construct, id: string, props: AuthApiStackProps) {
    super(scope, id, props);

    this.userAccountFeature = new UserSignupFeatureConstruct(this, "userSignup", {
      cognito: props.cognitoConstruct,
      secretManager: props.secretManager,
      api: props.gatewayConstruct,
      tables: props.dynamoTable,
    });
  }
}