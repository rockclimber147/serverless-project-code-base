import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";

import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { DynamoTablesConstruct } from "../DynamoDb/tables";
import { CognitoConstruct } from "../Cognito/cognito";
import { API_ENDPOINTS } from "../ApiGateway/endpoints";

interface LiveChatFeatureProps {
  api: CRUDGatewayConstruct;
  tables: DynamoTablesConstruct;
  auth: CognitoConstruct;
}

export class LiveChatFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: LiveChatFeatureProps) {
    super(scope, id);

    const chatTable = props.tables.chatTable;
    const userAuthorizer = new apigw.CognitoUserPoolsAuthorizer(this, "UserPoolAuthorizer", {
      cognitoUserPools: [props.auth.userPool],
    });

    const sendMessageLambda = new lambda.Function(this, "SendMessageLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "sendMessage.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/liveChat"),
      environment: {
        CHAT_TABLE: chatTable.tableName,
      },
    });
    chatTable.grantWriteData(sendMessageLambda);

    const getMessagesLambda = new lambda.Function(this, "GetMessagesLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "getMessages.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/liveChat"),
      environment: {
        CHAT_TABLE: chatTable.tableName,
      },
    });
    chatTable.grantReadData(getMessagesLambda);

    const getAllChatsLambda = new lambda.Function(this, "getAllChatsLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "getAllChats.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/liveChat"),
      environment: {
        CHAT_TABLE: chatTable.tableName,
      },
    });
    chatTable.grantReadData(getAllChatsLambda);

    const chatRoot = props.api.userResource.addResource(API_ENDPOINTS.user.chat.value);

    // POST /user/chat/sendMessage
    const sendMessageResource = chatRoot.addResource(API_ENDPOINTS.user.chat.sendMessage);
    sendMessageResource.addCorsPreflight({
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "OPTIONS"],
    });

    sendMessageResource.addMethod(
      "POST",
      new apigw.LambdaIntegration(sendMessageLambda),
      {
        authorizer: userAuthorizer,
        authorizationType: apigw.AuthorizationType.COGNITO,
      }
    );

    // GET /user/chat/getMessages
    const getMessagesResource = chatRoot.addResource(API_ENDPOINTS.user.chat.getMessages);
    getMessagesResource.addCorsPreflight({
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "OPTIONS"],
    });

    getMessagesResource.addMethod(
      "GET",
      new apigw.LambdaIntegration(getMessagesLambda),
      {
        authorizer: userAuthorizer,
        authorizationType: apigw.AuthorizationType.COGNITO,
      }
    );

    // GET /user/chat/getAllChats
    const getAllChatsResource = chatRoot.addResource(API_ENDPOINTS.user.chat.getAllChats);
    getAllChatsResource.addCorsPreflight({
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "OPTIONS"],
    });

    getAllChatsResource.addMethod(
      "GET",
      new apigw.LambdaIntegration(getAllChatsLambda),
      {
        authorizer: userAuthorizer,
        authorizationType: apigw.AuthorizationType.COGNITO,
      }
    );
  }
}
