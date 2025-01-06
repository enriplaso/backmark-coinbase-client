import { Account, IExchangeClient, Order, TimeInForce, Trade } from 'backmark-common-types';

export class CoinbaseClient implements IExchangeClient {
    marketBuyOrder(funds: number, timeInForce?: TimeInForce, cancelAfter?: Date): Order {
        throw new Error('Method not implemented.');
    }
    marketSellOrder(size: number, timeInForce?: TimeInForce, cancelAfter?: Date): Order {
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
