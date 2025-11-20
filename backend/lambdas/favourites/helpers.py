import time
import boto3
from boto3.dynamodb.types import TypeDeserializer

dynamodb = boto3.client("dynamodb")
deserializer = TypeDeserializer()

def create_favourite(table_name: str, user_id: str, listing_id: str) -> dict:
    favourite = _get_favourite_by_user_and_listing(table_name, user_id, listing_id)
    if favourite["success"]:
        return {
            "success": False,
            "error": "Favourite already exists"
        }
    
    item = {
        "listing_id": {"S": listing_id},
        "user_id": {"S": user_id},
    }

    dynamodb.put_item(TableName=table_name, Item=item)

    return {
        "success": True,
        "message": "Favourite registered successfully"
    }

def delete_favourite(table_name: str, user_id: str, listing_id: str) -> dict:
    response = _get_favourite_by_user_and_listing(table_name, user_id, listing_id)

    if not response["success"]:
        return response
    
    dynamodb.delete_item(TableName=table_name, Key={"user_id": {"S": user_id}, "listing_id": {"S": listing_id}})

    return {
        "success": True,
        "message": "Favourite deleted successfully",
    }

def get_favourite(table_name: str, user_id: str, listing_id: str):
    favourite = _get_favourite_by_user_and_listing(table_name, user_id, listing_id)

    if favourite["success"]:
        return {
            "success": True,
            "data": {
                "is_favourite": True
            }
        }
    else:
        return {
            "success": False,
            "data": {
                "is_favourite": False
            }
        }

def get_all_favourites(table_name: str, user_id: str):
    resp = dynamodb.query(
        TableName=table_name,
        KeyConditionExpression="user_id = :u",
        ExpressionAttributeValues={
            ":u": {"S": user_id}
        }
    )

    items = resp.get("Items", [])

    deserialized_items = [
        {k: _deserialize_value(v) for k, v in item.items()}
        for item in items
    ]

    return {
        "success": True,
        "data": deserialized_items
    }

def _get_favourite_by_user_and_listing(table_name: str, user_id: str, listing_id: str):
    favourite = dynamodb.get_item(TableName=table_name, Key={"user_id": {"S": user_id}, "listing_id": {"S": listing_id}})
    item = favourite.get("Item")

    if not item:
        return {
            "success": False,
            "error": "Favourite not found"
        }
    
    deserialized_items = {
        k: _deserialize_value(v) for k, v in item.items()
    }
    
    return {
        "success": True,
        "data": deserialized_items
    }

def _deserialize_value(value):
    return deserializer.deserialize(value)