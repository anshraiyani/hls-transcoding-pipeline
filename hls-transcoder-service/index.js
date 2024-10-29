require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { downloadFromS3, uploadToS3 } = require('./services/s3Service');
const { transcodeToHLS } = require('./services/ffmpegService');

async function processVideo() {
  const videoKey = process.env.VIDEO_KEY; // Get the video key from environment variables
  if (!videoKey) {
    console.error('VIDEO_KEY is not set in the environment variables.');
    return;
  }

  try {
    // Step 1: Download from S3
    const inputPath = await downloadFromS3(videoKey);

    // Step 2: Transcode to HLS
    const outputDir = await transcodeToHLS(inputPath);

    // Step 3: Upload each file in the HLS output to S3
    const files = fs.readdirSync(outputDir);
    for (const file of files) {
      const localFilePath = path.join(outputDir, file);
      const s3Key = `hls/${path.basename(outputDir)}/${file}`;
      await uploadToS3(localFilePath, s3Key);
    }

    console.log('Transcoding and upload completed.');
  } catch (error) {
    console.error('Error processing video:', error);
  }
}

processVideo();
