import json
import os
import boto3
from botocore.exceptions import ClientError
from helpers import calculate_secret_hash, parse_body, CORS_HEADERS

cognito_client = boto3.client("cognito-idp")
USER_POOL_ID = os.environ["USER_POOL_ID"]
CLIENT_ID = os.environ["CLIENT_ID"]

def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"message": "CORS preflight"})}

    try:
        body = parse_body(event)
    except Exception:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Invalid JSON"})}

    username = body.get("username")
    password = body.get("password")

    if not username or not password:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Missing credentials"})}

    secret_hash = calculate_secret_hash(username)
    try:
        response = cognito_client.admin_initiate_auth(
            UserPoolId=USER_POOL_ID,
            ClientId=CLIENT_ID,
            AuthFlow="ADMIN_NO_SRP_AUTH",
            AuthParameters={"USERNAME": username, "PASSWORD": password, "SECRET_HASH": secret_hash},
        )
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"idToken": response["AuthenticationResult"]["IdToken"]})}

    except cognito_client.exceptions.NotAuthorizedException:
        return {"statusCode": 401, "headers": CORS_HEADERS, "body": json.dumps({"error": "Invalid credentials"})}
    except ClientError as e:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": e.response['Error']['Message']})}
