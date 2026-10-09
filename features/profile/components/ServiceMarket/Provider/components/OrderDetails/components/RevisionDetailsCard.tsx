"use client";

import React from 'react';
import GlowLight from '@/components/shered/GlowLight';
import { useTranslation } from '@/lib/i18n/useTranslation';

const RevisionIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const FileIconPdf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500 mr-2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
    <path d="M9 15h6M9 11h6M9 19h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const FileIconImg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500 mr-2">
     <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect>
     <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
     <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
  </svg>
);

const RevisionDetailsCard = ({ order }: { order?: any }) => {
  const { t } = useTranslation();

  const revision = order?.revisions && order.revisions.length > 0 ? order.revisions[0] : null;

  return (
    <div className='relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden shadow-sm mt-6'>
      <GlowLight
          color="#06B187"
          size="w-[55px] h-[40px]"
          opacity="opacity-80"
          blur="blur-[35px] sm:blur-[35px]"
          position="top-0 right-0"
      />
      <GlowLight
          color="#06B187"
          size="w-[50px] h-[40px]"
          opacity="opacity-80"
          blur="blur-[35px] sm:blur-[35px]"
          position="bottom-0 left-0"
      />
      
      <div className='p-6 relative z-10'>
        {/* Header */}
        <div className='flex flex-row items-center gap-4 pb-6'>
          <div className="flex items-center justify-center h-9 w-9  rounded-lg bg-[#15803D1A] border border-green-100 shrink-0 ">
            <RevisionIcon className="w-5 h-5 text-blueSite" />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-bold text-subTitleColor m-0 leading-none">
              {t('orderDetails.revisionDetailsTitle', { defaultValue: 'Revision Details' })}
            </h3>  
            <span className="px-2.5 py-1 rounded-full bg-[#11D4521A] text-[#11D452] text-[12px] font-bold capitalize">
              {revision ? revision.request_type.toLowerCase() : 'Standard'} Revision
            </span>
          </div>
        </div>

        {/* Content Elements */}
        <div className='flex flex-col gap-6'>
          
          {/* Service Notes */}
          {order?.serviceNotes && (
            <div>
              <h4 className="text-[15px] font-bold text-blueSite mb-2">Service Notes</h4>
              <p className="text-textGrayColor text-[14px] leading-relaxed">
                {order.serviceNotes}
              </p>
            </div>
          )}

          {/* Revision Notes */}
          <div>
            <h4 className="text-[15px] font-bold text-blueSite mb-2">Revision Notes</h4>
            <p className="text-textGrayColor text-[14px] leading-relaxed">
              {revision ? revision.notes : 'We are looking for a clean, modern, and minimalist brand identity for our new eco-conscious tech startup "GreenByte". The color palette should focus on primary greens and soft neutrals.'}
            </p>
          </div>

          {/* Attached Files using custom fieldset style from design */}
          {revision?.attachments && revision.attachments.length > 0 && (
            <fieldset className="p-4 border border-grayBorder rounded-lg transition-colors bg-white">
              <legend className="px-2 text-blueSite font-semibold text-sm">
                {t('orderDetails.attachedFiles', { defaultValue: 'Attached Files' })}
              </legend>
              <div className="flex flex-wrap gap-4 mt-2">
                 {revision.attachments.map((url: string, idx: number) => {
                    const ext = url.split('.').pop()?.toLowerCase() || 'file';
                    const isPdf = ext === 'pdf';
                    const name = url.split('/').pop()?.split('_').pop() || `Attachment ${idx + 1}.${ext}`;
                    return (
                      <a href={url} target="_blank" rel="noopener noreferrer" key={idx} className="flex items-center px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                        {isPdf ? <FileIconPdf /> : <FileIconImg />}
                        <span className="text-[13px] font-medium text-subTitleColor">{name}</span>
                      </a>
                    );
                 })}
              </div>
            </fieldset>
          )}

        </div>
      </div>
    </div>
  );
};

export default RevisionDetailsCard;
