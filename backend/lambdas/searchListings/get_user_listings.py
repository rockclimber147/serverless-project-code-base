import os
import json
from helpers import get_all_user_listings

LISTINGS_TABLE = os.environ["LISTINGS_TABLE"]

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
}

def lambda_handler(event, context):
    method = event.get("httpMethod")
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    user_id = claims.get("sub")

    if not user_id:
        return cors_response(400, {"error": "user is not logged in"})
    
    if method == "GET":
        result = {
            "listings": get_all_user_listings(LISTINGS_TABLE, user_id)
        }
    else:
        result = {"error": "Unsupported method"}

    return cors_response(200, result)

def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }
