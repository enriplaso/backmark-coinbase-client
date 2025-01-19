import { Order, OrderStatus, OrderType, Side, TimeInForce } from 'backmark-common-types';
import { CreateOrderRequest, PreviewOrderResponse } from './types/coinbaseTypes';
import { OrderConfiguration, OrderSide } from './types/coinbaseCommonTypes';

export function transformCoinbaseOrderToOrder(
    coinbaseOrder: PreviewOrderResponse,
    requestOrder: CreateOrderRequest,
    timeInForce?: TimeInForce,
): Order {
    return {
        id: requestOrder.clientOrderId,
        type: 'market_market_ioc' in requestOrder.orderConfiguration ? OrderType.MARKET : OrderType.LIMIT,
        side: requestOrder.side === OrderSide.BUY ? Side.BUY : Side.SELL, // TODO: simplify types
        status: OrderStatus.ACTIVE,
        timeInForce: timeInForce,
        quantity: Number(coinbaseOrder.base_size),
        createdAt: new Date(),
        price: 3, //TODO fix missing parameters
        funds: Number(coinbaseOrder.quote_size),
        fillFees: Number(coinbaseOrder.commission_total),
    } as Order;
}

export function getLimitOrdersCoinbaseConf(price: number, size: number, timeInForce?: TimeInForce, cancelAfter?: Date): OrderConfiguration {
    switch (timeInForce) {
        case TimeInForce.FILL_OR_KILL:
            return { limit_limit_fok: { baseSize: size.toString(), limitPrice: price.toString() } };
        case TimeInForce.GOOD_TILL_TIME:
            if (cancelAfter === undefined) {
                throw new Error('cancelAfter cannot be undefined');
            }
            return {
                limit_limit_gtd: {
                    baseSize: size.toString(),
                    limitPrice: price.toString(),
                    endTime: cancelAfter.getTime().toString(),
                    postOnly: true,
                },
            };
        case TimeInForce.INMEDIATE_OR_CANCELL:
            return { limit_limit_fok: { baseSize: size.toString(), limitPrice: price.toString() } };
        default:
            return { limit_limit_gtc: { baseSize: size.toString(), limitPrice: price.toString(), postOnly: true } };
    }
}
