"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import CategorySearchBar from './CategorySearchBar';
import CategorySideItem from './CategorySideItem';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Menu } from 'lucide-react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import { useLangSwitch } from '@/lib/Hooks/useLangSwitch';
import { Category, CategorySearchParams } from '../types/type';
import FilterSection from './FilterSection';
import ResponsibleSellerFilter from './ResponsibleSellerFilter';
import PriceFilter from './PriceFilter';
import RatingFilter from './RatingFilter';
import PromotionsFilter from './PromotionsFilter';
import AttributesFilter from './AttributesFilter';

interface CategoriesSideBarProps {
  categories: Category[];
  searchParams: CategorySearchParams
}
const CategoriesSideBar: React.FC<CategoriesSideBarProps> = ({
  categories,
  searchParams
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setCategoryLoading, categoryLoading, setSelectedCategoryName } = useCategoryStore();
  const { currentLang } = useLangSwitch();
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1100); // custom breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const searchParamsFromHook = useSearchParams();
  console.log("search Params ", searchParams)
  const selectedCategory = searchParams.category;
  const [immediateSelectedId, setImmediatSelectedId] = useState<number | null>(Number(selectedCategory));

  // Check if we're on the products endpoint
  const isProductsPage = pathname?.includes('/products');

  // Update loading state when category changes in URL
  React.useEffect(() => {
    const currentCategory = searchParamsFromHook.get('category');
    if (currentCategory === selectedCategory) {
      // Category has been updated in URL, turn off loading
      setCategoryLoading(false);
    }
  }, [searchParamsFromHook, selectedCategory, setCategoryLoading]);

  // Handle category selection changes including "all"
  useEffect(() => {
    const currentCategory = searchParamsFromHook.get('category');
    console.log("remove on all", currentCategory)
    if (currentCategory === "all" || !currentCategory) {
      setImmediatSelectedId(null);
    } else if (currentCategory) {
      setImmediatSelectedId(Number(currentCategory));
    }
  }, [searchParamsFromHook]);


  useEffect(() => {
    console.log("categories ", categories)
    console.log("selectedCategory", selectedCategory)

  }, [])



  // console.log("is Products Page",isProductsPage)


  const handleSelectCategory = (id: number) => {
    // Set loading state to true immediately

    setImmediatSelectedId(id);
    setCategoryLoading(true);

    const params = new URLSearchParams();

    // Copy existing search params
    Object.entries(searchParams || {}).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });

    params.set("category", String(id));
    params.set("page", "1"); // reset pagination on category change

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
  };
  const { t } = useTranslation()
  const handleResetAll = () => {
    const params = new URLSearchParams();

    // لو تحب تبقي page=1 صراحة
    params.set("page", "1");

    router.push(`?${params.toString()}`, {
      scroll: false,
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
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={` absolute  ${currentLang == "ar" ? "right-4 " : "left-4"
              } z-30  text-subTitleColor p-3 rounded-lg shadow-lg hover:bg-blueSite/90 transition-all duration-300`}
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      <aside
        className={`${isMobile ? "absolute" : "relative"} w-[300px] mt-[6.5rem]  bg-white 2xl:w-[350px] rounded-lg
        transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar mb-[10px]
          ${isMobile
            ? (showMenu
              ? "translate-x-0 opacity-100 px-3"
              : (currentLang == "ar" ? "translate-x-full opacity-0" : "-translate-x-full opacity-0"))
            : "translate-x-0 opacity-100"
          }`}
        style={{
          position: isMobile ? "absolute" : "relative",
          zIndex: isMobile ? 30 : 10,
          height: isMobile ? "100%" : "auto",
          top: 0,
          ...(currentLang == "ar" ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
          transform: isMobile ? (showMenu ? "translateX(0)" : (currentLang == "ar" ? "translateX(100%)" : "translateX(-100%)")) : "translateX(0)"
        }}
      >
        {/* Header */}
        {/* Close Button - Only on screens < 1100px */}
        <div className="flex justify-end items-center p-3">

          {isMobile && (
            <button
              onClick={() => setShowMenu(false)}
              className={`text-subTitleColor hover:text-blueSite transition-colors`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex justify-between items-center p-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-subTitleColor">
            {t("filters.title")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleResetAll()}
              className="text-red-500 text-sm font-medium hover:underline"
            >
              {t("filters.reset_all")}
            </button>

          </div>
        </div>

        {!isProductsPage && (
          <FilterSection title=''>
            <div className='bg-bgGray p-3 rounded-md'>

              <CategorySearchBar />
              <div className="space-y-1 ">
                {categories.map((category) => (
                  <CategorySideItem
                    key={category.id}
                    category={category}
                    selectedId={String(immediateSelectedId)}
                    onSelect={(id) => {
                      handleSelectCategory(id);
                      if (isMobile) setShowMenu(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </FilterSection>
        )}

        <FilterSection title={t("product.responsibleSeller")} defaultOpen={true}>
          <div className='bg-bgGray p-3 rounded-md'>
            <ResponsibleSellerFilter />
          </div>
        </FilterSection>

        <FilterSection title={t("product.priceRange")} defaultOpen={false}>
          <div className='bg-bgGray p-3 rounded-md'>
            <PriceFilter />
          </div>
        </FilterSection>

        <FilterSection title={t("filters.rating")}>
          <div className='bg-bgGray p-3 rounded-md'>
            <RatingFilter />
          </div>
        </FilterSection>

        <FilterSection title={t("filters.promotions")} defaultOpen={true}>
          <div className='bg-bgGray p-3 rounded-md'>
           <PromotionsFilter />
          </div>
        </FilterSection>

        <FilterSection title={t("filters.attributes")} defaultOpen={true}>
          <div className='bg-bgGray p-3 rounded-md'>
            <AttributesFilter />
            </div>
        </FilterSection>

        {isMobile&&showMenu &&<div className="h-[580px]"></div>}
      </aside>
    </>
  );
};

export default CategoriesSideBar;
