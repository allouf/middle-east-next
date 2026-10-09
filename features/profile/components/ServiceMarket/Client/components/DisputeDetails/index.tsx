"use client";

import React from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import DisputeServiceInfo from './components/DisputeServiceInfo';

import ResolutionReportCard from './components/ResolutionReportCard';
import ProjectBriefCard from './components/ProjectBriefCard';
import ReviewDeliveryCard from './components/ReviewDeliveryCard';
import { useClientDisputes } from '../../hooks/Disputes/useClientDisputes';

const DisputeDetailsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

    const {disputeDetails} = useClientDisputes();
  
    console.log("disputeDetails", disputeDetails);

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('subTab', 'order_dispute');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Header Navigation */}
      <div className="flex flex-col gap-6 w-full mb-8">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blueSite font-bold hover:opacity-80 transition-opacity w-max uppercase text-[20px]"
        >
          <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
          GO BACK
        </button>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 w-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-1.5 h-8 bg-blueSite rounded-full"></span>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#1F2937]">
                Dispute #DSP-8821
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-gray-200">
                Under Review
              </span>
            </div>
            
            <div className="text-[14px] text-gray-500 ml-4">
              <span>Requested on </span>
              <span className="font-bold text-[#1F2937]">Oct 20, 2026 .</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full h-full">
          <DisputeServiceInfo />
          <ProjectBriefCard />
          <ReviewDeliveryCard/>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          <ResolutionReportCard />
        </div>
      </div>
    </div>
  );
};

export default DisputeDetailsPage;
