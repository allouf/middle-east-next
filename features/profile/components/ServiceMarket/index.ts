export * from './shared';

// Resolve ambiguity by explicitly re-exporting shared/clashing types from Client as default
export type { 
  ApiResponse, 
  ApiErrorResponse, 
  RequestOptions,
  OrderListResponse,
  OrderFilters,
  OrderAction,
  OrderDetails,
  OrderHistoryItemType
} from './Client';

// Provide aliased versions for Provider-specific types that clash
export type {
  OrderAction as ProviderOrderAction,
  OrderListResponse as ProviderOrderListResponse,
  OrderFilters as ProviderOrderFilters,
  OrderDetails as ProviderOrderDetails,
  OrderHistoryItemType as ProviderOrderHistoryItemType,
  ServiceOffer,
} from './Provider';



// Export everything else from both (clashing names will be ignored in favor of explicit exports above)
export * from './Provider';
export * from './Client';
