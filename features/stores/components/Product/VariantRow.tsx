"use client";

import React, { useState, useEffect, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import InputField from "../../../../components/ui/InputField";
import { App } from "antd";

interface Variant {
  option_values: string[];
  price: string;
  stock: string;
  low_stock_threshold: string;
  image: File | string | null | undefined;
}

interface VariantRowProps {
  index: number;
  variant: Variant;
  onUpdate: (index: number, updated: Variant) => void;
  onDelete: (index: number) => void;
  errors?: { price?: string; stock?: string; low_stock_threshold?: string };
  t: (key: string) => string;
  isMobile?: boolean;
}

const VariantRow = ({
  index,
  variant,
  onUpdate,
  onDelete,
  errors,
  t,
  isMobile = false,
}: VariantRowProps) => {


const { message: messageApi } = App.useApp();

  // Local state for immediate feedback, synced with parent occasionally or on blur
  // Actually, simple value/onChange is fine if we are careful, but let's use local state for better speed
  const [localPrice, setLocalPrice] = useState(variant.price);
  const [localStock, setLocalStock] = useState(variant.stock);
  const [localThreshold, setLocalThreshold] = useState(variant.low_stock_threshold);
  const [imagePreview, setImagePreview] = useState<string>(
    typeof variant.image === "string" && variant.image
      ? variant.image
      : "/uploadImage.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalPrice(variant.price);
  }, [variant.price]);

  useEffect(() => {
    setLocalStock(variant.stock);
  }, [variant.stock]);

  useEffect(() => {
    setLocalThreshold(variant.low_stock_threshold);
  }, [variant.low_stock_threshold]);

  useEffect(() => {
    if (!variant.image) {
      setImagePreview("/uploadImage.png");
      return;
    }

    if (typeof variant.image === "string") {
      setImagePreview(variant.image);
      return;
    }

    if (variant.image instanceof File) {
      const objectUrl = URL.createObjectURL(variant.image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [variant.image]);

  const translate = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const imageLabel = translate("products.image", "Image");
  const uploadHint = translate(
    "products.uploadClearPhoto",
    "Upload a clear product photo"
  );
  const uploadBtnText = translate("common.upload", "Upload");

  const handlePriceChange = (e: any) => {
    const val = e?.target?.value ?? String(e);
    setLocalPrice(val);
    onUpdate(index, { ...variant, price: val });
  };

  const handleStockChange = (e: any) => {
    const val = e?.target?.value ?? String(e);
    setLocalStock(val);
    onUpdate(index, { ...variant, stock: val });
  };

  const handleThresholdChange = (e: any) => {
    const val = e?.target?.value ?? String(e);
    setLocalThreshold(val);
    onUpdate(index, { ...variant, low_stock_threshold: val });
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Variant Name */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 text-sm">
            {Array.isArray(variant.option_values)
              ? variant.option_values.join(" / ")
              : "—"}
          </span>
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
          >
            <AiFillDelete size={16} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block px-2 text-xs font-medium text-gray-600 mb-1">
              {t("addProduct.step2.price")}
            </label>
            <InputField
              id={`price-${index}`}
              type="number"
              placeholder={t("addProduct.step2.price")}
              value={localPrice}
              onChange={handlePriceChange}
              unstyled
              className="py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-full"
              error={errors?.price}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block px-2 text-xs font-medium text-gray-600 mb-1">
                {t("addProduct.step2.stock")}
              </label>
              <InputField
                id={`stock-${index}`}
                type="number"
                placeholder={t("addProduct.step2.stock")}
                value={localStock}
                onChange={handleStockChange}
                unstyled
                className="py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-full"
                error={errors?.stock}
              />
            </div>

            <div>
              <label className="block px-2 text-xs font-medium text-gray-600 mb-1">
                {t("addProduct.step2.lowStock")}
              </label>
              <InputField
                id={`threshold-${index}`}
                type="number"
                placeholder={t("addProduct.step2.lowStock")}
                value={localThreshold}
                onChange={handleThresholdChange}
                unstyled
                className="py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-full"
                error={errors?.low_stock_threshold}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block px-2 text-xs font-medium text-gray-600 mb-2">
              {t("addProduct.step2.image")}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                <img
                  src={imagePreview}
                  alt={`${variant.option_values?.join(" / ")} image`}
                  className={variant.image?"h-full w-full object-cover":"w-6 h-6 object-contain"}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-1 text-xs text-subTitleColor">
                  <span className="text-gray-500 leading-tight">
                    {uploadHint}
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-md bg-blueSite text-white text-xs font-medium hover:bg-blueSite/15 transition-colors w-fit"
                  >
                    {uploadBtnText}
                  </button>
                </div>
              </div>
            </div>
            <input
              id={`image-${index}`}
              ref={fileInputRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                // Validate file type
                const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                  const allowedTypeNames = allowedTypes.map(type => type.replace('image/', '').toUpperCase()).join(', ');
                  const errorMessage = t('imageUpload.invalidFileType').replace('{{types}}', allowedTypeNames);
                  messageApi.error(errorMessage);
                  e.target.value = ''; // Clear the input
                  return;
                }
                
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
                onUpdate(index, { ...variant, image: file });
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout (Original)
  return (
    <tr className="border-b border-gray-100 hover:bg-slate-50/80 transition-colors group">
      <td className="p-3 text-start font-medium text-gray-700">
        {Array.isArray(variant.option_values)
          ? variant.option_values.join(" / ")
          : "—"}
      </td>
      <td className="p-3 text-start">
        <InputField
          id={`price-${index}`}
          type="number"
          placeholder={t("addProduct.step2.price")}
          value={localPrice}
          onChange={handlePriceChange}
          unstyled
          className="py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-full"
          error={errors?.price}
        />
      </td>
      <td className="p-3 text-start">
        <InputField
          id={`stock-${index}`}
          type="number"
          placeholder={t("addProduct.step2.stock")}
          value={localStock}
          onChange={handleStockChange}
          unstyled
          className="py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-full"
          error={errors?.stock}
        />
      </td>
      <td className="p-3 text-start">
        <InputField
          id={`threshold-${index}`}
          type="number"
          placeholder={t("addProduct.step2.lowStock")}
          value={localThreshold}
          onChange={handleThresholdChange}
          unstyled
          className="py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-full"
          error={errors?.low_stock_threshold}
        />
      </td>
      <td className="p-3 text-start">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
            <img
              src={imagePreview}
              alt={`${variant.option_values?.join(" / ")} image`}
              className={variant.image?"h-full w-full object-cover":"w-6 h-6 object-contain"}
            />
          </div>
          <div className="flex flex-col gap-1 text-xs text-subTitleColor">
            {/* <span className="text-sm font-semibold text-subTitleColor">
              {imageLabel}
            </span> */}
            <span className="text-gray-500 leading-tight w-[200px] mb-1">
              {uploadHint}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-md bg-blueSite text-white text-xs font-medium hover:bg-blueSite/15 transition-colors"
              >
                {uploadBtnText}
              </button>
          
            </div>
          </div>
        </div>
        <input
          id={`image-${index}`}
          ref={fileInputRef}
          type="file"
          accept="image/jpg,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            
            // Validate file type
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
              const allowedTypeNames = allowedTypes.map(type => type.replace('image/', '').toUpperCase()).join(', ');
              const errorMessage = t('imageUpload.invalidFileType').replace('{{types}}', allowedTypeNames);
              messageApi.error(errorMessage);
              e.target.value = ''; // Clear the input
              return;
            }
            
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            onUpdate(index, { ...variant, image: file });
          }}
        />
      </td>
      <td className="p-3 text-end">
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <AiFillDelete size={18} />
        </button>
      </td>
    </tr>
  );
};

export default VariantRow;

