import { Order, OrderStatus, OrderType, Side, TimeInForce } from 'backmark-common-types';
import { CreateOrderRequest, PreviewOrderResponse } from './types/coinbaseTypes';
import { OrderSide } from './types/coinbaseCommonTypes';

export function transformCoinbaseOrderToOrder(coinbaseOrder: PreviewOrderResponse, requestOrder: CreateOrderRequest): Order {
    return {
        id: requestOrder.clientOrderId,
        type: 'market_market_ioc' in requestOrder.orderConfiguration ? OrderType.MARKET : OrderType.LIMIT,
        side: requestOrder.side === OrderSide.BUY ? Side.BUY : Side.SELL, // TODO: simplify types
        status: OrderStatus.ACTIVE,
        timeInForce: TimeInForce.INMEDIATE_OR_CANCELL,
        quantity: Number(coinbaseOrder.base_size),
        createdAt: new Date(),
        price: 3,
        funds: Number(coinbaseOrder.quote_size),
        fillFees: Number(coinbaseOrder.commission_total),
    } as Order;
}
