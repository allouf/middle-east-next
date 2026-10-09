import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface CertificateCardProps {
  title: string;
  isVerified?: boolean;
  onView?: () => void;
}

const CertificateCard = ({ title, isVerified = true, onView }: CertificateCardProps) => {
  return (
    <div className="border border-[#DDE5E2] rounded-xl bg-white p-2 flex items-start justify-between shadow-sm">
      <div className="flex gap-3">
        <div className="h-20 w-20 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
          <ShieldCheck className="h-10 w-10 text-blueSite" />
        </div>

        <div className='flex flex-col items-center justify-between'>
          <h4 className="text-sm font-semibold text-[#1B1F1E] leading-5">
            {title}
          </h4>
          <div className='flex items-center justify-between'>
            {isVerified && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#D1FAE5] px-2 py-1 text-[14px] font-medium text-blueSite">
                <svg className="h-3 w-3 fill-[#00664F]" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#00664F"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                VERIFIED
              </div>
            )}
            {/* {onView && ( */}
            <button onClick={onView} className="text-gray-500 hover:text-[#00664F]">
              ↗
            </button>
            {/* )} */}
          </div>
        </div>
      </div>


    </div>
  );
};

export default CertificateCard;
