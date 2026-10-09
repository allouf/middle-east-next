// Client components will be exported here
export { default as MyOrder } from './components/MyOrder';
export { default as OrderRevisionClient } from './components/OrderRevision';
export {default as MyOrdersCustomer} from "./components/MyOrders"
export {default as OrderDetailsClient} from "./components/OrderDetails"
export { default as RFQ } from './components/MyRFQ';
export {default as CreateOrder} from "./components/CreateOrder"
export {default as CustomersDisputeOrders} from "./components/DisputeOrder"
export {default as CustomersDisputeOrderDetails} from "./components/DisputeDetails"
export {default as ClientRefundPayment } from "./components/RefundPayment"
export {default as MilestonesCustomerPage} from "./components/milestones"
// Export types
export * from './types/client.types';
export * from './types/order';

// Export services
export { clientOrderService } from './services/client-order.service';

// Export hooks
export { useOrderList } from './hooks/useOrderList';
export { useOrderDetails } from './hooks/useOrderDetails';
