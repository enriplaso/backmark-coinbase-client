import { CoinbaseError } from './error';
import { generateToken } from './jwtAuthentication';

export function coinbaseClientFactory(apiKey: string, apiSecret: string, domain: string, userAgent: string) {
    return async (path: string, httpMethod: string, body: Record<string, unknown>): Promise<string> => {
        const url = `https://${domain}${path}`;
        const authToken = generateToken(apiKey, apiSecret, url);

        const requestOptions: RequestInit = {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': userAgent,
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
        };

        const response: Response = await fetch(url, requestOptions);
        const responseText = await response.text();
        if (response.ok) {
            return responseText;
        }

        let message = `${response.status} Coinbase Error: ${response.statusText} ${responseText}`;

        if (response.status == 403 && responseText.includes('"error_details":"Missing required scopes"')) {
            message = `${response.status} Coinbase Error: Missing Required Scopes. Please verify your API keys include the necessary permissions.`;
        }

        throw new CoinbaseError(message, response.status, response);
    };
}

export type CoinbaseClient = (path: string, httpMethod: string, body: string) => Promise<string>;
