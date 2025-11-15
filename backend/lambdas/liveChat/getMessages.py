import json
import boto3
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
chat_table = dynamodb.Table(os.environ["CHAT_TABLE"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",  # replace "*" with your frontend URL in production
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
}

def lambda_handler(event, context):
    try:
        # Handle preflight OPTIONS request
        if event["httpMethod"] == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": ""
            }

        user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
        query_params = event.get("queryStringParameters") or {}
        partner_id = query_params.get("partnerId")

        if not partner_id:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "partnerId query parameter is required"})
            }

        # Compute chatId for the user pair
        chat_id = "#".join(sorted([user_id, partner_id]))

        # Query DynamoDB using partition key
        response = chat_table.query(
            KeyConditionExpression=Key("chatId").eq(chat_id),
            ScanIndexForward=True
        )

        items = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(items),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)}),
        }
