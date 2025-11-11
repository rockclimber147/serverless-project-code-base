# lambda/userFeature/resend.py
import json
import os
import boto3
from botocore.exceptions import ClientError
from common.helpers import calculate_secret_hash, parse_body, CORS_HEADERS

cognito_client = boto3.client("cognito-idp")

USER_POOL_ID = os.environ["USER_POOL_ID"]
CLIENT_ID = os.environ["CLIENT_ID"]

def lambda_handler(event, context):
    # Handle CORS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "CORS preflight"})
        }

    # Parse incoming request body
    try:
        body = parse_body(event)
    except Exception:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Invalid JSON"})
        }

    username = body.get("username")
    if not username:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Missing username"})
        }

    try:
        # Compute secret hash using helper
        secret_hash = calculate_secret_hash(username)

        # Resend confirmation code
        cognito_client.resend_confirmation_code(
            ClientId=CLIENT_ID,
            Username=username,
            SecretHash=secret_hash
        )

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Confirmation code resent successfully."})
        }

    except cognito_client.exceptions.UserNotFoundException:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "User not found."})
        }
    except ClientError as e:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": e.response['Error']['Message']})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }
