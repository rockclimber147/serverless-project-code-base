import os
import json
import boto3
from helpers import search_listing

LISTINGS_TABLE = os.environ.get("LISTINGS_TABLE")
REGION = os.environ.get("AWS_REGION", "us-west-2")

dynamodb = boto3.client("dynamodb", region_name=REGION)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
}

def lambda_handler(event, context):
    query_params = event.get("queryStringParameters") or {}

    name = query_params.get("name")
    tags_str = query_params.get("tags", "")
    if tags_str:
        tags = [t.strip() for t in tags_str.split(",") if t.strip()]
    else:
        tags = []
    sort = query_params.get("sort") 

    # add filters later

    response = search_listing(LISTINGS_TABLE, name, tags, sort)
    status = 200
    
    return cors_response(status, response)


def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }
