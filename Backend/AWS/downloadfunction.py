import json
import boto3
import base64

s3 = boto3.client('s3')
BUCKET_NAME = 'new-file-uploader'

def lambda_handler(event, context):
    try:
        # Get the file name from the query string parameters
        file_name = event['queryStringParameters']['fileName']
        
        # Retrieve the file from S3
        file_obj = s3.get_object(Bucket=BUCKET_NAME, Key=file_name)
        file_content = file_obj['Body'].read()
        
        return {
            'statusCode': 200,
            'body': file_content,
            'isBase64Encoded': True,
            'headers': {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': f'attachment; filename={file_name}'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error retrieving file: {str(e)}")
        }
