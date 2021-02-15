import json
import boto3  
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table('PhotoGallery')

def lambda_handler(event, context):
    photoID= event['body-json']['PhotoID']
    CreationTime = int(photoID)
    print(photoID);


    table.delete_item(
        Key={
            'PhotoID': str(photoID),
            'CreationTime': CreationTime
        }
    )
 
    return {
        "statusCode": 200,
        "body": json.dumps(photoID)
    }