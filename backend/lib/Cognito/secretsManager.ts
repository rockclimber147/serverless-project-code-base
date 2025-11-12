import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

interface SecretsManagerConstructProps {
  clientSecret: cdk.SecretValue;
  secretName: string;
}

export class SecretsManagerConstruct extends Construct {
  public readonly secret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: SecretsManagerConstructProps) {
    super(scope, id);

    this.secret = new secretsmanager.Secret(this, "CognitoClientSecret", {
      secretName: props.secretName,
      secretStringValue: props.clientSecret,
    });
  }
}