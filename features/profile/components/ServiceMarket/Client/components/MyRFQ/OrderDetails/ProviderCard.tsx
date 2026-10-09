import React from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./Card";

interface ProviderCardProps {
  providerName: string;
  providerInitials: string;
  rating: number;
  profession: string;
}

export default function ProviderCard({
  providerName,
  providerInitials,
  rating,
  profession,
}: ProviderCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-[#98A2B3]">
        {t('serviceMarket.rfq.orderDetails.provider')}
      </p>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B6B57] text-sm font-bold text-white">
          {providerInitials}
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-[#1F2937]">
            {providerName}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F59E0B]">
              {rating} <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            </span>
          </h4>
          <p className="text-xs text-[#98A2B3]">{profession}</p>
        </div>
      </div>
    </Card>
  );
}
