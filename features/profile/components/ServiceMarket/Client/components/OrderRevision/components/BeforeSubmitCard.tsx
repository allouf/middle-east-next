"use client";

import React from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Info } from 'lucide-react';

const BeforeSubmitCard = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[16px] bg-[#FEFCE8] border border-[#FEF08A] overflow-hidden mb-6 p-6">
      <div className="flex items-start gap-3">
        {/* Info Icon */}
        <div className="shrink-0 mt-0.5">
          <Info className="w-5 h-5 text-[#B45309]" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[16px] font-bold text-subTitleColor">
            {t('orderRevision.beforeSubmitTitle', { defaultValue: 'Before you submit:' })}
          </h3>
          <ul className="flex flex-col gap-2 list-none p-0 m-0 text-[13px] text-[#B45309] leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="shrink-0 font-bold mt-[-2px]">.</span>
              <span>
                {t('orderRevision.beforeSubmitPoint1', { defaultValue: 'Ensure all requests align with your original project scope.' })}
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="shrink-0 font-bold mt-[-2px]">.</span>
              <span>
                {t('orderRevision.beforeSubmitPoint2', { defaultValue: 'Submit all desired changes at once to use only one revision credit.' })}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BeforeSubmitCard;
