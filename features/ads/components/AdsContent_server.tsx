import React from 'react'
import AdsContent from './AdsContent'
import { AdSearchParams } from '../types/type';
import { fetchAds } from '../api/getAllAds';
import Pagination from '@/components/ui/Pagination';
import FiltersHeader from '@/features/category/components/FilterHeader';
import { ChevronDown, Eye, Package } from "lucide-react";
import { getT } from '@/lib/i18n/server';
import AdsFilterHeader from './AdsFilterHeader';

const AdsContent_server = async ({ searchParams, locale }: { searchParams: AdSearchParams; locale: string }) => {
  // Extract search parameters
  const page = Number(searchParams.page ?? 1);
  const rows = Number(searchParams.rows ?? 10);
  const search = searchParams.search ?? "";
  const min = Number(searchParams.min ?? 0);
  const max = Number(searchParams.max ?? 10000);
  const category = searchParams.category ?? "";
  const sub_category = searchParams.sub_category ?? "";

  const condition = searchParams.condition ?? "";
  const promo = searchParams.promo ?? "";
  const sort = searchParams.sort ?? "";
  const t = await getT(locale);
  // Build query string following CategoriesContent pattern
  const query = new URLSearchParams({
    paginate: "true",
    page: String(page),
    per_page: String(rows),


    /* Search */
    ...(search && { "search": search }),

    /* Category */
    ...(category && { "category_id": category }),
    ...(sub_category && { "subcategory_id": sub_category }),

    /* Price */
    ...(min > 0 && { min_price: String(min) }),
    ...(max < 10000 && { max_price: String(max) }),

    /* Condition */
    ...(condition && { "condition": condition }),

    /* Promotions */
    // ...(promo && { "promo": promo }),
    ...(promo === "free" && { "is_free": "1" }),
    ...(promo === "negotiable" && { "is_price_negotiable": "1" }),

    /* Sorting */
    ...(sort === "views_desc" && { sort: "most_viewed" }),
    ...(sort === "views_asc" && { sort: "least_viewed" }),
    ...(sort === "newest" && { sort: "newest_ads" }),
    ...(sort === "oldest" && { sort: "oldest" }),
    ...(sort === "price_asc" && { sort: "lowest_price" }),
    ...(sort === "price_desc" && { sort: "highest_price" }),
  }).toString();

  const sortOptions = [
    {
      value: "views_desc",
      label: t("filters.sort.most_viewed") || "Most viewed",
      icon: <Eye size={18} />,
    },
    {
      value: "views_asc",
      label: t("filters.sort.least_viewed") || "Least viewed",
      icon: <Eye size={18} />,
    },
    {
      value: "newest",
      label: t("filters.sort.newest") || "Newest ads",
      icon: <Package size={18} />,
    },
    {
      value: "price_asc",
      label: t("filters.sort.lowest_price") || "Lowest price",
      icon: <Package size={18} />,
    },
    {
      value: "price_desc",
      label: t("filters.sort.highest_price") || "Highest price",
      icon: <Package size={18} />,
    },
  ];

  // Fetch ads from API
  const adsRes = await fetchAds(query,locale);
  console.log("adds ss", adsRes)
  const ads = adsRes.ads;
  const meta = adsRes?.meta ?? {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };



  return (
    <div className="max-md:px-5">
      <AdsFilterHeader
        results={meta.total}
        sortOptions={sortOptions}
      />
      <AdsContent
        ads={ads}
        totalPages={meta.last_page}
        currentPage={meta.current_page}
        totalResults={meta.total}
        searchParams={searchParams}
      />

    </div>
  )
}

export default AdsContent_server