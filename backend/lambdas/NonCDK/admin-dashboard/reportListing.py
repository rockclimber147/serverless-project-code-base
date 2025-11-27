import os
import json
from datetime import datetime
import boto3

LISTINGS_TABLE = os.environ["LISTINGS_TABLE"]
REGION = "us-west-2"

dynamodb = boto3.client("dynamodb", region_name=REGION)

CORS_HEADERS = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
}

def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": ""
        }

    try:
        body = event.get("body")
        if isinstance(body, str):
            body = json.loads(body)
        elif body is None:
            body = event
        else:
            body = body

        listing_id = body.get("listing_id")
        user_id = body.get("user_id")
        user_report_reason = body.get("user_report_reason", "")
        print("body: ", body)

        if not listing_id:
            return cors_response(400, {"error": "listing_id is required"})
        
        if not user_id:
            return cors_response(400, {"error": "user_id is required"})

        try:
            listing = dynamodb.get_item(
                TableName=LISTINGS_TABLE,
                Key={"listing_id": {"S": listing_id}}
            )

            print("listing: ", listing)
            
            if "Item" not in listing:
                return cors_response(404, {"error": "Listing not found"})
        except Exception as e:
            return cors_response(500, {"error": f"Failed to verify listing: {str(e)}"})

        reported_at = int(datetime.now().strftime("%Y%m%d"))
        new_report = {
            "M": {
                "reason": {"S": user_report_reason},
                "reported_at": {"N": str(reported_at)},
                "reported_by": {"S": user_id}
            }
        }

        try:
            dynamodb.update_item(
                TableName=LISTINGS_TABLE,
                Key={"listing_id": {"S": listing_id}},
                UpdateExpression="SET reports = list_append(if_not_exists(reports, :empty_list), :new_report)",
                ExpressionAttributeValues={
                    ":empty_list": {"L": []},
                    ":new_report": {"L": [new_report]}
                }
            )
        except Exception as e:
            return cors_response(500, {"error": f"Failed to update listing: {str(e)}"})

        return cors_response(200, {
            "success": True,
            "message": "Report added successfully",
            "listing_id": listing_id,
            "report": {
                "user_report_reason": user_report_reason,
                "reported_at": reported_at,
                "reported_by": user_id
            }
        })

    except json.JSONDecodeError:
        return cors_response(400, {"error": "Invalid JSON in request body"})
    except Exception as err:
        print(f"Error: {str(err)}")
        return cors_response(500, {"error": str(err)})


def cors_response(status, body_dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body_dict)
    }