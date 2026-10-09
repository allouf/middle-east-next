"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { AlertCircle } from "lucide-react";

export default function NoPlans() {
  const { t } = useTranslation();

  return (
    <div className="rounded-[20px] border border-grayBorder bg-grayLight2 px-6 py-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-grayBorder/20">
          <AlertCircle size={32} className="text-grayBorder" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            {t("serviceMarket.boostCampaign.create.noPlansTitle", { defaultValue: "No Plans Available" })}
          </h3>
          <p className="text-sm text-[#64748B]">
            {t("serviceMarket.boostCampaign.create.noPlansDescription", { 
              defaultValue: "This service does not have any plans available for boost campaigns. Please select another service or contact support." 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
