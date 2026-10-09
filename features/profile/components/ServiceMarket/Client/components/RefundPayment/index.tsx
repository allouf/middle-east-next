"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import RefundInfoCard from './components/RefundInfoCard';
import ServiceInfoCard from './components/ServiceInfoCard';
import EscrowedAmountCard from './components/EscrowedAmountCard';
import NeedHelpCard from './components/NeedHelpCard';

const RefundPayment = () => {
  // Mock order for ServiceInfoCard based on the image provided
  const dummyOrder: any = {
    imageUrl: "/dummy-logo.png",
    category: "Graphic design",
    rating: 4.9,
    reviewsCount: 125,
    title: "Professional logo design for startups with a complete visual identity",
    description: "I will design a creative and modern logo that best represents your business, along with the delivery of the source files.",
    serviceType: "fixed_price",
    deliveryModel: "REMOTE",
    deliveryDays: 3,
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <button className="flex items-center gap-2 text-blueSite font-semibold text-[20px] hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          GO BACK
        </button>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blueSite rounded-full"></div>
          <h1 className="text-[24px] font-bold text-subTitleColor">
            Refund Payment <span className="text-textGrayColor font-normal">#Ref-8821</span>
          </h1>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - 2/3 width */}
        <div className="w-full lg:w-2/3 flex flex-col ">
          <RefundInfoCard />
          <ServiceInfoCard order={dummyOrder} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <EscrowedAmountCard />
          <NeedHelpCard />
        </div>
      </div>
    </div>
  );
};

export default RefundPayment;
