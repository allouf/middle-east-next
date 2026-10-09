"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useServicesFilterStore from "@/lib/store/useServicesFilterStore";

const DELIVERY_TYPES = [
  "remote",
  "on_site",
  "hybrid",
  "in_person",
];

const DeliveryTypeFilter: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setDeliveryTypeLoading } = useServicesFilterStore();

  const deliveryTypeParam = searchParams?.get("delivery_type") ?? "";
  const [localType, setLocalType] = useState<string>(deliveryTypeParam);

  useEffect(() => {
    setLocalType(deliveryTypeParam);
  }, [deliveryTypeParam]);

  useEffect(() => {
    if (deliveryTypeParam === localType) {
      setDeliveryTypeLoading(false);
    }
  }, [deliveryTypeParam, localType, setDeliveryTypeLoading]);

  const handleTypeChange = (value: string) => {
    setDeliveryTypeLoading(true);
    setLocalType(value);
    
    const params = new URLSearchParams(window.location.search);
    if (localType === value) {
      params.delete("delivery_type");
      setLocalType("");
    } else {
      params.set("delivery_type", value);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-3 py-2">
      {DELIVERY_TYPES.map((typeId) => (
        <label key={typeId} className="flex items-center gap-3 cursor-pointer group">
          <div className={`relative w-5 h-5 border-[1.5px] rounded flex items-center justify-center transition-all ${localType === typeId ? "bg-[#00664F] border-[#00664F]" : "border-gray-300 group-hover:border-[#00664F]"}`}>
            <input
              type="checkbox"
              className="sr-only"
              checked={localType === typeId}
              onChange={() => handleTypeChange(typeId)}
            />
            {localType === typeId && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-medium transition-colors ${localType === typeId ? "text-[#353635]" : "text-gray-500 group-hover:text-[#353635]"}`}>
            {t(`filters.delivery_types.${typeId}`)}
          </span>
        </label>
      ))}
    </div>
  );
};

export default DeliveryTypeFilter;
