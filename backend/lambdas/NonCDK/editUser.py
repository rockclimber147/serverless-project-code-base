import os
import json
import boto3

dynamodb = boto3.client('dynamodb')
TABLE = os.environ.get('DYNAMODB_TABLE')  # e.g., 'usertable'

ALLOWED_FIELDS = ('givenName', 'familyName', 'prefLocation', 'profileImage')  # email excluded

def lambda_handler(event, context):
    try:
        # Use the whole event as body since $input.body passes JSON
        body = event
        if isinstance(body, str):
            body = json.loads(body)

        user_id = body.get('id')
        if not user_id:
            return {'statusCode': 400, 'body': json.dumps({'error': 'id is required'})}

        update_parts = []
        attr_values = {}

        for key in ALLOWED_FIELDS:
            if key in body and body[key] != "":
                update_parts.append(f"{key} = :{key}")
                attr_values[f":{key}"] = {'S': str(body[key])}

        if not update_parts:
            return {'statusCode': 400, 'body': json.dumps({'error': 'no updatable fields provided'})}

        update_expr = "SET " + ", ".join(update_parts)

        dynamodb.update_item(
            TableName=TABLE,
            Key={'id': {'S': user_id}},
            UpdateExpression=update_expr,
            ExpressionAttributeValues=attr_values
        )

        return {'statusCode': 200, 'body': json.dumps({'message': 'Profile updated'})}

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}
