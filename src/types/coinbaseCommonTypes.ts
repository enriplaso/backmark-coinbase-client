// ----- ENUMS -----
export enum ProductType {
    UNKNOWN = 'UNKNOWN_PRODUCT_TYPE',
    SPOT = 'SPOT',
    FUTURE = 'FUTURE',
}

export enum ContractExpiryType {
    UNKNOWN = 'UNKNOWN_CONTRACT_EXPIRY_TYPE',
    EXPIRING = 'EXPIRING',
    PERPETUAL = 'PERPETUAL',
}

export enum ExpiringContractStatus {
    UNKNOWN = 'UNKNOWN_EXPIRING_CONTRACT_STATUS',
    UNEXPIRED = 'STATUS_UNEXPIRED',
    EXPIRED = 'STATUS_EXPIRED',
    ALL = 'STATUS_ALL',
}

export enum PortfolioType {
    UNDEFINED = 'UNDEFINED',
    DEFAULT = 'DEFAULT',
    CONSUMER = 'CONSUMER',
    INTX = 'INTX',
}

export enum MarginType {
    CROSS = 'CROSS',
    ISOLATED = 'ISOLATED',
}

export enum OrderPlacementSource {
    UNKNOWN = 'UNKNOWN_PLACEMENT_SOURCE',
    RETAIL_SIMPLE = 'RETAIL_SIMPLE',
    RETAIL_ADVANCED = 'RETAIL_ADVANCED',
}

export enum SortBy {
    UNKNOWN = 'UNKNOWN_SORT_BY',
    LIMIT_PRICE = 'LIMIT_PRICE',
    LAST_FILL_TIME = 'LAST_FILL_TIME',
}

