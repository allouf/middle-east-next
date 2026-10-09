"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder } from '../types';
import { Star, FolderOpen, Truck, Clock } from 'lucide-react';

interface ServiceInfoCardProps {
  order: DetailedOrder;
}

const ServiceInfoCard: React.FC<ServiceInfoCardProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-[20px] border border-[#E2E8F0] overflow-hidden mb-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row p-5  gap-3 bg-[#FAFAFA]">
        {/* Image */}
        <div className="relative w-full md:w-[200px] h-[180px] md:h-[150px] rounded-xl overflow-hidden flex-shrink-0 bg-blue-50/50">
          <Image
            src={order.imageUrl || "/anonymous.png"}
            alt={order.title}
            fill
            className="object-contain"
          />
        </div>

        {/* Info Content */}
        <div className="flex flex-col flex-1 py-1">
          {/* Header Row: Category and Rating */}
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[14px] font-bold bg-[#15803D1A] text-blueSite">
              {order.category}
            </span>
            <div className="flex items-center gap-1.5 text-[13px] text-textGrayColor">
              <span className="font-bold text-[#F59E0B] flex items-center gap-1">
                {order.rating.toFixed(1)}
                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              </span>
              <span>({order.reviewsCount} {t('orderDetails.reviews', { defaultValue: 'reviews' })})</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[20px]  font-bold text-subTitleColor mb-2 line-clamp-2">
            {order.title}
          </h2>

          {/* Description */}
          <p className="text-[14px] text-textGrayColor line-clamp-3 leading-relaxed">
            {order.description}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#F4F4F4] px-5 py-4 flex flex-wrap items-center gap-y-4 gap-x-6 border-t border-gray-100/60">
        <div className="flex items-center gap-2 text-[14px]">
          <FolderOpen className="w-4 h-4 text-blueSite" />
          <span className="text-textGrayColor">{t('orderDetails.serviceType', { defaultValue: 'Service Type:' })}</span>
          <span className="font-bold text-subTitleColor capitalize">
            {order.serviceType === 'fixed_price' ? 'Fixed' : order.serviceType?.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <Truck className="w-4 h-4 text-blueSite" />
          <span className="text-textGrayColor">{t('orderDetails.deliveryModel', { defaultValue: 'Delivery Model:' })}</span>
          <span className="font-bold text-subTitleColor capitalize">
            {order.deliveryModel?.toLowerCase() === 'remote' ? 'Remote' : order.deliveryModel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <Clock className="w-4 h-4 text-blueSite" />
          <span className="text-textGrayColor">{t('orderDetails.estimatedDelivery', { defaultValue: 'Estimated Delivery:' })}</span>
          <span className="font-bold text-subTitleColor first-letter:uppercase">{order.deliveryDays}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoCard;
