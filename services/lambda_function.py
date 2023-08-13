import json
import boto3
client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    response = client.get_object(
        Bucket='retailfeedbucketdavemeech',
        Key='cdktestfile.json',
)
# convert from streaming data to byte
    json_data = response['Body'].read()
    #convert data from byte to string
    data_string = json_data.decode('UTF-8')
    # convert from json string to dictionary
    data_dict =json.loads(data_string)
    
    #insert data to dynamodb
    table = dynamodb.Table('retaildynamodbtable')
    table.put_item(Item=data_dict)