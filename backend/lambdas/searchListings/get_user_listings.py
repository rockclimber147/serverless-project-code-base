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
    query_params = event.get("queryStringParameters") or {}
    user_id = query_params.get("user_id")

    if not user_id:
        return cors_response(400, {
            "success": False,
            "error": "Missing required query parameter: user id"
        })
    
    response = get_all_user_listings(LISTINGS_TABLE, user_id)
    return cors_response(200, response)

def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }
