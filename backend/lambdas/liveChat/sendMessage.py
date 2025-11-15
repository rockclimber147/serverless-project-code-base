import json
import boto3
import uuid
import os
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
chat_table = dynamodb.Table(os.environ['CHAT_TABLE'])

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
        partner_id = body.get("partnerId")
        message = body.get("message")

        if not partner_id or not message:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "partnerId and message are required"})
            }

        msg_id = str(uuid.uuid4())

        item = {
            "id": msg_id,
            "userId": user_id,
            "partnerId": partner_id,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }

        chat_table.put_item(Item=item)

        return {
            "statusCode": 200,
            "body": json.dumps({"ok": True, "messageId": msg_id}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }
