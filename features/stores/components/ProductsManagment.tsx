"use client";


import { useTranslation } from "@/lib/i18n/useTranslation";
import { Eye, Link, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BsStack } from "react-icons/bs";
import { fetchStoreProducts } from "../api";
import { PaginationMeta, StoreProduct } from "../types";
import CollapsedProduct from "./Product/CollapsedProduct";
import ProductRow from "./Product/ProductRow";
import { HiArrowSmallLeft, HiArrowSmallRight } from "react-icons/hi2";
import usePermissions from "@/lib/store/usePermissions";
import ProductsFilter from "./Product/ProductsFilter";

interface ProductsManagementProps {
  handleTabChange: (tab: string) => void;
}

const defaultMeta: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
};

const ProductsManagement: React.FC<ProductsManagementProps> = ({
  handleTabChange,
}) => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const id = params.id || "";
  const can = usePermissions((state) => state.can);
  const canCreate = can("products.create");
  const canUpdate = can("products.update");
  const canDelete = can("products.delete");
  const canManageStatus = canUpdate || can("products.pricing");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hasDiscount, setHasDiscount] = useState("");
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategoryId,
    selectedSubCategoryId,
    selectedStatus,
    debouncedSearch,
    minPrice,
    maxPrice,
    hasDiscount,
  ]);
  // Fetch products with dynamic filters
  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const categoryIds: (string | number)[] = [];
        if (selectedCategoryId) {
          categoryIds.push(selectedCategoryId);
        }
        if (selectedSubCategoryId) {
          categoryIds.push(selectedSubCategoryId);
        }
        const response = await fetchStoreProducts(id, {
          page,
          search: debouncedSearch.trim() || undefined,
          status: selectedStatus || undefined,
          categoryIds,
          min_price: minPrice || 0,
          max_price: maxPrice || undefined,
          has_discount: hasDiscount || undefined,
        });
        setProducts(response.products);
        setMeta(response.meta);
      } catch (err) {
        const errorMessage =
          (err as any).response?.data?.message ||
          (err as any).message ||
          "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      id,
      selectedCategoryId,
      selectedSubCategoryId,
      selectedStatus,
      debouncedSearch,
      minPrice,
      maxPrice,
      hasDiscount,
    ]
  );
  // Fetch products when filters or page change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    setCurrentPage(newPage);
  };
  const refetch = useCallback(
    (page = 1) => {
      setCurrentPage(page);
      fetchProducts(page);
    },
    [fetchProducts]
  );

  const stats = [
    {
      label: t("products.all"),
      value: meta.total,
      color: "#7965DB",
      icon: BsStack,
    },
    { label: t("products.new"), value: 12, color: "#56E8A7", icon: BsStack },
    { label: t("products.sale"), value: 8, color: "#00664F", icon: BsStack },
    { label: t("products.expired"), value: 2, color: "#BF2033", icon: BsStack },
  ];





  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Title + Search */}
        <div className="flex items-center gap-4 w-full md:w-2/3">
          <h1 className="text-[20px] font-semibold text-[#00664F]">{t("products.title")}</h1>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t("products.searchFor")}
              className="w-full bg-[#FAFAFA] rounded-[36px] px-4 py-2 text-sm outline-none placeholder-[#00664F] text-[#00664F]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        {canCreate && (
          <div className="flex gap-3 items-center mt-2 md:mt-0 w-full md:max-w-[15px] min-w-[150px]">
            <button
              className="bg-[#00664F] text-textWhiteColor w-full px-5 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#009a77] transition"
              onClick={() => handleTabChange("add_product")}
            >
              <Plus size={18} /> {t("products.add")}
            </button>
          </div>
        )}

        {/* <div className="flex flex-row gap-5">
          <Button 
          scale={1.03}
          unstyled
          className="px-6 py-2 rounded-md border border-textGrayColor text-[12px] font-bold flex flex-row gap-2 ">
           <CiImport className="text-blueSite text-[16px]"/> Import 
          </Button>
          <Button 
          scale={1.03}
          unstyled
          className="px-6 py-2 rounded-md border border-textGrayColor text-[12px] font-bold flex flex-row gap-2">
            <CiExport className="text-blueSite text-[16px]"/>  Export 
          </Button>

        </div> */}
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-[7px] shadow-sm flex items-center gap-3"
              style={{ backgroundColor: `${stat.color}10` }}
            >
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Icon size={22} color={stat.color} />
              </div>
              <div>
                <p className="font-medium text-subTitleColor">{stat.label}</p>
                <span
                  className="text-lg font-semibold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <ProductsFilter
        selectedCategoryId={selectedCategoryId}
        t={t}
        setSelectedCategoryId={setSelectedCategoryId}
        setSelectedSubCategoryId={setSelectedSubCategoryId}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        hasDiscount={hasDiscount}
        setHasDiscount={setHasDiscount}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">

      </div> */}
      {/* Products */}
      {loading ? (
        <p className="text-center text-textColor py-10">
          {t("products.loading")}
        </p>
      ) : error ? (
        <p className="text-center text-red-500 py-10">{error}</p>
      ) : isMobile ? (
        products.map((p) => (
          <CollapsedProduct
            key={p.id}
            product={p}
            refetch={refetch}
            canEdit={canUpdate}
            canDelete={canDelete}
          />
        ))
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md border p-5">
          <div className="flex justify-between pb-2 border-b">
            <div className="text-[18px] text-blueIcons">
              {t("products.all")}
            </div>
            <span className="text-[14px] text-blueIcons">
              {(meta.current_page - 1) * meta.per_page + 1} –{" "}
              {Math.min(meta.current_page * meta.per_page, meta.total)}{" "}
              {t("common.of")} {meta.total}
            </span>
          </div>
          <table className="w-full text-sm bg-white">
            <thead className="border-b [&_th]:p-3 [&_th]:text-blueIcons [&_th]:text-[14px] [&_th]:font-normal [&_th]:text-start">
              <tr>
                <th>{t("table.id")}</th>
                <th>{t("table.image")}</th>
                <th>{t("table.name")}</th>
                <th>{t("table.category")}</th>
                <th>{t("table.price")}</th>
                <th>{t("table.discount")}</th>
                <th>{t("table.quantity")}</th>
                <th>{t("table.status")}</th>
                <th className="!text-end">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((p, index) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    refetch={refetch}
                    handleTabChange={handleTabChange}
                    products={products}
                    currentIndex={index}
                    canEdit={canUpdate}
                    canDelete={canDelete}
                    canManageStatus={canManageStatus}
                    canCreate={canCreate}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-textColor">
                    {t("products.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center text-sm text-subTitleColor mt-4">
        <p className="text-[14px] text-blueIcons">
          {(meta.current_page - 1) * meta.per_page + 1} –{" "}
          {Math.min(meta.current_page * meta.per_page, meta.total)} of{" "}
          {meta.total}
        </p>
        <div className="flex items-center gap-2">
       
          <button
            className="size-8 text-[18px] flex justify-center items-center bg-blueIcons text-textWhiteColor border rounded-md disabled:opacity-45"
            disabled={meta.current_page === 1}
            onClick={() => handlePageChange(meta.current_page - 1)}
          >
            <HiArrowSmallLeft />
          </button>
          {/* {Array.from({ length: meta.last_page }).map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 border rounded-md ${
                meta.current_page === idx + 1
                  ? "bg-blueBtn text-textWhiteColor"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))} */}
          <button
            className="size-8 text-[18px] flex justify-center items-center bg-blueIcons text-textWhiteColor border rounded-md disabled:opacity-45"
            disabled={meta.current_page === meta.last_page}
            onClick={() => handlePageChange(meta.current_page + 1)}
          >
            <HiArrowSmallRight />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductsManagement;
