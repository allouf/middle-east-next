"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { useRouter } from 'next/navigation';
import { DetailedOrder } from '../types';
import { Download, ShieldCheck, RefreshCw, CheckCircle } from 'lucide-react';

interface OrderSummaryCardProps {
  order: DetailedOrder;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleRequestRevision = () => {
    router.push(`/dashboard?tab=service_market&subTab=order_revision&orderId=${order.id}`);
  };

  return (
    <div className="rounded-[16px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden mb-6 shadow-sm"> 
      <div className="flex justify-between items-center mb-6 bg-[#EEF0F2] p-5">
        <h3 className="text-[18px] font-bold text-subTitleColor flex items-center gap-2">
          <FileReceiptIcon className="w-5 h-5 text-textGrayColor" />
          {t('orderDetails.orderSummary', { defaultValue: 'Order Summary' })}
        </h3>
        <button className="p-2 rounded-lg border border-blueSite text-blueSite  hover:bg-green-50 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-4 text-[14px] text-textGrayColor font-medium mb-6">
          <div className="flex justify-between">
            <span>{t('orderDetails.servicePrice', { defaultValue: 'service price' })}</span>
            <span className="text-subTitleColor font-bold">{order.servicePrice.toFixed(2)}$</span>
          </div>
          <div className="flex justify-between">
            <span>{t('orderDetails.vat', { defaultValue: 'VAT' })}</span>
            <span className="text-subTitleColor font-bold">{order.vat.toFixed(2)}$</span>
          </div>
          <div className="flex justify-between">
            <span>{t('orderDetails.fees', { defaultValue: 'Fees' })}</span>
            <span className="text-subTitleColor font-bold">{order.fees.toFixed(2)}$</span>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="flex items-center justify-between mb-8">
          <span className="text-[15px] font-bold text-subTitleColor">
            {t('orderDetails.totalAmount', { defaultValue: 'Total Amount' })}
          </span>
          <span className="text-[20px] font-extrabold text-blueSite flex items-center gap-1.5">
            {order.totalPrice.toFixed(2)}$
            <LockIcon className="w-4 h-4 text-blueSite" />
          </span>
        </div>

        {/* Action Buttons based on state */}
        {(order.status === 'pending' || order.status === 'in_progress') && (
          <div className="w-full bg-[#11D4521A] text-[#11D452] py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-[14px]">
             {t('orderDetails.escrowProtection', { defaultValue: 'ESCROW PROTECTION' })}
             <EscrowLockIcon className="w-4 h-4" />
          </div>
        )}

        {(order.status === 'completed' || order.status === 'revision_completed') && (
          <div className="flex flex-col gap-3">
             <button className="w-full bg-blueSite hover:bg-blueSiteHover transition-colors text-white py-3 rounded-[13px] flex items-center justify-center gap-2 font-bold text-[13px] 2xl:text-[14px]">
               <CheckCircle className="w-4 h-4" />
               {t('orderDetails.acceptAndRelease', { defaultValue: 'ACCEPT & RELEASE PAYMENT' })}
             </button>
             <button 
               onClick={handleRequestRevision}
               className="w-full bg-[#EAEAEA] hover:bg-gray-200 transition-colors text-blueSite py-3 rounded-[13px] flex items-center justify-center gap-2 font-bold text-[14px]"
             >
               <RefreshCw className="w-4 h-4" />
               {t('orderDetails.requestRevision', { defaultValue: 'REQUEST REVISION' })}
             </button>
          </div>
        )}

        <p className="text-center text-[12px] text-gray-400 mt-5 max-w-[250px] mx-auto leading-relaxed">
           {t('orderDetails.paymentDisclaimer', { 
             defaultValue: 'Your payment is held securely and will only be released once you approve the final delivery.' 
           })}
        </p>
      </div>
    </div>
  );
};

// Helper internal icons to avoid importing extra libraries if we only have lucide
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

const EscrowLockIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 17C5.68333 16.5042 3.77083 15.3744 2.2625 13.6106C0.754167 11.8469 0 9.88833 0 7.735V2.55L8 0L16 2.55V7.735C16 9.88833 15.2458 11.8469 13.7375 13.6106C12.2292 15.3744 10.3167 16.5042 8 17ZM8 15.215C9.61667 14.79 10.9667 13.9506 12.05 12.6969C13.1333 11.4431 13.7667 10.0442 13.95 8.5H8V1.80625L2 3.71875V7.735C2 7.89083 2 8.01833 2 8.1175C2 8.21667 2.01667 8.34417 2.05 8.5H8V15.215Z" fill="currentColor"/>
  </svg>
);

export default OrderSummaryCard;
