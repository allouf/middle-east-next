"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useCategoryStore from "@/lib/store/useCategoryStore";
import { ConfigProvider, Slider } from "antd";

const PriceFilter: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const PRICE_PRESETS = [
    { label: t("categories.allPrice"), min: null, max: null },
    { label: t("categories.under20"), min: 0, max: 20 },
    { label: t("categories.25to100"), min: 25, max: 100 },
    { label: t("categories.100to300"), min: 100, max: 300 },
    { label: t("categories.300to500"), min: 300, max: 500 },
    { label: t("categories.500to1000"), min: 500, max: 1000 },
    { label: t("categories.1000to10000"), min: 1000, max: 10000 },
  ];

  /* ------------------ URL values ------------------ */
  const urlMin = Number(searchParams?.get("min") ?? 0);
  const urlMax = Number(searchParams?.get("max") ?? 10000);

  /* ------------------ local draft state ------------------ */
  const [draftMin, setDraftMin] = useState<number>(urlMin);
  const [draftMax, setDraftMax] = useState<number>(urlMax);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([urlMin, urlMax]);
  const { setCategoryLoading } = useCategoryStore();

  /* ------------------ helpers ------------------ */
  const updateURL = (min: number | null, max: number | null) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (min === null) params.delete("min");
    else params.set("min", String(min));

    if (max === null) params.delete("max");
    else params.set("max", String(max));

    params.set("page", "1"); // reset pagination
    router.push(`?${params.toString()}`, { scroll: false });

  };

  const applyRange = () => {
    setCategoryLoading(true);
    updateURL(localPriceRange[0], localPriceRange[1]);
  };

  const handlePriceChange = (min: number | null, max: number | null) => {
    if (min !== null && max !== null) {
      setLocalPriceRange([min, max]);
    }
    updateURL(min, max);
  };

    useEffect(() => {
        const urlMin = Number(searchParams?.get("min")) ?? 0;
        const urlMax = Number(searchParams?.get("max")) ?? 10000;
       const isActive =
            urlMin === (localPriceRange[0]) &&
            urlMax === (localPriceRange[1]);

      
      // Turn off loading when local state matches URL params
      if (isActive) {
        setCategoryLoading(false);
      }
    }, [searchParams, localPriceRange, setCategoryLoading]);

    useEffect(()=>{
      const urlMin = Number(searchParams?.get("min")) ?? 0;
      const urlMax = Number(searchParams?.get("max")) ?? 10000;

      setLocalPriceRange([urlMin, urlMax])
    },[searchParams])

  const applyPreset = (min: number | null, max: number | null) => {
    const newRange: [number, number] = [min ?? 0, max ?? 10000];
    setLocalPriceRange(newRange);
    updateURL(newRange[0], newRange[1]);
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-4">
      {/* <div className="font-semibold text-subTitleColor">
        {t("product.priceRange")}
      </div> */}

      {/* Ant Design Slider */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00664F",
            borderRadius: 2,
          },
        }}
      >
        <Slider
          range
          min={0}
          max={10000}
          step={50}
          value={localPriceRange}
          onChange={(values) =>
            setLocalPriceRange(values as [number, number])
          }
          onAfterChange={(values) =>
            handlePriceChange(values[0], values[1])
          }
          styles={{
            track: { backgroundColor: "#00664F" },
            handle: { borderColor: "#00664F" },
          }}
        />
      </ConfigProvider>

      {/* Inputs */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("filters.price.min") || "Min price"}
            className="w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00664F]/30 placeholder:text-gray-400"
            value={localPriceRange[0] || ""}
            onChange={(e) =>
              setLocalPriceRange([
                Number(e.target.value) || 0,
                localPriceRange[1],
              ])
            }
            onBlur={(e) =>
              handlePriceChange(
                Number(e.target.value) || null,
                localPriceRange[1],
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handlePriceChange(localPriceRange[0], localPriceRange[1])
            }
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("filters.price.max") || "Max price"}
            className="w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00664F]/30 placeholder:text-gray-400"
            value={localPriceRange[1] || ""}
            onChange={(e) =>
              setLocalPriceRange([
                localPriceRange[0],
                Number(e.target.value) || 0,
              ])
            }
            onBlur={(e) =>
              handlePriceChange(
                localPriceRange[0],
                Number(e.target.value) || null,
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handlePriceChange(localPriceRange[0], localPriceRange[1])
            }
          />
        </div>
      </div>

      <button
        onClick={applyRange}
        className="w-full bg-blueSite text-white py-1.5 rounded text-sm hover:bg-blueSiteHover transition"
      >
        {t("categories.apply")}
      </button>

      {/* Presets */}
      <div className="space-y-2 text-sm">
        {PRICE_PRESETS.map((preset) => {
          const isActive =
            preset.min === (localPriceRange[0]) &&
            preset.max === (localPriceRange[1]);

          return (
            <label
              key={preset.label}
              className="flex items-center gap-2 cursor-pointer text-textColor"
            >
              <input
                type="radio"
                checked={isActive}
                onChange={() =>
                  applyPreset(preset.min, preset.max)
                }
                className="accent-blueSite"
              />
              {preset.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PriceFilter;
