"use client";

import React from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Loader2, Edit2, Trash2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { RiVisaLine } from 'react-icons/ri';

interface OrderSummaryCardProps {
  plan: any; // Extract price from selected plan
  step: 'create' | 'payment';
  onCompletePayment?: () => void;
  onConfirmPayment?: () => void;
  isSubmitting?: boolean;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ 
  plan,
  step,
  onCompletePayment, 
  onConfirmPayment,
  isSubmitting 
}) => {
  const { t } = useTranslation();

  return (
    <>
    <div className="rounded-[16px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden  shadow-sm"> 
      <div className="flex justify-between items-center bg-[#EEF0F2] p-4 mb-6">
        <h3 className="text-[18px] xl:text-[20px] font-bold text-subTitleColor flex items-center gap-2">
          <FileReceiptIcon className="w-5 h-5 text-textGrayColor" />
          Order summary
        </h3>

      </div>

      <div className="px-5 pb-5">
        <div className="flex flex-col gap-4 text-[14px] text-textGrayColor font-medium mb-6">
          <div className="flex justify-between">
            <span>service price</span>
            <span className="text-subTitleColor font-bold">{plan?.price?.toFixed(2) || '0.00'} {plan?.currency || '$'}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT</span>
            <span className="text-subTitleColor font-bold">{(Number(plan?.price) * 0.05).toFixed(2) || '0.00'} {plan?.currency || '$'}</span>
          </div>
          <div className="flex justify-between">
            <span>Fees</span>
            <span className="text-subTitleColor font-bold">0.00 {plan?.currency || '$'}</span>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="flex items-center justify-between mb-6">
          <span className="text-[16px] font-bold text-subTitleColor">
            Total Amount
          </span>
          <span className="text-[20px] font-extrabold text-blueSite flex items-center gap-1.5 leading-none">
            {((Number(plan?.price) || 0) * 1.05).toFixed(2)} {plan?.currency || '$'}
            <LockIcon className="w-4 h-4 text-blueSite" />
          </span>
        </div>
        <div className='pb-4 '>
           <button 
                 onClick={onCompletePayment}
                 className="w-full border border-[#FDE68A] bg-[#FFFBEB] hover:bg-[#FEF3C7] transition-colors text-[#B45309] py-3 rounded-[13px] flex items-center justify-center gap-2 font-bold text-[14px]">
                 PENDING PAYMENT
                 <ArrowRight className="w-4 h-4" />
              </button>
        </div>
        <hr className="border-gray-200" />

        {/* Action Buttons based on state */}
        <div className="flex flex-col gap-3 pt-4">
            {step === 'create' ? (
              <button 
                 onClick={onCompletePayment}
                 className="w-full bg-blueSite hover:bg-blueSiteHover transition-colors text-white py-3 rounded-[13px] flex items-center justify-center gap-2 font-bold text-[14px]">
                 Complete Payment
                 <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                 onClick={onConfirmPayment}
                 disabled={isSubmitting}
                 className="w-full bg-[#00664F] hover:bg-[#00523F] transition-colors text-white py-3 rounded-[13px] flex items-center justify-center gap-2 font-bold text-[14px] disabled:opacity-70 disabled:cursor-not-allowed">
                 {isSubmitting ? (
                   <>
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Processing...
                   </>
                 ) : (
                   <>
                     Confirm Payment
                     <ShieldCheck className="w-4 h-4" />
                   </>
                 )}
              </button>
            )}
        </div>

        <div className="mt-5 mb-2 flex justify-center items-center gap-3">
           {/* Mock payment logos */}
           <div className="flex items-center gap-2  px-3 py-1.5 rounded-md  ">
             <span className="text-[#1A1F71] font-bold italic  tracking-tighter">
              <RiVisaLine className='text-[20px] w-11 h-8'/>
             </span>
           </div>
           <div className="flex items-center gap-2  px-3 py-1.5 rounded-md   relative overflow-hidden h-[34px] w-[50px] justify-center">
             <div className="flex items-center justify-center absolute scale-110">
               <div className="w-[18px] h-[18px] bg-[#EB001B] rounded-full z-10 translate-x-[6px]"></div>
               <div className="w-[18px] h-[18px] bg-[#F79E1B] rounded-full -translate-x-[6px]"></div>
             </div>
           </div>
           <div className="flex items-center gap-1  px-3 py-1.5 rounded-md   h-[34px]">
             <span className="text-gray-600 font-bold ml-1 flex items-center gap-0.5 text-[14px]"><FcGoogle className='' />Pay</span>
           </div>
        </div>

        <p className="text-center text-[11px] text-gray-500 mt-4 leading-relaxed px-2">
           By completing the payment, you agree to our <br/>
           <a href="#" className="underline font-bold text-gray-600 hover:text-gray-800">Terms and Conditions</a>
        </p>
      </div>

    </div>
    
    <div className=" py-3  flex justify-center items-center gap-1.5 text-blueSite text-[12px] bg-white mb-6">
        <ShieldCheck className="w-4 h-4" />
        Secure and encrypted payment
    </div>
    </>
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

export default OrderSummaryCard;
