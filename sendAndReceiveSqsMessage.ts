import * as AWS from 'aws-sdk';
// Set the region
AWS.config.update({region: 'YOUR_REGION'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueURL = "https://sqs.<YOUR_REGION>.amazonaws.com/<ACCOUNT_ID>/<QUEUE_NAME>";

const sendParams = {
    DelaySeconds: 10,
    MessageBody: "Hello!",
    QueueUrl: queueURL
  };

const receiveParams = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    // VisibilityTimeout: 120,
    // WaitTimeSeconds: 0
};

function sendMessageTOSqs() {
    sqs.sendMessage(sendParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Message sent to queue successfully!", data.MessageId);
        }
    });
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function listenToSQSMessages() {
    sendMessageTOSqs();
    for(let i = 0; i < 15; i++) {
        console.log("sleeping for 30s...");
        await sleep(30000); // 30s

        sqs.receiveMessage(receiveParams, function(err, data) {
            if (err) {
                console.log("Receive Error", err);
            } else if (data.Messages) {
                var now = new Date();
                console.log("message received successfully ",now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() );
            } else {
                // var now = new Date();
                console.log("no messages available ");
            }
        });
    }
}

listenToSQSMessages();
