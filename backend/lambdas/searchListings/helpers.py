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
        return {"success": False, "response": {"error": "Listing not found"}}

    deserialized_item = {
        k: _deserialize_value(v) for k, v in item.items()
    }

    return {"success": True, "response": deserialized_item}

def search_listing(table_name: str, name: str = None):
    items = _search_table_by_pagination(table_name, name)
    return _sort_by_descending_time(items)

def _sort_by_descending_time(listings: any):
    return sorted(listings, key=lambda x: int(x["created_at"]), reverse=True)

def _search_table_by_pagination(table_name: str, name: str = None):
    items = []
    last_evaluated_key = None

    # Loop through paginated scan results
    while True:
        scan_kwargs = {"TableName": table_name}

        if name:
            scan_kwargs["FilterExpression"] = "contains(#n, :val)"
            scan_kwargs["ExpressionAttributeNames"] = {"#n": "item_name"}
            scan_kwargs["ExpressionAttributeValues"] = {":val": {"S": name}}

        # paginate search
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
    """Deserialize DynamoDB attribute to JSON-safe Python type."""
    val = deserializer.deserialize(value)
    if isinstance(val, decimal.Decimal):
        return float(val) if val % 1 else int(val)
    return val