import time
import boto3

dynamodb = boto3.client("dynamodb")

def create_listing(table_name: str, user_id: str, data: dict) -> dict:
    """
    Creates a new listing owned by the user (user_id).
    Required fields: item_name, price
    """
    required = ["item_name", "price"]
    missing = [f for f in required if f not in data or data[f] in [None, ""]]
    if missing:
        return {
            "success": False,
            "error": f"Missing fields: {', '.join(missing)}"
        }

    listing_id = f"{user_id}-{int(time.time())}"

    item = {
        "listing_id": {"S": listing_id},
        "user_id": {"S": user_id},
        "item_name": {"S": data["item_name"]},
        "price": {"N": str(data["price"])},
        "is_removed": {"BOOL": False},
        "is_sold": {"BOOL": bool(data.get("is_sold", False))},
        "item_details": {"S": data.get("item_details", "")},
        "location": {"S": data.get("location", "")},
        "latitude": {"N": str(data.get("latitude", 0.0))},
        "longitude": {"N": str(data.get("longitude", 0.0))},
        "image": {"S": data.get("image", "")},
        "created_at": {"N": str(int(time.time()))},
        "search_name": {"S": data["item_name"].lower()},
        "search_details": {"S": data.get("details", "").lower()},
        "tags": {"L": [{"S": t.lower()} for t in data.get("tags", [])]}       
    }
    try: 
        dynamodb.put_item(TableName=table_name, Item=item)
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
        
    return {
        "success": True,
        "message": "Listing created successfully",
        "data": {
            "listing_id": listing_id
        }
    }

def update_listing(table_name: str, listing_id: str, user_id: str, updates: dict) -> dict:
    listing = dynamodb.get_item(TableName=table_name, Key={"listing_id": {"S": listing_id}})
    item = listing.get("Item")

    if not item:
        return {"success": False, "error": "Listing not found"}

    if item.get("user_id", {}).get("S") != user_id:
        return {"success": False, "error": "Forbidden - you do not own this listing"}

    allowed_fields = ["item_name", "item_details", "price", "is_sold", "location", "latitude", "longitude", "image", "tags"]
    update_fields = {k: v for k, v in updates.items() if k in allowed_fields}

    if not update_fields:
        return {"success": False, "error": "No valid fields to update"}

    expr = []
    values = {}
    # New dictionary for attribute names (aliases)
    names = {} 

    for i, (k, v) in enumerate(update_fields.items()):
        key_alias = f":val{i}"
        
        # --- RESERVED KEYWORD HANDLING ---
        attribute_name = k
        if k == "location":
            # Use an Expression Attribute Name for the reserved keyword 'location'
            name_alias = "#loc"
            names[name_alias] = k
            expr.append(f"{name_alias} = {key_alias}")
            attribute_name = name_alias
        else:
            expr.append(f"{k} = {key_alias}")
        # --- END RESERVED KEYWORD HANDLING ---

        # Value handling remains the same (mapping to DynamoDB types)
        if isinstance(v, bool):
            values[key_alias] = {"BOOL": v}
        elif isinstance(v, (int, float)):
            values[key_alias] = {"N": str(v)}
        elif k == "tags" and isinstance(v, list):
            # Special handling for list/set types
            values[key_alias] = {"L": [{"S": str(tag)} for tag in v]}
        else:
            values[key_alias] = {"S": str(v)}
            
        # Additional search field updates (appends to expr and values)
        if k == "item_name":
            expr.append("search_name = :search_name")
            values[":search_name"] = {"S": str(v).lower()}

        if k == "item_details":
            expr.append("search_details = :search_details")
            values[":search_details"] = {"S": str(v).lower()}


    # --- FINAL UPDATE CALL ---
    dynamodb.update_item(
        TableName=table_name,
        Key={"listing_id": {"S": listing_id}},
        UpdateExpression="SET " + ", ".join(expr),
        ExpressionAttributeValues=values,
        # Pass the new names dictionary to the API call
        ExpressionAttributeNames=names 
    )

    return {"success": True, "message": "Listing updated successfully"}


def delete_listing(table_name: str, listing_id: str, user_id: str) -> dict:
    """
    Deletes a listing if the user owns it.
    """
    listing = dynamodb.get_item(TableName=table_name, Key={"listing_id": {"S": listing_id}})
    item = listing.get("Item")

    if not item:
        return {
            "success": False,
            "error": "Listing not found"
        }

    if item.get("user_id", {}).get("S") != user_id:
        return {
            "success": False,
            "error": "Forbidden - you do not own this listing"
        }

    dynamodb.delete_item(TableName=table_name, Key={"listing_id": {"S": listing_id}})

    return {
        "success": True,
        "message": "Listing deleted successfully",
    }


def _backfill_search_fields(table_name: str):
    """
    Scans the entire table and adds search_name and search_details fields
    based on item_name and details. Safe for large tables (uses pagination).
    """
    last_key = None
    updated_count = 0

    while True:
        scan_kwargs = {"TableName": table_name}

        if last_key:
            scan_kwargs["ExclusiveStartKey"] = last_key

        response = dynamodb.scan(**scan_kwargs)

        for item in response.get("Items", []):
            listing_id = item["listing_id"]["S"]

            item_name = item.get("item_name", {}).get("S", "")
            details = item.get("details", {}).get("S", "")

            search_name = item_name.lower()
            search_details = details.lower()

            # Update DynamoDB — adds or overwrites the two fields
            dynamodb.update_item(
                TableName=table_name,
                Key={"listing_id": {"S": listing_id}},
                UpdateExpression="SET search_name = :sn, search_details = :sd",
                ExpressionAttributeValues={
                    ":sn": {"S": search_name},
                    ":sd": {"S": search_details},
                }
            )

            updated_count += 1
            print(f"Updated {listing_id}: search_name='{search_name}', search_details='{search_details}'")

        last_key = response.get("LastEvaluatedKey")
        if not last_key:
            break


def migrate_listings(table_name: str):
    last_evaluated_key = None

    while True:
        scan_kwargs = {"TableName": table_name}
        if last_evaluated_key:
            scan_kwargs["ExclusiveStartKey"] = last_evaluated_key

        response = dynamodb.scan(**scan_kwargs)

        for item in response.get("Items", []):
            listing_id = item["listing_id"]["S"]

            update_expr = []
            expr_attr_names = {}
            expr_attr_values = {}

            # Add tags if not present
            if "tags" not in item:
                update_expr.append("#tags = :tags")
                expr_attr_names["#tags"] = "tags"
                expr_attr_values[":tags"] = {"L": []}  # empty list

            if update_expr:
                update_expression = "SET " + ", ".join(update_expr)
                dynamodb.update_item(
                    TableName=table_name,
                    Key={"listing_id": {"S": listing_id}},
                    UpdateExpression=update_expression,
                    ExpressionAttributeNames=expr_attr_names,
                    ExpressionAttributeValues=expr_attr_values
                )
                print(f"Updated listing {listing_id}")

        last_evaluated_key = response.get("LastEvaluatedKey")
        if not last_evaluated_key:
            break
