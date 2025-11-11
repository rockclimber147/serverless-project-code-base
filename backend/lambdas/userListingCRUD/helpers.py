import time
import boto3

dynamodb = boto3.client("dynamodb")

# ---------- Create Listing ----------
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
            "error": f"Missing fields: {', '.join(missing)}",
            "user_id": user_id,
        }

    listing_id = f"{user_id}-{int(time.time())}"

    item = {
        "listing_id": {"S": listing_id},
        "user_id": {"S": user_id},
        "item_name": {"S": data["item_name"]},
        "price": {"N": str(data["price"])},
        "is_sold": {"BOOL": bool(data.get("is_sold", False))},
        "details": {"S": data.get("details", "")},
        "location": {"S": data.get("location", "")},
        "latitude": {"N": str(data.get("latitude", 0.0))},
        "longitude": {"N": str(data.get("longitude", 0.0))},
        "image": {"S": data.get("image", "")},
        "created_at": {"N": str(int(time.time()))},
    }

    dynamodb.put_item(TableName=table_name, Item=item)

    return {
        "success": True,
        "message": "Listing created successfully",
        "listing_id": listing_id,
        "user_id": user_id,
        "item_name": data["item_name"],
        "price": data["price"],
    }


# ---------- Update Listing ----------
def update_listing(table_name: str, listing_id: str, user_id: str, updates: dict) -> dict:
    """
    Updates fields in an existing listing if the user owns it.
    Only allows updates by the listing's creator (user_id).
    """
    listing = dynamodb.get_item(TableName=table_name, Key={"listing_id": {"S": listing_id}})
    item = listing.get("Item")

    if not item:
        return {
            "success": False,
            "error": "Listing not found",
            "listing_id": listing_id,
            "user_id": user_id,
        }

    if item.get("user_id", {}).get("S") != user_id:
        return {
            "success": False,
            "error": "Forbidden - you do not own this listing",
            "listing_id": listing_id,
            "user_id": user_id,
        }

    allowed_fields = ["item_name", "details", "price", "is_sold", "location", "latitude", "longitude", "image"]
    update_fields = {k: v for k, v in updates.items() if k in allowed_fields}

    if not update_fields:
        return {
            "success": False,
            "error": "No valid fields to update",
            "listing_id": listing_id,
            "user_id": user_id,
        }

    expr = []
    values = {}
    for i, (k, v) in enumerate(update_fields.items()):
        key_alias = f":val{i}"
        expr.append(f"{k} = {key_alias}")
        if isinstance(v, bool):
            values[key_alias] = {"BOOL": v}
        elif isinstance(v, (int, float)):
            values[key_alias] = {"N": str(v)}
        else:
            values[key_alias] = {"S": str(v)}

    dynamodb.update_item(
        TableName=table_name,
        Key={"listing_id": {"S": listing_id}},
        UpdateExpression="SET " + ", ".join(expr),
        ExpressionAttributeValues=values,
    )

    return {
        "success": True,
        "message": "Listing updated successfully",
        "listing_id": listing_id,
        "user_id": user_id,
        "updated_fields": list(update_fields.keys()),
    }


# ---------- Delete Listing ----------
def delete_listing(table_name: str, listing_id: str, user_id: str) -> dict:
    """
    Deletes a listing if the user owns it.
    """
    listing = dynamodb.get_item(TableName=table_name, Key={"listing_id": {"S": listing_id}})
    item = listing.get("Item")

    if not item:
        return {
            "success": False,
            "error": "Listing not found",
            "listing_id": listing_id,
            "user_id": user_id,
        }

    if item.get("user_id", {}).get("S") != user_id:
        return {
            "success": False,
            "error": "Forbidden - you do not own this listing",
            "listing_id": listing_id,
            "user_id": user_id,
        }

    dynamodb.delete_item(TableName=table_name, Key={"listing_id": {"S": listing_id}})

    return {
        "success": True,
        "message": "Listing deleted successfully",
        "listing_id": listing_id,
        "user_id": user_id,
    }
