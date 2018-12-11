import { SendMailOptions } from 'nodemailer';
import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { SendRawEmailRequest } from 'aws-sdk/clients/ses';
import EmailSender from './lib/email.sender';

test('source and destination should be correct', () => {
    const mailOptions: SendMailOptions = {
        to: 'to@example.com',
        from: 'from@example.com',
        subject: 'Test Subj',
        text: 'Test text',
        html: '<strong>Test html</strong>',
    };

    AWSMock.mock('SES', 'sendRawEmail', (options: SendRawEmailRequest) => {
        expect(options.Source).toBe(mailOptions.from);
        expect(options.Destinations.length).toBe(1);
        expect(options.Destinations[0]).toBe(mailOptions.to);

        AWSMock.restore('SES', 'sendRawEmail');
    });

    const sender = new EmailSender(new AWS.SES());
    sender.sendEmail(mailOptions);
});
