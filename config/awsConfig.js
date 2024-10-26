const { S3Client } = require('@aws-sdk/client-s3');
const { SQSClient } = require('@aws-sdk/client-sqs');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
require('dotenv').config();

// Configure the S3 and SQS clients
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

module.exports = { s3, sqs };
