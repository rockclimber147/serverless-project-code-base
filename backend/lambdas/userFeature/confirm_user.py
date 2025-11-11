# lambda/userFeature/confirm_user.py
import json
import os
import boto3
from botocore.exceptions import ClientError
from helpers import calculate_secret_hash, CORS_HEADERS

# AWS Cognito client
cognito_client = boto3.client("cognito-idp")

# Environment variables
USER_POOL_ID = os.environ["USER_POOL_ID"]
CLIENT_ID = os.environ["CLIENT_ID"]

def lambda_handler(event, context):
    # Handle preflight OPTIONS request
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "CORS preflight"})
        }

    try:
        # Safely parse event body
        body = event.get("body") or event
        if isinstance(body, str):
            body = json.loads(body)

        username = body["username"]
        confirmation_code = body["confirmationCode"]

        # Compute SECRET_HASH
        secret_hash = calculate_secret_hash(username)

        # Confirm the user
        cognito_client.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            ConfirmationCode=str(confirmation_code),
            ForceAliasCreation=False,
            SecretHash=secret_hash
        )

        # Optional: fetch user details to verify
        cognito_client.admin_get_user(
            UserPoolId=USER_POOL_ID,
            Username=username
        )

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "User confirmed successfully."})
        }

    except cognito_client.exceptions.CodeMismatchException:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Invalid confirmation code."})
        }
    except cognito_client.exceptions.NotAuthorizedException:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Username is not authorized."})
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
