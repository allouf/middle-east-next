"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useCategoryStore from "@/lib/store/useCategoryStore";

const AttributesFilter: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCategoryLoading } = useCategoryStore();

  const ATTRIBUTES = [
    { key: "available", label: t("filters.attributes_items.available") },
    { key: "unavailable", label: t("filters.attributes_items.unavailable") },
    { key: "best_seller", label: t("filters.attributes_items.best_seller") },
    { key: "new_arrival", label: t("filters.attributes_items.new_arrival") },
    { key: "guaranteed", label: t("filters.attributes_items.guaranteed") },
    { key: "free_delivery", label: t("filters.attributes_items.free_delivery") },
  ];

  const activeAttrs =
    searchParams?.get("attr")?.split(",").filter(Boolean) ?? [];

  // Local state for immediate UI updates
  const [localActiveAttrs, setLocalActiveAttrs] = useState<string[]>(activeAttrs);

  // Sync local state with URL params and turn off loading when they match
  useEffect(() => {
    const urlAttrs = searchParams?.get("attr")?.split(",").filter(Boolean) ?? [];
    
    // Turn off loading when local state matches URL params
    if (JSON.stringify(localActiveAttrs.sort()) === JSON.stringify(urlAttrs.sort())) {
      setCategoryLoading(false);
    }
  }, [searchParams, localActiveAttrs, setCategoryLoading]);

  useEffect(() => {
    const urlAttrs = searchParams?.get("attr")?.split(",").filter(Boolean) ?? [];
    setLocalActiveAttrs(urlAttrs);
  }, [searchParams]);

  const toggleAttr = (key: string) => {
    // Set loading state to true immediately
    setCategoryLoading(true);
    
    // Update local state immediately for instant UI feedback
    const newLocalAttrs = [...localActiveAttrs];
    const index = newLocalAttrs.indexOf(key);
    
    if (index > -1) {
      newLocalAttrs.splice(index, 1);
    } else {
      newLocalAttrs.push(key);
    }
    setLocalActiveAttrs(newLocalAttrs);

    const params = new URLSearchParams(searchParams?.toString());
    const set = new Set(activeAttrs);

    set.has(key) ? set.delete(key) : set.add(key);

    if (set.size === 0) {
      params.delete("attr");
    } else {
      params.set("attr", Array.from(set).join(","));
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {ATTRIBUTES.map((item) => (
        <label
          key={item.key}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={localActiveAttrs.includes(item.key)}
            onChange={() => toggleAttr(item.key)}
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

export default AttributesFilter;
