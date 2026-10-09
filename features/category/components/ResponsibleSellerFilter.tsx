"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useCategoryStore from "@/lib/store/useCategoryStore";

const ResponsibleSellerFilter: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCategoryLoading } = useCategoryStore();

  const SELLERS = [
    { key: "company", label: t("filters.seller.company") },
    { key: "person", label: t("filters.seller.person") },
  ];

  // Local state for immediate UI updates
  const [localSelectedSeller, setLocalSelectedSeller] = useState<string | null>(
    searchParams?.get("seller")
  );

  // Sync local state with URL params and turn off loading when they match
  useEffect(() => {
    const urlSeller = searchParams?.get("seller");

    
    // Turn off loading when local state matches URL params
    if (localSelectedSeller === urlSeller) {
      setCategoryLoading(false);
    }
  }, [searchParams, localSelectedSeller, setCategoryLoading]);
  useEffect(()=>{
    const urlSeller = searchParams?.get("seller");
    setLocalSelectedSeller(urlSeller)
  },[searchParams])

  const selectedSeller = searchParams?.get("seller");

  const selectSeller = (key: string) => {
    // Set loading state to true immediately
    setCategoryLoading(true);
    
    setLocalSelectedSeller(key);

    // Update URL params
    const params = new URLSearchParams(searchParams?.toString());

    if (selectedSeller === key) {
      // unselect if clicked again
      params.delete("seller");
    } else {
      params.set("seller", key);
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-2 flex flex-row justify-between items-center">
      {SELLERS.map((item) => (
        <label
          key={item.key}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="seller"
            checked={localSelectedSeller === item.key}
            onChange={() => selectSeller(item.key)}
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

export default ResponsibleSellerFilter;
