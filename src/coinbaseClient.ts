import { Account, IExchangeClient, Order, TimeInForce, Trade } from 'backmark-common-types';
import { CoinbaseHttpClient } from './httpClient';
import {
    transformCoinbaseAccountToAccounts,
    getLimitOrdersCoinbaseConf,
    getStopOrdersCoinbaseConf,
    transformCoinbaseOrderToOrder,
    transformCoinbasePreviewOrderResponseToOrder,
    transformFillToTrade,
} from './transformer';
import { CreateOrderRequest } from './types/coinbaseTypes';
import { OrderSide, StopDirection } from './types/coinbaseCommonTypes';
import { isAccount, isFillResponse, isListOrdersResponse, isPreviewOrderResponse } from './typePredicates';

const API_PREFIX = '/api/v3/brokerage';

export class CoinbaseClient implements IExchangeClient {
    constructor(
        private httpClient: CoinbaseHttpClient,
        private productId: string,
    ) {}
    public async marketBuyOrder(funds: number, timeInForce = TimeInForce.INMEDIATE_OR_CANCELL): Promise<Order> {
        if (timeInForce !== TimeInForce.INMEDIATE_OR_CANCELL) {
            console.warn('Coinbase only accepts Market IOC orders');
        }

        const body: CreateOrderRequest = {
            productId: this.productId,
            clientOrderId: crypto.randomUUID(),
            side: OrderSide.BUY,
            orderConfiguration: { market_market_ioc: { quote_size: funds.toString() } },
        };

        const response = await this.httpClient(`${API_PREFIX}/orders`, 'POST', body);

        if (!isPreviewOrderResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }
        return transformCoinbasePreviewOrderResponseToOrder(response, body, timeInForce);
    }
    public async marketSellOrder(size: number, timeInForce = TimeInForce.INMEDIATE_OR_CANCELL): Promise<Order> {
        if (timeInForce !== TimeInForce.INMEDIATE_OR_CANCELL) {
            console.warn('Coinbase only accepts Market IOC orders');
        }
        const body: CreateOrderRequest = {
            productId: this.productId,
            clientOrderId: crypto.randomUUID(),
            side: OrderSide.SELL,
            orderConfiguration: { market_market_ioc: { base_size: size.toString() } },
        };

        const response = await this.httpClient(`${API_PREFIX}/orders`, 'POST', body);

        if (!isPreviewOrderResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }
        return transformCoinbasePreviewOrderResponseToOrder(response, body, timeInForce);
    }
    public async limitBuyOrder(price: number, funds: number, timeInForce?: TimeInForce, cancelAfter?: Date): Promise<Order> {
        const body: CreateOrderRequest = {
            productId: this.productId,
            clientOrderId: crypto.randomUUID(),
            side: OrderSide.BUY,
            orderConfiguration: getLimitOrdersCoinbaseConf(price, funds, timeInForce, cancelAfter),
        };

        const response = await this.httpClient(`${API_PREFIX}/orders`, 'POST', body);

        if (!isPreviewOrderResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }
        return transformCoinbasePreviewOrderResponseToOrder(response, body, timeInForce);
    }
    public async limitSellOrder(price: number, quantity: number, timeInForce?: TimeInForce, cancelAfter?: Date): Promise<Order> {
        const body: CreateOrderRequest = {
            productId: this.productId,
            clientOrderId: crypto.randomUUID(),
            side: OrderSide.SELL,
            orderConfiguration: getLimitOrdersCoinbaseConf(price, quantity, timeInForce, cancelAfter),
        };

        const response = await this.httpClient(`${API_PREFIX}/orders`, 'POST', body);

        if (!isPreviewOrderResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }
        return transformCoinbasePreviewOrderResponseToOrder(response, body, timeInForce);
    }
    public async stopLossOrder(price: number, size: number, timeInForce?: TimeInForce, cancelAfter?: Date): Promise<Order> {
        const body: CreateOrderRequest = {
            productId: this.productId,
            clientOrderId: crypto.randomUUID(),
            side: OrderSide.SELL,
            orderConfiguration: getStopOrdersCoinbaseConf(price, size, StopDirection.DOWN, timeInForce, cancelAfter), //TODO
        };

        const response = await this.httpClient(`${API_PREFIX}/orders`, 'POST', body);

        if (!isPreviewOrderResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }
        return transformCoinbasePreviewOrderResponseToOrder(response, body, timeInForce);
    }
    public async stopEntryOrder(price: number, size: number, timeInForce?: TimeInForce, cancelAfter?: Date): Promise<Order> {
        const body: CreateOrderRequest = {
            productId: this.productId,
            clientOrderId: crypto.randomUUID(),
            side: OrderSide.SELL,
            orderConfiguration: getStopOrdersCoinbaseConf(price, size, StopDirection.UP, timeInForce, cancelAfter), //TODO
        };

        const response = await this.httpClient(`${API_PREFIX}/orders`, 'POST', body);

        if (!isPreviewOrderResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }
        return transformCoinbasePreviewOrderResponseToOrder(response, body, timeInForce);
    }

    async cancelOrder(id: string): Promise<void> {
        const response = await this.httpClient(`${API_PREFIX}/orders/batch_cancel`, 'POST', { order_ids: [id] });
        // TODO check the response and throw respective error https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelorders
        console.info(JSON.stringify(response));
    }
    public async getAllOrders(): Promise<Order[]> {
        const response = await this.httpClient(
            `${API_PREFIX}/orders/historical/batch?order_status=OPEN&product_ids=${this.productId}`,
            'GET',
        );
        if (!isListOrdersResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }

        return response.orders.map((order) => transformCoinbaseOrderToOrder(order));
    }
    public async getAllTrades(limit = 500, startTimeStamp?: number, endTimeStamp?: number): Promise<Trade[]> {
        const response = await this.httpClient(
            `${API_PREFIX}/brokerage/orders/historical/fills?limit=${limit}&start_sequence_timestamp=${startTimeStamp}&end_sequence_timestamp=${endTimeStamp}`,
            'GET',
        );

        if (!isFillResponse(response)) {
            throw new Error('Unexpected response type from Coinbase API');
        }

        return response.fills.map((fill): Trade => transformFillToTrade(fill));
    }

    public async cancelAllOrders(): Promise<void> {
        const BATCH_SIZE = 100;
        const openOrders = await this.getAllOrders();
        const orderBatches = [];

        const orderIds = openOrders.map((order) => order.id);

        for (let i = 0; i < orderIds.length; i += BATCH_SIZE) {
            orderBatches.push(orderIds.slice(i, i + BATCH_SIZE));
        }

        for (const batch of orderBatches) {
            try {
                await this.httpClient(`${API_PREFIX}/brokerage/orders/batch_cancel`, 'POST', { order_ids: batch });
                console.log(`Successfully canceled batch of orders: ${batch.toString()}`);
            } catch (error) {
                console.error(`Failed to cancel batch of orders: ${batch.toString()}`);
                throw error;
            }
        }
    }
    public async getAccount(): Promise<Account> {
        // assume we have only a single account
        const response = await this.httpClient(`${API_PREFIX}/brokerage/accounts`, 'GET');

        if (!Array.isArray(response) || !isAccount(response[0])) {
            throw new Error('Unexpected response type from Coinbase API, no account was found');
        }

        return transformCoinbaseAccountToAccounts(response[0]);
    }
}
