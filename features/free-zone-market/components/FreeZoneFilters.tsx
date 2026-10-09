"use client";

import React, { useRef } from 'react';
import { Collapse, Checkbox, Input, Slider, Button, Radio, Tree, ConfigProvider, Skeleton } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState, useTransition, useMemo } from 'react';
import type { Category } from '@/features/category/types/type';
import type { DataNode } from 'antd/es/tree';

const { Panel } = Collapse;

interface FreeZoneFiltersProps {
  onFilterChange?: (filters: any) => void;
  initialCategories: Category[];
}

const FreeZoneFilters: React.FC<FreeZoneFiltersProps> = ({ onFilterChange, initialCategories }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params?.locale || 'en';

  // --- State for Data ---
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [countries, setCountries] = useState<any[]>([]);

  // --- State for Filters ---
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number | null>(null);

  const [isPending, startTransition] = useTransition();

  // Search local states
  const [catSearch, setCatSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  // Fetch Data
  useEffect(() => {
    // Sync initial props
    setCategories(initialCategories || []);
    // Countries
    import("@/shared/utils/locationApi").then(({ fetchCountries }) => {
      fetchCountries().then(list => setCountries(list || []));
    });
  }, [locale, initialCategories]);

  // Sync with URL params on mount or when URL changes
  useEffect(() => {
    const cats = searchParams.get('category')?.split(',').filter(Boolean) || [];
    setSelectedCategories(cats.includes('all') ? [] : cats);
    setExpandedKeys(cats.includes('all') ? [] : cats);
    
    setSelectedCountry(searchParams.get('country_code') || null);
    
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    setPriceRange([min ? Number(min) : 0, max ? Number(max) : 1000]);
    
    const r = searchParams.get('rating');
    setRating(r ? Number(r) : null);
  }, [searchParams]);

  // Use a ref to prevent endless rendering / dependency loops when we manually push router
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply Filters
  const applyFilters = (updates: any = {}) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    // Merge current state with updates
    const currentCategories = updates.categories !== undefined ? updates.categories : selectedCategories;
    const currentCountry = updates.country !== undefined ? updates.country : selectedCountry;
    const currentPrice = updates.price !== undefined ? updates.price : priceRange;
    const currentRating = updates.rating !== undefined ? updates.rating : rating;

    if (currentCategories.length > 0) {
      params.set('category', currentCategories.join(','));
    } else {
      params.delete('category');
    }

    if (currentCountry) {
      params.set('country_code', currentCountry);
    } else {
      params.delete('country_code');
    }

    if (currentPrice[0] > 0) params.set('min', currentPrice[0].toString());
    else params.delete('min');
    
    if (currentPrice[1] < 1000) params.set('max', currentPrice[1].toString());
    else params.delete('max');

    if (currentRating !== null) params.set('rating', currentRating.toString());
    else params.delete('rating');

    startTransition(() => {
      router.push(`/${locale}/free-zone?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setExpandedKeys([]);
    setSelectedCountry(null);
    setPriceRange([0, 1000]);
    setRating(null);
    startTransition(() => {
      router.push(`/${locale}/free-zone`, { scroll: false });
    });
  };

  // Build Tree Data
  const buildTreeData = (cats: Category[]): DataNode[] => {
    return cats.map((cat) => ({
      title: cat.name,
      key: String(cat.id),
      children: cat.children && cat.children.length > 0 ? buildTreeData(cat.children) : undefined,
    }));
  };

  const treeData = useMemo(() => buildTreeData(
    categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()))
  ), [categories, catSearch]);

  const onCheck = (checkedKeysValue: any) => {
    const keys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked;
    const newCategories = keys as string[];
    
    // Ensure single selection: take the last added key
    const singleCategory = newCategories.length > 0 ? [newCategories[newCategories.length - 1]] : [];
    
    setSelectedCategories(singleCategory);
    applyFilters({ categories: singleCategory });
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00664F',
        },
      }}
    >
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col gap-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-somar-bold font-bold text-[#0F172A] flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 18V12H10V14H18V16H10V18H8ZM0 16V14H6V16H0ZM4 12V10H0V8H4V6H6V12H4ZM8 10V8H18V10H8ZM12 6V0H14V2H18V4H14V6H12ZM0 4V2H10V4H0Z" fill="#00664F" />
          </svg>

          {t('freeZoneMarket.filters.title')}
        </h2>

      </div>

      <div className="space-y-6">
        {/* Categories */}
        <section>
          <h3 className="text-xs font-somar-bold font-semibold text-[#64748B] uppercase tracking-wider mb-3">
            {t('freeZoneMarket.filters.categories')}
          </h3>
          <Input
            prefix={<SearchOutlined className="text-[#6B7280] me-2" />}
            placeholder={t('freeZoneMarket.filters.searchCategories')}
            className="rounded-xl bg-[#F8FAFC] placeholder-[#6B7280] mb-4 h-10"
            bordered={false}
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
          />
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {categories.length > 0 ? (
              <Tree
                checkable
                checkStrictly={true}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={true}
                onCheck={onCheck}
                checkedKeys={selectedCategories}
                treeData={treeData}
                selectable={false}
                className="font-somar-medium text-gray-600 bg-transparent"
              />
            ) : (
              <div className="space-y-2">
                <Skeleton.Button active block size="small" />
                <Skeleton.Button active block size="small" />
                <Skeleton.Button active block size="small" />
                <Skeleton.Button active block size="small" />
              </div>
            )}
          </div>
        </section>

        {/* Country */}
        <section>
          <h3 className="text-xs font-somar-bold font-semibold text-[#64748B] uppercase tracking-wider mb-3">
            {t('freeZoneMarket.filters.country')}
          </h3>
          <Input
            prefix={<svg className='me-2' width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15L5 13.25L1.125 14.75C0.847222 14.8611 0.590278 14.8299 0.354167 14.6562C0.118056 14.4826 0 14.25 0 13.9583V2.29167C0 2.11111 0.0520833 1.95139 0.15625 1.8125C0.260417 1.67361 0.402778 1.56944 0.583333 1.5L5 0L10 1.75L13.875 0.25C14.1528 0.138889 14.4097 0.170139 14.6458 0.34375C14.8819 0.517361 15 0.75 15 1.04167V12.7083C15 12.8889 14.9479 13.0486 14.8438 13.1875C14.7396 13.3264 14.5972 13.4306 14.4167 13.5L10 15ZM9.16667 12.9583V3.20833L5.83333 2.04167V11.7917L9.16667 12.9583ZM10.8333 12.9583L13.3333 12.125V2.25L10.8333 3.20833V12.9583ZM1.66667 12.75L4.16667 11.7917V2.04167L1.66667 2.875V12.75ZM10.8333 3.20833V12.9583V3.20833ZM4.16667 2.04167V11.7917V2.04167Z" fill="#94A3B8" />
            </svg>
            }
            placeholder={t('freeZoneMarket.filters.searchCountries')}
            className="rounded-xl bg-[#F8FAFC] placeholder-[#6B7280] mb-4 h-10"
            bordered={false}
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
          />
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {countries.length > 0 ? (
              countries
                .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                .map((country: any) => (
                  <Radio 
                    key={country.id}
                    checked={selectedCountry === country.shortName}
                    onClick={(e) => {
                      const newCountry = selectedCountry === country.shortName ? null : country.shortName;
                      setSelectedCountry(newCountry);
                      applyFilters({ country: newCountry });
                    }}
                    className="font-somar-medium text-gray-600 ml-0 hover:bg-gray-50 rounded"
                  >
                    {country.name}
                  </Radio>
                ))
            ) : (
              <div className="space-y-2">
                <Skeleton.Button active block size="small" />
                <Skeleton.Button active block size="small" />
                <Skeleton.Button active block size="small" />
                <Skeleton.Button active block size="small" />
              </div>
            )}
          </div>
        </section>

        {/* Price */}
        <section>
          <h3 className="text-xs font-somar-bold font-semibold text-[#64748B] uppercase tracking-wider mb-3">
            {t('freeZoneMarket.filters.basicPrice')}
          </h3>
          <div className="px-2">
            <Slider
              range
              value={priceRange}
              onChange={(val) => setPriceRange(val as [number, number])}
              onAfterChange={(val) => applyFilters({ price: val })}
              max={1000}
            />
            <div className="flex justify-between mt-2 gap-2">
              <div className="flex flex-col ">
                <span className="text-[10px] text-[#94A3B8] mb-1">{t('freeZoneMarket.filters.min')}</span>
                <Input size='large' value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} onBlur={() => applyFilters()} className="bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] rounded-md text-xs font-somar-bold w-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94A3B8] mb-1">{t('freeZoneMarket.filters.max')}</span>
                <Input size='large' value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} onBlur={() => applyFilters()} className="bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] rounded-md text-xs font-somar-bold w-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              t('freeZoneMarket.filters.under20'),
              t('freeZoneMarket.filters.range25to100'),
              t('freeZoneMarket.filters.range100to500')
            ].map((range, idx) => (
              <Button
                key={range}
                onClick={() => {
                  let val: [number, number] = [0, 1000];
                  if (idx === 0) val = [0, 20];
                  if (idx === 1) val = [25, 100];
                  if (idx === 2) val = [100, 500];
                  setPriceRange(val);
                  applyFilters({ price: val });
                }}
                size="small"
                className={`rounded-full text-[12px] font-semibold h-7 px-3 bg-transparent text-gray-500 border-gray-200 hover:bg-[#00664F1A] hover:text-[#00664F] hover:border-[#00664F33]`}
              >
                {range}
              </Button>
            ))}
          </div>
        </section>

        {/* Rating */}
        <section>
          <h3 className="text-xs font-somar-bold font-semibold text-[#64748B] uppercase tracking-wider mb-3">
            {t('freeZoneMarket.filters.rating')}
          </h3>
          <Radio.Group 
            className="flex flex-col w-full" 
            value={rating} 
            onChange={(e) => {
              setRating(e.target.value);
              applyFilters({ rating: e.target.value });
            }}
          >
            {[5, 4, 3].map((stars) => (
              <Radio key={stars} value={stars} className="font-somar-medium text-gray-600 mb-2 last:mb-0">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400 text-[18px]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < stars ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-xs ml-1 whitespace-nowrap">
                    {t(`freeZoneMarket.filters.above${stars}`)}
                  </span>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </section>

        <Button type="text" onClick={clearFilters} className="text-[#64748B] hover:text-blueSite font-medium w-full mt-2">
          {t('freeZoneMarket.filters.clear')}
        </Button>
      </div>

      <style jsx global>{`
        .free-zone-collapse .ant-collapse-header {
          padding: 0 !important;
          margin-bottom: 12px;
        }
        .free-zone-collapse .ant-collapse-content-box {
          padding: 0 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
    </ConfigProvider>
  );
};

export default FreeZoneFilters;
