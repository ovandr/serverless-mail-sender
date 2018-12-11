import { createTransport, SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer';
import SES from 'aws-sdk/clients/ses';

export default class EmailSender {
    private transporter: Transporter;

    constructor(ses: SES) {
        this.transporter = createTransport({
            SES: ses,
        });
    }

    public async sendEmail(options: SendMailOptions): Promise<SentMessageInfo> {
        options.headers = options.headers || {};
        options.headers['X-SES-CONFIGURATION-SET'] = process.env.SES_CONFIG_SET;

        return this.transporter.sendMail(options);
    }
}
