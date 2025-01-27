import { MarginType, Order, OrderConfiguration, OrderSide } from './coinbaseCommonTypes';

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

export type PreviewOrderResponse = {
    order_total: string;
    commission_total: string;
    errs: Record<string, unknown>[];
    warning: Record<string, unknown>[];
    quote_size: string;
    base_size: string;
    best_bid: string;
    best_ask: string;
    is_max: boolean;
    order_margin_total?: string;
    leverage?: string;
    long_leverage?: string;
    short_leverage?: string;
    slippage?: string;
    preview_id?: string;
    current_liquidation_buffer?: string;
    projected_liquidation_buffer?: string;
    max_leverage?: string;
    pnl_configuration?: Record<string, unknown>;
};

export type ListOrdersResponse = {
    orders: Order[];
    sequence?: number; // deprecated
    has_next: boolean;
    cursor?: string;
};
