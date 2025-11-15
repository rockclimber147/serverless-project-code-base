import json
import boto3
import os

chat_table = boto3.resource("dynamodb").Table(os.environ["CHAT_TABLE"])

def lambda_handler(event, context):
    try:
        user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
        query_params = event.get("queryStringParameters") or {}
        partner_id = query_params.get("partnerId")

        if not partner_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "partnerId query parameter is required"})
            }

        response = chat_table.scan(
            FilterExpression="(userId = :u AND partnerId = :p) OR (userId = :p AND partnerId = :u)",
            ExpressionAttributeValues={
                ":u": user_id,
                ":p": partner_id
            }
        )

        # Sort messages by timestamp ascending
        items = sorted(response.get("Items", []), key=lambda x: x["timestamp"])

        return {
            "statusCode": 200,
            "body": json.dumps(items),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }
