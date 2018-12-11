import { Context, APIGatewayEvent } from 'aws-lambda';
import { AWSError } from 'aws-sdk/lib/error';
import SES from 'aws-sdk/clients/ses';
import { createResponce } from './utils';

const ses = new SES();

export async function verifyEmail(event: APIGatewayEvent, context: Context) {
    return ses.verifyEmailIdentity({
        EmailAddress: JSON.parse(event.body).email,
    }, (error: AWSError, result) => {
        return createResponce(error, result);
    });
}

export async function verifyDomain(event: APIGatewayEvent, context: Context) {
    return ses.verifyDomainIdentity({
        Domain: JSON.parse(event.body).domain,
    }, (error: AWSError, result) => {
        return createResponce(error, result);
    });
}

export async function getStatus(event: APIGatewayEvent, context: Context) {
    return ses.getIdentityVerificationAttributes({
        Identities: JSON.parse(event.body).identities,
    }).promise().then((result) => {
        return createResponce(null, result);
    });
}
