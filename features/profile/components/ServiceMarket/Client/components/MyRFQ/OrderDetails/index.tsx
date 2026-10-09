"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import GoBackButton from "./GoBackButton";
import OrderHeader from "./OrderHeader";
import RequestSummaryCard from "./RequestSummaryCard";
import ProjectBriefCard from "./ProjectBriefCard";
import OrderSummarySidebar from "./OrderSummarySidebar";
import ProviderCard from "./ProviderCard";
import HelpCard from "./HelpCard";

export default function OrderDetailsPage() {
  const { t } = useTranslation();

  // Sample data - in real app this would come from props/API
  const orderData = {
    requestId: "#RFQ-8821",
    status: "⏱ In Progress",
    purchasedDate: "Oct 24, 2023",
    category: "Graphic design",
    title: "Professional logo design for startups with complete visual identity.",
    serviceType: "Fixed",
    deliveryModel: "REMOTE",
    estimatedDelivery: "3 Days",
    lastUpdated: "21 Oct 2026",
    attachedFiles: [
      { name: "Brand_Vision.pdf", type: "pdf" as const },
      { name: "Moodboard.png", type: "img" as const }
    ],
    briefAuthor: "Bilal Mardini",
    briefContent: "I am looking for a modern, minimalist logo for my new fintech startup called ApexFlow. The design should convey trust, speed, and innovation. I prefer a palette of deep blues and vibrant greens.",
    servicePrice: "50.00$",
    vat: "2.50$",
    fees: "0.00$",
    totalAmount: "52.50$",
    paymentStatus: "ESCROW PROTECTION ",
    providerName: "Studio Creative Lab",
    providerInitials: "SC",
    rating: 4.5,
    profession: "UI/UX Designer"
  };

  return (
    <section className="w-full bg-[#FAFCFB] p-4 md:p-6">
      <div className="mb-5">
        <GoBackButton />
      </div>

      <OrderHeader
        requestId={orderData.requestId}
        status={orderData.status}
        purchasedDate={orderData.purchasedDate}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <RequestSummaryCard
            category={orderData.category}
            title={orderData.title}
            serviceType={orderData.serviceType}
            deliveryModel={orderData.deliveryModel}
            estimatedDelivery={orderData.estimatedDelivery}
          />
          <ProjectBriefCard
            lastUpdated={orderData.lastUpdated}
            attachedFiles={orderData.attachedFiles}
            briefAuthor={orderData.briefAuthor}
            briefContent={orderData.briefContent}
          />

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FEECEC] px-4 text-sm font-semibold text-[#F04438]"
          >
            {t('serviceMarket.rfq.orderDetails.cancelOrder')}
          </button>
        </div>

        <aside className="space-y-4">
          <OrderSummarySidebar
            servicePrice={orderData.servicePrice}
            vat={orderData.vat}
            fees={orderData.fees}
            totalAmount={orderData.totalAmount}
            paymentStatus={orderData.paymentStatus}
          />
          <ProviderCard
            providerName={orderData.providerName}
            providerInitials={orderData.providerInitials}
            rating={orderData.rating}
            profession={orderData.profession}
          />
          <HelpCard />
        </aside>
      </div>
    </section>
  );
}