import os
import json
import boto3
from helpers import get_all_favourites, create_favourite, delete_favourite, get_favourite

FAVOURITES_TABLE = os.environ.get("FAVOURITES_TABLE")
REGION = os.environ.get("AWS_REGION", "us-west-2")

dynamodb = boto3.client("dynamodb", region_name=REGION)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
}

def lambda_handler(event, context):
    method = event.get("httpMethod")
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    user_id = claims.get("sub")

    if not user_id:
        return error_response_missing_user()

    if method == "GET":
        query_params = event.get("queryStringParameters") or {}
        listing_id = query_params.get("listing_id")

        if not listing_id: 
            items = get_all_favourites(FAVOURITES_TABLE, user_id)
            return cors_response(200, items)
        
        result = get_favourite(FAVOURITES_TABLE, user_id, listing_id)
    elif method == "POST" or method == "DELETE":
        body = json.loads(event.get("body") or "{}")

        if not body["listing_id"]:
            return error_response_missing_listing()
        if method == "POST":
            result = create_favourite(FAVOURITES_TABLE, user_id, body.get("listing_id"))
        else:
            result = delete_favourite(FAVOURITES_TABLE, user_id, body.get("listing_id"))
    else:
        result = {"error": "Unsupported method"}

    status = 200 if "error" not in result else 400
    return cors_response(status, result)


def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }

def error_response_missing_listing():
    status = 401
    message = {
        "error": "Missing listing id"
    }

    return cors_response(status, message)

def error_response_missing_user():
    status = 401
    message = {
        "error": "Missing user id"
    }

    return cors_response(status, message)