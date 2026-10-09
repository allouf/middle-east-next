import React from 'react'
import { fetchProducts } from '../api/getProductsByCategory'
import { CategorySearchParams } from '../types/type';
import Pagination from '@/components/ui/Pagination';

import CategoryProductCard from './CategoryProductCard';
import FiltersHeader from './FilterHeader';
import { getT } from '@/lib/i18n/server';
import CategoriesContentClient from './CategoriesContentClient';




const CategoriesContent = async({searchParams, locale}:{searchParams:CategorySearchParams, locale: string}) => {

     const t = await getT(locale);
    console.log("search Params",searchParams)
    const page = Number(searchParams.page ?? 1);
    const search = searchParams.search ?? "";
    const min = Number(searchParams.min ?? 0);
    const max = Number(searchParams.max ?? 10000);
    const category = searchParams.category ?? "all";
    const rating = Number(searchParams.rating ?? 0);

    const seller = searchParams.seller; // "company" | "person"
    const sort = searchParams.sort;

    /* NEW */
    const promo = searchParams.promo?.split(",") ?? [];
    const attr = searchParams.attr?.split(",") ?? [];            // "available" | "best_seller" | ...



    console.log("category with content ",category)

const query = new URLSearchParams({
    paginate: "true",
    page: String(page),
  
    /* Search */
    ...(search && { "search": search }),
  
    /* Category */
    ...(category !== "all" && { "category_ids[]": category }),
  
    /* Price */
    ...(min > 0 && { min_price: String(min) }),
    ...(max < 10000 && { max_price: String(max) }),
  
    /* Rating */
    ...(rating > 0 && { rating: String(rating) }),
  
    /* Seller */
    ...(seller === "company" && { seller_type: "company" }),
    ...(seller === "person" && { seller_type: "person" }),
  
    /* Promotions */

  
    ...(promo.includes("sponsored") && { sponsored: "1" }),
    ...(promo.includes("sale") && { on_sale: "1" }),
  
    ...(attr.includes("available") && { available: "1" }),
    ...(attr.includes("unavailable") && { available: "0" }),
    ...(attr.includes("best_seller") && { best_seller: "1" }),
    ...(attr.includes("new_arrival") && { new_arrival: "1" }),
    ...(attr.includes("guaranteed") && { guaranteed: "1" }),
    ...(attr.includes("free_delivery") && { free_delivery: "1" }),
  
    /* Sorting */
    ...(sort === "popular" && { sort_by: "popularity" }),
    ...(sort === "price_asc" && { sort_by: "price",sort_order: "asc" }),
    ...(sort === "price_desc" && { sort_by: "price", sort_order: "desc" }),
    ...(sort === "newest" && { sort_by: "created_at", sort_order: "desc" }),
  }).toString();
  
    const productsRes = await fetchProducts(query, locale);


    const products = productsRes.products;
    const meta = productsRes?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      };
    // console.log("search params",searchParams)

    // console.log("categories content",productsRes) 

  return (
    <>
    <FiltersHeader results={products.length} sortOptions={[
    { value: "popular", label: t("filters.sort.most_popular") },
    { value: "price_asc", label: t("filters.sort.lowest_price") },
    { value: "price_desc", label: t("filters.sort.highest_price") },
    { value: "newest", label: t("filters.sort.newest") }
  ]}/>
    <CategoriesContentClient products={products} lastPage={meta.last_page} page={Number(searchParams.page)??1}/>
    </>
  )
}

export default CategoriesContent
