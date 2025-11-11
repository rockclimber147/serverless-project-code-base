import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DemoCognitoConstruct } from "../Cognito/cognito";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { DynamoTableDemoConstruct } from "../DynamoDb/demo";
import { SecretsManagerConstruct } from "../Cognito/secretsManager";
import { UserAuthFeatureConstruct } from "../features/_DemoUserAuthFeature";

export class ProductionStack extends cdk.Stack {
  public readonly cognitoConstruct: DemoCognitoConstruct;
  public readonly gatewayConstruct: CRUDGatewayConstruct;
  public readonly dynamoTable: DynamoTableDemoConstruct;
  public readonly secretManager: SecretsManagerConstruct;
  public readonly userAccountFeature: UserAuthFeatureConstruct;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.cognitoConstruct = new DemoCognitoConstruct(this, "Cognito");

    this.gatewayConstruct = new CRUDGatewayConstruct(this, "CrusGateway");

    this.dynamoTable = new DynamoTableDemoConstruct(this, "DynamoTables");

    this.secretManager = new SecretsManagerConstruct(
      this,
      "CognitoClientSecret",
      {
        secretName: "UserPoolClientSecret",
        clientSecret:
          this.cognitoConstruct.userPoolClient.userPoolClientSecret!,
      }
    );

    this.userAccountFeature = new UserAuthFeatureConstruct(this, "userSignup", {
      cognito: this.cognitoConstruct,
      secretManager: this.secretManager,
      api: this.gatewayConstruct,
      tables: this.dynamoTable,
    });
  }
}
