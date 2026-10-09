"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Dropdown, ConfigProvider, MenuProps } from "antd";
import useServicesFilterStore from "@/lib/store/useServicesFilterStore";

interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}
interface FiltersHeaderProps {
  results?: number;
  sortOptions: SortOption[];
}

const ServicesFilterHeader: React.FC<FiltersHeaderProps> = ({ results = 0, sortOptions }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams?.get("search") ?? ""
  );

  const {
    selectedCategoryName,
    selectedSubCategoryName,
    setCategoryLoading,
    setSubCategoryLoading,
    setPriceLoading,
    setRatingLoading,
    setServiceTypeLoading,
    setDeliveryTypeLoading
  } = useServicesFilterStore();

  const [activeFiltersLocal, setActiveFiltersLocal] = useState<{ key: string; label: string }[]>([]);

  const currentSortValue = searchParams?.get("sort") ?? "newest";
  const currentSort = sortOptions.find(opt => opt.value === currentSortValue) || sortOptions[0];

  const handleSortChange = (value: string) => {
    setCategoryLoading(true);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("sort", value);
    params.set("page", "1");

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
    router.refresh();
  };

  const menuItems: MenuProps['items'] = sortOptions.map((option) => ({
    key: option.value,
    label: option.icon ? (
      <div className="flex items-center gap-3 py-1">
        <span
          className={`${currentSortValue === option.value ? "text-white" : "text-[#00664F]"}`}
        >
          {option.icon}
        </span>
        <span className="text-sm font-medium">{option.label}</span>
      </div>
    ) : (
      <span className="text-sm font-medium">{option.label}</span>
    ),
    onClick: () => handleSortChange(option.value),
    ...(currentSortValue === option.value && { className: 'selected-sort-item' }),
  }));

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  const handleSearch = () => {
    setCategoryLoading(true);
    updateURL({ search: searchInput.trim() || null });
  };

  const removeFilter = (key: string) => {
    if (key === 'category') setCategoryLoading(true);
    else if (key === 'sub_category') setSubCategoryLoading(true);
    else if (key === 'min' || key === 'max') setPriceLoading(true);
    else if (key === 'rating') setRatingLoading(true);
    else if (key === 'service_type') setServiceTypeLoading(true);
    else if (key === 'delivery_type') setDeliveryTypeLoading(true);
    else setCategoryLoading(true);

    setActiveFiltersLocal(prev => prev.filter(filter => filter.key !== key));
    updateURL({ [key]: null });
  };

  useEffect(() => {
    const filters = [
      searchParams?.get("search") && {
        key: "search",
        label: `${t("categories.search")}: ${searchParams.get("search")}`,
      },
      searchParams?.get("category") && searchParams.get("category") !== "all" && {
        key: "category",
        label: `${t("categories.category")}: ${selectedCategoryName || searchParams.get("category")}`,
      },
      searchParams?.get("sub_category") && {
        key: "sub_category",
        label: `${t("categories.subcategory")}: ${selectedSubCategoryName || searchParams.get("sub_category")}`,
      },
      searchParams?.get("min") && {
        key: "min",
        label: `${t("categories.min")}: $${searchParams.get("min")}`,
      },
      searchParams?.get("max") && {
        key: "max",
        label: `${t("categories.max")}: $${searchParams.get("max")}`,
      },
      searchParams?.get("rating") && {
        key: "rating",
        label: t("categories.ratingAndUp", { rating: searchParams.get("rating") }),
      },
      searchParams?.get("service_type") && {
        key: "service_type",
        label: `${t("categories.type")}: ${searchParams.get("service_type")?.toUpperCase().replace('_', ' ')}`,
      },
      searchParams?.get("delivery_type") && {
        key: "delivery_type",
        label: `${t("categories.delivery")}: ${searchParams.get("delivery_type")?.toUpperCase().replace('_', ' ')}`,
      },
      searchParams?.get("sort") && {
        key: "sort",
        label: `${t("categories.sort")}: ${sortOptions.find((opt) => opt.value === searchParams.get("sort"))?.label || searchParams.get("sort")}`,
      },
    ].filter(Boolean) as { key: string; label: string }[];

    setActiveFiltersLocal(filters);
  }, [searchParams, selectedCategoryName, selectedSubCategoryName, t, sortOptions]);

  return (
    <div className="space-y-3 mb-6">
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 md:w-[400px] w-full border rounded-md px-3 py-2">
          <input
            type="text"
            placeholder={t("common.searchPlaceholder") || "Search services..."}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 outline-none text-sm"
          />
          <button
            onClick={handleSearch}
            className="text-blueSite hover:text-blueSiteHover"
          >
            <FiSearch size={18} />
          </button>
        </div>

        <ConfigProvider
          theme={{
            token: { colorPrimary: "#00664F", borderRadius: 12 },
            components: {
              Dropdown: { paddingBlock: 8 },
              Menu: {
                itemSelectedBg: "#00664F",
                itemSelectedColor: "#ffffff",
                itemHoverBg: "#f5f5f5",
                borderRadiusLG: 16,
                itemPaddingInline: 12,
              },
            },
          }}
        >
          <Dropdown
            menu={{ items: menuItems, className: "premium-sort-dropdown" }}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="sort-dropdown-overlay"
          >
            <button className="flex items-center justify-between gap-4 border border-gray-200 rounded-lg px-4 py-2 bg-white min-w-[180px] hover:border-[#00664F] transition-colors outline-none">
              <span className="text-sm text-[#474947]">{currentSort.label}</span>
              <FiChevronDown size={18} className="text-gray-400" />
            </button>
          </Dropdown>
        </ConfigProvider>

        <style jsx global>{`
          .sort-dropdown-overlay .ant-dropdown-menu {
            padding: 8px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid #f3f4f6;
          }
          .sort-dropdown-overlay .ant-dropdown-menu-item {
            border-radius: 12px !important; margin-bottom: 4px; transition: all 0.2s ease;
          }
          .sort-dropdown-overlay .selected-sort-item {
            background-color: #00664f !important; color: white !important;
          }
          .sort-dropdown-overlay .ant-dropdown-menu-item:last-child {
            margin-bottom: 0;
          }
          .sort-dropdown-overlay .ant-dropdown-menu-item-divider {
            margin: 8px 12px !important; background-color: #f3f4f6 !important;
          }
        `}</style>
      </div>

      {activeFiltersLocal.length > 0 && (
        <div className="flex items-center justify-between bg-blueLight rounded-md px-3 py-3 text-xs text-subTitleColor">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium text-textColor">{t("categories.activeFilters")}</span>

            {activeFiltersLocal.map((filter) => (
              <span
                key={filter.key}
                className="px-2 py-0.5 rounded-md cursor-pointer text-subTitleColor text-[16px] 2xl:text-[18px]"
                onClick={() => removeFilter(filter.key)}
              >
                {filter.label} <span className="px-3">✕</span>
              </span>
            ))}
          </div>
          <span className="font-semibold text-blueSite">
            {t("categories.resultsFound", { count: results })}
          </span>
        </div>
      )}
    </div>
  );
};

export default ServicesFilterHeader;
