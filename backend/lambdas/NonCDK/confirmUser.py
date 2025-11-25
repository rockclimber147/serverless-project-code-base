import json
import hmac
import hashlib
import base64
import boto3
from botocore.exceptions import ClientError

# Initialize AWS Cognito client
cognito_client = boto3.client('cognito-idp')
ses_client = boto3.client("ses", region_name="us-west-2")

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
        # event IS the body already
        body = event
        if isinstance(body, str):
            body = json.loads(body)

        username = body['username']
        confirmation_code = body['confirmationCode']

        secret_hash = calculate_secret_hash(username)

        response = cognito_client.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            ConfirmationCode=str(confirmation_code),
            ForceAliasCreation=False,
            SecretHash=secret_hash
        )

        # Fetch the user details
        fetch_user = cognito_client.admin_get_user(
            UserPoolId=USER_POOL_ID,
            Username=username
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User confirmed successfully.'})
        }

    except cognito_client.exceptions.CodeMismatchException:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid confirmation code.'})
        }
    except cognito_client.exceptions.NotAuthorizedException:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Username is not authorized.'})
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

