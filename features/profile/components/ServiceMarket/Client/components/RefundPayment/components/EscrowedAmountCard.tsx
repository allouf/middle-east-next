"use client";

import { CheckCircle2 } from 'lucide-react';

const EscrowedAmountCard = () => {

  return (
    <div className="rounded-[16px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden mb-6 shadow-sm"> 
      <div className="flex justify-between items-center mb-6 bg-[#EEF0F2] p-5">
        <h3 className="text-[18px] font-bold text-subTitleColor flex items-center gap-2">
          <FileReceiptIcon className="w-5 h-5 text-textGrayColor" />
          Escrowed Amount
        </h3>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-4 text-[14px] text-textGrayColor font-medium mb-6">
          <div className="flex justify-between">
            <span>Service Price</span>
            <span className="text-subTitleColor font-bold">50.00$</span>
          </div>
          <div className="flex justify-between">
            <span>Fees</span>
            <span className="text-subTitleColor font-bold">0.00$</span>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="flex items-center justify-between mb-8">
          <span className="text-[15px] font-bold text-subTitleColor">
            Total Amount
          </span>
          <span className="text-[20px] font-extrabold text-[#11D452] flex items-center gap-1.5">
            52.50$
            <LockIcon className="w-4 h-4 text-[#11D452]" />
          </span>
        </div>

        <button className="w-full bg-blueSite hover:bg-blueSiteHover transition-colors text-white py-3 rounded-[13px] flex items-center justify-center gap-2 font-bold text-[13px] 2xl:text-[14px]">
          CONFIRM REFUND <CheckCircle2 className="w-4 h-4" />
        </button>

        <p className="text-center text-[12px] text-gray-400 mt-5 max-w-[250px] mx-auto leading-relaxed">
           Your payment is held securely and will only be released once you approve the final delivery.
        </p>
      </div>
    </div>
  );
};

// Helper internal icons
const FileReceiptIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default EscrowedAmountCard;
