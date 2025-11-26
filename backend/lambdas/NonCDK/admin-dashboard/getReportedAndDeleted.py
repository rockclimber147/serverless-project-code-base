import json
import os
import boto3

dynamodb = boto3.client("dynamodb")

def normalize(attr):
    """Convert DynamoDB AttributeValue to normal Python types."""
    if attr is None:
        return None

    if "S" in attr:
        return attr["S"]
    if "N" in attr:
        num = attr["N"]
        return int(num) if num.isdigit() else float(num)
    if "BOOL" in attr:
        return attr["BOOL"]
    if "L" in attr:
        return [normalize(v.get("M", v)) for v in attr["L"]]
    if "M" in attr:
        return {k: normalize(v) for k, v in attr["M"].items()}

    if isinstance(attr, dict):
        return {k: normalize(v) for k, v in attr.items()}

    return None


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
        table_name = os.environ["LISTINGS_TABLE"]

        result = dynamodb.scan(TableName=table_name)
        items = result.get("Items", [])

        cleaned = []
        for item in items:
            cleaned.append({
                "listing_id": normalize(item.get("listing_id")),
                "user_id": normalize(item.get("user_id")),
                "item_name": normalize(item.get("item_name")),
                "is_removed": normalize(item.get("is_removed")),
                "is_sold": normalize(item.get("is_sold")),
                "reports": normalize(item.get("reports")) or []
            })

        reported = [
            x for x in cleaned
            if not x["is_removed"] and len(x["reports"]) > 0
        ]

        deleted = [
            x for x in cleaned
            if x["is_removed"] and len(x["reports"]) > 0
        ]

        for listing in reported + deleted:
            listing["reports"].sort(key=lambda r: r.get("reported_at", 0))

        body = {
            "reported": reported,
            "deleted": deleted
        }

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(body)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }
