const {
    ReceiveMessageCommand,
    DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { sqs } = require("../config/awsConfig"); // Import the SQS client

// Poll for messages in the temp SQS queue (triggered by S3)
const pollForTempVideo = async (videoKey) => {
    const queueUrl = process.env.SQS_QUEUE_URL; // URL of the temporary SQS queue

    while (true) {
        try {
            // Check for messages in the queue
            const command = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 10, // Increase to fetch multiple messages at once
                WaitTimeSeconds: 5, // Long polling for 5 seconds
            });

            const data = await sqs.send(command);

            if (data.Messages && data.Messages.length > 0) {
                for (const message of data.Messages) {
                    // Ensure the message body is a valid JSON string
                    let body;
                    try {
                        body =
                            typeof message.Body === "string"
                                ? JSON.parse(message.Body)
                                : message.Body;
                    } catch (jsonError) {
                        console.error(
                            "Failed to parse SQS message body:",
                            message.Body
                        );
                        continue; // Skip this message and continue with the next one
                    }

                    // Extract video key from S3 event notification
                    const s3Event = body && body.Records && body.Records[0];
                    if (
                        s3Event &&
                        s3Event.s3 &&
                        s3Event.s3.object &&
                        s3Event.s3.object.key
                    ) {
                        const receivedVideoKey = s3Event.s3.object.key;

                        // Check if the received video key matches the expected video key
                        if (receivedVideoKey === videoKey) {
                            // Delete the message after processing
                            await sqs.send(
                                new DeleteMessageCommand({
                                    QueueUrl: queueUrl,
                                    ReceiptHandle: message.ReceiptHandle,
                                })
                            );

                            // Return the key of the video that was uploaded to the temp bucket
                            return { videoKey: receivedVideoKey };
                        }
                    } else {
                        console.error("Invalid S3 event structure:", body);
                    }
                }
            }
        } catch (error) {
            console.error("Error polling for temp video:", error);
            throw new Error(
                "Failed to retrieve video status from temp SQS queue"
            );
        }

        // Wait for a short period before polling again
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
};

module.exports = { pollForTempVideo };
