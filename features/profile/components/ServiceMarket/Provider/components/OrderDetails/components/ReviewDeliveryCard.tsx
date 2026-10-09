"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder, FileAttachment } from '../types';
import { FileText, Image as ImageIcon, File, Download, FileCheck } from 'lucide-react';

interface ReviewDeliveryCardProps {
  order: DetailedOrder;
}

const getFileIcon = (type: FileAttachment['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'png':
    case 'jpg':
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
};

const ReviewDeliveryCard: React.FC<ReviewDeliveryCardProps> = ({ order }) => {
  const { t } = useTranslation();

  const { deliveries, customer } = order;
  const delivery = deliveries && deliveries.length > 0 ? deliveries[0] : null;

  if (!delivery && (!order.deliveryFiles || order.deliveryFiles.length === 0)) {
    return null;
  }

  const files = delivery?.attachments?.map((url, idx) => {
    const ext = url.split('.').pop()?.toLowerCase() || 'file';
    let type: FileAttachment['type'] = 'doc';
    if (ext === 'pdf') type = 'pdf';
    else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'png';
    return {
      name: `Attachment ${idx + 1}.${ext}`,
      type,
      url,
    };
  }) || order.deliveryFiles || [];

  const message = delivery ? delivery.message : order.deliveryMessage;
  const submittedAt = delivery ? delivery.submittedAt : order.deliveredAt;
  const deliveryVersion = delivery ? `v${delivery.version}` : null;

  const handleDownloadAll = () => {
    files.forEach((file) => {
      const link = document.createElement('a');
      link.href = file.url;
      link.setAttribute('download', file.name);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="rounded-[20px] bg-[#F4F4F4] border border-[#E2E8F0] overflow-hidden  shadow-sm mt-6">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A]">
              <FileCheck className="w-5 h-5 text-blueSite" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-bold text-subTitleColor">
                {t('orderDetails.deliverySubmitted', { defaultValue: 'Delivery Submitted' })}
              </h3>
              {deliveryVersion && (
                <span className="px-2 py-0.5 rounded-full bg-[#11D4521A] text-[#11D452] text-[12px] font-bold">
                  {deliveryVersion}
                </span>
              )}
            </div>
          </div>
          {submittedAt && (
            <span className="text-[12px] text-gray-400 font-medium">{submittedAt}</span>
          )}
        </div>

        <p className="text-[16px] text-textGrayColor leading-relaxed">
          {t('orderDetails.providerDeliveryText', { 
            defaultValue: 'You have submitted the final work for review. The customer will inspect the files before accepting the delivery.' 
          })}
        </p>

        {files && files.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
             <div className="relative">
                <span className="absolute -top-[10px] left-4 bg-[#F4F4F4] px-2 text-[12px] font-bold text-blueSite z-10">
                   {t('orderDetails.attachedFiles', { defaultValue: 'Attached Files' })}
                </span>
                <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col md:flex-row flex-wrap gap-4 mt-2 bg-transparent justify-between items-center relative z-0">
                  <div className="flex flex-wrap gap-4">
                    {files.map((file, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 px-4 py-2 bg-white rounded-[8px] border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-green-200 cursor-pointer"
                      >
                        {getFileIcon(file.type)}
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-textGrayColor font-medium truncate max-w-[200px] block hover:text-blueSite">
                          {file.name}
                        </a>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleDownloadAll}
                    title={t('orderDetails.downloadAll', { defaultValue: 'Download All' })}
                    className="flex items-center justify-center p-2.5 rounded-lg border border-gray-200 bg-white text-green-700 hover:bg-green-50 transition-colors w-full md:w-auto"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* Delivery Message with Customer Info as context */}
        <div className="mt-4 flex gap-4 bg-white p-4 rounded-[8px] border border-gray-100/60 shadow-sm relative">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={customer.avatar || "/anonymous.png"}
              alt={customer.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-bold text-subTitleColor">
                Delivered to {customer.name}
              </span>
              {submittedAt && (
                <span className="text-[12px] text-gray-400">{submittedAt}</span>
              )}
            </div>
            {message && (
              <p className="text-[14px] text-textGrayColor leading-relaxed mt-1">
                "{message}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDeliveryCard;
