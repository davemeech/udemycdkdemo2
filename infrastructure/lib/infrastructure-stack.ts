import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const retailfeediamrole = new iam.Role(this, 'retailiamlogicalid', {
      roleName: 'inventoryfeedlambdarole',
      description: "role for lambda service",
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    })
    retailfeediamrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
    retailfeediamrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));
    retailfeediamrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'));

    // Lambda function
    const retaillambda = new lambda.Function(this, 'retaillambdadlogicalid', {
      role: retailfeediamrole,
      handler: 'lambda_function.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_11,
      code: lambda.Code.fromAsset('../services/')
    })
    retaillambda.node.addDependency(retailfeediamrole);

    //s3 bucket
    const retails3bucket = new s3.Bucket(this, 'retailbucketlogicalid', {
      bucketName: 'retailfeedbucketdavemeech',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })

    //s3 event notification
    retails3bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(retaillambda));

    //dynamodb
    const retaildynamodb = new dynamodb.Table(this, 'dynamodblogicalid', {
      tableName: 'retaildynamodbtable',
      partitionKey: { name: 'customername', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
  }
}
