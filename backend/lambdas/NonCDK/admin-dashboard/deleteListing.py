import json
import boto3
import os
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer
import urllib3

http = urllib3.PoolManager()
dynamodb = boto3.client("dynamodb")
ses = boto3.client("ses")
serializer = TypeSerializer()
deserializer = TypeDeserializer()

GET_USER_ENDPOINT = os.environ["GET_USER_ENDPOINT"]
LISTINGS_TABLE = os.environ["LISTINGS_TABLE"]

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body") or "{}")
        listing_id = body.get("listing_id")
        reason = body.get("reason", "")

        if not listing_id:
            return response(400, {"error": "listing_id is required"})

        res = dynamodb.get_item(
            TableName=LISTINGS_TABLE,
            Key={"listing_id": {"S": listing_id}}
        )

        if "Item" not in res:
            return response(404, {"error": "Listing not found"})

        item = res["Item"]
        current_state = item.get("is_removed", {"BOOL": False})["BOOL"]
        new_state = not current_state
        update_expr = "SET is_removed = :new"
        expr_vals = {":new": {"BOOL": new_state}}

        if new_state:
            update_expr += ", removed_reason = :reason"
            expr_vals[":reason"] = {"S": reason}
        else:
            update_expr += " REMOVE removed_reason"

        dynamodb.update_item(
            TableName=LISTINGS_TABLE,
            Key={"listing_id": {"S": listing_id}},
            UpdateExpression=update_expr,
            ExpressionAttributeValues=expr_vals
        )

        # If removing → send email
        if new_state:
            user_id = item["user_id"]["S"]
            item_name = item["item_name"]["S"]
            user_email = get_user_email(user_id)
            send_removal_email(user_email, item_name, reason)

        return response(200, {
            "message": "Listing updated successfully",
            "listing_id": listing_id,
            "is_removed": new_state
        })

    except Exception as e:
        return response(500, {"error": str(e)})

def get_user_email(user_id):
    try:
        url = f"{GET_USER_ENDPOINT}?id={user_id}"
        response = http.request("GET", url)

        if response.status != 200:
            print("Failed to fetch user:", response.data)
            return None

        data = json.loads(response.data.decode("utf-8"))
        print(data)
        return data.get("data", {}).get("email")

    except Exception as e:
        print("Error fetching user email:", str(e))
        return None

def send_removal_email(user_email, item_name, reason):
    message_text = (
        f"Hello,\n\n"
        f"Your listing '{item_name}' has been removed by an administrator.\n\n"
        f"Reason:\n{reason}\n\n"
        "If you believe this was a mistake, please contact support.\n\n"
        "- Crocklist Admin Team"
    )

    ses.send_email(
        Source="crocklist7@gmail.com",
        Destination={"ToAddresses": [user_email]},
        Message={
            "Subject": {"Data": f"Your listing '{item_name}' was removed"},
            "Body": {"Text": {"Data": message_text}}
        }
    )

def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
        "body": json.dumps(body)
    }
