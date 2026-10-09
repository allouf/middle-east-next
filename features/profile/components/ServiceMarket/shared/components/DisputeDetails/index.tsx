"use client";

import React from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import DisputeRequestCard from './components/DisputeRequestCard';
import DisputeServiceInfo from './components/DisputeServiceInfo';

import ResolutionReportCard from './components/ResolutionReportCard';
import ProjectBriefCard from './components/ProjectBriefCard';
import ReviewDeliveryCard from './components/ReviewDeliveryCard';
import { useDisputes } from '../../hooks/Disputes/useDisputes';

const DisputeDetailsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('disputeId');

  const {disputeDetails,loadingDetails} = useDisputes({autoFetchList:true,disputeId:Number(id)})

  console.log(disputeDetails,"disputeDetailsdisputeDetails")

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('subTab', 'order_dispute');
    router.push(`?${params.toString()}`);
  };

  if (loadingDetails) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00664F]"></div>
      </div>
    );
  }

  if (!disputeDetails) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-gray-500">
        Dispute not found.
      </div>
    );
  }

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
                Dispute #{disputeDetails.order?.order_number || id}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full h-full">
          <DisputeRequestCard dispute={disputeDetails} />
          <DisputeServiceInfo dispute={disputeDetails} />
          <ProjectBriefCard order={disputeDetails.order} buyer={disputeDetails.buyer} />
          {disputeDetails.evidences?.map((evidence: any) => (
            <ReviewDeliveryCard key={evidence.id} evidence={evidence} provider={disputeDetails.provider} />
          ))}
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          <ResolutionReportCard dispute={disputeDetails} />
        </div>
      </div>
    </div>
  );
};

export default DisputeDetailsPage;
