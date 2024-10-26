const { uploadVideoToS3 } = require("../services/s3Service");
const { pollForTempVideo } = require("../services/sqsPoller"); // Import polling function
const { startEcsTask } = require("../services/ecsService");
const { pollForProcessedVideo } = require("../services/processedSQSPoller");

async function uploadVideo(req, res) {
    try {
        const file = req.file;

        // upload to S3
        const s3Result = await uploadVideoToS3(file);

        // polling the message in SQS
        const tempVideoData = await pollForTempVideo(s3Result.Key);

        // starting a container
        await startEcsTask(tempVideoData.videoKey);

        return res.status(200).json({
            message: "Video uploaded.",
            videoKey: tempVideoData.videoKey,
        });
    } catch (error) {
        console.error("Error uploading video:", error);
        return res.status(500).json({ error: "internal server error" });
    }
}

async function checkStatus(req, res) {
    try {
        const { videoKey } = req.query;

        const processedVideoKey = await pollForProcessedVideo(videoKey);

        const processedVideoLink = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME_PROD}/${processedVideoKey.videoKey}`;

        return res.status(200).json({
            message: "Video processed.",
            link: processedVideoLink,
        });
    } catch (error) {
        console.error("Error transcoding video:", error);
        return res.status(500).json({ error: "internal server error" });
    }
}

module.exports = { uploadVideo, checkStatus };
