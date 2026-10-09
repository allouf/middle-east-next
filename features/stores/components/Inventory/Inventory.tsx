"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { IoEyeOutline, IoSearchOutline } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import useGetData from "@/lib/api/useGetData";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import { useTranslation } from "@/lib/i18n/useTranslation";

type InventoryVariant = {
  id: string;
  label: string;
  sku: string;
  stock: number | string;
  lowStock: number | string;
  image?: string;
  status?: string;
};

type InventoryProduct = {
  key: string;
  code?: string;
  name: string;
  image?: string;
  variants: InventoryVariant[];
};

const normalizeString = (value: any) =>
  value === null || value === undefined ? "" : String(value).toLowerCase();

const extractImage = (source: any): string | undefined => {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  if (Array.isArray(source)) return extractImage(source[0]);
  if (typeof source === "object") {
    return (
      source.url ||
      source.image ||
      source.thumbnail ||
      source.path ||
      source.preview ||
      undefined
    );
  }
  return undefined;
};

const getStatusBadgeClass = (status?: string) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("inactive") || normalized.includes("disabled")) {
    return "bg-red-50 text-[#C2410C]";
  }
  if (normalized.includes("pending") || normalized.includes("low")) {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#E3F5EE] text-[#0B7A56]";
};

const formatOptionText = (optionValues: any): string => {
  if (!optionValues) return "-";
  if (typeof optionValues === "string" || typeof optionValues === "number") {
    return String(optionValues);
  }
  if (Array.isArray(optionValues)) {
    const text = optionValues
      .map((opt: any) => {
        if (typeof opt === "string" || typeof opt === "number")
          return String(opt);
        if (typeof opt === "object" && opt) {
          return (
            opt.value ||
            opt.name ||
            opt.label ||
            opt.option ||
            opt.title ||
            opt.id ||
            ""
          );
        }
        return "";
      })
      .filter(Boolean)
      .join(" / ");
    return text || "-";
  }
  if (typeof optionValues === "object") {
    return Object.values(optionValues)
      .map((val) => String(val))
      .join(" / ");
  }
  return "-";
};

const mapVariant = (variant: any, idx: number): InventoryVariant => {
  const optionValues =
    variant?.option_values ||
    variant?.options ||
    variant?.attributes ||
    variant?.variation ||
    variant?.values;

  const stockValue =
    variant?.stock ??
    variant?.quantity ??
    variant?.available_stock ??
    variant?.availableQty ??
    variant?.available_qty ??
    variant?.inventory ??
    variant?.qty;

  const lowStockValue =
    variant?.low_stock_threshold ??
    variant?.low_stock ??
    variant?.low_stock_limit ??
    variant?.low_stock_quantity ??
    variant?.low_stock_qty ??
    variant?.low_stock_warning ??
    variant?.min_qty;

  const statusValue =
    variant?.status === true
      ? "Active"
      : variant?.status === false
      ? "Inactive"
      : variant?.status ||
        variant?.state ||
        variant?.activation_status ||
        variant?.stock_status ||
        "Active";

  return {
    id: String(variant?.id ?? variant?.sku ?? idx),
    label:
      formatOptionText(optionValues) ||
      formatOptionText(variant?.variant) ||
      formatOptionText(variant?.name) ||
      String(variant?.sku || variant?.id || `Variant ${idx + 1}`),
    sku: String(
      variant?.sku ||
        variant?.code ||
        variant?.barcode ||
        variant?.identifier ||
        variant?.id ||
        "-"
    ),
    stock:
      typeof stockValue === "number" || typeof stockValue === "string"
        ? stockValue
        : "-",
    lowStock:
      typeof lowStockValue === "number" || typeof lowStockValue === "string"
        ? lowStockValue
        : "-",
    image:
      extractImage(variant?.image) ||
      extractImage(variant?.thumbnail) ||
      extractImage(variant?.gallery) ||
      extractImage(variant?.media),
    status: statusValue,
  };
};

const extractArray = (source: any): any[] => {
  if (!source) return [];
  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.data)) return source.data;
  if (Array.isArray(source?.items)) return source.items;
  if (Array.isArray(source?.records)) return source.records;
  return [];
};

const pickArray = (...candidates: any[]): any[] => {
  for (const candidate of candidates) {
    const arrayCandidate = extractArray(candidate);
    if (arrayCandidate.length) return arrayCandidate;
  }
  return [];
};

