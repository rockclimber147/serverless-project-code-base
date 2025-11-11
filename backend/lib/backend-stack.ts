import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoConstruct } from './Cognito/cognito';
import { CRUDGatewayConstruct } from './ApiGateway/gateway';
import { DynamoTableConstruct } from './DynamoDb/tables';
import { SecretsManagerConstruct } from './Cognito/secretsManager';
import { UserSignupFeatureConstruct } from './features/UserAccountFeature';

export class ProductionStack extends cdk.Stack {
  public readonly cognitoConstruct: CognitoConstruct;
  public readonly gatewayConstruct: CRUDGatewayConstruct;
  public readonly dynamoTable: DynamoTableConstruct;
  public readonly secretManager: SecretsManagerConstruct;
  public readonly userAccountFeature: UserSignupFeatureConstruct;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.cognitoConstruct = new CognitoConstruct(this, "Cognito");

    this.gatewayConstruct = new CRUDGatewayConstruct(this, "CrusGateway");

    this.dynamoTable = new DynamoTableConstruct(this, "DynamoTables");

    this.secretManager = new SecretsManagerConstruct(this, "CognitoClientSecret", {
      secretName: "UserPoolClientSecret",
      clientSecret: this.cognitoConstruct.userPoolClient.userPoolClientSecret!,
    });

    this.userAccountFeature = new UserSignupFeatureConstruct(this, "userSignup", {
      cognito: this.cognitoConstruct,
      secretManager: this.secretManager,
      api: this.gatewayConstruct,
      tables: this.dynamoTable,
    });
  }
}
