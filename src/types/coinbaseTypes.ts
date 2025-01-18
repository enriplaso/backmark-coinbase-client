import { MarginType, OrderConfiguration, OrderSide } from './coinbaseCommonTypes';

// Create Order
export type CreateOrderRequest = {
    // Body Params
    clientOrderId: string;
    productId: string;
    side: OrderSide;
    orderConfiguration: OrderConfiguration;
    selfTradePreventionId?: string;
    leverage?: string;
    marginType?: MarginType;
    retailPortfolioId?: string;
};
