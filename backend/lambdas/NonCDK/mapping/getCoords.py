import json
import boto3

client = boto3.client('geo-places', region_name='us-west-2')

def lambda_handler(event, context):
    body = json.loads(event.get('body') or '{}')
    address = body.get('address')
    
    if not address:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Address is required'})
        }

    resp = client.geocode(QueryText=address, MaxResults=1)

    result_items = resp.get('ResultItems', [])
    if not result_items:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Address not found'})
        }

    geometry = result_items[0]['Position']
    lng, lat = geometry

    return {
        'statusCode': 200,
        'body': json.dumps({
            'latitude': lat,
            'longitude': lng
        }),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
    }
