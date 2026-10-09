"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useCategoryStore from "@/lib/store/useCategoryStore";


const RATING_PRESETS = [1, 2, 3, 4, 5];

const RatingFilter: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCategoryLoading } = useCategoryStore();

  const ratingParam = Number(searchParams?.get("rating") ?? 0);

  // Local state for immediate UI updates
  const [localRating, setLocalRating] = useState<number>(ratingParam);

  useEffect(() => {
    setLocalRating(ratingParam);
  }, [ratingParam]);

  const commitRating = (value: number) => {
    setCategoryLoading(true);
    setLocalRating(value);
    const params = new URLSearchParams(window.location.search);

    if (value <= 0) params.delete("rating");
    else params.set("rating", String(value));

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  /* ------------------ Slider Value ------------------ */
  const sliderValue = useMemo(() => {
    return localRating > 0 ? localRating : 0;
  }, [localRating]);

  return (
    <div className="space-y-3">
      {/* Slider */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={sliderValue}
          // 1. Update UI immediately so the slider moves smoothly
          onChange={(e) => setLocalRating(Number(e.target.value))}
          // 2. Only update the URL when the user lets go
          onMouseUp={(e) => commitRating(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commitRating(Number((e.target as HTMLInputElement).value))}
          className="w-full accent-blueSite"
        />

        <div className="flex items-center gap-1 bg-[#E6F0ED] px-2 py-1 rounded text-xs font-medium text-blueSite">
          <FaStar size={12} />
          {sliderValue || t("categories.all")}
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-1">
        {/* All Ratings */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!localRating}
            onChange={() => commitRating(0)}
            className="accent-blueSite"
          />
          <span className="text-sm">{t("categories.allRatings")}</span>
        </label>

        {RATING_PRESETS.map((rate) => (
          <label key={rate} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={localRating === rate}
              onChange={() => commitRating(rate)}
              className="accent-blueSite"
            />

            <span className="flex items-center gap-1 text-sm text-textColor">
              {t("categories.above")}

              <FaStar size={12} className="text-blueSite" />
              <span>{rate}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;
