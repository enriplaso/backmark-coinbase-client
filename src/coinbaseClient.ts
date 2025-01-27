import { Account, IExchangeClient, Order, TimeInForce, Trade } from 'backmark-common-types';
import { CoinbaseHttpClient } from './httpClient';
import {
    getLimitOrdersCoinbaseConf,
    getStopOrdersCoinbaseConf,
    transformCoinbaseOrderToOrder,
    transformCoinbasePreviewOrderResponseToOrder,
} from './transformer';
import { CreateOrderRequest } from './types/coinbaseTypes';
import { OrderSide, StopDirection } from './types/coinbaseCommonTypes';
import { isListOrdersResponse, isPreviewOrderResponse } from './typePredicates';

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
        await this.httpClient(`${API_PREFIX}/orders/batch_cancel`, 'POST', { order_ids: [id] });
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
    getAllTrades(): Trade[] {
        // https://api.coinbase.com/api/v3/brokerage/orders/historical/fills
        throw new Error('Method not implemented.');
    }
    cancelAllOrders(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getAccount(): Account {
        throw new Error('Method not implemented.');
    }
}
