import OrderDetails from "./OrderDetails";

interface OrderDetailsWrapperProps {
  storeId: string;
  orderId: string;
}

const OrderDetailsWrapper = ({ storeId, orderId }: OrderDetailsWrapperProps) => {
  return <OrderDetails storeId={storeId} orderId={orderId} />;
};

export default OrderDetailsWrapper;
