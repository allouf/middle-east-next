"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { Modal } from "antd";
import useGetData from "@/lib/api/useGetData";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface Option {
  name: string;
  type: string;
  values: string[];
}

interface Variant {
  option_values: string[];
  price: string;
  stock: string;
  low_stock_threshold: string;
  image: File | string | null | undefined;
}

interface FormState {
  name: string;
  category_id: string;
  sub_category_id: string;
  gallery: (File | string)[];
  specifications: string;
  description: string;
  additional_features: string[];
  price: string;
  options: Option[];
  variants: Variant[];
  has_discount: boolean;
  discount_value: string;
  discount_type: string;
  store_id: string | number | null;
  status: "active" | "draft" | null;
}

interface ProductPreviewModalProps {
  formData: FormState;
  variants_draft: Variant[];
  gallery: (File | string)[];
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  storeId: string | number | null;
}

const ProductPreviewModal = ({
  formData,
  variants_draft,
  gallery,
  currentImageIndex,
  setCurrentImageIndex,
  open,
  onClose,
  onSubmit,
  loading,
  storeId,
}: ProductPreviewModalProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const selectedVariants = variants_draft;
  const galleryImages = Array.isArray(gallery) ? gallery : [];
  const totalImages = galleryImages.length;

  // Fetch store data
  const { data: storeData } = useGetData({
    url: storeId ? STORE_ENDPOINT.getStoreDetails(storeId) : undefined,
  });

  const storeName = storeData?.data?.name || t("addProduct.preview.companyName");

  // Get option values for display
  const getOptionValues = () => {
    if (!formData.options || formData.options.length === 0) return [];
    return formData.options.map((opt) => ({
      name: opt.name,
      values: opt.values || [],
    }));
  };

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

  // Get image URL - handle both File objects and URLs
  const getImageUrl = (image: File | string | null) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (typeof image === "string") {
      return image;
    }
    return "/defaulLogo.png";
  };

  const currentImage = galleryImages[currentImageIndex];
  const currentImageUrl = currentImage
    ? getImageUrl(currentImage)
    : "/defaulLogo.png";

  // Calculate price with discount
  const calculatePrice = () => {
    if (selectedVariants.length > 0) {
      const prices = selectedVariants.map((v) => parseFloat(v.price) || 0);
      const minPrice = Math.min(...prices);
      if (formData.has_discount && formData.discount_value) {
        if (formData.discount_type === "percentage") {
          return minPrice * (1 - parseFloat(formData.discount_value) / 100);
        } else {
          return Math.max(0, minPrice - parseFloat(formData.discount_value));
        }
      }
      return minPrice;
    }
    return 0;
  };

  const displayPrice = calculatePrice();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="95%"
      style={{ maxWidth: '1200px', top: 20 }}
      className="product-preview-modal"
    >
      <div className="bg-white rounded-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Modal Content */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Left Section - Images */}
          <div className="w-full lg:w-1/2 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex flex-col flex-1 overflow-y-auto">
              {/* Image Thumbnails - Above main image */}
              {totalImages > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => {
                    const isActive = idx === currentImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 border transition-all bg-white shadow-sm ${isActive
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
                    {t("addProduct.preview.noImagesAvailable")}
                  </div>
                )}
              </div>

              {/* Navigation and Counter */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-normal text-subTitleColor">
                  {String(currentImageIndex + 1).padStart(2, "0")}{" "}
                  <span className="text-[#338572]">
                    {t("addProduct.preview.of")}{" "}
                    {String(totalImages).padStart(2, "0")}
                  </span>
                </span>

                {totalImages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={prevImage}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-blueSite text-blueSite bg-white hover:bg-[#E6F0ED] transition"
                      aria-label={t("addProduct.preview.previousImage")}
                    >
                      {isRTL ? <FaArrowRight size={14} /> : <FaArrowLeft size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blueSite text-textWhiteColor hover:bg-[#338572] transition"
                      aria-label={t("addProduct.preview.nextImage")}
                    >
                      {isRTL ? <FaArrowLeft size={14} /> : <FaArrowRight size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-white flex-shrink-0 flex flex-col gap-3">
              <button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-blueSite hover:bg-[#338572] text-textWhiteColor font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t("addProduct.preview.submitting")
                  : t("addProduct.preview.confirmPublication")}
              </button>
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-subTitleColor font-semibold py-3 px-6 rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                {t("addProduct.preview.cancel")}
              </button>
            </div>
          </div>
          {/* Right Section - Product Details */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Top Row: Product Name and Price */}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                {/* Left: Product Title */}
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-subTitleColor">
                    {formData.name || t("addProduct.preview.productName")}
                  </h1>
                </div>

                {/* Right: Price */}
                <div className="text-right">
                  <div className="text-sm text-subTitleColor mb-1">
                    {t("addProduct.preview.price")}
                  </div>
                  <div>
                    <span
                      className="text-2xl sm:text-3xl font-bold"
                      style={{ color: "#004838" }}
                    >
                      ${displayPrice.toLocaleString()}
                    </span>
                    {formData.has_discount && formData.discount_value && (
                      <span className="ml-2 text-lg text-textColor line-through">
                        $
                        {selectedVariants.length > 0
                          ? Math.min(
                            ...selectedVariants.map(
                              (v) => parseFloat(v.price) || 0
                            )
                          ).toLocaleString()
                          : "0"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Second Row: Listed By and Quantity */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                {/* Left: Listed By */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-subTitleColor">
                    {t("addProduct.preview.listedBy")}
                  </span>
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
                    {t("addProduct.preview.verifiedSeller")}
                  </span>
                </div>

                {/* Right: Quantity */}
                {selectedVariants.length > 0 && (
                  <div className="text-right">
                    <span style={{ color: "#004838" }}>
                      {t("addProduct.preview.quantity")}
                    </span>{" "}
                    <span className="text-green-600 font-semibold">
                      {selectedVariants.reduce(
                        (sum, v) => sum + (parseInt(v.stock) || 0),
                        0
                      )}{" "}
                      {t("addProduct.preview.leftInStock")}
                    </span>
                  </div>
                )}
              </div>

              {/* Options Display */}
              {getOptionValues().map((option, idx) => (
                <div key={idx} className="mb-4 flex gap-2">
                  <div className="text-[#004838] mb-2">{option.name}:</div>
                  <div className="flex flex-wrap gap-2">
                    {option.name.toLowerCase() === "color"
                      ? option.values.map((val, valIdx) => (
                        <div
                          key={valIdx}
                          className="size-8 rounded-full border-2 border-gray-300"
                          style={{
                            backgroundColor:
                              val.toLowerCase() === "white"
                                ? "#fff"
                                : val.toLowerCase() === "black"
                                  ? "#000"
                                  : val.toLowerCase() === "red"
                                    ? "#ff0000"
                                    : val.toLowerCase() === "blue"
                                      ? "#0000ff"
                                      : val.toLowerCase() === "green"
                                        ? "#008000"
                                        : val.toLowerCase() === "yellow"
                                          ? "#ffff00"
                                          : val.toLowerCase() === "purple"
                                            ? "#800080"
                                            : val.toLowerCase() === "pink"
                                              ? "#ffc0cb"
                                              : val.toLowerCase() === "orange"
                                                ? "#ffa500"
                                                : val.toLowerCase() === "gray"
                                                  ? "#808080"
                                                  : "#ccc",
                          }}
                          title={val}
                        />
                      ))
                      : option.values.map((val, valIdx) => (
                        <button
                          key={valIdx}
                          className="flex justify-center items-center size-8 aspect-square bg-[#FAFAFA] rounded-full hover:shadow-lg hover:bg-white text-sm transition-all duration-300"
                        >
                          {val}
                        </button>
                      ))}
                  </div>
                </div>
              ))}

              {/* Description */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#004838] mb-2">
                  {t("addProduct.preview.description")}
                </h3>
                <p className="text-subTitleColor text-sm leading-relaxed">
                  {formData.description ||
                    t("addProduct.preview.noDescriptionProvided")}
                </p>
              </div>

              {/* Specifications */}
              {formData.specifications && formData.specifications.trim() && (
                <div className="mb-4">
                  <h3 className="font-semibold text-[#004838] mb-2">
                    {t("addProduct.preview.specifications")}
                  </h3>
                  <p className="text-subTitleColor text-sm leading-relaxed whitespace-pre-line">
                    {formData.specifications}
                  </p>
                </div>
              )}

              {/* Additional Features */}
              {formData.additional_features &&
                formData.additional_features.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#004838] mb-2">
                      {t("addProduct.preview.additionalFeatures")}
                    </h3>
                    <ul className="list-disc list-inside text-subTitleColor text-sm space-y-1">
                      {formData.additional_features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Options */}
              {selectedVariants.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-[#004838] mb-2">
                    {t("addProduct.preview.options")}
                  </h3>
                  <ul className="list-disc list-inside text-subTitleColor text-sm space-y-1">
                    {selectedVariants.map((variant, idx) => (
                      <li key={idx}>
                        {t("addProduct.preview.variant")} {idx + 1}:{" "}
                        {Array.isArray(variant.option_values)
                          ? variant.option_values.join(" / ")
                          : ""}{" "}
                        - {t("addProduct.preview.price")}: ${variant.price || "0"}, {t("addProduct.preview.stock")}:{" "}
                        {variant.stock || "0"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductPreviewModal;
