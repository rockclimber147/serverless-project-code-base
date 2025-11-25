import json
import hmac
import hashlib
import base64
import boto3
from botocore.exceptions import ClientError

# Initialize AWS Cognito client
cognito_client = boto3.client('cognito-idp')

# Set your Cognito User Pool details
USER_POOL_ID = os.environ.get('USER_POOL_ID')
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

def calculate_secret_hash(username):
    msg = f'{username}{CLIENT_ID}'
    hashed = hmac.new(CLIENT_SECRET.encode(), msg.encode(), hashlib.sha256).digest()
    return base64.b64encode(hashed).decode()

def lambda_handler(event, context):
    try:
        # Parse the incoming request body
        body = event
        
        if isinstance(body, str):
            body = json.loads(body)  # Parse if it's still a string
        
        # Extract required fields from the request
        username = body['username']

        # Calculate the SECRET_HASH
        secret_hash = calculate_secret_hash(username)

        # Resend confirmation code to the user
        response = cognito_client.resend_confirmation_code(
            ClientId=CLIENT_ID,
            Username=username,
            SecretHash=secret_hash
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Confirmation code resent successfully.'})
        }

    except cognito_client.exceptions.UserNotFoundException:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'User not found.'})
        }
    except ClientError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': e.response['Error']['Message']})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