const mapInventoryData = (response: any): InventoryProduct[] => {
  const payload = response?.data ?? response;
  const rawList =
    pickArray(
      payload?.inventory,
      payload?.items,
      payload?.data,
      payload?.products,
      payload
    ) || [];

  const grouped = new Map<string, InventoryProduct>();

  rawList.forEach((item: any, idx: number) => {
    const baseProduct = item?.product || item;
    const productId =
      item?.product_id ||
      item?.productId ||
      baseProduct?.id ||
      item?.id ||
      `product-${idx}`;

    const productName =
      baseProduct?.name ||
      item?.product_name ||
      item?.name ||
      `Product ${idx + 1}`;

    const productSku = baseProduct?.sku || item?.sku || baseProduct?.code;

    const productImage =
      extractImage(baseProduct?.image) ||
      extractImage(baseProduct?.thumbnail) ||
      extractImage(item?.image) ||
      extractImage(item?.thumbnail);

    const existing = grouped.get(String(productId));

    const current: InventoryProduct = existing || {
      key: String(productId),
      code: productSku,
      name: productName,
      image: productImage,
      variants: [],
    };

    if (!current.image && productImage) current.image = productImage;
    if (!current.code && productSku) current.code = productSku;
    if (productName && current.name.startsWith("Product "))
      current.name = productName;

    const variantCandidates = pickArray(
      item?.variants,
      item?.items,
      item?.inventory,
      item?.stocks
    );

    if (variantCandidates.length) {
      variantCandidates.forEach((variant: any, variantIdx: number) => {
        current.variants.push(mapVariant(variant, variantIdx));
      });
    } else {
      current.variants.push(mapVariant(item, idx));
    }

    grouped.set(String(productId), current);
  });

  return Array.from(grouped.values());
};

