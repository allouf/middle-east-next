"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import React from "react";

export const SelectedAddressMeta: React.FC<{ address: any }> = ({ address }) => {
  const { t } = useTranslation();
  if (!address) return null;

  const Item = ({
    label,
    value,
  }: {
    label: string;
    value?: string | null;
  }) => (
    <div>
    {/* <div className="min-w-0 rounded-lg bg-white/10 p-3 sm:p-4"> */}
      <label className="block text-textWhiteColor/90 text-xs md:text-[14px] mb-1 font-medium">
        {label}
      </label>
      <div className="text-textWhiteColor font-medium text-sm sm:text-[15px] truncate">
        {value || "N/A"}
      </div>
    {/* </div> */}
    </div>
  );

  return (
    <div className="bg-[#055542]/90 rounded-xl p-2 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Item label={t("checkout.country")} value={address?.country} />
        <Item label={t("checkout.city")} value={address?.city} />
        <Item label={t("checkout.region")} value={address?.region} />
      </div>
    </div>
  );
};
