import json
import boto3

client = boto3.client('geo-places', region_name='us-west-2')

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    lat = body.get('latitude')
    lng = body.get('longitude')

    if lat is None or lng is None:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'latitude and longitude are required'}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }
        }

    resp = client.reverse_geocode(
        QueryPosition=[lng, lat],
        MaxResults=1
    )

    result_items = resp.get('ResultItems', [])
    if not result_items:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'No address found for these coordinates'}),
            'headers': {'Content‑Type': 'application/json'}
        }

    address = result_items[0]['Address']['Label']

    return {
        'statusCode': 200,
        'body': json.dumps({'address': address}),
        'headers': {'Content‑Type': 'application/json'}
    }
