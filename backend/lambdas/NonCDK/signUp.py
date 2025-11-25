import json
import hmac
import hashlib
import base64
import boto3
from botocore.exceptions import ClientError

# AWS clients
cognito_client = boto3.client('cognito-idp')
dynamodb_client = boto3.client('dynamodb')

# Configuration
USER_POOL_ID = os.environ.get('USER_POOL_ID')
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
DYNAMODB_TABLE = 'usertable'

# CORS headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}

# Helper to calculate SECRET_HASH for Cognito
def calculate_secret_hash(username):
    msg = f'{username}{CLIENT_ID}'
    hashed = hmac.new(CLIENT_SECRET.encode(), msg.encode(), hashlib.sha256).digest()
    return base64.b64encode(hashed).decode()

def lambda_handler(event, context):
    # Handle preflight OPTIONS request
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "CORS preflight"})
        }

    # Parse body safely
    body = event.get("body") or event  # fallback: event itself may contain JSON
    if isinstance(body, str):
        try:
            body = json.loads(body)
        except json.JSONDecodeError:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Invalid JSON in request body."})
            }

    # Required fields
    required_fields = ["username", "password", "email", "givenName", "familyName", "prefLocation"]
    missing = [f for f in required_fields if not body.get(f)]
    if missing:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": f"Missing fields: {', '.join(missing)}"})
        }

    username = body["username"]
    password = body["password"]
    email = body["email"]
    given_name = body["givenName"]
    family_name = body["familyName"]
    pref_location = body["prefLocation"]

    try:
        # Cognito signup
        secret_hash = calculate_secret_hash(username)
        response = cognito_client.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[
                {"Name": "email", "Value": email},
                {"Name": "given_name", "Value": given_name},
                {"Name": "family_name", "Value": family_name},
            ],
            SecretHash=secret_hash
        )
        cognito_id = response['UserSub']

        # Store extra info in DynamoDB
        dynamodb_client.put_item(
            TableName=DYNAMODB_TABLE,
            Item={
                'id': {'S': cognito_id},
                'givenName': {'S': given_name},
                'familyName': {'S': family_name},
                'email': {'S': email},
                'prefLocation': {'S': pref_location},
                'role': {'S': 'user'}
            }
        )

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "User signed up successfully.", "userSub": cognito_id})
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
