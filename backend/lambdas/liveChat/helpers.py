import json
import boto3
import os
import urllib3

GET_USER_ENDPOINT = os.environ["GET_USER_ENDPOINT"]

http = urllib3.PoolManager()
ses = boto3.client("ses")

def get_seller_email(user_id):
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

def send_email_to_seller(user_id, message):

    user_email = get_seller_email(user_id)

    message_text = (
        f"Hello,\n\n"
        f"You have a new message regarding one of your listings.\n\n"
        f"Message:\n{message}\n\n"
        "View and reply in CrocList chat page!.\n\n"
        "- Crocklist Admin Team"
    )

    ses.send_email(
        Source="crocklist7@gmail.com",
        Destination={"ToAddresses": [user_email]},
        Message={
            "Subject": {"Data": f"You've recieved a message about your listing on CrocList!"},
            "Body": {"Text": {"Data": message_text}}
        }
    )
