"use client";

import { OrderDetails } from "../../../types/order";
import OrderActionBar from "./OrderActionBar";
import OrderCountdownCard from "./OrderCountdownCard";
import OrderDetailsHeader from "./OrderDetailsHeader";
import OrderRequirementsCard from "./OrderRequirementsCard";
import OrderServiceCard from "./OrderServiceCard";
import OrderSummaryCard from "./OrderSummaryCard";

const orderMock: OrderDetails = {
  id: "1",
  orderNumber: "ORD-8821",
  status: "pending",
  purchasedAt: "Oct 24, 2023",

  title: "Professional logo design for startups with a complete visual identity.",
  category: "Graphic design",
  rating: 4.9,
  reviewsCount: 125,
  description:
    "I will design a creative and modern logo that best represents your business, along with delivery of source files.",
  image: "/images/order-card-demo.png",

  serviceType: "Fixed",
  deliveryModel: "REMOTE",
  estimatedDeliveryDays: 3,

  countdown: {
    days: 1,
    hours: 16,
    mins: 32,
    note: "72 hours to accept service before it is automatically canceled.",
  },

  briefDate: "21 Oct 2026",
  attachments: [
    { id: "1", name: "Brand_Vision.pdf", type: "pdf" },
    { id: "2", name: "Moodboard.png", type: "image" },
  ],

  customer: {
    name: "Bilal Mardini",
    avatar: "/images/avatar-placeholder.png",
    message:
      "I am looking for a modern, minimalist logo for my new fintech startup called 'ApexFlow'. The design should convey trust, speed, and innovation. I prefer a palette of deep blues and vibrant greens.",
  },

  summary: {
    servicePrice: 50,
    vat: 2.5,
    fees: 0,
    total: 52.5,
  },
};

interface Props {
  orderId?: string;
  onBack?: () => void;
}

export default function OrderDetailsPage({ orderId, onBack }: Props) {
  // In a real app, you would use the orderId to fetch the actual order data
  // For now, we'll use the mock data
  const order = orderMock;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8 md:px-6 lg:px-8">
      <OrderDetailsHeader
        orderNumber={order.orderNumber}
        status={order.status}
        purchasedAt={order.purchasedAt}
        onBack={onBack || (() => console.log("back"))}
        onMessageCustomer={() => console.log("message")}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <OrderServiceCard
            image={order.image}
            category={order.category}
            rating={order.rating}
            reviewsCount={order.reviewsCount}
            title={order.title}
            description={order.description}
            serviceType={order.serviceType}
            deliveryModel={order.deliveryModel}
            estimatedDeliveryDays={order.estimatedDeliveryDays}
          />

          <OrderCountdownCard
            days={order.countdown.days}
            hours={order.countdown.hours}
            mins={order.countdown.mins}
            note={order.countdown.note}
          />

          <OrderRequirementsCard
            briefDate={order.briefDate}
            attachments={order.attachments}
            customerName={order.customer.name}
            customerAvatar={order.customer.avatar}
            customerMessage={order.customer.message}
          />

          <OrderActionBar
            onReject={() => console.log("reject")}
            onConfirm={() => console.log("confirm")}
          />
        </div>

        <div>
          <OrderSummaryCard
            servicePrice={order.summary.servicePrice}
            vat={order.summary.vat}
            fees={order.summary.fees}
            total={order.summary.total}
          />
        </div>
      </div>
    </section>
  );
}