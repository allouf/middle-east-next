'use client';

import React, { useEffect, useState } from 'react'
import useGetData from '@/lib/api/useGetData';
import { PRODUCTS_ENDPOINT } from '@/shared/constants/urls';
import Pagination from '@/components/ui/Pagination';
import ProductSkeleton from "./ProductSkeleton";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  FlashSellCreateSecondStepProps,
  Product,
  ProductVariant,
  ProductsApiResponse,
  ProductDetailsApiResponse,
  PaginationMeta
} from '../../types/flashSell';

const FlashSellCreateSecondStep: React.FC<FlashSellCreateSecondStepProps> = ({ formData, toggleVariantSelection, params, handleAddError, errors, step, isSubmited }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | number | null>(null);

  const { data: resData, loading: loadingProducts } = useGetData({
    url: PRODUCTS_ENDPOINT.getByStore(params?.id || ""),
    paginate: true,
    page: currentPage,
    extraParams: {
      search
    }
  });
  const {
    data: productData,
    loading: loadingVariants,
    refetch: refetchDetails,
  } = useGetData({
    url: PRODUCTS_ENDPOINT.details(selectedProduct || 1),
    enabled: !!selectedProduct
  });
  const variants = productData?.data?.variants || [];
  const meta = resData?.data?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    has_more: false,
  } as PaginationMeta;
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // console.log("Products Data",resData)
  // console.log("productDetails",productData)


  useEffect(() => {
    if (resData)
      setProducts(resData?.data?.products)
  }, [resData, currentPage])
  useEffect(() => {
    if (resData?.data?.products?.length && !selectedProduct) {
      setSelectedProduct(resData.data.products[0].id);
    }
  }, [resData]);

  useEffect(() => {
    refetchDetails();
  }, [selectedProduct]);

  useEffect(() => {


    if ((!Array.isArray(formData.products) || formData.products.length === 0) && step >= 2) {
      handleAddError(
        "products",
        "You should select at least one product"
      );
    } else {
      handleAddError("products", "");
    }
  }, [formData, handleAddError])
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2  ">
        {/* Left: products */}
        <div className=" p-3">
          <div className="flex items-center gap-2 mb-2 bg-bgGray rounded-full mx-3 py-2 px-4 ">

            <input
              type="text"
              placeholder={t("flashSell.products.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm bg-transparent "
            />
            <Search className="w-4 h-4 text-textColor" />
          </div>

          {loadingProducts ? (
            <div className="max-h-[250px] overflow-auto px-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className=" max-h-[250px]  overflow-auto px-3 dropDown">
              {products.map((product: Product) => {

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`flex items-center gap-3 p-3 my-1 cursor-pointer  border-b ${Number(selectedProduct) === product.id
                      ? "border-blueSite bg-[#E6F0ED]"
                      : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >

                    <img
                      src={
                        product.gallery?.[0]?.file_path ||
                        "https://placehold.co/40x40?text=P"
                      }
                      alt={product.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">
                      {product.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={meta.last_page} onPageChange={handlePageChange} />
        </div>

        {/* Right: variants */}
        <div className="p-4 border-s-2">
          <h3 className="text-[20px] 2xl:text-[22px] font-semibold mb-4 text-subTitleColor">
            {t("flashSell.products.variantsTitle")}
          </h3>

          {loadingVariants ? (
            <p>{t("flashSell.products.loadingVariants")}</p>
          ) : selectedProduct && variants.length > 0 ? (

            <div className="w-full">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100 [&_th]:p-2 [&_th]:text-start">
                    <th className="w-10">{t("flashSell.table.select")}</th>
                    <th>{t("flashSell.table.variant")}</th>
                    <th className="whitespace-nowrap">{t("flashSell.table.price")}</th>
                    <th className="whitespace-nowrap">{t("flashSell.table.quantity")}</th>
                  </tr>
                </thead>

                <tbody className="[&_td]:p-2 [&_td]:text-start">
                  {variants.map((variant: ProductVariant) => {
                    const isChecked = formData.products
                      ?.find((p) => p.product_id === selectedProduct)
                      ?.variants.includes(variant.id);

                    return (
                      <tr key={variant.id} className="border-b hover:bg-gray-50">
                        <td className="w-10">
                          <input
                            type="checkbox"
                            checked={!!isChecked}
                            onChange={toggleVariantSelection(
                              selectedProduct,
                              variant,
                              productData?.data?.name
                            )}
                          />
                        </td>

                        {/* ✅ لا تضع flex على td */}
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {variant.option_values?.map((v, index) => (
                              <span key={index} className="inline-flex items-center">
                                <span className="bg-blueLight text-subTitleColor text-xs px-2 py-1 rounded-md">
                                  {v.value}
                                </span>
                                {index < (variant.option_values?.length ?? 0) - 1 && (
                                  <span className="mx-1 text-gray-400">/</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* أرقام: الأفضل تكون end (يمين في EN / يسار في AR) */}
                        <td className="text-end whitespace-nowrap">${variant.price}</td>
                        <td className="text-end whitespace-nowrap">{variant.stock}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          ) : (
            <p className="text-textColor text-sm">
              {selectedProduct
                ? t("flashSell.products.noVariants")
                : t("flashSell.products.selectProduct")}
            </p>
          )}
        </div>
        {errors["products"] && isSubmited &&
          <p className="text-red-500 text-xs mt-1">
            {errors["products"] || t("errorRequired")}
          </p>}
      </div>

    </div>
  )
}

export default FlashSellCreateSecondStep