const Inventory = () => {
  const { t } = useTranslation();
  const params = useParams<{ id?: string }>();
  const storeId = params?.id || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, loading, error } = useGetData({
    url: storeId ? STORE_ENDPOINT.getItems(storeId) : "",
    paginate: true,
    page,
    search: searchTerm,
    extraParams: { per_page: pageSize },
    enabled: Boolean(storeId),
  });

  const payload = useMemo(() => data?.data ?? data, [data]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, pageSize, storeId]);

  const mappedProducts = useMemo(() => mapInventoryData(payload), [payload]);

  useEffect(() => {
    if (!mappedProducts.length) {
      setExpandedId(null);
      return;
    }
    if (!expandedId || !mappedProducts.find((p) => p.key === expandedId)) {
      setExpandedId(mappedProducts[0]?.key ?? null);
    }
  }, [mappedProducts, expandedId]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return mappedProducts;
    const term = searchTerm.toLowerCase();
    return mappedProducts.filter((product) => {
      const matchesProduct =
        normalizeString(product.name).includes(term) ||
        normalizeString(product.code).includes(term);
      const matchesVariant = (product.variants || []).some((variant) => {
        return (
          normalizeString(variant.label).includes(term) ||
          normalizeString(variant.sku).includes(term)
        );
      });
      return matchesProduct || matchesVariant;
    });
  }, [mappedProducts, searchTerm]);

  const hasServerMeta =
    payload?.meta ||
    payload?.inventory?.meta ||
    payload?.data?.meta ||
    payload?.items?.meta ||
    payload?.products?.meta;

  const meta = useMemo(() => {
    const metaCandidate =
      payload?.meta ||
      payload?.inventory?.meta ||
      payload?.data?.meta ||
      payload?.items?.meta ||
      payload?.products?.meta ||
      {};

    return {
      current_page:
        metaCandidate.current_page ||
        metaCandidate.currentPage ||
        metaCandidate.page ||
        page,
      per_page: metaCandidate.per_page || metaCandidate.perPage || pageSize,
      total:
        metaCandidate.total ??
        metaCandidate.count ??
        (hasServerMeta ? filteredProducts.length : filteredProducts.length),
    };
  }, [filteredProducts.length, hasServerMeta, page, pageSize, payload]);

  const totalRows = meta.total ?? filteredProducts.length;
  const effectivePageSize = meta.per_page || pageSize || 10;
  const currentPage = meta.current_page || page;
  const totalPages = effectivePageSize
    ? Math.max(1, Math.ceil(totalRows / effectivePageSize))
    : 1;

  const displayProducts = useMemo(() => {
    if (hasServerMeta) return filteredProducts;
    const startIndex = (page - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, hasServerMeta, page, pageSize]);

  useEffect(() => {
    if (!hasServerMeta) {
      const computedPages = Math.max(
        1,
        Math.ceil((filteredProducts.length || 1) / effectivePageSize)
      );
      if (page > computedPages) {
        setPage(computedPages);
      }
    }
  }, [effectivePageSize, filteredProducts.length, hasServerMeta, page]);

  const startRow = totalRows ? (currentPage - 1) * effectivePageSize + 1 : 0;
  const endRow = totalRows
    ? Math.min(currentPage * effectivePageSize, totalRows)
    : 0;

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-10 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl sm:text-xl font-semibold text-blueSite">
          {t("store_management.inventory.title")}
        </h2>
        <div className="w-full sm:w-80">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-blueSite text-xl" />
            <input
              type="text"
              placeholder={t("store_management.inventory.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[46px] rounded-full !border-none bg-[#F7FBFA] !shadow-none px-4 pl-10 text-[14px] text-blueSite outline-none transition placeholder-blueSite"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-blueSite text-[16px] font-semibold border-b-2 border-blueSite pb-2">
        <span>{t("store_management.inventory.allProducts")}</span>
        <span className="text-sm font-medium">
          {startRow} - {endRow} of {totalRows || 0}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !mappedProducts.length ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[70px] w-full animate-pulse rounded-2xl border border-[#E0E7E4] bg-[#F4F8F6]"
            />
          ))}
        </div>
      ) : null}

      <div className="space-y-3">
        {displayProducts.map((product) => {
          const isExpanded = expandedId === product.key;
          const variantsToRender = Array.isArray(product.variants)
            ? product.variants
            : [];
          return (
            <div
              key={product.key}
              className="rounded-2xl border border-[#E0E7E4] bg-white shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => !isExpanded && handleToggle(product.key)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 transition-colors ${
                  isExpanded
                    ? "bg-blueSite text-white"
                    : "bg-white text-blueSite"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span
                    className={`text-lg font-semibold ${
                      isExpanded ? "text-white" : "text-blueSite"
                    }`}
                  >
                    {product.code || product.key}
                  </span>
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/60 bg-white/80">
                    <img
                      src={product.image || "/defaulLogo.png"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    className={`truncate text-left text-base sm:text-lg font-semibold ${
                      isExpanded ? "text-white" : "text-blueSite"
                    }`}
                  >
                    {product.name}
                  </div>
                </div>
                <IoEyeOutline
                  className={`text-xl ${
                    isExpanded ? "text-white" : "text-blueSite"
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="bg-[#F4FAF7] px-4 pb-4 pt-3 sm:px-6">
                  <div className="grid grid-cols-6 items-center gap-4 border-b border-[#E3F0EB] pb-3 text-[13px] font-semibold text-blueSite">
                    <span>{t("store_management.inventory.table.variants")}</span>
                    <span>{t("store_management.inventory.table.sku")}</span>
                    <span>{t("store_management.inventory.table.stock")}</span>
                    <span>{t("store_management.inventory.table.lowStock")}</span>
                    <span>{t("store_management.inventory.table.image")}</span>
                    <span>{t("store_management.inventory.table.status")}</span>
                  </div>

                  {variantsToRender.length ? (
                    variantsToRender.map((variant) => (
                      <div
                        key={variant.id}
                        className="grid grid-cols-6 items-center gap-4 border-b border-[#E3F0EB] py-3 last:border-b-0 text-[14px]"
                      >
                        <span className="truncate text-[#374151]">
                          {variant.label || "-"}
                        </span>
                        <span className="font-semibold text-[#111827]">
                          {variant.sku || "-"}
                        </span>
                        <span className="text-[#111827]">
                          {variant.stock ?? "-"}
                        </span>
                        <span className="text-[#111827]">
                          {variant.lowStock ?? "-"}
                        </span>
                        <div className="flex items-center">
                          <div className="h-9 w-9 overflow-hidden rounded-full border border-[#E0E7E4] bg-white">
                            <img
                              src={variant.image || "/defaulLogo.png"}
                              alt={variant.label || "variant image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center justify-center rounded-md px-3 py-[6px] text-[12px] font-semibold ${getStatusBadgeClass(
                              variant.status
                            )}`}
                          >
                            {variant.status || "Active"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-sm text-[#6B7280]">
                      {t("store_management.inventory.noVariants")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!loading && !displayProducts.length ? (
          <div className="rounded-xl border border-[#E0E7E4] bg-[#F7FBFA] px-4 py-6 text-center text-sm text-[#6B7280]">
            {t("store_management.inventory.noProducts")}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-blueSite text-sm font-medium">
        <span>
          {startRow} - {endRow} of {totalRows || 0}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span>{t("store_management.inventory.rowsPerPage")}:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-9 rounded-md border border-[#E0E7E4] bg-white px-2 text-[#111827] outline-none focus:border-blueSite focus:ring-2 focus:ring-blueSite/15"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage <= 1 || loading}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E0E7E4] bg-white text-blueSite transition hover:bg-[#F4F8F6] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("store_management.inventory.previousPage")}
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= totalPages || loading}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E0E7E4] bg-white text-blueSite transition hover:bg-[#F4F8F6] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("store_management.inventory.nextPage")}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