export enum OrderSide {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum StopDirection {
    UP = 'STOP_DIRECTION_STOP_UP',
    DOWN = 'STOP_DIRECTION_STOP_DOWN',
}

export enum Granularity {
    UNKNOWN = 'UNKNOWN_GRANULARITY',
    ONE_MINUTE = 'ONE_MINUTE',
    FIVE_MINUTE = 'FIVE_MINUTE',
    FIFTEEN_MINUTE = 'FIFTEEN_MINUTE',
    THIRTY_MINUTE = 'THIRTY_MINUTE',
    ONE_HOUR = 'ONE_HOUR',
    TWO_HOUR = 'TWO_HOUR',
    SIX_HOUR = 'SIX_HOUR',
    ONE_DAY = 'ONE_DAY',
}

export enum ProductVenue {
    UNKNOWN = 'UNKNOWN_VENUE_TYPE',
    CBE = 'CBE',
    FCM = 'FCM',
    INTX = 'INTX',
}

export enum IntradayMarginSetting {
    UNSPECIFIED = 'INTRADAY_MARGIN_SETTING_UNSPECIFIED',
    STANDARD = 'INTRADAY_MARGIN_SETTING_STANDARD',
    INTRADAY = 'INTRADAY_MARGIN_SETTING_INTRADAY',
}

export enum TimeInForce {
    UNKNOWN_TIME_IN_FORCE = 'UNKNOWN_TIME_IN_FORCE',
    GOOD_UNTIL_DATE_TIME = 'GOOD_UNTIL_DATE_TIME',
    GOOD_UNTIL_CANCELLED = 'GOOD_UNTIL_CANCELLED',
    IMMEDIATE_OR_CANCEL = 'IMMEDIATE_OR_CANCEL',
    FILL_OR_KILL = 'FILL_OR_KILL',
}

// ----- TYPES -----
export type AccountBalance = {
    value: string; // Amount of currency that this object represents
    currency: string; // Denomination of the currency
};

export type Account = {
    hold: AccountBalance;
    uuid?: string;
    name?: string;
    currency?: string;
    available_balance?: AccountBalance;
    default?: boolean;
    active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    type?: Record<string, unknown>;
    ready?: boolean;
    retail_portfolio_id?: string;
};

export type TradeIncentiveMetadata = {
    userIncentiveId?: string;
    codeVal?: string;
};

export type OrderConfiguration =
    | { market_market_ioc: MarketMarketIoc }
    | { sor_limit_ioc: SorLimitIoc }
    | { limit_limit_gtc: LimitLimitGtc }
    | { limit_limit_gtd: LimitLimitGtd }
    | { limit_limit_fok: LimitLimitFok }
    | { stop_limit_stop_limit_gtc: StopLimitStopLimitGtc }
    | { stop_limit_stop_limit_gtd: StopLimitStopLimitGtd }
    | { trigger_bracket_gtc: TriggerBracketGtc }
    | { trigger_bracket_gtd: TriggerBracketGtd };

export type MarketMarketIoc = { quote_size: string } | { base_size: string };

export type SorLimitIoc = {
    baseSize: string;
    limitPrice: string;
};

export type LimitLimitGtc = {
    baseSize: string;
    limitPrice: string;
    postOnly: boolean;
};

export type LimitLimitGtd = {
    baseSize: string;
    limitPrice: string;
    endTime: string;
    postOnly: boolean;
};

export type LimitLimitFok = {
    baseSize: string;
    limitPrice: string;
};

export type StopLimitStopLimitGtc = {
    baseSize: string;
    limitPrice: string;
    stopPrice: string;
    stopDirection: StopDirection;
};

export type StopLimitStopLimitGtd = {
    baseSize: string;
    limitPrice: string;
    stopPrice: string;
    endTime: string;
    stopDirection: StopDirection;
};

export type TriggerBracketGtc = {
    baseSize: string;
    limitPrice: string;
    stopTriggerPrice: string;
};

export type TriggerBracketGtd = {
    baseSize: string;
    limitPrice: string;
    stopTriggerPrice: string;
    endTime: string;
};

export type RatConvertTrade = {
    id?: string;
    status?: Record<string, unknown>;
    user_entered_amount?: Record<string, unknown>;
    amount?: Record<string, unknown>;
    subtotal?: Record<string, unknown>;
    total?: Record<string, unknown>;
    fees?: Record<string, unknown>;
    total_fee?: Record<string, unknown>;
    source?: Record<string, unknown>;
    target?: Record<string, unknown>;
    unit_price?: Record<string, unknown>;
    user_warnings?: Record<string, unknown>;
    user_reference?: string;
    source_curency?: string;
    cancellation_reason?: Record<string, unknown>;
    source_id?: string;
    target_id?: string;
    subscription_info?: Record<string, unknown>;
    exchange_rate?: Record<string, unknown>;
    tax_details?: Record<string, unknown>;
    trade_incentive_info?: Record<string, unknown>;
    total_fee_without_tax?: Record<string, unknown>;
    fiat_denoted_total?: Record<string, unknown>;
};

export type FCMBalanceSummary = {
    futures_buying_power?: Record<string, unknown>;
    total_usd_balance?: Record<string, unknown>;
    cbi_usd_balance?: Record<string, unknown>;
    cfm_usd_balance?: Record<string, unknown>;
    total_open_orders_hold_amount?: Record<string, unknown>;
    unrealized_pnl?: Record<string, unknown>;
    daily_realized_pnl?: Record<string, unknown>;
    initial_margin?: Record<string, unknown>;
    available_margin?: Record<string, unknown>;
    liquidation_threshold?: Record<string, unknown>;
    liquidation_buffer_amount?: Record<string, unknown>;
    liquidation_buffer_percentage?: string;
    intraday_margin_window_measure?: Record<string, unknown>;
    overnight_margin_window_measure?: Record<string, unknown>;
};

export type FCMPosition = {
    product_id?: string;
    expiration_time?: Record<string, unknown>;
    side?: Record<string, unknown>;
    number_of_contracts?: string;
    current_price?: string;
    avg_entry_price?: string;
    unrealized_pnl?: string;
    daily_realized_pnl?: string;
};

export type FCMSweep = {
    id: string;
    requested_amount: Record<string, unknown>;
    should_sweep_all: boolean;
    status: Record<string, unknown>;
    schedule_time: Record<string, unknown>;
};

export type CancelOrderObject = {
    success: boolean;
    failure_reason: Record<string, unknown>;
    order_id: string;
};

export type Order = {
    order_id: string;
    product_id: string;
    user_id: string;
    order_configuration: OrderConfiguration;
    side: OrderSide;
    client_order_id: string;
    status: Record<string, unknown>;
    time_in_force?: TimeInForce;
    created_time: Record<string, unknown>;
    completion_percentage: string;
    filled_size?: string;
    average_filled_price: string;
    fee?: string;
    number_of_fills: string;
    filled_value?: string;
    pending_cancel: boolean;
    size_in_quote: boolean;
    total_fees: string;
    size_inclusive_of_fees: boolean;
    total_value_after_fees: string;
    trigger_status?: Record<string, unknown>;
    order_type?: Record<string, unknown>;
    reject_reason?: Record<string, unknown>;
    settled?: boolean;
    product_type?: ProductType;
    reject_message?: string;
    cancel_message?: string;
    order_placement_source?: OrderPlacementSource;
    outstanding_hold_amount?: string;
    is_liquidation?: boolean;
    last_fill_time?: Record<string, unknown>;
    edit_history?: Record<string, unknown>[];
    leverage?: string;
    margin_type?: MarginType;
    retail_portfolio_id?: string;
    originating_order_id?: string;
    attached_order_id?: string;
};

export type PaymentMethod = {
    id?: string;
    type?: string;
    name?: string;
    currency?: string;
    verified?: boolean;
    allow_buy?: boolean;
    allow_sell?: boolean;
    allow_deposit?: boolean;
    allow_withdraw?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type PerpetualPortfolio = {
    portfolio_uuid?: string;
    collateral?: string;
    position_notional?: string;
    open_position_notional?: string;
    pending_fees?: string;
    borrow?: string;
    accrued_interest?: string;
    rolling_debt?: string;
    portfolio_initial_margin?: string;
    portfolio_im_notional?: Record<string, unknown>;
    liquidation_percentage?: string;
    liquidation_buffer?: string;
    margin_type?: Record<string, unknown>;
    margin_flags?: Record<string, unknown>;
    liquidation_status?: Record<string, unknown>;
    unrealized_pnl?: Record<string, unknown>;
    total_balance?: Record<string, unknown>;
};

export type PortfolioSummary = {
    unrealized_pnl?: Record<string, unknown>;
    buying_power?: Record<string, unknown>;
    total_balance?: Record<string, unknown>;
    max_withdrawal_amount?: Record<string, unknown>;
};

export type PositionSummary = {
    aggregated_pnl?: Record<string, unknown>;
};

export type Position = {
    product_id?: string;
    product_uuid?: string;
    portfolio_uuid?: string;
    symbol?: string;
    vwap?: Record<string, unknown>;
    entry_vwap?: Record<string, unknown>;
    position_side?: Record<string, unknown>;
    margin_type?: Record<string, unknown>;
    net_size?: string;
    buy_order_size?: string;
    sell_order_size?: string;
    im_contribution?: string;
    unrealized_pnl?: Record<string, unknown>;
    mark_price?: Record<string, unknown>;
    liquidation_price?: Record<string, unknown>;
    leverage?: string;
    im_notional?: Record<string, unknown>;
    mm_notional?: Record<string, unknown>;
    position_notional?: Record<string, unknown>;
    aggregated_pnl?: Record<string, unknown>;
};

export type Balance = {
    asset: Record<string, unknown>;
    quantity: string;
    hold: string;
    transfer_hold: string;
    collateral_value: string;
    collateral_weight: string;
    max_withdraw_amount: string;
    loan: string;
    loan_collateral_requirement_usd: string;
    pledged_quantity: string;
};

export type Portfolio = {
    name?: string;
    uuid?: string;
    type?: string;
};

export type PortfolioBreakdown = {
    portfolio?: Portfolio;
    portfolio_balances?: Record<string, unknown>;
    spot_positions?: Record<string, unknown>[];
    perp_positions?: Record<string, unknown>[];
    futures_positions?: Record<string, unknown>[];
};

export type PriceBook = {
    product_id: string;
    bids: Record<string, unknown>[];
    asks: Record<string, unknown>[];
    time?: Record<string, unknown>;
};

export type Products = {
    products?: Product[];
    num_products?: number;
};

export type Product = {
    product_id: string;
    price: string;
    price_percentage_change_24h: string;
    volume_24h: string;
    volume_percentage_change_24h: string;
    base_increment: string;
    quote_increment: string;
    quote_min_size: string;
    quote_max_size: string;
    base_min_size: string;
    base_max_size: string;
    base_name: string;
    quote_name: string;
    watched: boolean;
    is_disabled: boolean;
    new: boolean;
    status: string;
    cancel_only: boolean;
    limit_only: boolean;
    post_only: boolean;
    trading_disabled: boolean;
    auction_mode: boolean;
    product_type?: ProductType;
    quote_currency_id?: string;
    base_currency_id?: string;
    fcm_trading_session_details?: Record<string, unknown>;
    mid_market_price?: string;
    alias?: string;
    alias_to?: string[];
    base_display_symbol: string;
    quote_display_symbol?: string;
    view_only?: boolean;
    price_increment?: string;
    display_name?: string;
    product_venue?: ProductVenue;
    approximate_quote_24h_volume?: string;
    future_product_details?: Record<string, unknown>;
};

export type Candles = {
    candles?: Candle[];
};

export type Candle = {
    start?: string;
    low?: string;
    high?: string;
    open?: string;
    close?: string;
    volume?: string;
};

export type HistoricalMarketTrade = {
    trade_id?: string;
    product_id?: string;
    price?: string;
    size?: string;
    time?: string;
    side?: OrderSide;
};

export type PortfolioBalance = {
    portfolio_uuid?: string;
    balances?: Balance[];
    is_margin_limit_reached?: boolean;
};

export type Fill = {
    entry_id: string;
    trade_id: string;
    order_id: string;
    trade_time: string;
    trade_type: 'FILL' | 'REVERSAL' | 'CORRECTION' | 'SYNTHETIC';
    price: string;
    size: string;
    commission: string;
    product_id: string;
    sequence_timestamp: string;
    liquidity_indicator: 'UNKNOWN_LIQUIDITY_INDICATOR' | 'MAKER' | 'TAKER';
    size_in_quote: boolean;
    user_id: string;
    side: 'BUY' | 'SELL';
    retail_portfolio_id: string;
};

export type FillResponse = {
    fills: Fill[];
    cursor?: string;
};

export type ListOrdersResponse = {
    orders: Order[];
    sequence?: number; // deprecated
    has_next: boolean;
    cursor?: string;
};

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
