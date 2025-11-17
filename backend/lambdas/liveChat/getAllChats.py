import boto3
import json
import os
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["CHAT_TABLE"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",  # replace with your frontend URL in production
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
}

def lambda_handler(event, context):
    try:
        # Handle preflight OPTIONS request
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": ""
            }

        user_id = event['requestContext']['authorizer']['claims']['sub']

        # Scan all messages where current user is sender or receiver
        response = table.scan(
            FilterExpression=Attr("senderId").eq(user_id) | Attr("receiverId").eq(user_id)
        )
        items = response.get("Items", [])

        # Extract unique partner IDs
        partners = set()
        for item in items:
            if item['senderId'] != user_id:
                partners.add(item['senderId'])
            if item['receiverId'] != user_id:
                partners.add(item['receiverId'])

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(list(partners))
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }
