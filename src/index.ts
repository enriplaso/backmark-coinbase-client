import { CoinbaseClient } from './coinbaseClient';
import { coinbaseHttpClientFactory } from './httpClient';

export const DOMAIN = 'api.coinbase.com';
export const USER_AGENT = `backmark-coinbase-client`;

export function coinbaseClient(productId: string, apiKey: string, apiSecret: string): CoinbaseClient {
    const httpClient = coinbaseHttpClientFactory(apiKey, apiSecret, DOMAIN, USER_AGENT);
    return new CoinbaseClient(httpClient, productId);
}
