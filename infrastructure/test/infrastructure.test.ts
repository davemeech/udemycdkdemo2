import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Infrastructure from '../lib/infrastructure-stack';

describe('Retail Feed IAM Role', () => {
    test('That it was created with the expected properties', () => {
        const app = new cdk.App();
        // WHEN
        const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack');
        // THEN
        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::IAM::Role', {
            RoleName: 'inventoryfeedlambdarole'
        });
    });
});

describe('Retail Feed Lambda', () => {
    test('That it was created with the expected properties', () => {
        const app = new cdk.App();
        // WHEN
        const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack');
        // THEN
        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'lambda_function.lambda_handler',
            Runtime: 'python3.11'
        });
    });
});

describe('Retail Feed S3 Bucket', () => {
    test('That it was created with the expected properties', () => {
        const app = new cdk.App();
        // WHEN
        const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack');
        // THEN
        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::S3::Bucket', {
            BucketName: 'retailfeedbucketdavemeech'
        });
    });
});

describe('Retail Feed DynamoDB Table', () => {
    test('That it was created with the expected properties', () => {
        const app = new cdk.App();
        // WHEN
        const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack');
        // THEN
        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::DynamoDB::Table', {
            TableName: "retaildynamodbtable",
            AttributeDefinitions: [
                {
                 AttributeName: "customername",
                 AttributeType: "S"
                }
               ],
               KeySchema: [
                {
                 AttributeName: "customername",
                 KeyType: "HASH"
                }
               ]
        });
    });
});

