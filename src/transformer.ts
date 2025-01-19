import { Order, OrderStatus, OrderType, Side, TimeInForce } from 'backmark-common-types';
import { CreateOrderRequest, PreviewOrderResponse } from './types/coinbaseTypes';
import { OrderConfiguration, OrderSide, StopDirection } from './types/coinbaseCommonTypes';

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

export function getStopOrdersCoinbaseConf(
    price: number,
    size: number,
    direction: StopDirection,
    timeInForce?: TimeInForce,
    cancelAfter?: Date,
): OrderConfiguration {
    if (timeInForce === TimeInForce.FILL_OR_KILL || timeInForce === TimeInForce.INMEDIATE_OR_CANCELL) {
        throw new Error('FOK and IOC time in force is not allowed in Coinbase for Stop loss ordes');
    }
    if (timeInForce === TimeInForce.GOOD_TILL_CANCEL) {
        return {
            stop_limit_stop_limit_gtc: {
                baseSize: size.toString(),
                limitPrice: (price - price * 0.5).toString(),
                stopPrice: price.toString(),
                stopDirection: direction,
            },
        };
    }

    if (cancelAfter === undefined) {
        throw new Error('cancelAfter cannot be undefined');
    }

    return {
        stop_limit_stop_limit_gtd: {
            baseSize: size.toString(),
            limitPrice: (price - price * 0.5).toString(),
            stopDirection: direction,
            stopPrice: price.toString(),
            endTime: cancelAfter.getTime().toString(),
        },
    };
}
