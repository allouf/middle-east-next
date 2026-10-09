"use client";

import React from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ExternalLink } from 'lucide-react';
import { DetailedOrder } from '../types'; // Adjust import if needed

interface RevisionStatusCardProps {
  order?: any; // Define appropriate type
}

const RevisionStatusCard = ({ order }: RevisionStatusCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[16px] bg-[#FAFAFA] border border-[#E2E8F0] mb-6">
      <div className="flex items-start gap-4">
        {/* Left Icon */}
        <div className=" h-9 w-9  shrink-0 rounded-[12px] bg-[#15803D1A] flex items-center justify-center">
          <ClipboardIcon className="w-6 h-6 text-blueSite" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-bold text-subTitleColor">
              {t('orderDetails.statusRevisionRequested', { defaultValue: 'Status: Revision Requested' })}
            </h3>
            <span className="px-2 py-0.5 rounded-[6px] bg-[#11D4521A] text-[#11D452] text-[10px] font-bold tracking-wider uppercase">
              {t('orderDetails.reviewing', { defaultValue: 'REVIEWING' })}
            </span>
          </div>
          <p className="text-textGrayColor text-[14px]">
            {t('orderDetails.revisionStatusDesc', { defaultValue: 'You are in the final review stage. You have ' })}
            <span className="font-bold text-subTitleColor">
              {t('orderDetails.revisionsRemaining', { defaultValue: '2 revisions remaining' })}
            </span>
            {t('orderDetails.forThisOrder', { defaultValue: ' for this order.' })}
          </p>
        </div>
      </div>

      {/* Right Action */}
      {/* <button className="flex items-center gap-2 text-[14px] font-bold text-blueSite hover:text-blueSiteHover transition-colors mt-2 md:mt-0 whitespace-nowrap">
        {t('orderDetails.viewBrief', { defaultValue: 'View Original Brief' })}
        <ExternalLink className="w-4 h-4" />
      </button> */}
    </div>
  );
};

// Local inline SVG
const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg 
    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <circle cx="12" cy="14" r="3"></circle>
    <path d="M14 16l3 3"></path>
  </svg>
);

export default RevisionStatusCard;
