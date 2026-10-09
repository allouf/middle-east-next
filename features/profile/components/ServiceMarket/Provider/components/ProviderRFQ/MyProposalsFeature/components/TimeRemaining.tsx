"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

interface TimeRemainingProps {
  days: number;
  hours: number;
  minutes: number;
}

export default function TimeRemaining({ days, hours, minutes }: TimeRemainingProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFAFA] p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9]">
            <Clock className="h-6 w-6 text-[#0B6B57]" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">
              {t("serviceMarket.providerRfq.timeRemaining.title", "Open Time Remaining")}
            </h3>
            <p className="mt-2 text-sm text-[#98A2B3]">
              <span className="font-semibold text-[#344054]">{t("serviceMarket.providerRfq.timeRemaining.hours", "72 hours")}</span> {t("serviceMarket.providerRfq.timeRemaining.description", "to accept Quotes before it is automatically Closed")}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <div className="text-center">
            <div className="text-[38px] font-bold leading-none text-[#FF4D4F]">
              {String(days).padStart(2, '0')}
            </div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
              {t("serviceMarket.providerRfq.timeRemaining.days", "DAYS")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[38px] font-bold leading-none text-[#FF4D4F]">
              {String(hours).padStart(2, '0')}
            </div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
              {t("serviceMarket.providerRfq.timeRemaining.hours", "HOURS")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[38px] font-bold leading-none text-[#FF4D4F]">
              {String(minutes).padStart(2, '0')}
            </div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
              {t("serviceMarket.providerRfq.timeRemaining.mins", "MINS")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
