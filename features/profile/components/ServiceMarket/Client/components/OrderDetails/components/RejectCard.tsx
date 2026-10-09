import { useTranslation } from '@/lib/i18n/useTranslation'
import Image from 'next/image'
import React from 'react'

const RejectIcon = ({ className }: { className?: string }) => (
    <svg 
        width="16" 
        height="20" 
        viewBox="0 0 16 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path 
            d="M14 0H2C0.9 0 0.01 0.9 0.01 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V2C16 0.9 15.1 0 14 0ZM14 18H2V2H14V18ZM4 14H12V16H4V14ZM4 10H12V12H4V10ZM4 6H9V8H4V6Z" 
            fill="currentColor"
        />
    </svg>
);

const RejectCard = ({ order }: { order: any }) => {
    const { t } = useTranslation()

  return (
    <div className='relative rounded-[20px] bg-[#F8D4D4] overflow-hidden shadow-sm mb-6'>
        <div className='p-6'>
            {/* Header */}
            <div className='flex flex-row justify-between items-center pb-4'>
                <div className='flex flex-row gap-4 items-center'>
                    <div className="flex items-center justify-center p-2 rounded-lg bg-[#DC2626] border border-[#FECACA]">
                         <RejectIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-[18px] 2xl:text-[20px] font-bold text-[#DC2626]">
                            {t('orderDetails.rejectionReason', { defaultValue: 'Rejection Reason' })}
                        </h3>  
                    </div>
                </div>
                <div className="text-[10px] font-medium text-[#7F1D1D]">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </div>
            </div>

            {/* Subtext */}
            <div className='mb-6 ml-[60px]'>
                <p className='text-textGrayColor text-[14px] font-medium'>
                    {t('orderDetails.clientDeclined', { defaultValue: 'The provider has declined your request for this service.' })}
                </p>
                <p className='text-textGrayColor text-[14px]'>
                    No further action is required for this specific order.
                </p>
            </div>

            {/* Inner Content Box */}
            <div className="bg-white rounded-[12px] p-5 shadow-sm border border-[#FEE2E2] relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-[42px] h-[42px] rounded-full overflow-hidden relative bg-[#E2E8F0] shrink-0 border border-gray-100">
                        <Image src={order.provider.avatar || "/anonymous.png"} alt="Provider Avatar" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-[16px] text-subTitleColor">{order.provider.name}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    {order.rejectionReason?.reason?.name && (
                        <p className="font-bold text-subTitleColor text-[14px]">
                            {order.rejectionReason.reason.name}
                        </p>
                    )}
                    <p className="text-textGrayColor text-[14px] leading-relaxed">
                        &quot;{order.rejectionReason?.notes || "No message provided."}&quot;
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RejectCard
