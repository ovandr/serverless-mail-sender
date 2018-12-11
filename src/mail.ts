import { APIGatewayEvent, SQSEvent } from 'aws-lambda';
import SES from 'aws-sdk/clients/ses';
import SQS from 'aws-sdk/clients/sqs';
import { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { createResponce } from './utils';
import EmailSender from './lib/email.sender';
import { AWSError } from 'aws-sdk';

const ses = new SES();
const sqs = new SQS();
const sender = new EmailSender(ses);
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/606300951917/MailQueue';

const sendEmail = async (options: SendMailOptions) => {
    return sender.sendEmail(options);
};

const sendTemplate = async (options: SendMailOptions, template: string, data: {}) => {
    return sender.sendTemplate(options, template, data);
};

export async function send(event: APIGatewayEvent) {
    const options: SendMailOptions = JSON.parse(event.body);

    const [quota, sqsAttributes] = await Promise.all([
        ses.getSendQuota().promise(),
        sqs.getQueueAttributes({
            QueueUrl: queueUrl,
            AttributeNames: ['ApproximateNumberOfMessages'],
        }).promise(),
        ses.getIdentityVerificationAttributes({
            Identities: [options.sender.toString()],
        }).promise(),
    ]);

    const queueCount = parseInt(sqsAttributes.Attributes.ApproximateNumberOfMessages, 10);
    if (quota.SentLast24Hours + queueCount >= quota.Max24HourSend) {
        return createResponce(new AWSError('Daily limit exceed'), null);
    }

    return createResponce(null, await sqs.sendMessage({
        MessageBody: event.body,
        QueueUrl: queueUrl,
    }).promise());
}

export async function sqsHandler(event: SQSEvent) {
    await sendEmail(JSON.parse(event.Records[0].body));
}
