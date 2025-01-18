import { PreviewOrderResponse } from './types/coinbaseTypes';

export function isPreviewOrderResponse(obj: unknown): obj is PreviewOrderResponse {
    return (
        obj !== null &&
        typeof obj === 'object' &&
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
