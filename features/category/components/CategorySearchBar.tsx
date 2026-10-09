"use client";

import React, { useState, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const CategorySearchBar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValue = searchParams?.get("category_search") ?? "";
  const [value, setValue] = useState(initialValue);

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());

    if (value.trim()) {
      params.set("category_search", value.trim());
    } else {
      params.delete("category_search");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <div className="relative mb-3">
      <input
        type="text"
        placeholder={t("common.searchPlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-full border border-gray-300 px-4 py-2 pr-10 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blueSite"
      />

      <button
        type="button"
        onClick={submitSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   text-textColor hover:text-blueSite transition"
        aria-label={t("categories.searchPlaceholder")}
      >
        <Search size={18} />
      </button>
    </div>
  );
};

export default CategorySearchBar;
