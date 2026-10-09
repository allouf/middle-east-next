"use client";

import FilterSection from "@/features/category/components/FilterSection";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ConfigProvider, Slider } from "antd";
import { Search, Menu } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TbCaretUpFilled } from "react-icons/tb";
import { AdCategory, AdSearchParams, Category } from "../types/type";
import CategoryElement from "./CategoryElement";
import useAdsFilterStore from "@/lib/store/useAdsFilterStore";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";
import { useFooterControl } from "@/lib/Hooks/useFooterControl";

interface AdsSideBarProps {
  categories: AdCategory[];
  searchParams: AdSearchParams;
}

const AdsSideBar: React.FC<AdsSideBarProps> = ({
  categories,
  searchParams,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { currentLang } = useLangSwitch();
  const { hideFooter, showFooter } = useFooterControl();
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const urlSearchParams = useSearchParams();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1100); // custom breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide footer when menu is open on mobile
  useEffect(() => {
    if (showMenu && isMobile) {
      hideFooter();
    } else {
      showFooter();
    }
  }, [showMenu, isMobile, hideFooter, showFooter]);

  // Zustand store for loading states
  const {
    setCategoryLoading, categoryLoading,
    setSubCategoryLoading, subCategoryLoading,
    setPriceLoading, priceLoading,
    setConditionLoading, conditionLoading,

    setPromoLoading, promoLoading,
    setSelectedCategoryName,
    setSelectedSubCategoryName
  } = useAdsFilterStore();

  // Immediate state for all filters (source of truth)
  const [immediateSelectedCategory, setImmediateSelectedCategory] = useState<string | null>(
    searchParams.category || null,
  );
  const [immediateSelectedSubCategory, setImmediateSelectedSubCategory] = useState<string | null>(
    searchParams.sub_category || null,
  );
  const [immediateCondition, setImmediateCondition] = useState<string>(
    searchParams.condition || "",
  );
  const [immediatePromo, setImmediatePromo] = useState<string>(
    searchParams.promo || "",
  );
  const [immediatePriceRange, setImmediatePriceRange] = useState<[number, number]>([
    Number(searchParams.min) || 0,
    Number(searchParams.max) || 10000,
  ]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [categorySearch, setCategorySearch] = useState("");

  // Legacy state for price slider (kept for compatibility)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    Number(searchParams.min) || 0,
    Number(searchParams.max) || 10000,
  ]);



  useEffect(() => {
    const currentCategory = urlSearchParams?.get('category') || null;
    const currentSubCategory = urlSearchParams?.get('sub_category') || null;
    const currentCondition = urlSearchParams?.get('condition') || "";
    const currentPromo = urlSearchParams?.get('promo') || "";
    const currentMin = urlSearchParams?.get('min') || "0";
    const currentMax = urlSearchParams?.get('max') || "10000";

    // Sync local state if URL changes externally (e.g. from header)
    if (currentCategory !== immediateSelectedCategory) {
      setImmediateSelectedCategory(currentCategory);
    }
    if (currentSubCategory !== immediateSelectedSubCategory) {
      setImmediateSelectedSubCategory(currentSubCategory);
    }
    if (currentCondition !== immediateCondition) {
      setImmediateCondition(currentCondition);
    }
    if (currentPromo !== immediatePromo) {
      setImmediatePromo(currentPromo);
    }

    const urlMin = Number(currentMin);
    const urlMax = Number(currentMax);

    if (urlMin !== immediatePriceRange[0] || urlMax !== immediatePriceRange[1]) {
      setImmediatePriceRange([urlMin, urlMax]);
    }

  }, [urlSearchParams])

  // URL-State Synchronization Effects
  useEffect(() => {
    const currentCategory = urlSearchParams?.get('category') || null;
    const currentSubCategory = urlSearchParams?.get('sub_category') || null;
    const currentCondition = urlSearchParams?.get('condition') || "";
    const currentPromo = urlSearchParams?.get('promo') || "";
    const currentMin = urlSearchParams?.get('min') || "0";
    const currentMax = urlSearchParams?.get('max') || "10000";



    const urlMin = Number(currentMin);
    const urlMax = Number(currentMax);

    // if (urlMin !== immediatePriceRange[0] || urlMax !== immediatePriceRange[1]) {
    //   setImmediatePriceRange([urlMin, urlMax]);
    // }

    // Turn off loading states when matched
    if (currentCategory === immediateSelectedCategory) setCategoryLoading(false);
    if (currentSubCategory === immediateSelectedSubCategory) setSubCategoryLoading(false);
    if (currentCondition === immediateCondition) setConditionLoading(false);
    if (currentPromo === immediatePromo) setPromoLoading(false);
    if (urlMin === immediatePriceRange[0] && urlMax === immediatePriceRange[1]) setPriceLoading(false);

  }, [urlSearchParams, immediateSelectedCategory, immediateSelectedSubCategory, immediateCondition, immediatePromo, immediatePriceRange, setCategoryLoading, setSubCategoryLoading, setConditionLoading, setPromoLoading, setPriceLoading]);


  // Sync legacy price range with immediate state
  useEffect(() => {
    setLocalPriceRange(immediatePriceRange);
  }, [immediatePriceRange]);

  const PRICE_PRESETS = [
    { label: t("categories.allPrice") || "All Price", min: null, max: null },
    { label: t("categories.under20") || "Under $20", min: 0, max: 20 },
    { label: t("categories.25to100") || "$25 - $100", min: 25, max: 100 },
    { label: t("categories.100to300") || "$100 - $300", min: 100, max: 300 },
    { label: t("categories.300to500") || "$300 - $500", min: 300, max: 500 },
    { label: t("categories.500to1000") || "$500 - $1000", min: 500, max: 1000 },
  ];

  const CONDITION_OPTIONS = [
    { value: "new", label: t("ads_feature.condition.new") || "New" },
    { value: "used", label: t("ads_feature.condition.used") || "Used" },
  ];

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(urlSearchParams?.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (categoryId: string, level: number, name: string, parentId?: string, parentName?: string) => {
    console.log("level", level, "categoryId", categoryId, "parentId", parentId);

    // Update immediate state instantly
    if (level === 1 && parentId) {
      setImmediateSelectedCategory(parentId);
      setImmediateSelectedSubCategory(categoryId);
      setCategoryLoading(true);
      setSubCategoryLoading(true);
      setSelectedSubCategoryName(name); // Set subcategory name
      if (parentName) {
        setSelectedCategoryName(parentName); // Set parent category name
      }

      // We might need to find parent name if we want to set it too, but usually parent is already set or we can infer it. 
      // Actually, if we are clicking a subcategory, we are in a context where we might not easily know parent name unless passed.
      // But for now let's just set the subcategory name if level is 1.
      // The user requirement is "set it when the userClicks on a category or subCategory".

      updateURL({
        category: parentId,
        sub_category: categoryId
      });
    } else {
      setImmediateSelectedCategory(categoryId);
      setImmediateSelectedSubCategory(null);
      setCategoryLoading(true);
      setSubCategoryLoading(true);
      setSelectedCategoryName(name); // Set category name
      setSelectedSubCategoryName(null); // Reset subcategory name
      updateURL({ category: categoryId });
    }
  };

  const handlePriceChange = (min: number | null, max: number | null) => {
    // Update immediate state instantly
    setImmediatePriceRange([min || 0, max || 10000]);
    setPriceLoading(true);
    updateURL({
      min: min !== null ? String(min) : null,
      max: max !== null ? String(max) : null,
    });
  };

  const handleConditionChange = (condition: string) => {
    const current = immediateCondition;
    const newCondition = current === condition ? "" : condition;

    // Update immediate state instantly
    setImmediateCondition(newCondition);
    setConditionLoading(true);
    updateURL({ condition: newCondition || null });
  };

  const handlePromoChange = (promo: string) => {
    const current = immediatePromo;
    const newPromo = current === promo ? "" : promo;

    // Update immediate state instantly
    setImmediatePromo(newPromo);
    setPromoLoading(true);
    updateURL({ promo: newPromo || null });
  };

  const handleResetAll = () => {
    // Reset all immediate states
    setImmediateSelectedCategory(null);
    setImmediateSelectedSubCategory(null);
    setSelectedCategoryName(null);
    setSelectedSubCategoryName(null);
    setImmediateCondition("");
    setImmediatePromo("");
    setImmediatePriceRange([0, 10000]);

    // Set loading states
    setCategoryLoading(true);
    setSubCategoryLoading(true);
    setConditionLoading(true);
    setPromoLoading(true);
    setPriceLoading(true);

    router.push("?page=1", { scroll: false });
    
    // Close sidebar on mobile after reset
    if (isMobile) setShowMenu(false);
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const renderCategoryTree = (cats: AdCategory[], level = 0) => {
    return cats
      .filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
      )
      .map((category) => {
        const isExpanded = expandedCategories.has(String(category.id));
        const hasChildren = category.subcategories && category.subcategories.length > 0;

        return (
          <CategoryElement
            key={category.id}
            category={category}
            level={level}
            parentId={category.id}
            selectedCategory={immediateSelectedCategory}
            selectedSubCategory={immediateSelectedSubCategory}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onToggleExpand={toggleExpand}
            onSelect={handleCategorySelect}
          />
        );
      });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {showMenu && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-20 transition-opacity duration-300"
          onClick={() => setShowMenu(false)}
        />
      )}
      
      {/* Sidebar Toggle Button - Only on screens < 1100px */}
      {isMobile && (
        <div  className=" relative">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className={`absolute -top-6 ${currentLang == "ar" ? "right-4" : "left-4"
            } z-30 text-white p-3 rounded-lg shadow-lg hover:bg-blueSite/90 transition-all duration-300`}
       
       style={{
          background:
            "linear-gradient(90deg, #00664F 0%, rgba(0, 102, 79, 0.6) 100%)",
        }}
       >
          <Menu size={24} />
        </button>
        </div>
      )}
      
      <aside
        className={`${isMobile ? "fixed top-[145px] md:top-[140px] " : "relative"} z-30 w-full sm:w-[320px] bg-[#FAFAFA] pb-6 overflow-hidden flex flex-col
        transition-all duration-300 ease-in-out
          ${isMobile
            ? (showMenu
                ? "opacity-100"
                : "opacity-0 pointer-events-none")
            : "opacity-100"
          }`}
        style={{
          height: isMobile ? "100vh" : "auto",
          ...(currentLang == "ar" ? { right: 0, left: "auto" } : { left: 0, right: "auto" }),
          transform: isMobile ? (showMenu ? "translateX(0)" : (currentLang == "ar" ? "translateX(100%)" : "translateX(-100%)")) : "translateX(0)"
        }}
      >
      {/* Dark Green Header */}
      <div
        className="bg-[#00664F] py-3 sm:py-4 px-6 rounded-none lg:rounded-e-2xl "
        style={{
          background:
            "linear-gradient(90deg, #00664F 0%, rgba(0, 102, 79, 0.6) 100%)",
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg font-bold tracking-tight">
            {t("filters.title_sidebar") || "The Filters :"}
          </h2>
          {/* Close Button - Only on screens < 1100px */}
          {isMobile && (
            <button
              onClick={() => setShowMenu(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 space-y-3 sm:space-y-4 py-3 sm:py-4 overflow-y-auto flex-1 max-h-[calc(100vh-200px)] lg:max-h-none">
        {/* Category Filter */}
        <FilterSection
          title={t("filters.categories") || "FILTER BY CATEGORIES"}
          defaultOpen={true}
        >
          {/* Category Search */}
          <div className="relative mb-4 mt-2">
            <input
              type="text"
              placeholder={
                t("filters.search_placeholder") || "Search for anything..."
              }
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full py-2 px-4 pr-10 bg-white border border-gray-100 rounded-full text-sm outline-none placeholder:text-gray-400 focus:border-[#00664F]/30"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {renderCategoryTree(categories)}
          </div>
        </FilterSection>

        {/* Acquisition Method Filter */}
        <FilterSection
          title={t("ads_feature.acquisition_method") || "ACQUISITION METHOD"}
          defaultOpen={true}
        >
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative w-5 h-5 border-[1.5px] border-emerald-500/40 rounded-full flex items-center justify-center group-hover:border-[#00664F]">
                <input
                  type="radio"
                  name="promo"
                  className="sr-only"
                  onChange={() => handlePromoChange("FREE".toLowerCase())}
                  checked={immediatePromo === "FREE".toLowerCase()}
                />
                {immediatePromo === "FREE".toLowerCase() && (
                  <div className="w-2.5 h-2.5 bg-[#00664F] rounded-full" />
                )}
              </div>
              <span className="text-sm font-medium text-[#353635]">
                {t("ads_feature.free_ads") || "Free Ads"}
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative w-5 h-5 border-[1.5px] border-emerald-500/40 rounded-full flex items-center justify-center group-hover:border-[#00664F]">
                <input
                  type="radio"
                  name="promo"
                  className="sr-only"
                  onChange={() => handlePromoChange("NEGOTIABLE".toLowerCase())}
                  checked={immediatePromo === "NEGOTIABLE".toLowerCase()}
                />
                {immediatePromo === "NEGOTIABLE".toLowerCase() && (
                  <div className="w-2.5 h-2.5 bg-[#00664F] rounded-full" />
                )}
              </div>
              <span className="text-sm font-medium text-[#353635]">
                {t("ads_feature.negotiable_ads") || "Negotiable Ads"}
              </span>
            </label>
          </div>
        </FilterSection>

        {/* Item Condition Filter */}
        <FilterSection
          title={t("ads_feature.item_condition") || "ITEM CONDITION"}
          defaultOpen={true}
        >
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative w-5 h-5 border-[1.5px] border-emerald-500/40 rounded-full flex items-center justify-center group-hover:border-[#00664F]">
                <input
                  type="radio"
                  name="condition"
                  className="sr-only"
                  onChange={() => handleConditionChange("used")}
                  checked={immediateCondition === "used"}
                />
                {immediateCondition === "used" && (
                  <div className="w-2.5 h-2.5 bg-[#00664F] rounded-full" />
                )}
              </div>
              <span className="text-sm font-medium text-[#353635]">
                {t("ads_feature.used_ads") || "Used Ads"}
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative w-5 h-5 border-[1.5px] border-emerald-500/40 rounded-full flex items-center justify-center group-hover:border-[#00664F]">
                <input
                  type="radio"
                  name="condition"
                  className="sr-only"
                  onChange={() => handleConditionChange("new")}
                  checked={immediateCondition === "new"}
                />
                {immediateCondition === "new" && (
                  <div className="w-2.5 h-2.5 bg-[#00664F] rounded-full" />
                )}
              </div>
              <span className="text-sm font-medium text-[#353635]">
                {t("ads_feature.newest_ads") || "Newest Ads"}
              </span>
            </label>
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection
          title={t("product.priceRange") || "PRICE RANGE"}
          defaultOpen={true}
        >
          <div className="space-y-4 pt-4">
            {/* Functional Ant Design Multi-Range Slider */}
            <div className="px-2">
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
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t("filters.price.min") || "Min price"}
                  className="w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00664F]/30 placeholder:text-gray-400"
                  value={immediatePriceRange[0] || ""}
                  onChange={(e) =>
                    setImmediatePriceRange([
                      Number(e.target.value) || 0,
                      immediatePriceRange[1],
                    ])
                  }
                  onBlur={(e) =>
                    handlePriceChange(
                      Number(e.target.value) || null,
                      immediatePriceRange[1],
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handlePriceChange(immediatePriceRange[0], immediatePriceRange[1])
                  }
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t("filters.price.max") || "Max price"}
                  className="w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00664F]/30 placeholder:text-gray-400"
                  value={immediatePriceRange[1] || ""}
                  onChange={(e) =>
                    setImmediatePriceRange([
                      immediatePriceRange[0],
                      Number(e.target.value) || 0,
                    ])
                  }
                  onBlur={(e) =>
                    handlePriceChange(
                      immediatePriceRange[0],
                      Number(e.target.value) || null,
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handlePriceChange(immediatePriceRange[0], immediatePriceRange[1])
                  }
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs text-[#353635B2] font-medium">
                {t("categories.allPrice") || "All Price"}
              </span>
              {PRICE_PRESETS.map((preset) => {
                const isSelected =
                  (immediatePriceRange[0] === (preset.min || 0) ||
                    (!immediatePriceRange[0] && !preset.min)) &&
                  (immediatePriceRange[1] === (preset.max || 10000) ||
                    (!immediatePriceRange[1] && !preset.max));
                return (
                  <label
                    key={preset.label}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`relative w-5 h-5 border-[1.5px] ${isSelected ? "border-[#00664F]" : "border-emerald-500/40"} rounded-full flex items-center justify-center group-hover:border-[#00664F]`}
                    >
                      <input
                        type="radio"
                        name="price-preset"
                        className="sr-only"
                        onChange={() =>
                          handlePriceChange(preset.min, preset.max)
                        }
                        checked={isSelected}
                      />
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-[#00664F] rounded-full" />
                      )}
                    </div>
                    <span
                      className={`text-[13px] font-medium transition-colors ${isSelected ? "text-[#353635]" : "text-[#353635B2] group-hover:text-[#353635]"}`}
                    >
                      {preset.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </FilterSection>

        {/* ActionButtons - Inside scrollable container, positioned after filters */}
        <div className="pb-3">
          <div className="space-y-4">
            <button 
              className="w-full bg-[#00664F] text-white py-3.5 rounded-2xl font-bold tracking-tight hover:bg-[#00523F] transition shadow-md"
              onClick={() => {
                // Apply filters and close sidebar on mobile
                if (isMobile) setShowMenu(false);
              }}
            >
              {t("categories.apply") || "Filter"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResetAll}
                className="text-red-500 text-sm font-bold underline uppercase tracking-wider hover:text-red-600 transition"
              >
                {t("filters.reset_all") || "RESET ALL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default AdsSideBar;
