import os
import json
import boto3
from helpers import create_listing, update_listing, delete_listing, migrate_listings

LISTINGS_TABLE = os.environ.get("LISTINGS_TABLE")
REGION = os.environ.get("AWS_REGION", "us-west-2")

dynamodb = boto3.client("dynamodb", region_name=REGION)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST,PATCH,DELETE",
}


def lambda_handler(event, context):

    if event.get("action") == "migrate":
        result = migrate_listings(LISTINGS_TABLE)
        return cors_response(200, {"success": True, "result": result})

    method = event.get("httpMethod")
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    user_id = claims.get("sub")

    if not user_id:
        return cors_response(401, {"success": False, "error": "Missing user identity"})

    body = json.loads(event.get("body") or "{}")

    if method == "POST":
        result = create_listing(LISTINGS_TABLE, user_id, body)
    elif method == "PATCH":
        result = update_listing(LISTINGS_TABLE, body.get("listing_id"), user_id, body)
    elif method == "DELETE":
        result = delete_listing(LISTINGS_TABLE, body.get("listing_id"), user_id)
    else:
        cors_response(405, {"error": "Method not allowed"})

    status = 200 if "error" not in result else 400
    return cors_response(status, result)


def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }