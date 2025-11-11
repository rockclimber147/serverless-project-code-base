import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export interface CognitoConstructProps {
  readonly enableSelfSignupForUserPool?: boolean;
}

export class CognitoConstruct extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly adminPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly adminPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: CognitoConstructProps) {
    super(scope, id);

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'UserPool',
      selfSignUpEnabled: props?.enableSelfSignupForUserPool ?? true,
      signInAliases: { email: true },
    });

    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      generateSecret: true,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
      },
    });

    this.adminPool = new cognito.UserPool(this, 'AdminPool', {
      userPoolName: 'AdminPool',
      selfSignUpEnabled: false,
      signInAliases: { email: true },
    });

    this.adminPoolClient = new cognito.UserPoolClient(this, 'AdminPoolClient', {
      userPool: this.adminPool,
      generateSecret: true,
      authFlows: {
        userPassword: true,
      },
    });
  }
}
