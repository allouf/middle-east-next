import React, { Suspense } from 'react';
import Image from 'next/image';

import BestSellers from "./BestSellers";
import ProductRate from "../../../components/cards/product/ProductRate";

import DiscountedProducts from "./DiscountedProducts";
import SuggestedProducts from "./suggestedProducts";
import Breadcrumb from "@/features/stores/components/ProductDetails/Breadcrumb";
import { USER_STORES_ENDPOINT } from "@/shared/constants/urls";
import LoaderPage from "@/components/shared/LoaderPage";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import AddTickets from "@/features/stores/components/SupportTckets/AddTickets";
import { StoreDetailsResponse, Store, SocialLinks } from "../types/type";
import StoreDescription from "./StoreDescription";
import PopularCategories from "./PopularCategories";
import StoreBreadCrumb from './StoreBreadCrumb';
import PopularCategories_srver from './PopularCategories_srver';
import BestSellers_server from './BestSellers_server';
import DiscountProducts_server from './DiscountProducts_server';
import SuggestedProducts_server from './SuggestedProducts_server';
import HeaderHome from '@/components/shared/HeaderHome';
import { useTranslation } from "@/lib/i18n/useTranslation";
import StoreImage from './StoreImage';
import StorePolices_info from "./StorePolices_info"
import { getT } from '@/lib/i18n/server';





interface StoreUserDetailsProps {
  storeId: string;
  locale?: string;
  data: StoreDetailsResponse
  searchParams?: { Details?: string }
}

const StoreUserDetails = async ({ storeId, data, searchParams, locale }: StoreUserDetailsProps) => {
   const t = await getT(locale);


  // Extract store data from API response with proper typing
  const store: Store = data?.data?.store || {} as Store;
  const returnPolicy = data?.data?.return_policy || "";
  const shippingPolicy = data?.data?.shipping_policy || "";
  // Get store data with fallbacks
  const storeName = store.name || t("store.defaultName");
  const storeLogo = store.logo || null;
  const storeCover = store.cover || null;
  const storeDescription = store.description || "";
  const storeRating = store.rating || 0;
  const storePhones = store.phones || [];
  const storeEmails = store.emails || [];
  const socialLinks: SocialLinks = store.social_links || {};
  const storeCategories = store.categories || [];
  const descriptionText = storeDescription || t("store.noDescription");

  // Get services/categories as a string for the header
  const services = storeCategories.length > 0
    ? storeCategories.slice(0, 4).map((cat) => cat.name).join(" • ")
    : t("store.defaultCategory");


  console.log("store Data ", data)

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image Header */}
      <div className="relative w-full sm:h-56 h-[100px] bg-gray-100 flex items-center justify-center">
        <StoreImage
          src={storeCover}
          alt="cover"
          fallbackType="cover"
          storeName={storeName}
        />
      </div>
      {/* Main Content */}
      <div className=" mx-auto md:px-12 px-4 pt-8 pb-24">
        {/* Store Profile Section */}
        <div className="flex flex-row justify-between bg-white rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Left: Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-blueIcons overflow-hidden bg-gray-200 flex items-center justify-center">
                <StoreImage
                  src={storeLogo}
                  alt={storeName}
                  fallbackType="logo"
                  storeName={storeName}
                />
              </div>
            </div>
            {/* Right: Store Info */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-subTitleColor mb-3">
                {storeName}
              </h2>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-start text-yellow-400 mt-1">
                  <ProductRate rating={storeRating} size={28} isDark={true} hideText />
                </div>
                <span className="text-textColor text-md">
                  ({storeRating})
                </span>
              </div>
            </div>
            {/* Description */}
          </div>
          {/* <div>
            <AddTickets store_id={storeId} />
          </div> */}
        </div>
        {searchParams?.Details == "true" && (
          <StoreBreadCrumb storeId={storeId} />
        )}
        {/* Description & Contact Methods */}
        <StoreDescription
          descriptionText={storeDescription || ""}
          storePhones={storePhones || []}
          storeEmails={storeEmails || []}
          socialLinks={socialLinks || {}}
          storeWebsite={store.website}
          storeId={storeId}

        />
        {/* Popular Categories Section */}
        {searchParams?.Details === "true" ? (
          <StorePolices_info shippingPolicy={shippingPolicy} returnPolicy={returnPolicy} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
            <Suspense fallback={
              <section className="py-10">
                <div className="mx-auto">
                  <HeaderHome text={t("popularCategories.title")} url="#" />
                  <div className="container mx-auto">
                    <LoaderPage type="categories" count={8} />
                  </div>
                </div>
              </section>
            }>
              <PopularCategories_srver storeId={storeId} locale={locale} />
            </Suspense>
            <Suspense fallback={
              <section className="py-10">
                <div className="mx-auto">
                  <HeaderHome text={t("bestSellers.title")} url="#" />
                  <div className="container mx-auto">
                    <LoaderPage type="products" count={8} />
                  </div>
                </div>
              </section>
            }>
              <BestSellers_server storeId={storeId} locale={locale} />
            </Suspense>
            <Suspense fallback={
              <section className="py-10">
                <div className="mx-auto">
                  <HeaderHome text={t("discountProducts.title")} url="#" />
                  <div className="container mx-auto">
                    <LoaderPage type="products" count={8} />
                  </div>
                </div>
              </section>
            }>
              <DiscountProducts_server storeId={storeId} locale={locale} />
            </Suspense>
            <Suspense fallback={
              <section className="py-10">
                <div className="mx-auto">
                  <HeaderHome text={t("suggestedProducts.title")} url="#" />
                  <div className="container mx-auto">
                    <LoaderPage type="products" count={8} />
                  </div>
                </div>
              </section>
            }>
              <SuggestedProducts_server storeId={storeId} locale={locale} />
            </Suspense>



          </div>
        )}
      </div>
    </div>
  );
};
export default StoreUserDetails;
