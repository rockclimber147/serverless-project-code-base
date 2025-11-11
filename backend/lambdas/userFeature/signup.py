# lambda/userFeature/signup.py
import json
import os
import boto3
from botocore.exceptions import ClientError
from helpers import calculate_secret_hash, parse_body, CORS_HEADERS

cognito_client = boto3.client("cognito-idp")
dynamodb_client = boto3.client("dynamodb")

USER_POOL_ID = os.environ["USER_POOL_ID"]
CLIENT_ID = os.environ["CLIENT_ID"]
DYNAMODB_TABLE = os.environ["DYNAMODB_TABLE"]

def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"message": "CORS preflight"})}

    try:
        body = parse_body(event)
    except Exception:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Invalid JSON"})}

    required_fields = ["username", "password", "email", "givenName", "familyName", "prefLocation"]
    missing = [f for f in required_fields if not body.get(f)]
    if missing:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": f"Missing: {', '.join(missing)}"})}

    username = body["username"]
    secret_hash = calculate_secret_hash(username)

    try:
        response = cognito_client.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password=body["password"],
            UserAttributes=[
                {"Name": "email", "Value": body["email"]},
                {"Name": "given_name", "Value": body["givenName"]},
                {"Name": "family_name", "Value": body["familyName"]},
            ],
            SecretHash=secret_hash,
        )
        cognito_id = response["UserSub"]

        dynamodb_client.put_item(
            TableName=DYNAMODB_TABLE,
            Item={
                "id": {"S": cognito_id},
                "email": {"S": body["email"]},
                "prefLocation": {"S": body["prefLocation"]},
                "role": {"S": "user"},
            },
        )

        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"userSub": cognito_id})}

    except ClientError as e:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": e.response['Error']['Message']})}
