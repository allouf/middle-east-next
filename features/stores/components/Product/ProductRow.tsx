"use client";

import useGetData from "@/lib/api/useGetData";
import { PRODUCTS_ENDPOINT, STORE_ENDPOINT } from "@/shared/constants/urls";
import { Eye, LucideUserX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SVGProps, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GrCopy } from "react-icons/gr";
import Modal from "../../../../components/ui/Modal";
import api from "../../../../lib/api";
import usePostData from "../../../../lib/api/usePostData";
import { StoreProduct } from "../../types";
import { message } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Image from "next/image";
import { EyeFilled } from "@ant-design/icons";
import Link from "next/link";

// Custom icons from provided SVGs
const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.0634 0.905167C10.8931 0.735573 10.6909 0.601406 10.4684 0.510416C10.2459 0.419425 10.0077 0.373415 9.76731 0.375042C9.52697 0.376669 9.28932 0.425901 9.06811 0.519895C8.8469 0.61389 8.64651 0.750782 8.4785 0.922667L1.6159 7.78537C1.36245 8.03883 1.18176 8.35574 1.09276 8.70296L0.511569 10.9703C0.436061 11.2649 0.703861 11.5326 0.998419 11.4571L3.26589 10.8755C3.61301 10.7865 3.92983 10.6058 4.18323 10.3524L11.0459 3.48963C11.2178 3.3217 11.3548 3.12135 11.4488 2.90017C11.5428 2.679 11.5921 2.44137 11.5937 2.20105C11.5953 1.96072 11.5493 1.72245 11.4583 1.50002C11.3673 1.27759 11.2331 1.07541 11.0634 0.905167Z"
      fill="#00664F"
      stroke="#00664F"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.7538 11.2168C10.7186 11.742 10.2823 12.1499 9.75602 12.1499H3.4471C2.92081 12.1499 2.48459 11.742 2.44934 11.2169L1.88281 2.77539H11.3196L10.7538 11.2168Z"
      fill="#BF2033"
      stroke="#BF2033"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.601562 2.77734H12.6016"
      stroke="#BF2033"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.12604 0.599609H5.06667C4.7962 0.599609 4.53681 0.714214 4.34556 0.918212C4.15432 1.12221 4.04688 1.39889 4.04688 1.68739V2.77516H9.14583V1.68739C9.14583 1.39889 9.03839 1.12221 8.84714 0.918212C8.65589 0.714214 8.3965 0.599609 8.12604 0.599609Z"
      stroke="#BF2033"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ProductRowProps {
  product: StoreProduct;
  refetch: (page?: number) => void;
  handleTabChange: (tab: string) => void;
  products: StoreProduct[];
  currentIndex: number;
  canEdit?: boolean;
  canDelete?: boolean;
  canManageStatus?: boolean;
  canCreate?: boolean;
}

