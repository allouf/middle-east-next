"use client";

import GlowLight from '@/components/shered/GlowLight'
import React from 'react'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { useRouter } from 'next/navigation'
import { BookOpenIcon } from '@/components/Icons/BookOpenIcon';
import { useTranslation } from '@/lib/i18n/useTranslation';

const CheckCircle = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M5 8.5L7 10.5L11.5 5" stroke="#00664F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="7" stroke="#00664F" strokeWidth="1.2"/>
  </svg>
);

const EmptyState = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleBackToServices = () => {
    router.push(window.location.pathname, { scroll: false });
  };

  return (
    <div className='w-full max-w-[650px] border border-gray-100 rounded-[20px] pb-10 pt-10 px-6 md:px-10 relative overflow-hidden bg-white mx-auto flex flex-col items-center shadow-[0px_2px_15px_rgba(0,0,0,0.02)]'>

      <GlowLight
        color="#06B187"
        size="w-[55px] h-[40px]"
        opacity="opacity-80"
        blur="blur-[35px] sm:blur-[35px]"
        position="top-0 right-0"
          />
      <GlowLight
        color="#06B187"
        size="w-[120px] h-[120px]"
        opacity="opacity-30"
        blur="blur-[60px] sm:blur-[60px]"
        position="bottom-[-20px] left-[-20px]"
      />

      <div className="flex flex-col items-center text-center gap-4 z-10 relative">
        <div className='bg-[#00664F1A] rounded-full w-36 h-36 flex items-center justify-center'>
            <SearchIcon className="mb-4" />
        </div>
        <h2 className="text-[#00664F] text-[18px] md:text-[26px] font-semibold mb-3">
          {t('services.noServicesFound.title')}
        </h2>
        <p className="text-[#848484] text-[13px] md:text-[16px] leading-relaxed mb-6 max-w-[480px]">
          {t('services.noServicesFound.description')}
        </p>
        <button 
          onClick={handleBackToServices}
          className="bg-[#00664F] text-white px-16 py-2.5 rounded-lg text-[18px] font-medium hover:bg-[#00523f] transition-all focus:ring-2 focus:ring-[#00664F] focus:ring-offset-2"
        >
          {t('services.noServicesFound.backToServices')}
        </button>
      </div>

      <div className="mt-8 w-full border border-gray-100/70 rounded-[16px] p-6 relative overflow-hidden bg-[#fafafa]/50 z-10 flex flex-col items-center">
        {/* Diamond Grid Pattern Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="80" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
                <path d="M40 0L80 20L40 40L0 20Z" fill="none" stroke="#E5E7EB" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="w-20 h-20 bg-[#00664F4D] rounded-full flex items-center justify-center mb-4 z-10 p-2 border-4 border-white">
          <BookOpenIcon className='w-7 h-7'/>
        </div>

        <h3 className="text-[#1A1C1A] text-[20px] font-bold mb-2.5 z-10 text-center">
          {t('services.noServicesFound.whatYouCanDo')}
        </h3>

        <p className="text-[#848484] text-[16px] mb-5 text-center max-w-[340px] z-10">
          {t('services.noServicesFound.stepsToRefine')}
        </p>

        <ul className="flex flex-col gap-3.5 text-[#4D4D4D] text-[14px] z-10">
          <li className="flex items-center gap-2.5">
            <CheckCircle /> {t('services.noServicesFound.tips.checkLink')}
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle /> {t('services.noServicesFound.tips.browseLatest')}
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle /> {t('services.noServicesFound.tips.contactSupport')}
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle /> {t('services.noServicesFound.tips.useSearch')}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EmptyState;