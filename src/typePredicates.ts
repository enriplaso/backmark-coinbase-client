import { Account, AccountBalance, Fill, FillResponse } from './types/coinbaseCommonTypes';
import { ListOrdersResponse, PreviewOrderResponse } from './types/coinbaseTypes';

export function isObject(obj: unknown): obj is object {
    return obj !== null && typeof obj === 'object' && obj !== undefined;
}

export function isPreviewOrderResponse(obj: unknown): obj is PreviewOrderResponse {
    return (
        isObject(obj) &&
        'order_total' in obj &&
        typeof obj.order_total === 'string' &&
        'commission_total' in obj &&
        typeof obj.commission_total === 'string' &&
        'errs' in obj &&
        Array.isArray(obj.errs) &&
        obj.errs.every((err) => typeof err === 'object') &&
        'warning' in obj &&
        Array.isArray(obj.warning) &&
        obj.warning.every((warn) => typeof warn === 'object') &&
        'quote_size' in obj &&
        typeof obj.quote_size === 'string' &&
        'base_size' in obj &&
        typeof obj.base_size === 'string' &&
        'best_bid' in obj &&
        typeof obj.best_bid === 'string' &&
        'best_ask' in obj &&
        typeof obj.best_ask === 'string' &&
        'is_max' in obj &&
        typeof obj.is_max === 'boolean' &&
        (!('order_margin_total' in obj) || typeof obj.order_margin_total === 'string') &&
        (!('leverage' in obj) || typeof obj.leverage === 'string') &&
        (!('long_leverage' in obj) || typeof obj.long_leverage === 'string') &&
        (!('short_leverage' in obj) || typeof obj.short_leverage === 'string') &&
        (!('slippage' in obj) || typeof obj.slippage === 'string') &&
        (!('preview_id' in obj) || typeof obj.preview_id === 'string') &&
        (!('current_liquidation_buffer' in obj) || typeof obj.current_liquidation_buffer === 'string') &&
        (!('projected_liquidation_buffer' in obj) || typeof obj.projected_liquidation_buffer === 'string') &&
        (!('max_leverage' in obj) || typeof obj.max_leverage === 'string') &&
        (!('pnl_configuration' in obj) || typeof obj.pnl_configuration === 'object')
    );
}

export function isListOrdersResponse(obj: unknown): obj is ListOrdersResponse {
    return isObject(obj) && 'orders' in obj && Array.isArray(obj.orders) && 'has_next' in obj && typeof obj.has_next === 'boolean';
}

export function isFill(obj: unknown): obj is Fill {
    return (
        isObject(obj) &&
        'entry_id' in obj &&
        typeof obj.entry_id === 'string' &&
        'trade_id' in obj &&
        typeof obj.trade_id === 'string' &&
        'order_id' in obj &&
        typeof obj.order_id === 'string' &&
        'trade_time' in obj &&
        typeof obj.trade_time === 'string' &&
        'trade_type' in obj &&
        (obj.trade_type === 'FILL' || obj.trade_type === 'REVERSAL' || obj.trade_type === 'CORRECTION' || obj.trade_type === 'SYNTHETIC') &&
        'price' in obj &&
        typeof obj.price === 'string' &&
        'size' in obj &&
        typeof obj.size === 'string' &&
        'commission' in obj &&
        typeof obj.commission === 'string' &&
        'product_id' in obj &&
        typeof obj.product_id === 'string' &&
        'sequence_timestamp' in obj &&
        typeof obj.sequence_timestamp === 'string' &&
        'liquidity_indicator' in obj &&
        (obj.liquidity_indicator === 'UNKNOWN_LIQUIDITY_INDICATOR' ||
            obj.liquidity_indicator === 'MAKER' ||
            obj.liquidity_indicator === 'TAKER') &&
        'size_in_quote' in obj &&
        typeof obj.size_in_quote === 'boolean' &&
        'user_id' in obj &&
        typeof obj.user_id === 'string' &&
        'side' in obj &&
        (obj.side === 'BUY' || obj.side === 'SELL') &&
        'retail_portfolio_id' in obj &&
        typeof obj.retail_portfolio_id === 'string'
    );
}

export function isFillResponse(response: unknown): response is FillResponse {
    return (
        isObject(response) &&
        'fills' in response &&
        Array.isArray(response.fills) &&
        response.fills.every(isFill) &&
        (!('cursor' in response) || typeof response.cursor === 'string')
    );
}

export function isAccountBalance(obj: unknown): obj is AccountBalance {
    return isObject(obj) && 'value' in obj && typeof obj.value === 'string' && 'currency' in obj && typeof obj.currency === 'string';
}

export function isAccount(obj: unknown): obj is Account {
    return (
        isObject(obj) &&
        ('uuid' in obj ? typeof obj.uuid === 'string' : true) &&
        ('name' in obj ? typeof obj.name === 'string' : true) &&
        ('currency' in obj ? typeof obj.currency === 'string' : true) &&
        ('available_balance' in obj ? isAccountBalance(obj.available_balance) : true) &&
        ('default' in obj ? typeof obj.default === 'boolean' : true) &&
        ('active' in obj ? typeof obj.active === 'boolean' : true) &&
        ('created_at' in obj ? typeof obj.created_at === 'string' : true) &&
        ('updated_at' in obj ? typeof obj.updated_at === 'string' : true) &&
        ('deleted_at' in obj ? typeof obj.deleted_at === 'string' : true) &&
        ('type' in obj ? typeof obj.type === 'object' && obj.type !== null : true) &&
        ('ready' in obj ? typeof obj.ready === 'boolean' : true) &&
        ('hold' in obj ? isAccountBalance(obj.hold) : true) &&
        ('retail_portfolio_id' in obj ? typeof obj.retail_portfolio_id === 'string' : true)
    );
}
