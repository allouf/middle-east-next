import React from 'react';
import ServicesContent from './ServicesContent';
import { ServiceSearchParams } from '../types/type';
import { Eye, Package, Star } from "lucide-react";
import { getT } from '@/lib/i18n/server';
import ServicesFilterHeader from './ServicesFilterHeader';
import { fetchServices } from '../api/getAllServices';

const ServicesContent_server = async ({ searchParams, locale }: { searchParams: ServiceSearchParams; locale: string }) => {
  const t = await getT(locale);
  
  // Extract search parameters
  const page = Number(searchParams.page ?? 1);
  const rows = Number(searchParams.rows ?? 10);
  const search = searchParams.search ?? "";
  const min = Number(searchParams.min ?? 0);
  const max = Number(searchParams.max ?? 10000);
  const category = searchParams.category ?? "";
  const sub_category = searchParams.sub_category ?? "";

  const rating = searchParams.rating ?? "";
  const service_type = searchParams.service_type ?? "";
  const sort = searchParams.sort ?? "";

  // Build query string
  const query = new URLSearchParams({
    // paginate: "true",
    page: String(page),
    per_page: String(rows),
    
    /* Search */
    ...(search && { "search": search }),

    /* Category */
    ...(category && category !== 'all' && { "category_id": category }),
   // ...(sub_category && { "subcategory_id": sub_category }),

    /* Price */
    ...(min > 0 && { min_price: String(min) }),
    ...(max < 10000 && { max_price: String(max) }),

    /* Rating */
    ...(rating && {min_rating: rating }),

    /* Service Type */
    ...(service_type && { type: service_type }),

    /* Sorting */
    ...(sort === "newest" && { sort: "newest" }),
    ...(sort === "oldest" && { sort: "oldest" }),
    ...(sort === "lowest_price" && { sort: "lowest_price" }),
    ...(sort === "highest_price" && { sort: "highest_price" }),
    ...(sort === "lowest_rate" && { sort: "lowest_rate" }),
    ...(sort === "highest_rate" && { sort: "highest_rate" }),
  }).toString();

  const sortOptions = [
    {
      value: "newest",
      label: t("filters.sort.newest") || "Newest",
      icon: <Package size={18} />,
    },
    {
      value: "oldest",
      label: t("filters.sort.oldest") || "Oldest",
      icon: <Package size={18} />,
    },
    {
      value: "lowest_price",
      label: t("filters.sort.lowest_price") || "Lowest Price",
      icon: <Package size={18} />,
    },
    {
      value: "highest_price",
      label: t("filters.sort.highest_price") || "Highest Price",
      icon: <Package size={18} />,
    },
    {
      value: "lowest_rate",
      label: t("filters.sort.lowest_rate") || "Lowest Rate",
      icon: <Star size={18} />,
    },
    {
      value: "highest_rate",
      label: t("filters.sort.highest_rate") || "Highest Rate",
      icon: <Star size={18} />,
    },
  ];

  // Fetch from API
  const { services: fetchResult, meta } = await fetchServices(query, locale);
  // console.log("fetchResult",fetchResult)
  const services = fetchResult.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: "",
    description: item.description,
    price: (item.price_from || 0).toString(),
    is_price_negotiable: false, 
    status: 'active',
    contact_method: 'both',
    show_phone: false,
    images: item.media && item.media.length > 0 ? item.media.map((m: any) => m.url) : (item.cover?.url ? [item.cover.url] : []),
    cover: item.cover || null,
    media: item.media || [],
    views_count: 0,
    published_at: item.created_at,
    is_owner: false,
    is_favorited: false,
    rating: item.rating || 0,
    delivery_model: item.delivery_model || null,
    delivery_time: item.delivery_time || null,
    user: {
      id: item.service_provider?.id,
      name: item.service_provider?.display_name || "Provider",
      photo: null,
    },
    country_code: item.service_provider?.country_code,
    category: {
      id: item.service_category?.id,
      name: item.service_category?.name,
      slug: item.service_category?.slug,
    },
    region: item.service_provider?.region,
    created_at: item.created_at,
    updated_at: item.created_at,
    service_type: item.type,
    provider_type: null,
  })) as any[];

  return (
    <div className="max-md:px-5">
      <ServicesFilterHeader
        results={meta.total}
        sortOptions={sortOptions}
      />
      <ServicesContent
        services={services}
        totalPages={meta.last_page}
        currentPage={meta.current_page}
        totalResults={meta.total}
        searchParams={searchParams}
      />
    </div>
  )
}

export default ServicesContent_server
