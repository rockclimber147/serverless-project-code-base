import json
import boto3
import os

dynamodb = boto3.resource("dynamodb")
table_name = os.environ["USERS_TABLE"]

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json"
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        table = dynamodb.Table(table_name)
        result = table.scan()

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(result.get("Items", []))
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"message": str(e)})
        }
