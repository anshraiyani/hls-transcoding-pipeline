const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');

async function uploadVideoToS3(file) {
  const fileKey = `uploads/${uuidv4()}_${file.originalname}`;
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  // Upload the video to S3
  await s3.send(new PutObjectCommand(uploadParams));

  // Return file details, including the S3 location
  return { Key: fileKey, Location: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}` };
}

module.exports = { uploadVideoToS3 };
