"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder } from '../../OrderDetails/types';
import { Star } from 'lucide-react';

interface ProviderCardProps {
  order: DetailedOrder;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[16px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden mb-6 shadow-sm">
      <div className="p-6">
        <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          {t('orderDetails.provider', { defaultValue: 'PROVIDER' })}
        </h3>

        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={order.provider.avatar || "/anonymous.png"}
              alt={order.provider.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <span className="text-[16px] font-bold text-subTitleColor line-clamp-1">
                 {order.provider.name}
               </span>
               <span className="text-[#F59E0B] flex items-center gap-0.5 text-[12px] font-bold">
                 {order.rating.toFixed(1)} <Star className="w-3 h-3 fill-[#F59E0B]" />
               </span>
            </div>
            <span className="text-[13px] text-textGrayColor">
              {order.provider.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
