import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { CognitoConstruct } from "../Cognito/cognito";
import { SecretsManagerConstruct } from "../Cognito/secretsManager";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { DynamoTableConstruct } from "../DynamoDb/tables";

export interface UserSignupFeatureProps {
  cognito: CognitoConstruct;
  secretManager: SecretsManagerConstruct;
  api: CRUDGatewayConstruct;
  tables: DynamoTableConstruct;
}

export class UserSignupFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: UserSignupFeatureProps) {
    super(scope, id);

    //
    // --- Lambda ---
    //
    const signupLambda = new lambda.Function(this, "UserSignupLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "signup.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/userFeature"),
      environment: {
        USER_POOL_ID: props.cognito.userPool.userPoolId,
        CLIENT_ID: props.cognito.userPoolClient.userPoolClientId,
        DYNAMODB_TABLE: props.tables.userTable.tableName,
        CLIENT_SECRET_ARN: props.secretManager.secret.secretArn, // pass the secret ARN
      },
    });

    const signinLambda = new lambda.Function(this, "UserSigninLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "signin.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/userFeature"),
      environment: {
        USER_POOL_ID: props.cognito.userPool.userPoolId,
        CLIENT_ID: props.cognito.userPoolClient.userPoolClientId,
        CLIENT_SECRET_ARN: props.secretManager.secret.secretArn,
      },
    });

    const confirmUserLambda = new lambda.Function(this, "UserConfirmLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "confirm_user.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/userFeature"),
      environment: {
        USER_POOL_ID: props.cognito.userPool.userPoolId,
        CLIENT_ID: props.cognito.userPoolClient.userPoolClientId,
        CLIENT_SECRET_ARN: props.secretManager.secret.secretArn,
      },
    });

    //
    // --- Permissions ---
    //
    props.tables.userTable.grantReadWriteData(signupLambda);

    props.cognito.userPool.grant(signupLambda, "cognito-idp:SignUp");
    props.secretManager.secret.grantRead(signupLambda);

    props.cognito.userPool.grant(signinLambda, "cognito-idp:AdminInitiateAuth");
    props.secretManager.secret.grantRead(signinLambda);

    props.cognito.userPool.grant(confirmUserLambda, "cognito-idp:ConfirmSignUp", "cognito-idp:AdminGetUser");
    props.secretManager.secret.grantRead(confirmUserLambda);

    //
    // --- API Routes ---
    //
    const signupResource = props.api.authResource.addResource("signup");
    signupResource.addMethod("POST", new apigw.LambdaIntegration(signupLambda), {
      authorizationType: apigw.AuthorizationType.NONE,
    });

    const signinResource = props.api.authResource.addResource("signin");
    signinResource.addMethod("POST", new apigw.LambdaIntegration(signinLambda), {
      authorizationType: apigw.AuthorizationType.NONE,
    });

    const confirmResource = props.api.authResource.addResource("confirm");
    confirmResource.addMethod("POST", new apigw.LambdaIntegration(confirmUserLambda), {
      authorizationType: apigw.AuthorizationType.NONE,
    });
  }
}