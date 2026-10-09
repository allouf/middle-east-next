'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import DropDown from './DropDown';
import { ConfigProvider, Slider } from 'antd';

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  className?: string;
  showLabel?: boolean;
}

const PRICE_PRESETS = [
  { labelKey: "allPrice", min: null, max: null },
  { labelKey: "under25", min: 0, max: 25 },
  { labelKey: "25to100", min: 25, max: 100 },
  { labelKey: "100to250", min: 100, max: 250 },
  { labelKey: "250to500", min: 250, max: 500 },
  { labelKey: "500to1000", min: 500, max: 1000 },
  { labelKey: "1000to2500", min: 1000, max: 2500 },
  { labelKey: "2500to5000", min: 2500, max: 5000 },
  { labelKey: "5000plus", min: 5000, max: 10000 },
];

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  className = '',
  showLabel = true,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const [draftMin, setDraftMin] = useState<number>(Number(minPrice) || 0);
  const [draftMax, setDraftMax] = useState<number>(Number(maxPrice) || 10000);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    Number(minPrice) || 0,
    Number(maxPrice) || 10000
  ]);

  const applyRange = () => {
    onMinPriceChange(localPriceRange[0] === 0 ? '' : String(localPriceRange[0]));
    onMaxPriceChange(localPriceRange[1] === 10000 ? '' : String(localPriceRange[1]));
    setIsOpen(false);
  };

  const applyPreset = (min: number | null, max: number | null) => {
    const newMin = min ?? 0;
    const newMax = max ?? 10000;
    const newRange: [number, number] = [newMin, newMax];

    setLocalPriceRange(newRange);
    setDraftMin(newMin);
    setDraftMax(newMax);

    if (min === null && max === null) {
      onMinPriceChange('');
      onMaxPriceChange('');
    } else {
      onMinPriceChange(String(newMin));
      onMaxPriceChange(String(newMax));
    }

    setIsOpen(false);
  };

  const clearFilter = () => {
    const newRange: [number, number] = [0, 10000];
    setLocalPriceRange(newRange);
    setDraftMin(0);
    setDraftMax(10000);
    onMinPriceChange('');
    onMaxPriceChange('');
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (!minPrice && !maxPrice) return t('filters.price.title');

    const currentMin = Number(minPrice) || 0;
    const currentMax = Number(maxPrice) || 10000;

    if (currentMin === 0 && currentMax === 10000) return t('filters.price.title');
    if (currentMin === 0) return t('priceFilter.under25', { max: currentMax });
    if (currentMax === 10000) return t('priceFilter.from', { min: currentMin });

    return t('priceFilter.range', { min: currentMin, max: currentMax });
  };

  useEffect(() => {
    const newMin = Number(minPrice) || 0;
    const newMax = Number(maxPrice) || 10000;
    const newRange: [number, number] = [newMin, newMax];
    
    setLocalPriceRange(newRange);
    setDraftMin(newMin);
    setDraftMax(newMax);
  }, [minPrice, maxPrice]);

  const hasActiveFilter = Boolean(minPrice || maxPrice);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <DropDown
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        containerRef={containerRef}
        placement="bottomLeft"
        disableScroll
        className="p-4 w-[380px] border border-gray-100"
        triggerNode={
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-[38px] px-4 border border-blueSite rounded-md text-textColor cursor-pointer hover:border-blueSite transition-colors flex items-center"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[14px] font-medium">{getDisplayText()}</span>
              <svg
                className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {showLabel && (
            <div className="font-semibold text-subTitleColor text-[15px]">
              {t('filters.price.title')}
            </div>
          )}

          {/* Ant Design Slider */}
          <div className="rounded-md border border-gray-100 p-3">
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
                styles={{
                  track: { backgroundColor: "#00664F" },
                  handle: { borderColor: "#00664F" },
                }}
              />
            </ConfigProvider>

            {/* ✅ Min & Max in SAME row */}
            <div className="flex justify-between text-[13px] text-gray-600 mt-2">
              <span>
                {t('priceFilter.min')}: <span className="font-semibold text-textColor">${localPriceRange[0]}</span>
              </span>
              <span>
                {t('priceFilter.max')}: <span className="font-semibold text-textColor">${localPriceRange[1]}</span>
              </span>
            </div>
          </div>

          {/* Inputs */}
          <div className="flex gap-3">
            <input
              type="text"
              value={localPriceRange[0] || ""}
              onChange={(e) =>
                setLocalPriceRange([
                  Number(e.target.value) || 0,
                  localPriceRange[1],
                ])
              }
              className="w-1/2 h-[36px] border rounded px-3 text-[14px] bg-transparent border-grayBorder text-textColor focus:outline-none focus:border-blueSite"
              placeholder={t('priceFilter.min')}
            />
            <input
              type="text"
              value={localPriceRange[1] || ""}
              onChange={(e) =>
                setLocalPriceRange([
                  localPriceRange[0],
                  Number(e.target.value) || 0,
                ])
              }
              className="w-1/2 h-[36px] border rounded px-3 text-[14px] bg-transparent border-grayBorder text-textColor focus:outline-none focus:border-blueSite"
              placeholder={t('priceFilter.max')}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={applyRange}
              className="flex-1 h-[36px] bg-blueSite text-white rounded text-[14px] font-medium hover:bg-blueSiteHover transition"
            >
              {t('filters.apply')}
            </button>

            {hasActiveFilter && (
              <button
                onClick={clearFilter}
                className="h-[36px] px-4 border border-red-400 text-red-500 rounded text-[14px] font-medium hover:bg-red-50 transition"
              >
                {t('filters.clear')}
              </button>
            )}
          </div>

          <div className="h-px bg-gray-100" />

          {/* Presets */}
          <div className="space-y-2 text-[14px]">
            {PRICE_PRESETS.map((preset) => {
              const currentMin = Number(minPrice) || 0;
              const currentMax = Number(maxPrice) || 10000;
              const isAllPriceActive = !minPrice && !maxPrice;

              const isActive =
                preset.min === null && preset.max === null
                  ? isAllPriceActive
                  : preset.min === currentMin && preset.max === currentMax;

              return (
                <label
                  key={preset.labelKey}
                  className={`flex items-center gap-3 cursor-pointer rounded px-3 py-2
                    ${isActive ? "bg-blue-50" : "hover:bg-gray-50"} text-textColor`}
                >
                  <input
                    type="radio"
                    checked={isActive}
                    onChange={() => applyPreset(preset.min, preset.max)}
                    className="accent-blueSite w-4 h-4"
                  />
                  <span className="leading-none">{t(`priceFilter.${preset.labelKey}`)}</span>
                </label>
              );
            })}
          </div>
        </div>
      </DropDown>
    </div>
  );
};

export default PriceFilter;
