"use client";

import React, { useState } from 'react';
import GlowLight from '@/components/shered/GlowLight';
import InputField from '@/components/ui/InputField';
import MultiInputField from '@/components/ui/MultiInputField';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { FileCard } from '../../CreateOrder/components/OrderRequirementsCard';

const RevisionIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

interface RevisionDetailsCardProps {
  requestType: string;
  setRequestType: (type: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  files: any[];
  setFiles: (files: any[]) => void;
}

const RevisionDetailsCard: React.FC<RevisionDetailsCardProps> = ({
  requestType,
  setRequestType,
  notes,
  setNotes,
  files,
  setFiles
}) => {
  const { t } = useTranslation();

  const requestOptions = [
    { id: 'STANDARD', label: 'Standard Revision' },
    { id: 'MINOR', label: 'Minor Changes' },
    { id: 'CLARIFICATION', label: 'Clarification Only' },
  ];

  return (
    <div className='relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden shadow-sm mb-6'>
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
        <div className='flex flex-row gap-4 pb-6'>
          <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A] border border-green-100 shrink-0 h-max">
            <RevisionIcon className="w-5 h-5 text-blueSite" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-subTitleColor m-0 leading-none mb-1.5">
              {t('orderRevision.detailsTitle', { defaultValue: 'Revision Details' })}
            </h3>  
            <p className="text-textGrayColor text-[14px]">
              {t('orderRevision.detailsDesc', { defaultValue: 'Please provide the Provider/seller with all the details to begin work.' })}
            </p>
          </div>
        </div>

        {/* Form Elements */}
        <div className='flex flex-col gap-5'>
          
          {/* Custom Fieldset for Request Type */}
          <fieldset className="p-4 border border-grayBorder rounded-lg transition-colors bg-white">
            <legend className="px-2 text-blueSite font-semibold text-sm">
              {t('orderRevision.requestType', { defaultValue: 'Request Type (Optional)' })}
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {requestOptions.map((opt) => (
                <label 
                  key={opt.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    requestType === opt.id 
                      ? 'border-blueSite bg-blueSite/5' 
                      : 'border-[#E2E8F0] bg-white hover:border-blueSite/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="requestType"
                    value={opt.id}
                    checked={requestType === opt.id}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-4 h-4 text-blueSite focus:ring-blueSite border-gray-300"
                  />
                  <span className="text-[14px] text-subTitleColor font-medium">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Revision Notes */}
          <fieldset className="px-4 py-2 border border-grayBorder rounded-lg transition-colors bg-white">
            <legend className="px-2 text-blueSite font-semibold text-sm">
              {t('orderRevision.revisionNotes', { defaultValue: 'Revision Notes' })}
            </legend>
            <textarea
              className="w-full bg-transparent border-0 outline-none resize-y min-h-[100px] text-subTitleColor placeholder-textGrayColor/70 text-[14px] leading-relaxed py-2"
              placeholder={t('orderRevision.notesPlaceholder', { 
                defaultValue: 'Write a detailed description of what you want from the seller... For example: \npreferred colors, similar examples, extras...' 
              })}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </fieldset>

          {/* Extra Attached Files using MultiInputField logic */}
          <fieldset className="p-4 border border-dashed border-grayBorder rounded-lg transition-colors bg-white/50">
            <legend className="px-2 text-blueSite font-semibold text-sm bg-[#FAFAFA]">
              {t('orderRevision.attachedFiles', { defaultValue: 'Extra Attached Files (Optional)' })}
            </legend>
            
            {/* The actual file multi input */}
            <div className="w-full">
               <MultiInputField
                  id="revision_files"
                  label=""
                  type="file"
                  values={files}
                  onChange={(val: any) => setFiles(val)}
                  unstyled
                  withFieldset={false}
                  showList={false}
              />
            </div>
            {files && files.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mt-2">
                    {files.map((file: any, index: number) => (
                        <FileCard 
                            key={index} 
                            file={file} 
                            onRemove={() => {
                                const nextFiles = files.filter((_: any, i: number) => i !== index);
                                setFiles(nextFiles);
                            }} 
                        />
                    ))}
                </div>
            )}
          </fieldset>

        </div>
      </div>
    </div>
  );
};

export default RevisionDetailsCard;
