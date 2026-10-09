"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Star, FolderOpen, Truck, Clock } from 'lucide-react';

interface ServiceInfoCardProps {
  service: any; // We receive serviceData
}

const ServiceInfoCard: React.FC<ServiceInfoCardProps> = ({ service }) => {
  const { t } = useTranslation();

  console.log("service Data",service)

  return (
    <div className="flex flex-col rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden mb-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row p-5 gap-3 bg-[#FAFAFA]">
        {/* Image */}
        <div className="relative w-full md:w-[200px] h-[180px] md:h-[150px] rounded-xl overflow-hidden flex-shrink-0 bg-blue-50/50 flex items-center justify-center p-2">
           <div className="w-full h-full bg-blue-100/50 rounded flex items-center justify-center overflow-hidden relative">
             <Image src={service?.media[0]?.url||service?.cover?.url || "/anonymous.png"} alt="service" layout="fill" className="object-cover" />
           </div>
        </div>

        {/* Info Content */}
        <div className="flex flex-col flex-1 py-1">
          {/* Header Row: Category and Rating */}
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold bg-[#15803D1A] text-blueSite">
              {service?.service_category?.name || 'Service Category'}
            </span>
            <div className="flex items-center gap-1.5 text-[13px] text-textGrayColor">
              <span className="font-bold text-[#F59E0B] flex items-center gap-1">
                {service?.rating || 4.9}
                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              </span>
              <span>({service?.reviews_count || 125} reviews)</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[20px] font-bold text-subTitleColor mb-2 line-clamp-2">
            {service?.title}
          </h2>

          {/* Description */}
          <p className="text-[14px] text-textGrayColor line-clamp-3 leading-relaxed">
            {service?.description}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#F4F4F4] px-5 py-4 flex flex-wrap items-center gap-y-4 gap-x-6 border-t border-gray-100/60">
        <div className="flex items-center gap-2 text-[14px]">
          <FolderOpen className="w-4 h-4 text-blueSite" />
          <span className="text-textGrayColor">Service Type:</span>
          <span className="font-bold text-subTitleColor capitalize">
            {service?.type === 'fixed_price' ? 'Fixed' : service?.type?.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <Truck className="w-4 h-4 text-blueSite" />
          <span className="text-textGrayColor">Delivery Model:</span>
          <span className="font-bold text-subTitleColor capitalize">
            {service?.delivery_model?.toLowerCase() === 'remote' ? 'Remote' : service?.delivery_model}
          </span>
        </div>
        {/* Estimated delivery would usually come from the plan itself, but since we are in Service Info we can show the global estimation if present, otherwise ignore. */}
        <div className="flex items-center gap-2 text-[14px]">
          <Clock className="w-4 h-4 text-blueSite" />
          <span className="text-textGrayColor">Starting Price:</span>
          <span className="font-bold text-subTitleColor">{service?.price_from} $</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoCard;
