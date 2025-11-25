import boto3
import decimal
from boto3.dynamodb.types import TypeDeserializer

dynamodb = boto3.client("dynamodb")
deserializer = TypeDeserializer()

def get_listing_by_id(table_name: str, listing_id: str):
    response = dynamodb.get_item(
        TableName=table_name,
        Key={"listing_id": {"S": listing_id}}
    )
    item = response.get("Item")

    if not item:
        return {"success": False, "error": "Listing not found"}

    deserialized_item = {
        k: _deserialize_value(v) for k, v in item.items()
    }

    return {"success": True, "data": deserialized_item}

def search_listing(table_name: str, name: str = None):
    items = _search_table_by_pagination(table_name, name)
    return {
        "success": True,
        "data": _sort_by_descending_time(items)
    }

def get_all_user_listings(table_name: str, user_id: str):
    items = []
    last_key = None

    while True:
        scan_kwargs = {
            "TableName": table_name,
            "FilterExpression": "user_id = :u",
            "ExpressionAttributeValues": {
                ":u": {"S": user_id}
            }
        }

        if last_key:
            scan_kwargs["ExclusiveStartKey"] = last_key

        response = dynamodb.scan(**scan_kwargs)

        for raw_item in response.get("Items", []):
            item = {k: _deserialize_value(v) for k, v in raw_item.items()}
            items.append(item)

        last_key = response.get("LastEvaluatedKey")
        if not last_key:
            break

    return {
        "success": True,
        "data": _sort_by_descending_time(items)
    }

def get_user_favourited_listings(favourites_table: str, listings_table: str, user_id: str):
    fav_response = dynamodb.query(
        TableName=favourites_table,
        KeyConditionExpression="user_id = :uid",
        ExpressionAttributeValues={
            ":uid": {"S": user_id}
        }
    )

    favourite_items = fav_response.get("Items", [])
    if not favourite_items:
        return []

    listing_ids = [
        item["listing_id"]["S"]
        for item in favourite_items
    ]

    keys = [{"listing_id": {"S": lid}} for lid in listing_ids]

    batch_response = dynamodb.batch_get_item(
        RequestItems={
            listings_table: {
                "Keys": keys
            }
        }
    )

    raw_listings = batch_response["Responses"].get(listings_table, [])

    listings = [
        {
            **{k: _deserialize_value(v) for k, v in raw_item.items()},
            "is_favourite": True
        }
        for raw_item in raw_listings
    ]

    return listings

def _sort_by_descending_time(listings: any):
    return sorted(listings, key=lambda x: int(x["created_at"]), reverse=True)

def _search_table_by_pagination(table_name: str, name: str = None):
    items = []
    last_evaluated_key = None

    while True:
        scan_kwargs = {"TableName": table_name}

        # Expression attribute containers
        expression_names = {"#sold": "is_sold"}
        expression_values = {":false": {"BOOL": False}}
        filter_expression = "#sold = :false"  # Only active listings

        # Optional name filter
        if name:
            expression_names["#n"] = "item_name"
            expression_values[":val"] = {"S": name}
            filter_expression += " AND contains(#n, :val)"

        scan_kwargs["FilterExpression"] = filter_expression
        scan_kwargs["ExpressionAttributeNames"] = expression_names
        scan_kwargs["ExpressionAttributeValues"] = expression_values

        # Handle pagination
        if last_evaluated_key:
            scan_kwargs["ExclusiveStartKey"] = last_evaluated_key

        response = dynamodb.scan(**scan_kwargs)

        for raw_item in response.get("Items", []):
            item = {k: _deserialize_value(v) for k, v in raw_item.items()}
            items.append(item)

        last_evaluated_key = response.get("LastEvaluatedKey")
        if not last_evaluated_key:
            break

    return items

def _deserialize_value(value):
    val = deserializer.deserialize(value)
    return _convert_nested(val)

def _convert_nested(val):
    if isinstance(val, decimal.Decimal):
        return float(val) if val % 1 else int(val)

    if isinstance(val, list):
        return [_convert_nested(v) for v in val]

    if isinstance(val, dict):
        return {k: _convert_nested(v) for k, v in val.items()}

    return val
