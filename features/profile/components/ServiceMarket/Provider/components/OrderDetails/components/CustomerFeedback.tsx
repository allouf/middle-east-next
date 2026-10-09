import GlowLight from '@/components/shered/GlowLight'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { DetailedOrder } from '../types'

const FeedbackIcon = ({ className }: { className?: string }) => (
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

const CustomerFeedback = ({ order }: { order: DetailedOrder }) => {
    const {t} = useTranslation()

    if (!order.feedback) return null;

    const formattedDate = order.feedback.createdAt 
      ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(order.feedback.createdAt))
      : '';

  return (
    <div className='relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden shadow-sm mt-6'>
        
        <div className='p-6'>
            {/* Header */}
            <div className='flex flex-row justify-between items-center pb-6'>
                <div className='flex flex-row gap-4 items-center'>
                    <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A] border border-green-100">
                         <FeedbackIcon className="w-5 h-5 text-blueSite" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-bold text-subTitleColor">
                            {t('orderDetails.customerFeedback', { defaultValue: 'Customer Feedback' })}
                        </h3>  
                    </div>
                </div>
                {formattedDate && (
                  <div className="text-[10px] font-medium text-textGrayColor">
                      {formattedDate}
                  </div>
                )}
            </div>

            {/* Inner Content Box */}
            <div className="bg-white rounded-[12px] p-5 shadow-sm border border-[#F1F5F9] relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-[42px] h-[42px] rounded-full overflow-hidden relative bg-[#E2E8F0] shrink-0 border border-gray-100">
                        <Image src={order.customer.avatar || "/anonymous.png"} alt="User Avatar" fill className="object-cover" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[16px] text-subTitleColor">{order.customer.name}</span>
                        <div className="flex items-center text-[#F59E0B]">
                            <span className="font-bold text-[14px] mr-1">{order.feedback.rating.toFixed(1)}</span>
                            <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                        </div>
                    </div>
                </div>
                <p className="text-textGrayColor text-[14px] leading-relaxed">
                    &quot;{order.feedback.comment}&quot;
                </p>
            </div>
        </div>
    </div>
  )
}

export default CustomerFeedback
