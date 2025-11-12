import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";

import { CognitoConstruct } from "../Cognito/cognito";
import { CRUDGatewayConstruct } from "../ApiGateway/gateway";
import { DynamoTablesConstruct } from "../DynamoDb/tables";
import { ListingPhotosBucketConstruct } from "../S3/listingPhotos";

interface ListingsFeatureProps {
  tables: DynamoTablesConstruct;
  api: CRUDGatewayConstruct;
  auth: CognitoConstruct;
  listingPhotos: ListingPhotosBucketConstruct
}

export class ListingsFeatureConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ListingsFeatureProps) {
    super(scope, id);

    const userAuthorizer = new apigw.CognitoUserPoolsAuthorizer(this, "UserPoolAuthorizer", {
      cognitoUserPools: [props.auth.userPool],
    });

    const listingCUDLambda = new lambda.Function(this, "listingCUDLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "listing_cud.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/userListingCRUD"),
      environment: {
        LISTINGS_TABLE: props.tables.listingsTable.tableName,
        USER_POOL_ID: props.auth.userPool.userPoolId,
      },
    });

    props.tables.listingsTable.grantReadWriteData(listingCUDLambda);

    const listingsResource = props.api.userResource.addResource("listings");
    this.addMethodWithAuthorizer(listingsResource, "POST", listingCUDLambda, userAuthorizer);
    this.addMethodWithAuthorizer(listingsResource, "PATCH", listingCUDLambda, userAuthorizer);
    this.addMethodWithAuthorizer(listingsResource, "DELETE", listingCUDLambda, userAuthorizer);

    const listingPhotoLambda = new lambda.Function(this, "listingPhotoLambda", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "listing_photo.lambda_handler",
      code: lambda.Code.fromAsset("lambdas/UserListingCRUD"),
      environment: {
        LISTING_PHOTOS_BUCKET: props.listingPhotos.bucket.bucketName,
      },
    });

    props.listingPhotos.bucket.grantPut(listingPhotoLambda);

    const photoResource = listingsResource.addResource("photo");
    this.addMethodWithAuthorizer(photoResource, "POST", listingPhotoLambda, userAuthorizer);
  }

  private addMethodWithAuthorizer(
    resource: apigw.IResource,
    method: string,
    lambdaFn: lambda.IFunction,
    authorizer: apigw.IAuthorizer
  ) {
    resource.addMethod(method, new apigw.LambdaIntegration(lambdaFn), {
      authorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    });
  }
}
