"use client";

import React from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder, FileAttachment } from '../types';
import GlowLight from '@/components/shered/GlowLight';
import { FileText, Image as ImageIcon, File } from 'lucide-react';

interface RequirementsCardProps {
  order: DetailedOrder;
}

const getFileIcon = (type: FileAttachment['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'png':
    case 'jpg':
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
};

const RequirementsCard: React.FC<RequirementsCardProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden  shadow-sm mt-6">
      {/* Glow Effect */}
      <GlowLight
        color="#06B187"
        size="w-[55px]  h-[40px]"
        opacity="opacity-80"
        blur="blur-[35px] sm:blur-[35px]"
        position="top-0 right-0"
    />
    <GlowLight
        color="#06B187"
        size="w-[50px]  h-[40px]"
        opacity="opacity-80"
        blur="blur-[35px] sm:blur-[35px]"
        position="bottom-0 left-0"
    />

      <div className="relative z-10 p-5 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A] border border-green-100">
            <FileText className="w-5 h-5 text-blueSite" />
          </div>
          <h3 className="text-[18px] font-bold text-subTitleColor">
            {t('orderDetails.orderRequirements', { defaultValue: 'Order Requirements' })}
          </h3>
        </div>

        {order.serviceNotes && (
          <div className="flex flex-col gap-2">
            <h4 className="text-[16px] font-bold text-blueSite">
              {t('orderDetails.serviceNotes', { defaultValue: 'Service Notes' })}
            </h4>
            <p className="text-[14px] text-textGrayColor leading-relaxed pr-0 md:pr-10">
              {order.serviceNotes}
            </p>
          </div>
        )}

        {order.requirementFiles && order.requirementFiles.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
             <div className="relative">
                <span className="absolute -top-[10px] left-4 px-2 text-[12px] bg-[#FAFAFA] font-bold text-blueSite z-10">
                   {t('orderDetails.attachedFiles', { defaultValue: 'Attached Files' })}
                </span>
                <div className="border border-gray-200 rounded-[12px] p-4 flex flex-wrap gap-4 mt-2 bg-white/60 backdrop-blur-sm relative z-0">
                  {order.requirementFiles.map((file, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 px-4 py-2 bg-white rounded-[8px] border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-green-200 transition-all"
                    >
                      {getFileIcon(file.type)}
                      <span className="text-[13px] text-textGrayColor font-medium">{file.name}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementsCard;
