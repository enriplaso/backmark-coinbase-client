import { Account, IExchangeClient, Order, TimeInForce, Trade } from 'backmark-common-types';
import { CoinbaseHttpClient } from './httpClient';
import { transformCoinbaseOrderToOrder } from './transformer';
import { CreateOrderRequest } from './types/coinbaseTypes';
import { OrderSide } from './types/coinbaseCommonTypes';

const API_PREFIX = '/api/v3/brokerage';

export class CoinbaseClient implements IExchangeClient {
    constructor(
        private httpClient: CoinbaseHttpClient,
        private productId: string,
    ) {}
    public async marketBuyOrder(funds: number, timeInForce = TimeInForce.INMEDIATE_OR_CANCELL): Promise<Order> {
        if (timeInForce !== TimeInForce.INMEDIATE_OR_CANCELL) {
            console.warn('Coinbase only accept Market IOC orders');
        }

        const body: CreateOrderRequest = {
            productId: this.productId,
            clientOrderId: crypto.randomUUID(),
            side: OrderSide.BUY,
            orderConfiguration: { market_market_ioc: { quote_size: funds.toString() } },
        };

        const response = await this.httpClient(`${API_PREFIX}/orders`, 'POST', body);
        return transformCoinbaseOrderToOrder(response);
    }
    marketSellOrder(size: number, timeInForce = TimeInForce.INMEDIATE_OR_CANCELL): Order {
        if (timeInForce !== TimeInForce.INMEDIATE_OR_CANCELL) {
            console.warn('Coinbase only accept Market IOC orders');
        }

        throw new Error('Method not implemented.');
    }
    limitBuyOrder(price: number, funds: number, timeInForce?: TimeInForce, cancelAfter?: Date): Order {
        throw new Error('Method not implemented.');
    }
    limitSellOrder(price: number, quantity: number, timeInForce?: TimeInForce, cancelAfter?: Date): Order {
        throw new Error('Method not implemented.');
    }
    stopLossOrder(price: number, size: number, timeInForce?: TimeInForce, cancelAfter?: Date): Order {
        throw new Error('Method not implemented.');
    }
    stopEntryOrder(price: number, size: number, timeInForce?: TimeInForce, cancelAfter?: Date): Order {
        throw new Error('Method not implemented.');
    }
    cancelOrder(id: string): void {
        throw new Error('Method not implemented.');
    }
    getAllOrders(): Order[] {
        throw new Error('Method not implemented.');
    }
    getAllTrades(): Trade[] {
        throw new Error('Method not implemented.');
    }
    cancelAllOrders(): void {
        throw new Error('Method not implemented.');
    }
    getAccount(): Account {
        throw new Error('Method not implemented.');
    }
}
