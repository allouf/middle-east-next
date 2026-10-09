"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequestDetail } from "../../../types/Rfq";

interface RFQHeaderProps {
  requestDetail?: RequestDetail | null;
}

export default function RFQHeader({ requestDetail }: RFQHeaderProps) {
  const { t } = useTranslation();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Awarded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Canceled':
        return 'bg-[#EEF0F2] text-gray-600 border-gray-300';
      case 'Expired':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="mb-6 flex flex-row items-center gap-2">
      <div className="border-4 w-1 rounded-md border-blueSite h-14 mb-4" />

      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 w-full">

        <div>
          <div className="flex flex-row ">
            <h1 className="text-2xl font-bold text-gray-900">{requestDetail?.reference_number || ''}</h1>
            {requestDetail?.status && (
              <span className={`inline-flex items-center mx-2 px-3 py-1 rounded-xl text-xs font-semibold border ${getStatusBadgeColor(requestDetail.status)}`}>
                {requestDetail.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-600">{t('serviceMarket.rfq.details.summary.posted')}{requestDetail?.created_at || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
