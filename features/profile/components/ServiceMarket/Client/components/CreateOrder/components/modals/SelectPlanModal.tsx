"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { RefreshCw, Clock, ShieldCheck } from "lucide-react";

interface Plan {
  id: string | number;
  title: string;
  price: number;
  currency: string;
  estimated_delivery_time?: string | null;
  revision_window?: string | null;
  number_of_revisions?: number | null;
  revision_scope_rules?: string | null;
  description?: string | null;
}

interface SelectPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  currentSelectedId?: string | number | null;
  onSelect: (planId: string | number) => void;
}

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const SelectPlanModal: React.FC<SelectPlanModalProps> = ({ 
  isOpen, 
  onClose, 
  plans, 
  currentSelectedId, 
  onSelect 
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | number | null>(currentSelectedId || null);

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

  useEffect(() => {
    if (isOpen) {
      setSelected(currentSelectedId || plans[0]?.id || null);
    }
  }, [isOpen, currentSelectedId, plans]);

  const handleSave = () => {
    if (selected) {
      onSelect(selected);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      padding="p-0"
      secondPadding="p-0"
      className="border-2 border-blueSite rounded-[24px]"
      showCloseButton={false} 
      style={{maxWidth:"900px"}}
    >
        <div className="flex flex-col p-6 pt-5">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-[20px] font-bold text-subTitleColor">
                 Select A Plan
               </h2>
               <button onClick={onClose} className="text-blueSite hover:bg-blueSite/10 p-1 rounded-full transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
               </button>
            </div>

            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
               {plans.map((plan) => {
                  const isSelected = selected === plan.id;
                  return (
                      <div 
                         key={plan.id}
                         onClick={() => setSelected(plan.id)}
                         className={`rounded-[16px] p-5 cursor-pointer transition-all duration-200 border bg-[#FAFAFA] ${isSelected ? 'border-[#FAFAFA]' : 'border-transparent hover:border-gray-200'} shadow-sm`}
                      >
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blueSite' : 'border-gray-400'}`}>
                                    {isSelected && <div className="w-[10px] h-[10px] rounded-full bg-blueSite" />}
                                </div>
                                <h3 className="text-[17px] font-bold text-subTitleColor">{plan.title || 'Plan'}</h3>
                             </div>
                             <div className="flex items-center gap-1.5 text-blueSite font-bold text-[18px]">
                                <TagIcon className="w-[18px] h-[18px]" />
                                {Number(plan.price || 0).toFixed(2)} {plan.currency || '$'}
                             </div>
                         </div>
                         
                         <p className="text-[13px] text-textGrayColor mt-1 ml-7">
                             {plan.description || "This package will be selected if you do not specify what you will choose."}
                         </p>

                         <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-x-6 gap-y-3 ml-7">
                             <div className="flex items-center gap-1.5 text-[13px]">
                                 <RefreshCw className="w-4 h-4 text-blueSite" />
                                 <span className="text-textGrayColor">Revisions:</span>
                                 <span className="font-bold text-subTitleColor">{plan.number_of_revisions ? `${plan.number_of_revisions} Times` : 'Unlimited'}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-[13px]">
                                 <Clock className="w-4 h-4 text-blueSite" />
                                 <span className="text-textGrayColor">Estimated Delivery:</span>
                                 <span className="font-bold text-subTitleColor">{formatValueUnit(plan.estimated_delivery_time) || '-'}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-[13px]">
                                 <ShieldCheck className="w-4 h-4 text-blueSite" />
                                 <span className="text-textGrayColor">Request modifications:</span>
                                 <span className="font-bold text-subTitleColor">{formatValueUnit(plan.revision_window) || 'N/A'}</span>
                             </div>
                         </div>
                      </div>
                  );
               })}
            </div>

            <div className="mt-8 flex justify-center mb-2">
                <button 
                  onClick={handleSave}
                  className="bg-blueSite hover:bg-[#00523f] text-white px-12 py-2.5 rounded-[8px] font-bold text-[14px] transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default SelectPlanModal;
