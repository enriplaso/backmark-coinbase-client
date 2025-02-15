import { Account, Order, OrderStatus, OrderType, Side, TimeInForce, Trade } from 'backmark-common-types';
import {
    OrderConfiguration,
    OrderSide,
    StopDirection,
    Order as CoinbaseOrder,
    TimeInForce as CoinbaseTimeInForce,
    Account as CoinbaseAccount,
    Fill,
    CreateOrderRequest,
    PreviewOrderResponse,
} from './types/coinbaseCommonTypes';

export function transformCoinbasePreviewOrderResponseToOrder(
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

export function transformCoinbaseOrderToOrder(coinbaseOrder: CoinbaseOrder): Order {
    let timeInForce = TimeInForce.GOOD_TILL_CANCEL;

    switch (coinbaseOrder.time_in_force) {
        case CoinbaseTimeInForce.FILL_OR_KILL:
            timeInForce = TimeInForce.FILL_OR_KILL;
            break;
        case CoinbaseTimeInForce.GOOD_UNTIL_CANCELLED:
            timeInForce = TimeInForce.GOOD_TILL_CANCEL;
            break;
        case CoinbaseTimeInForce.GOOD_UNTIL_DATE_TIME:
            timeInForce = TimeInForce.GOOD_TILL_TIME;
            break;
        case CoinbaseTimeInForce.IMMEDIATE_OR_CANCEL:
            timeInForce = TimeInForce.INMEDIATE_OR_CANCELL;
            break;
    }
    return {
        id: coinbaseOrder.order_id,
        type: 'market_market_ioc' in coinbaseOrder.order_configuration ? OrderType.MARKET : OrderType.LIMIT,
        side: coinbaseOrder.side === OrderSide.BUY ? Side.BUY : Side.SELL, // TODO: simplify types
        status: OrderStatus.ACTIVE,
        timeInForce,
        quantity: Number(coinbaseOrder.filled_size),
        createdAt: new Date(),
        price: Number(coinbaseOrder.average_filled_price), //TODO fix missing parameters
        funds: Number(coinbaseOrder.total_value_after_fees),
        fillFees: Number(coinbaseOrder.total_fees),
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

export function transformFillToTrade(fill: Fill): Trade {
    return {
        orderId: fill.order_id,
        price: parseFloat(fill.price),
        side: fill.side as Side,
        quantity: parseFloat(fill.size),
        createdAt: new Date(fill.trade_time),
    };
}

export function transformCoinbaseAccountToAccounts(account: CoinbaseAccount): Account {
    return {
        id: account.uuid ?? '',
        balance: parseFloat(account.available_balance?.value ?? '0'), // TODO: this should be the USDT available
        available: parseFloat(account.hold?.value ?? '0'),
        currency: account.currency ?? '',
        productQuantity: 0, //TODO: this is the current product available amount, eg BTC USDT
        fee: 0.0, // Default fee (if not provided in Account)
    };
}
