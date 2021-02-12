import json
import boto3  
from boto3.dynamodb.conditions import Key, Attr

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table('PhotoGallery')

def lambda_handler(event, context):
    photoID=event['params']['path']['id']
    print(photoID)
    try:
        response = table.delete_item(
            Key={
                'PhotoID': photoID
            }
        )
    except ClientError as e:
        print(e)
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            print(e.response['Error']['Message'])
        else:
            raise
    else:
        return response