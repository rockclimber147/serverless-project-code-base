import os
import boto3

dynamodb = boto3.resource("dynamodb")

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json"
    }

    # Handle preflight
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        table_name = os.environ["LISTINGS_TABLE"]

        table = dynamodb.Table(table_name)
        result = table.scan()

        return {
            "statusCode": 200,
            "headers": headers,
            "body": result
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": {"success": False, "error": str(e)}
        }