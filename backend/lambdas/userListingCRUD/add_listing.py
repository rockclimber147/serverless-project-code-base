import os
import json
import boto3
import base64
import time
from botocore.exceptions import ClientError

# --- Environment Variables ---
LISTINGS_TABLE = os.environ.get("LISTINGS_TABLE")
REGION = os.environ.get("AWS_REGION", "us-west-2")

dynamodb = boto3.client("dynamodb", region_name=REGION)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
}


def lambda_handler(event, context):
    try:
        # --- CORS preflight ---
        if event.get("httpMethod") == "OPTIONS":
            return cors_response(200, {"message": "CORS preflight"})

        # --- Get user from authorizer claims ---
        claims = (
            event.get("requestContext", {})
            .get("authorizer", {})
            .get("claims", {})
        )
        user_id = claims.get("sub")

        if not user_id:
            return cors_response(401, {"error": "Unauthorized - missing user claims"})

        # --- Parse body ---
        body = event.get("body")
        if event.get("isBase64Encoded"):
            body = base64.b64decode(body).decode("utf-8")
        data = json.loads(body)

        # --- Validate required fields ---
        required_fields = ["title", "description", "price"]
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return cors_response(400, {"error": f"Missing fields: {', '.join(missing)}"})

        # --- Generate listing ID ---
        listing_id = f"{user_id}-{int(time.time())}"

        # --- Store listing in DynamoDB ---
        item = {
            "listing_id": {"S": listing_id},
            "owner_id": {"S": user_id},
            "title": {"S": data["title"]},
            "description": {"S": data["description"]},
            "price": {"N": str(data["price"])},
            "created_at": {"N": str(int(time.time()))},
        }

        dynamodb.put_item(TableName=LISTINGS_TABLE, Item=item)

        return cors_response(
            200, {"message": "Listing created", "listing_id": listing_id}
        )

    except Exception as e:
        return cors_response(500, {"error": str(e)})


def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }
