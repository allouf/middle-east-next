"use client";

import React, { useMemo, useState } from "react";
import OrderHistoryFilters from "./ListOrder/OrderHistoryFilters";
import { OrderHistoryItemType } from "../../types/order";
import OrderHistoryCard from "./ListOrder/OrderHistoryCard";
import OrderDetailsPage from "./OrderDetails/OrderDetailsPage";


const ordersMock: OrderHistoryItemType[] = [
  {
    id: "1",
    orderNumber: "ORD-8921",
    title: "Professional logo design for startups with a complete visual identity.",
    sellerName: "Souad Ahmad",
    sellerSubtitle: "lorem ipsum",
    image: "/images/order-card-demo.png",
    orderDate: "24 May 2023",
    deliveryDays: 3,
    total: 52.5,
    status: "pending",
    paymentStatus: "escrow",
    urgentLabel: "16 hours",
  },
  {
    id: "2",
    orderNumber: "ORD-8921",
    title: "Professional logo design for startups with a complete visual identity.",
    sellerName: "Souad Ahmad",
    sellerSubtitle: "lorem ipsum",
    image: "/images/order-card-demo.png",
    orderDate: "24 May 2023",
    deliveryDays: 3,
    total: 52.5,
    status: "in_progress",
    paymentStatus: "escrow",
  },
  {
    id: "3",
    orderNumber: "ORD-8921",
    title: "Professional logo design for startups with a complete visual identity.",
    sellerName: "Souad Ahmad",
    sellerSubtitle: "lorem ipsum",
    image: "/images/order-card-demo.png",
    orderDate: "24 May 2023",
    deliveryDays: 3,
    total: 52.5,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "4",
    orderNumber: "ORD-8921",
    title: "Professional logo design for startups with a complete visual identity.",
    sellerName: "Souad Ahmad",
    sellerSubtitle: "lorem ipsum",
    image: "/images/order-card-demo.png",
    orderDate: "24 May 2023",
    deliveryDays: 3,
    total: 52.5,
    status: "cancelled",
    paymentStatus: "escrow",
    rejectionReason: "Service currently unavailable",
  },
];

type FilterValue = "all" | "pending" | "in_progress" | "completed" | "cancelled";
type ViewMode = "list" | "details";

export default function OrderHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return ordersMock;
    return ordersMock.filter((item) => item.status === activeFilter);
  }, [activeFilter]);

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setViewMode("details");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedOrderId(null);
  };

  // Show order details view
  if (viewMode === "details" && selectedOrderId) {
    return (
      <OrderDetailsPage 
        orderId={selectedOrderId}
        onBack={handleBackToList}
      />
    );
  }

  // Show order list view
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="h-9 w-1.5 rounded-full bg-blueSite" />
            <h1 className="text-3xl font-bold tracking-tight text-textColor md:text-[44px]">
              Order History
            </h1>
          </div>

          <p className="max-w-2xl text-base text-textGrayColor md:text-lg">
            Track all your transactions and purchased services in one place
          </p>
        </div>

        <OrderHistoryFilters value={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <OrderHistoryCard 
            key={order.id} 
            order={order} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </section>
  );
}