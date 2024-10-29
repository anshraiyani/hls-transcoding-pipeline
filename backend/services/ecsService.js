// services/ecsService.js
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { fromEnv } = require("@aws-sdk/credential-provider-env");

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});

async function startEcsTask(videoKey) {
    try {
        const params = {
            cluster: process.env.CLUSTER_ARN,
            taskDefinition: process.env.TASK_DEFINITION_ARN,
            launchType: "FARGATE",
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: [
                        "subnet-0763b03ba9f630552",
                        "subnet-05bf859dbb50b2261",
                        "subnet-03733580533a002a8",
                    ],
                    securityGroups: ["sg-0d828226897337808"],
                    assignPublicIp: "ENABLED",
                },
            },
            overrides: {
                containerOverrides: [
                    {
                        name: "hls-video-processor",
                        environment: [
                            {
                                name: "VIDEO_KEY",
                                value: videoKey,
                            },
                            {
                                name: "TEMP_BUCKET",
                                value: "anshraiyani.temp-hls",
                            },
                            {
                                name: "PROD_BUCKET",
                                value: "anshraiyani.prod-hls",
                            },
                            {
                                name: "AWS_ACCESS_KEY_ID",
                                value: process.env.AWS_ACCESS_KEY_ID,
                            },
                            {
                                name: "AWS_SECRET_ACCESS_KEY",
                                value: process.env.AWS_SECRET_ACCESS_KEY,
                            },
                        ],
                    },
                ],
            },
        };

        const command = new RunTaskCommand(params);
        const data = await ecsClient.send(command);

        console.log("ECS task started successfully"  );
        return data;
    } catch (error) {
        console.error("Error starting ECS task:", error);
        throw new Error("Failed to start ECS task");
    }
}

module.exports = { startEcsTask };
