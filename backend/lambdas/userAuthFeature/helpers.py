# lambda/common/helpers.py
import hmac
import hashlib
import base64
import json
import boto3
import os

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}

def get_client_secret():
    """Fetch the Cognito client secret from Secrets Manager at runtime."""
    secret_arn = os.environ.get("CLIENT_SECRET_ARN")
    if not secret_arn:
        raise Exception("CLIENT_SECRET_ARN not set in environment")
    client = boto3.client("secretsmanager")
    secret_value = client.get_secret_value(SecretId=secret_arn)
    return secret_value["SecretString"]

def calculate_secret_hash(username):
    """Compute Cognito SECRET_HASH using runtime secret."""
    client_id = os.environ.get("CLIENT_ID")
    client_secret = get_client_secret()
    msg = f"{username}{client_id}"
    hashed = hmac.new(client_secret.encode(), msg.encode(), hashlib.sha256).digest()
    return base64.b64encode(hashed).decode()

def parse_body(event):
    """Safely parse the event body into a dict."""
    body = event.get("body") or event
    if isinstance(body, str):
        return json.loads(body)
    return body
