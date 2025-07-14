import {
    IDataObject,
    IExecuteFunctions,
    IHookFunctions,
    ILoadOptionsFunctions,
    IWebhookFunctions,
    IHttpRequestMethods,
    IHttpRequestOptions,
    NodeApiError,
} from 'n8n-workflow';

import { createHmac } from 'crypto';

export async function polarApiRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<any> {
    const credentials = await this.getCredentials('polarApi');
    const environment = credentials.environment as string;
    
    const baseUrl = environment === 'sandbox' 
        ? 'https://sandbox-api.polar.sh'
        : 'https://api.polar.sh';

    const options: IHttpRequestOptions = {
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body,
        qs,
        json: true,
    };

    if (Object.keys(body).length === 0) {
        delete options.body;
    }

    try {
        return await this.helpers.httpRequestWithAuthentication.call(
            this,
            'polarApi',
            options,
        );
    } catch (error) {
        throw new NodeApiError(this.getNode(), error);
    }
}

export async function polarApiRequestAllItems(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    query: IDataObject = {},
): Promise<any> {
    const returnData: IDataObject[] = [];
    let responseData;
    
    query.limit = query.limit || 100;
    let page = 1;

    do {
        query.page = page;
        responseData = await polarApiRequest.call(this, method, endpoint, body, query);
        
        if (responseData.items) {
            returnData.push(...responseData.items);
        } else if (Array.isArray(responseData)) {
            returnData.push(...responseData);
            break;
        } else {
            returnData.push(responseData);
            break;
        }

        page++;
    } while (
        responseData.pagination &&
        responseData.pagination.next_page !== null
    );

    return returnData;
}

// Standard Webhooks signature validation for Polar.sh
// Based on Standard Webhooks spec and Polar.sh documentation
export function validateStandardWebhookSignature(
    payload: string,
    webhookId: string,
    webhookTimestamp: string,
    webhookSignature: string,
    secret: string,
): boolean {
    try {
        // According to Polar.sh docs: "Secret needs to be base64 encoded"
        // The user's secret (e.g., 'test') needs to be base64 encoded before use
        const base64Secret = Buffer.from(secret, 'utf8').toString('base64');
        const secretBytes = Buffer.from(base64Secret, 'base64');
        
        // Standard Webhooks signed payload format: webhook-id.webhook-timestamp.payload
        const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`;
        
        // Calculate expected signature using HMAC-SHA256
        const expectedSignature = createHmac('sha256', secretBytes)
            .update(signedPayload, 'utf8')
            .digest('base64');
        
        // Standard Webhooks signature header format: "v1,base64_signature"
        // Parse multiple signatures if present (space-separated)
        const signatureParts = webhookSignature.split(' ');
        
        for (const signaturePart of signatureParts) {
            if (signaturePart.includes(',')) {
                const [version, signature] = signaturePart.split(',', 2);
                
                if (version === 'v1' && signature === expectedSignature) {
                    return true;
                }
            }
        }
        
        return false;
    } catch (error) {
        return false;
    }
}

// Validate webhook timestamp to prevent replay attacks
export function validateWebhookTimestamp(timestamp: string, toleranceInSeconds: number = 300): boolean {
    try {
        const webhookTime = parseInt(timestamp) * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeDifference = Math.abs(currentTime - webhookTime);
        
        return timeDifference <= toleranceInSeconds * 1000;
    } catch (error) {
        return false;
    }
}

// Helper to format amounts (Polar uses cents)
export function formatAmount(cents: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(cents / 100);
}

// Helper to convert amount to cents
export function toCents(amount: number): number {
    return Math.round(amount * 100);
} 