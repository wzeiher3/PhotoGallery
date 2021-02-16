import json
import boto3  
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

REGION="us-east-1"
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table('PhotoGallery')

def lambda_handler(event, context):
    photoID= event['body-json']['PhotoID']
    title=event['body-json']['title']
    description=event['body-json']['description']
    tags=event['body-json']['tags']
    CreationTime = int(photoID)
    print(photoID);
    print(title);
    print(description);
    print(tags);
    

    try: 
        table.update_item(
            Key={
                'PhotoID': str(photoID),
                'CreationTime': CreationTime
             },
            UpdateExpression="set Title=:t, Description=:d, Tags=:a",
            ExpressionAttributeValues={
                ':t': str(title),
                ':d': str(description),
                ':a': str(tags),
            }
        )
    except ClientError as e: 
        print(e.response['Error']['Message']);
        return {
            "statusCode": 400,
            "body": json.dumps(photoID)
        }
    else:
        return {
            "statusCode": 200,
            "body": json.dumps(photoID)
        }
   
 
 













# import json
# import boto3  
# from boto3.dynamodb.conditions import Key, Attr
# from botocore.exceptions import ClientError

# REGION="us-east-1"
# dynamodb = boto3.resource('dynamodb', region_name=REGION)
# table = dynamodb.Table('PhotoGallery')

# def lambda_handler(event, context):
#     photoID= event['body-json']['PhotoID']
#     title=event['body-json']['title']
#     description=event['body-json']['description']
#     tags=event['body-json']['tags']
#     CreationTime = int(photoID)
#     print(photoID);

#    table.update_item(
#             Key={
#                 'PhotoID': str(photoID),
#                 'CreationTime': CreationTime
#              },
#             UpdateExpression="set title=:t, description=:d, tags=:a",
#             ExpressionAttributeValues={
#                 ':t': str(title),
#                 ':d': str(description),
#                 ':a': str(tags),
#             }
#         )

   
 
#     return {
#         "statusCode": 200,
#         "body": json.dumps(photoID)
#     }