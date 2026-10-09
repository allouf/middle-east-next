"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useCategoryStore from "@/lib/store/useCategoryStore";

const PromotionsFilter: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCategoryLoading } = useCategoryStore();

  const PROMOTIONS = [
    { key: "sponsored", label: t("filters.promotions_items.sponsored") },
    { key: "sale", label: t("filters.promotions_items.sale") },
  ];

  const activePromos =
    searchParams?.get("promo")?.split(",").filter(Boolean) ?? [];

  // Local state for immediate UI updates
  const [localActivePromos, setLocalActivePromos] = useState<string[]>(activePromos);

  // Sync local state with URL params and turn off loading when they match
  useEffect(() => {
    const urlPromos = searchParams?.get("promo")?.split(",").filter(Boolean) ?? [];
    
    // Turn off loading when local state matches URL params
    if (JSON.stringify(localActivePromos.sort()) === JSON.stringify(urlPromos.sort())) {
      setCategoryLoading(false);
    }
  }, [searchParams, localActivePromos, setCategoryLoading]);

  useEffect(() => {
    const urlPromos = searchParams?.get("promo")?.split(",").filter(Boolean) ?? [];
    setLocalActivePromos(urlPromos);
  }, [searchParams]);

  const togglePromo = (key: string) => {
    // Set loading state to true immediately
    setCategoryLoading(true);
    
    // Update local state immediately for instant UI feedback
    const newLocalPromos = [...localActivePromos];
    const index = newLocalPromos.indexOf(key);
    
    if (index > -1) {
      newLocalPromos.splice(index, 1);
    } else {
      newLocalPromos.push(key);
    }
    setLocalActivePromos(newLocalPromos);

    const params = new URLSearchParams(searchParams?.toString());
    const set = new Set(activePromos);

    set.has(key) ? set.delete(key) : set.add(key);

    if (set.size === 0) {
      params.delete("promo");
    } else {
      params.set("promo", Array.from(set).join(","));
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-2">
      {PROMOTIONS.map((item) => (
        <label
          key={item.key}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={localActivePromos.includes(item.key)}
            onChange={() => togglePromo(item.key)}
            className="accent-blueSite"
          />
          <span className="text-sm text-textColor">
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default PromotionsFilter;
