import { Order } from 'backmark-common-types';

export function transformCoinbaseOrderToOrder(coinbaseOrder: string): Order {
    try {
        const coinbaseOrderJSON = JSON.stringify(coinbaseOrder);
    } catch (error) {}
    //TODO
    return {} as Order;
}
