const {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
const fs = require("fs");
const path = require("path");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});

async function downloadFromS3(key) {
    const bucketName = process.env.TEMP_BUCKET_NAME;
    const tempDir = path.join(__dirname, "temp");

    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const localFilePath = path.join(tempDir, path.basename(key));
    const downloadParams = {
        Bucket: bucketName,
        Key: key,
    };

    const command = new GetObjectCommand(downloadParams);
    const data = await s3.send(command);

    // Stream the file to the local disk
    const writeStream = fs.createWriteStream(localFilePath);
    data.Body.pipe(writeStream);

    return new Promise((resolve, reject) => {
        writeStream.on("close", () => resolve(localFilePath));
        writeStream.on("error", reject);
    });
}

async function uploadToS3(localFilePath, key) {
    const bucketName = process.env.PRODUCTION_BUCKET_NAME;
    const fileStream = fs.createReadStream(localFilePath);
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
    };

    const command = new PutObjectCommand(uploadParams);
    return s3.send(command);
}

module.exports = { downloadFromS3, uploadToS3 };
