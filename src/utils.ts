import { AWSError } from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';

export const createResponce = (error: AWSError, result: {}): APIGatewayProxyResult => {
    return {
        statusCode: error ? error.statusCode || 400 : 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(error || result),
    };
};
