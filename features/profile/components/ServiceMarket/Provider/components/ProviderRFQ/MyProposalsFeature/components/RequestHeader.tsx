"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface RequestHeaderProps {
  referenceNumber: string;
  status: string;
  createdAt: string;
  onClose?: () => void;
  backUrl?: string;
}

export default function RequestHeader({ 
  referenceNumber, 
  status, 
  createdAt,
  onClose,
  backUrl
}: RequestHeaderProps) {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  
  const renderBackButton = () => {
    if (backUrl) {
      return (
        <Link
          href={backUrl}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {t("common.back", "Back")}
        </Link>
      );
    }
    
    if (onClose) {
      return (
        <button
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-2 text-blueSite hover:opacity-80"
        >
          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span className="font-medium text-sm">{t('serviceMarket.providerRfq.backToRequests', 'Back to Requests')}</span>
        </button>
      );
    }
    
    return null;
  };
  
  return (
    <div className="mb-6">
      {renderBackButton()}
      <div className="flex items-center gap-2">
        <div className="h-6 w-1 rounded-full bg-[#0B6B57]" />
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          {t("serviceMarket.providerRfq.requestDetails.request", "Request")} {referenceNumber}
        </h1>
        <span className="ml-3 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-semibold text-[#7C3AED]">
          {status}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {t("serviceMarket.providerRfq.requestDetails.postedOn", "Posted on")} <span className="font-semibold">{createdAt}</span>.
      </p>
    </div>
  );
}
