import json
import boto3
import os
from datetime import datetime
from boto3.dynamodb.conditions import Key
from helpers import send_email_to_seller

dynamodb = boto3.resource("dynamodb")
chat_table = dynamodb.Table(os.environ["CHAT_TABLE"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
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

        body = json.loads(event.get("body", "{}"))
        user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
        partner_id = body.get("partnerId")
        message = body.get("message")

        if not partner_id or not message:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "partnerId and message are required"})
            }

        # Compute chatId for the user pair (order independent)
        chat_id = "#".join(sorted([user_id, partner_id]))

        # Send email notification if first message between seller and buyer
        try:
            response = chat_table.query(
                KeyConditionExpression=Key("chatId").eq(chat_id)
            )
            if response.get("Count", 0) == 0:
                send_email_to_seller(partner_id, message)
        except Exception as e:
            print("Email failed:", e)

        # Put item into DynamoDB
        item = {
            "chatId": chat_id,
            "timestamp": datetime.utcnow().isoformat(),
            "senderId": user_id,
            "receiverId": partner_id,
            "message": message
        }

        chat_table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"ok": True}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)}),
        }