const ProductRow = ({
  product,
  refetch,
  handleTabChange,
  products = [],
  currentIndex = 0,
  canEdit = true,
  canDelete = true,
  canManageStatus = true,
  canCreate = true,
}: ProductRowProps) => {
  const { t } = useTranslation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productStatus, setProductStatus] = useState(product.status);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Fetch full product details
  const { data: productData, loading } = useGetData({
    url: PRODUCTS_ENDPOINT.details(product.id),
  });

  // Update product status when data is fetched
  useEffect(() => {
    if (productData?.data?.status) {
      setProductStatus(productData.data.status);
    }
  }, [productData]);

  // Fetch store data for edit modal
  const { data: storeData } = useGetData({
    url: productData?.data?.store_id
      ? STORE_ENDPOINT.getStoreDetails(productData.data.store_id)
      : undefined,
  });

  const {
    postData,
    loading: posting,
    error,
  } = usePostData(PRODUCTS_ENDPOINT.switchActivation(product.id));
  const { postData: dublicate, loading: dublicating } = usePostData(
    PRODUCTS_ENDPOINT.dublicate(product.id)
  );

  const addSearchParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams); // clone current ones
    newParams.set(key, value);
    newParams.set("tab", "update_product"); // add or update
    replace(`${pathname}?${newParams.toString()}`);
  };

  // useEffect(() => {
  //   console.log("product Details", productData);
  // }, [productData]);

  // ✅ Delete handler
  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      await api.delete(PRODUCTS_ENDPOINT.deleteProduct(product.id));
      message.success("Product deleted successfully!");
      setDeleteDialog(false);
      refetch?.();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to delete product"
      );
    }
  };

  const handleDublicate = async () => {
    if (!canCreate) return;
    try {
      dublicate(
        {},
        {
          onSuccess: () => {
            refetch?.();
          },
        }
      );
      // toast.success("Product Dublicated successfully!");
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to delete product"
      );
    }
  };

  const handleSwitchActivation = () => {
    if (!canManageStatus) return;
    // const payload = {
    //   is_active:productStatus
    // }
    postData(
      {},
      {
        onSuccess: () => {
          setProductStatus((prev) =>
            prev === "active" ? "inactive" : "active"
          );
        },
      }
    );
  };

  const handleEdit = () => {
    if (!canEdit) return;
    setCurrentImageIndex(0); // Reset image index when opening modal
    setShowEditModal(true);
  };

  const handleEditNavigate = () => {
    if (!canEdit) return;
    addSearchParam("ID", `${product.id}`);
    setShowEditModal(false);
  };

  const handleDeleteFromModal = async () => {
    if (!canDelete) return;
    try {
      await api.delete(PRODUCTS_ENDPOINT.deleteProduct(product.id));
      message.success("Product deleted successfully!");
      setShowEditModal(false);
      setDeleteDialog(false);
      refetch?.();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to delete product"
      );
    }
  };

  // Navigation between products in edit modal
  const totalProducts = products.length || 1;
  const currentProductIndex = products.findIndex((p) => p.id === product.id);
  const canGoPrev = currentProductIndex > 0;
  const canGoNext =
    currentProductIndex < totalProducts - 1 && currentProductIndex >= 0;

  const handlePrevProduct = () => {
    if (canGoPrev) {
      setShowEditModal(false);
      // Scroll to previous product row and trigger its edit
      setTimeout(() => {
        const prevProductId = products[currentProductIndex - 1].id;
        const prevRow = document.querySelector(
          `[data-product-id="${prevProductId}"]`
        );
        if (prevRow) {
          prevRow.scrollIntoView({ behavior: "smooth", block: "center" });
          // Trigger click on edit button of previous product
          const editButton = prevRow.querySelector(
            "[data-edit-button]"
          ) as HTMLButtonElement;
          if (editButton) {
            editButton.click();
          }
        }
      }, 100);
    }
  };

  const handleNextProduct = () => {
    if (canGoNext) {
      setShowEditModal(false);
      // Scroll to next product row and trigger its edit
      setTimeout(() => {
        const nextProductId = products[currentProductIndex + 1].id;
        const nextRow = document.querySelector(
          `[data-product-id="${nextProductId}"]`
        );
        if (nextRow) {
          nextRow.scrollIntoView({ behavior: "smooth", block: "center" });
          // Trigger click on edit button of next product
          const editButton = nextRow.querySelector(
            "[data-edit-button]"
          ) as HTMLButtonElement;
          if (editButton) {
            editButton.click();
          }
        }
      }, 100);
    }
  };

  // Edit Modal Component
  const editProductModal = () => {
    if (loading || !productData?.data) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-subTitleColor">{t("products.loadingDetails")}</div>
          </div>
        </div>
      );
    }

    const {
      id,
      store_id,
      name,
      description,
      price,
      status,
      gallery = [],
      variants = [],
      options = [],
      store = {},
      category = {},
      specifications = "",
      additional_features = [],
    } = productData.data;

    const galleryImages = Array.isArray(gallery) ? gallery : [];
    const totalImages = galleryImages.length;

    // Get image URL
    const getImageUrl = (image: string | { file_path: string }) => {
      if (typeof image === "string") {
        return image;
      }
      if (image?.file_path) {
        return image.file_path;
      }
      return "/defaulLogo.png";
    };

    const currentImage = galleryImages[currentImageIndex];
    const currentImageUrl = currentImage
      ? getImageUrl(currentImage)
      : "/defaulLogo.png";

    const nextImage = () => {
      if (totalImages > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
      }
    };

    const prevImage = () => {
      if (totalImages > 0) {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
      }
    };

    const storeName = storeData?.data?.name || store?.name || "Company name";

    // Get option values for display
    const getOptionValues = () => {
      if (!options || !Array.isArray(options) || options.length === 0)
        return [];
      return options
        .filter((opt) => opt && opt.name)
        .map((opt) => ({
          name: opt.name,
          values: Array.isArray(opt.values)
            ? opt.values
              .filter((v: any) => v != null)
              .map((v: any) =>
                typeof v === "object" && v.value ? v.value : v
              )
            : [],
        }));
    };

    // Calculate price
    const calculatePrice = () => {
      if (variants && variants.length > 0) {
        const prices = variants.map((v: any) => parseFloat(v.price) || 0);
        return Math.min(...prices);
      }
      return parseFloat(price) || 0;
    };

    const displayPrice = calculatePrice();

    // Calculate total stock
    const totalStock =
      variants && variants.length > 0
        ? variants.reduce(
          (sum: number, v: any) => sum + (parseInt(v.stock) || 0),
          0
        )
        : 0;

    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Navigation Header */}
          {totalProducts > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <span className="text-sm font-normal text-subTitleColor">
                {String(currentProductIndex + 1).padStart(2, "0")}{" "}
                <span className="text-[#338572]">
                  {t("common.of")} {String(totalProducts).padStart(2, "0")}
                </span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevProduct}
                  disabled={!canGoPrev}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-blueSite text-blueSite bg-white hover:bg-[#E6F0ED] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous product"
                >
                  <FaArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNextProduct}
                  disabled={!canGoNext}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blueSite text-textWhiteColor hover:bg-[#338572] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next product"
                >
                  <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Modal Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Section - Images */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
              <div className="p-4 space-y-4 flex flex-col flex-1 overflow-y-auto">
                {/* Image Thumbnails */}
                {totalImages > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {galleryImages.map((img, idx) => {
                      const isActive = idx === currentImageIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-24 h-16 flex-shrink-0 border transition-all bg-white shadow-sm ${isActive
                            ? "border-blueSite ring-2 ring-blue-100 shadow-md"
                            : "border-gray-200 hover:border-blueSite/60"
                            }`}
                        >
                          <img
                            src={getImageUrl(img)}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex-1">
                  {totalImages > 0 ? (
                    <div className="aspect-square">
                      <img
                        src={currentImageUrl}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center text-textColor">
                      No images available
                    </div>
                  )}
                </div>

                {/* Navigation and Counter */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-subTitleColor">
                    {String(currentImageIndex + 1).padStart(2, "0")}{" "}
                    <span className="text-[#338572]">
                      of {String(totalImages).padStart(2, "0")}
                    </span>
                  </span>

                  {totalImages > 1 && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={prevImage}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-blueSite text-blueSite bg-white hover:bg-[#E6F0ED] transition"
                        aria-label="Previous image"
                      >
                        <FaArrowLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blueSite text-textWhiteColor hover:bg-[#004838] transition"
                        aria-label="Next image"
                      >
                        <FaArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 bg-white flex flex-col gap-3">
                <button
                  onClick={handleEditNavigate}
                  className="w-full bg-blueSite hover:bg-[#004838] text-textWhiteColor font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {t("products.editProduct")}
                </button>
                <button
                  onClick={handleSwitchActivation}
                  disabled={posting}
                  className="w-full border-2 border-blueSite text-blueSite font-semibold py-3 px-6 rounded-lg hover:bg-[#E6F0ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {productStatus === "active"
                    ? t("products.productDisablement")
                    : t("products.productEnablement")}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setDeleteDialog(true);
                  }}
                  className="w-full text-red-500 font-semibold py-2 px-6 underline hover:text-red-700 transition-colors text-center"
                >
                  {t("products.deleteProduct")}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-full border border-gray-300 text-subTitleColor font-semibold py-3 px-6 rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>

            {/* Right Section - Product Details */}
            <div className="w-1/2 overflow-y-auto">
              <div className="p-6">
                {/* Top Row: Product Name and Price */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-subTitleColor">
                      {name || t("products.title")}
                    </h1>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-subTitleColor mb-1">{t("products.price")}</div>
                    <div>
                      <span
                        className="text-3xl font-bold"
                        style={{ color: "#004838" }}
                      >
                        ${displayPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Second Row: Listed By and Quantity */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-subTitleColor">{t("products.listedBy")}:</span>
                    <span className="font-semibold text-subTitleColor">
                      {storeName}
                    </span>
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.2671 5.89015L13.2749 4.73739C13.0852 4.51851 12.932 4.10994 12.932 3.81811V2.57781C12.932 1.80445 12.2972 1.16971 11.5239 1.16971H10.2836C9.99903 1.16971 9.58316 1.01649 9.36429 0.8268L8.21154 -0.165439C7.70812 -0.595895 6.88369 -0.595895 6.37298 -0.165439L5.2275 0.834096C5.00862 1.01649 4.59275 1.16971 4.30822 1.16971H3.04603C2.27267 1.16971 1.63792 1.80445 1.63792 2.57781V3.82541C1.63792 4.10994 1.48471 4.51851 1.30231 4.73739L0.317371 5.89744C-0.10579 6.40086 -0.10579 7.218 0.317371 7.72141L1.30231 8.88146C1.48471 9.10033 1.63792 9.5089 1.63792 9.79344V11.041C1.63792 11.8144 2.27267 12.4491 3.04603 12.4491H4.30822C4.59275 12.4491 5.00862 12.6024 5.2275 12.792L6.38027 13.7843C6.88369 14.2147 7.70812 14.2147 8.21883 13.7843L9.37158 12.792C9.59046 12.6024 9.99903 12.4491 10.2909 12.4491H11.5312C12.3045 12.4491 12.9393 11.8144 12.9393 11.041V9.80074C12.9393 9.5162 13.0925 9.10033 13.2822 8.88146L14.2744 7.72871C14.6976 7.22529 14.6976 6.39356 14.2671 5.89015ZM10.3273 5.43051L6.80343 8.95441C6.70129 9.05656 6.56267 9.11492 6.41675 9.11492C6.27083 9.11492 6.13221 9.05656 6.03007 8.95441L4.26444 7.18881C4.05286 6.97723 4.05286 6.62703 4.26444 6.41545C4.47602 6.20387 4.82622 6.20387 5.0378 6.41545L6.41675 7.79437L9.55398 4.65714C9.76556 4.44555 10.1158 4.44555 10.3273 4.65714C10.5389 4.86872 10.5389 5.21892 10.3273 5.43051Z"
                        fill="#004838"
                      />
                    </svg>
                    <span className="text-sm" style={{ color: "#004838" }}>
                      ({t("products.verifiedSeller")})
                    </span>
                  </div>
                  {totalStock > 0 && (
                    <div className="text-right">
                      <span style={{ color: "#004838" }}>{t("products.qty")} :</span>{" "}
                      <span className="text-green-600 font-semibold">
                        {totalStock} {t("products.leftInStock")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Options Display */}
                {getOptionValues().length > 0 &&
                  getOptionValues().map((option, idx) => {
                    if (
                      !option ||
                      !option.name ||
                      !Array.isArray(option.values)
                    )
                      return null;
                    return (
                      <div key={idx} className="mb-4 flex gap-2">
                        <div className="text-[#004838] mb-2">
                          {String(option.name)}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {String(option.name).toLowerCase() === "color"
                            ? option.values.map((val, valIdx) => {
                              if (val == null) return null;
                              const valStr = String(val).toLowerCase();
                              return (
                                <div
                                  key={valIdx}
                                  className="size-8 rounded-full border-2 border-gray-300"
                                  style={{
                                    backgroundColor:
                                      valStr === "white"
                                        ? "#fff"
                                        : valStr === "black"
                                          ? "#000"
                                          : valStr === "red"
                                            ? "#ff0000"
                                            : valStr === "blue"
                                              ? "#0000ff"
                                              : valStr === "green"
                                                ? "#008000"
                                                : valStr === "yellow"
                                                  ? "#ffff00"
                                                  : valStr === "purple"
                                                    ? "#800080"
                                                    : valStr === "pink"
                                                      ? "#ffc0cb"
                                                      : valStr === "orange"
                                                        ? "#ffa500"
                                                        : valStr === "gray"
                                                          ? "#808080"
                                                          : "#ccc",
                                  }}
                                  title={String(val)}
                                />
                              );
                            })
                            : option.values.map((val, valIdx) => {
                              if (val == null) return null;
                              return (
                                <button
                                  key={valIdx}
                                  className="flex justify-center items-center size-8 aspect-square bg-[#FAFAFA] rounded-full hover:shadow-lg hover:bg-white text-sm transition-all duration-300"
                                >
                                  {String(val)}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}

                {/* Description */}
                <div className="mb-4">
                  <h3 className="font-semibold text-[#004838] mb-2">
                    {t("products.description")}:
                  </h3>
                  <p className="text-subTitleColor text-sm leading-relaxed">
                    {description || t("products.noDescription")}
                  </p>
                </div>

                {/* Specifications */}
                {specifications && specifications.trim() && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#004838] mb-2">
                      {t("products.specifications")}:
                    </h3>
                    <p className="text-subTitleColor text-sm leading-relaxed whitespace-pre-line">
                      {specifications}
                    </p>
                  </div>
                )}

                {/* Additional Features */}
                {additional_features && additional_features.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#004838] mb-2">
                      {t("products.additionalFeatures")}:
                    </h3>
                    <ul className="list-disc list-inside text-subTitleColor text-sm space-y-1">
                      {additional_features.map(
                        (feature: string, idx: number) => (
                          <li key={idx}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Variants */}
                {variants && variants.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#004838] mb-2">
                      {t("products.variants")}:
                    </h3>
                    <ul className="list-disc list-inside text-subTitleColor text-sm space-y-1">
                      {variants.map((variant: any, idx: number) => {
                        // Extract option values from variant.option_values array
                        const optionValues = Array.isArray(
                          variant.option_values
                        )
                          ? variant.option_values
                            .map((ov: any) =>
                              typeof ov === "object" && ov.value
                                ? ov.value
                                : ov
                            )
                            .join(" / ")
                          : "";
                        return (
                          <li key={variant.id || idx}>
                            {t("products.variantLabel")} {idx + 1}: {optionValues} - {t("products.price")}: $
                            {variant.price || "0"}, {t("products.stock")}:{" "}
                            {variant.stock || "0"}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* --- TABLE ROW --- */}
      <tr
        className="border-b hover:bg-gray-50 transition-colors"
        data-product-id={product.id}
      >
        <td className="p-3">{product.id}</td>
        <td className="p-3">
          <Image
            src={
              product?.gallery?.[0]?.file_path ||
              "https://placehold.co/40x40?text=P"
            }
            alt={product.name}
            width={30}
            height={30}
            sizes="30px"
            className="size-8 rounded-full object-cover"
          />
        </td>
        <td className="p-3">{product.name}</td>
        <td className="p-3 first-letter:uppercase">
          {product?.category?.name || "—"}
        </td>
        <td className="p-3">${product.price?.toFixed(2) || "0.00"}</td>
        <td className="p-3">
          {product.discount_value && product.discount_value > 0
            ? product.discount_type === "percentage"
              ? `${product.discount_value}%`
              : `$${product.discount_value}`
            : "—"}
        </td>
        <td className="p-3">{product.total_left_in_stock ?? "—"}</td>
        <td className="p-3">
          {productStatus === "active" ? (
            <span
              className={`text-[#06B187] bg-[#05C168]/20 rounded px-2 py-0.5 text-xs font-medium ${canManageStatus ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              onClick={canManageStatus ? handleSwitchActivation : undefined}
            >
              {t("status.active")}
            </span>
          ) : (
            <span
              className={`text-[#BF2033] bg-[#D02F44]/20 rounded px-2 py-0.5 text-xs font-medium ${canManageStatus ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              onClick={canManageStatus ? handleSwitchActivation : undefined}
            >
              {t("status.notActive")}
            </span>
          )}
        </td>
        <td className=" text-end space-x-3">
          <button
            className="inline-flex items-center justify-center hover:opacity-80 rtl:mx-4">
            <Link href={`/products/${product.id}`}>

              <EyeFilled
                size={18}
                className="text-blueIcons cursor-pointer hover:text-blueSiteHover"
              />
            </Link>
          </button>
          {canCreate && (
            <button
              className="inline-flex items-center justify-center hover:opacity-80"
              onClick={handleDublicate}
              title={t("products.duplicateProduct")}
            >
              <GrCopy
                size={13}
                className="text-blueBtn cursor-pointer hover:text-blueSiteHover"
                title={t("products.duplicateProduct")}
              />
            </button>
          )}
          {canEdit && (
            <button
              className="inline-flex items-center justify-center hover:opacity-80"
              onClick={handleEdit}
              title={t("products.editProduct")}
              data-edit-button
            >
              <PencilIcon />
            </button>
          )}
          {canDelete && (
            <button
              className="inline-flex items-center justify-center hover:opacity-80"
              onClick={() => setDeleteDialog(true)}
              title={t("products.deleteProduct")}
            >
              <BinIcon />
            </button>
          )}
        </td>
      </tr>

      {/* --- EDIT PRODUCT MODAL --- */}
      {showEditModal &&
        typeof document !== "undefined" &&
        createPortal(editProductModal(), document.body)}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {canDelete && (
        <Modal
          isOpen={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          className="p-6 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="p-5 rounded-full bg-red-50 mb-3">
              <LucideUserX size={40} color="#dc2626" />
            </div>
            <h2 className="text-lg font-semibold mb-4">
              Delete this product permanently?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteDialog(false)}
                className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-textWhiteColor rounded-md hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProductRow;
