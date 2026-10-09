"use client";

import FilterSection from "@/features/category/components/FilterSection";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Search, Menu } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ServiceCategory, ServiceSearchParams } from "../types/type";
import CategoryElement from "./CategoryElement";
import useServicesFilterStore from "@/lib/store/useServicesFilterStore";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";
import { useFooterControl } from "@/lib/Hooks/useFooterControl";
import RatingFilter from "./RatingFilter";
import PriceFilter from "./PriceFilter";
import ServiceTypeFilter from "./ServiceTypeFilter";
import DeliveryTypeFilter from "./DeliveryTypeFilter";


interface ServicesSideBarProps {
  categories: ServiceCategory[];
  searchParams: ServiceSearchParams;
}

const ServicesSideBar: React.FC<ServicesSideBarProps> = ({
  categories,
  searchParams,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentLang } = useLangSwitch();
  const { hideFooter, showFooter } = useFooterControl();
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const urlSearchParams = useSearchParams();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (showMenu && isMobile) {
      hideFooter();
    } else {
      showFooter();
    }
  }, [showMenu, isMobile, hideFooter, showFooter]);

  const {
    setCategoryLoading,
    setSubCategoryLoading,
    setPriceLoading,
    setRatingLoading,
    setServiceTypeLoading,
    setDeliveryTypeLoading,
    setSelectedCategoryName,
    setSelectedSubCategoryName
  } = useServicesFilterStore();

  const [immediateSelectedCategory, setImmediateSelectedCategory] = useState<string | null>(searchParams.category || null);
  const [immediateSelectedSubCategory, setImmediateSelectedSubCategory] = useState<string | null>(searchParams.sub_category || null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [categorySearch, setCategorySearch] = useState(urlSearchParams?.get("category_search") || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentUrlSearch = urlSearchParams?.get("category_search") || "";
      if (categorySearch !== currentUrlSearch) {
        const params = new URLSearchParams(urlSearchParams?.toString());
        if (categorySearch.trim()) {
          params.set("category_search", categorySearch.trim());
        } else {
          params.delete("category_search");
        }
        router.push(`?${params.toString()}`, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [categorySearch, router, urlSearchParams]);

  useEffect(() => {
    const currentCategory = urlSearchParams?.get('category') || null;
    const currentSubCategory = urlSearchParams?.get('sub_category') || null;

    if (currentCategory === immediateSelectedCategory) setCategoryLoading(false);
    if (currentSubCategory === immediateSelectedSubCategory) setSubCategoryLoading(false);

  }, [urlSearchParams, immediateSelectedCategory, immediateSelectedSubCategory, setCategoryLoading, setSubCategoryLoading]);


  useEffect(()=>{
    const currentCategory = urlSearchParams?.get('category') || null;
    const currentSubCategory = urlSearchParams?.get('sub_category') || null;
        if (currentCategory !== immediateSelectedCategory) setImmediateSelectedCategory(currentCategory);
       if (currentSubCategory !== immediateSelectedSubCategory) setImmediateSelectedSubCategory(currentSubCategory);
  },[urlSearchParams])

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
    if (level === 1 && parentId) {
      setImmediateSelectedCategory(parentId);
      setImmediateSelectedSubCategory(categoryId);
      setCategoryLoading(true);
      setSubCategoryLoading(true);
      setSelectedSubCategoryName(name);
      if (parentName) setSelectedCategoryName(parentName);
      updateURL({ category: parentId, sub_category: categoryId });
    } else {

      console.log("category id",categoryId)
      console.log("level",level)

      setImmediateSelectedCategory(categoryId);
      setImmediateSelectedSubCategory(null);
      setCategoryLoading(true);
      setSubCategoryLoading(true);
      setSelectedCategoryName(name);
      setSelectedSubCategoryName(null);
      updateURL({ category: categoryId });
    }
  };

  const handleResetAll = () => {
    setImmediateSelectedCategory(null);
    setImmediateSelectedSubCategory(null);
    setSelectedCategoryName(null);
    setSelectedSubCategoryName(null);
    setCategoryLoading(true);
    setSubCategoryLoading(true);
    setServiceTypeLoading(true);
    setDeliveryTypeLoading(true);

    router.push("?page=1", { scroll: false });
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

  const renderCategoryTree = (cats: ServiceCategory[], level = 0) => {
    return cats
      .filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
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
      {showMenu && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-20 transition-opacity duration-300"
          onClick={() => setShowMenu(false)}
        />
      )}
      
      {isMobile && (
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={`absolute -top-6 ${currentLang === "ar" ? "right-4" : "left-4"} z-30 text-white p-3 rounded-lg shadow-lg hover:bg-blueSite/90 transition-all duration-300`}
            style={{ background: "linear-gradient(90deg, #00664F 0%, rgba(0, 102, 79, 0.6) 100%)" }}
          >
            <Menu size={24} />
          </button>
        </div>
      )}
      
      <aside
        className={`${isMobile ? "fixed top-[145px] md:top-[140px]" : "relative"} z-30 w-full sm:w-[340px] 2xl:w-[380px] bg-[#FAFAFA] pb-6 overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${isMobile ? (showMenu ? "opacity-100" : "opacity-0 pointer-events-none") : "opacity-100"}`}
        style={{
          height: isMobile ? "100vh" : "auto",
          ...(currentLang === "ar" ? { right: 0, left: "auto" } : { left: 0, right: "auto" }),
          transform: isMobile ? (showMenu ? "translateX(0)" : (currentLang === "ar" ? "translateX(100%)" : "translateX(-100%)")) : "translateX(0)"
        }}
      >
        <div
          className="bg-[#00664F] py-3 sm:py-4 px-6 rounded-none lg:rounded-e-2xl"
          style={{ background: "linear-gradient(90deg, #00664F 0%, rgba(0, 102, 79, 0.6) 100%)" }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-white text-lg font-bold tracking-tight">
              {t("filters.title_sidebar")}
            </h2>
            {isMobile && (
              <button onClick={() => setShowMenu(false)} className="text-white hover:text-gray-200 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="px-5 space-y-3 sm:space-y-4 py-3 sm:py-4 overflow-y-auto flex-1 max-h-[calc(100vh-200px)] lg:max-h-none">
          <FilterSection title={t("filters.categories")} defaultOpen={true}>
            <div className="relative mb-4 mt-2">
              <input
                type="text"
                placeholder={t("filters.search_placeholder")}
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

          <FilterSection title={t("filters.service_type")} defaultOpen={true}>
            <ServiceTypeFilter />
          </FilterSection>

          <FilterSection title={t("filters.delivery_type")} defaultOpen={true}>
            <DeliveryTypeFilter />
          </FilterSection>

          <FilterSection title={t("filters.rating")} defaultOpen={true}>
            <RatingFilter />
          </FilterSection>

          <FilterSection title={t("product.priceRange")} defaultOpen={true}>
            <PriceFilter />
          </FilterSection>

          <div className="pb-3">
            <div className="space-y-4">
              <button 
                className="w-full bg-[#00664F] text-white py-3.5 rounded-2xl font-bold tracking-tight hover:bg-[#00523F] transition shadow-md"
                onClick={() => { if (isMobile) setShowMenu(false); }}
              >
                {t("categories.apply")}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-red-500 text-sm font-bold underline uppercase tracking-wider hover:text-red-600 transition"
                >
                  {t("filters.reset_all")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ServicesSideBar;
