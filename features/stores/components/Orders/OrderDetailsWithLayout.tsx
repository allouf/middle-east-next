"use client";

import { useRouter } from "next/navigation";
import MyStoreWrapper from "../MyStoreWrapper";
import OrderDetails from "./OrderDetails";

interface OrderDetailsWithLayoutProps {
  storeId: string;
  orderId: string;
  locale: string;
}

const OrderDetailsWithLayout = ({
  storeId,
  orderId,
  locale,
}: OrderDetailsWithLayoutProps) => {
  const router = useRouter();

  const tabs = [
    {
      id: "orders",
      name: "Orders",
      key: "orders",
    },
  ];

  const handleTabChange = (tab: string) => {
    router.push(`/${locale}/stores/${storeId}/management?tab=${tab}`);
  };

  return (
    <MyStoreWrapper tabs={tabs} activeTab="orders" handleTabChange={handleTabChange}>
      <OrderDetails storeId={storeId} orderId={orderId} />
    </MyStoreWrapper>
  );
};

export default OrderDetailsWithLayout;
