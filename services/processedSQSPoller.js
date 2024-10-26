const {
    ReceiveMessageCommand,
    DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { sqs } = require("../config/awsConfig");

const pollForProcessedVideo = async (videoKey) => {
    const queueUrl = process.env.SQS_PROCESSED_QUEUE_URL;

    while (true) {
        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 5,
            });

            const data = await sqs.send(command);

            if (data.Messages && data.Messages.length > 0) {
                for (const message of data.Messages) {
                    let body;
                    try {
                        body = typeof message.Body === "string"
                            ? JSON.parse(message.Body)
                            : message.Body; 
                    } catch (jsonError) {
                        console.error("Failed to parse SQS message body:", message.Body);
                        continue;
                    }

                    const s3Event = body && body.Records && body.Records[0];

                    if (
                        s3Event &&
                        s3Event.s3 &&
                        s3Event.s3.object &&
                        s3Event.s3.object.key
                    ) {
                        const receivedVideoKey = s3Event.s3.object.key;
                        const expectedKey = `hls/${videoKey}/index.m3u8`; 

                        // Check if received key matches the expected key
                        if (receivedVideoKey === expectedKey) {
                            await sqs.send(
                                new DeleteMessageCommand({
                                    QueueUrl: queueUrl,
                                    ReceiptHandle: message.ReceiptHandle,
                                })
                            );

                            console.log(`Message deleted for key: ${receivedVideoKey}`);
                            return { videoKey: receivedVideoKey }; // Return the matched key
                        }
                    } else {
                        console.error("Invalid S3 event structure:", body);
                    }
                }
            }
        } catch (error) {
            console.error("Error polling for processed video:", error);
            throw new Error("Failed to retrieve video status from processed SQS queue");
        }

        // Wait before polling again
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
};

module.exports = { pollForProcessedVideo };
