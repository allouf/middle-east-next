"use client";

import React from 'react';
import { RefreshCw, Clock, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PiCoinsThin } from 'react-icons/pi';

interface SelectedPlanCardProps {
  plan: any; 
  onChangeClick?: () => void;
}

const SelectedPlanCard: React.FC<SelectedPlanCardProps> = ({ plan, onChangeClick }) => {
    const { t } = useTranslation();

    const formatValueUnit = (obj: any) => {
        if (!obj) return null;
        if (typeof obj === 'string') return obj;
        if (typeof obj === 'object' && obj !== null) {
            if ('value' in obj && 'unit' in obj) {
                return `${obj.value} ${obj.unit}`;
            }
            return JSON.stringify(obj);
        }
        return String(obj);
    };

    return (
        <div className="flex flex-col rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden mb-6 p-5 w-full">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                       <div className="w-[20px] h-[20px] rounded-full border-[1.5px] border-blueSite flex items-center justify-center flex-shrink-0">
                           <div className="w-2.5 h-2.5 rounded-full bg-blueSite" />
                       </div>
                       <h2 className="text-[17px] lg:text-[20px] font-bold text-subTitleColor">
                           {plan?.title || 'Plan Title'}
                       </h2>
                    </div>
                    <p className="text-[13px] text-textGrayColor mt-1 ml-[28px]">
                        This package will be selected if you do not specify what you will choose.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-blueSite font-bold text-[18px]">
                    <PiCoinsThin className="w-5 h-5" /> 
                    {Number(plan?.price || 0).toFixed(2)} {plan?.currency || '$'}
                </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 flex-wrap gap-4 w-full">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-1.5 text-[14px]">
                        <RefreshCw className="w-4 h-4 text-blueSite" />
                        <span className="text-textGrayColor">Revisions:</span>
                        <span className="font-bold text-subTitleColor">{plan?.number_of_revisions ? `${plan.number_of_revisions} Times` : 'Unlimited'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[14px]">
                        <Clock className="w-4 h-4 text-blueSite" />
                        <span className="text-textGrayColor">Estimated Delivery:</span>
                        <span className="font-bold text-subTitleColor">{formatValueUnit(plan?.estimated_delivery_time) || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[14px]">
                        <ShieldCheck className="w-4 h-4 text-blueSite" />
                        <span className="text-textGrayColor">Request modifications:</span>
                        <span className="font-bold text-subTitleColor">{formatValueUnit(plan?.revision_window) || 'N/A'}</span>
                    </div>
                </div>
                
                <button 
                   onClick={onChangeClick}
                   className="px-6 py-2 rounded-[8px] border border-blueSite bg-[#EAF2F0] hover:bg-[#DDF0E9] text-blueSite text-[14px] font-bold transition-colors"
                >
                   Change
                </button>
            </div>
        </div>
    );
};

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
)

export default SelectedPlanCard;
