import os
import json
import boto3
from botocore.exceptions import ClientError

# --- Environment Variables ---
BUCKET_NAME = os.environ.get("LISTING_PHOTOS_BUCKET")
REGION = os.environ.get("AWS_REGION", "us-west-2")

s3_client = boto3.client("s3", region_name=REGION)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
}


def lambda_handler(event, context):
    method = event.get("httpMethod")
    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": ""
        }
    
    body = json.loads(event.get("body") or "{}")
    listing_id = body.get("listing_id")

    if not listing_id:
        return cors_response(400, {"success": False, "error": "listing_id is required"})

    filename = f"{listing_id}.jpg"

    try:
        url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": filename,
                "ContentType": "image/jpeg",
                "ACL": "bucket-owner-full-control"
            },
            ExpiresIn=300,
        )
    except ClientError as e:
        return cors_response(500, {"success": False, "error": str(e)})

    public_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"

    return cors_response(200, {
        "success": True,
        "data": {
            "upload_url": url, 
            "public_url": public_url
        }
    })


def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict),
    }
