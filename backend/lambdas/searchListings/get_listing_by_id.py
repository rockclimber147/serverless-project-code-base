import os
import json
from helpers import get_listing_by_id

LISTINGS_TABLE = os.environ["LISTINGS_TABLE"]

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
}

def lambda_handler(event, context):
    query_params = event.get("queryStringParameters") or {}
    listing_id = query_params.get("id")

    if not listing_id:
        return cors_response(400, {
            "success": False,
            "error": "Missing required query parameter: id"
        })

    response = get_listing_by_id(LISTINGS_TABLE, listing_id)
    status = 200 if response["success"] else 404

    return cors_response(status, response)

def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }
