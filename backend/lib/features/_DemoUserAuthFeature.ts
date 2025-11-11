import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { DemoCognitoConstruct } from "../Cognito/cognito";
import { SecretsManagerConstruct } from "../Cognito/secretsManager";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { DynamoTableDemoConstruct } from "../DynamoDb/demo";
import { API_ENDPOINTS } from "../ApiGateway/endpoints";

export interface UserAuthFeatureProps {
  cognito: DemoCognitoConstruct;
  secretManager: SecretsManagerConstruct;
  api: CRUDGatewayConstruct;
  tables: DynamoTableDemoConstruct;
}

export class UserAuthFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: UserAuthFeatureProps) {
    super(scope, id);

    const createLambda = (name: string, handler: string) =>
      new lambda.Function(this, name, {
        runtime: lambda.Runtime.PYTHON_3_11,
        handler,
        code: lambda.Code.fromAsset("lambdas/userAuthFeature"),
        environment: {
          USER_POOL_ID: props.cognito.userPool.userPoolId,
          CLIENT_ID: props.cognito.userPoolClient.userPoolClientId,
          DYNAMODB_TABLE: props.tables.userTable.tableName,
          CLIENT_SECRET_ARN: props.secretManager.secret.secretArn,
        },
      });

    // --- Create Lambdas ---
    const signupLambda = createLambda(
      "UserSignupLambda",
      "signup.lambda_handler"
    );
    const signinLambda = createLambda(
      "UserSigninLambda",
      "signin.lambda_handler"
    );
    const confirmUserLambda = createLambda(
      "UserConfirmLambda",
      "confirm_user.lambda_handler"
    );
    const resendLambda = createLambda(
      "UserResendLambda",
      "resend_code.lambda_handler"
    );

    // --- Grant Permissions ---
    props.tables.userTable.grantReadWriteData(signupLambda);

    props.cognito.userPool.grant(signupLambda, "cognito-idp:SignUp");
    props.cognito.userPool.grant(signinLambda, "cognito-idp:AdminInitiateAuth");
    props.cognito.userPool.grant(
      confirmUserLambda,
      "cognito-idp:ConfirmSignUp",
      "cognito-idp:AdminGetUser"
    );
    props.cognito.userPool.grant(
      resendLambda,
      "cognito-idp:ResendConfirmationCode"
    );

    props.secretManager.secret.grantRead(signupLambda);
    props.secretManager.secret.grantRead(signinLambda);
    props.secretManager.secret.grantRead(confirmUserLambda);
    props.secretManager.secret.grantRead(resendLambda);

    // --- Helper function to attach API routes ---
    const addRoute = (path: string, fn: lambda.Function) => {
      const resource = props.api.authResource.addResource(path);
      resource.addMethod("POST", new apigw.LambdaIntegration(fn), {
        authorizationType: apigw.AuthorizationType.NONE,
      });
    };

    // --- API Routes ---
    addRoute(API_ENDPOINTS.auth.signup, signupLambda);
    addRoute(API_ENDPOINTS.auth.signin, signinLambda);
    addRoute(API_ENDPOINTS.auth.confirm, confirmUserLambda);
    addRoute(API_ENDPOINTS.auth.resend, resendLambda);
  }
}
