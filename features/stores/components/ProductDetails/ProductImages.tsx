'use client';

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ProductGallery } from "@/features/product/types/type";

interface ProductImagesProps {
  images?: ProductGallery[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  name?: string;
  discountPercent?: number;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  selectedImage,
  setSelectedImage,
  name,
  discountPercent,
}) => {
  const gallery = images?.length
    ? images
    : [{ id: 1, file_path: "/dummy/prod21.png" }];
  const total = gallery.length;
  const activeIndex =
    selectedImage >= 0 && selectedImage < total ? selectedImage : 0;

  const selectIndex = (idx: number): void => {
    if (!setSelectedImage) return;
    const next = (idx + total) % total;
    setSelectedImage(next);
  };

  const formatNumber = (num: number): string => String(num).padStart(2, "0");

  return (
    <div className="space-y-4">
      {total > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {gallery.map((img, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={img.id || index}
                onClick={() => selectIndex(index)}
                className={`w-24 h-16 flex-shrink-0 border transition-all bg-white shadow-sm ${isActive
                  ? "border-blueSite ring-2 ring-blue-100 shadow-md"
                  : "border-gray-200 hover:border-blueSite/60"
                  }`}
              >
                <img
                  src={img.file_path || "/dummy/prod21.png"}
                  alt={`${name || "Product"} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex items-center justify-center w-full aspect-[95/60] max-w-[950px]" style={{ padding: '10.05px' }}>
        {discountPercent ? (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-semibold rounded-md bg-[#f8d631] text-subTitleColor">
            {discountPercent}% OFF
          </span>
        ) : null}

        <button
          type="button"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-blueSite shadow-sm hover:shadow transition"
          aria-label="Share product"
        >
          <img
            src="/icons/share-06.svg"
            alt="Share"
            className="w-5 h-5"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </button>

        <div className="w-full h-full flex items-center justify-center">
          <img
            src={gallery[activeIndex]?.file_path || "/dummy/prod21.png"}
            alt={name || "Product image"}
            className="w-full h-full object-contain"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.target as HTMLImageElement).src = "/dummy/prod21.png";
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-subTitleColor">
          {formatNumber(activeIndex + 1)}{" "}
          <span className="text-blueSite">of {formatNumber(total)}</span>
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => selectIndex(activeIndex - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-blueSite text-blueSite bg-white hover:bg-[#E6F0ED] transition"
            aria-label="Previous image"
          >
            <FaArrowLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => selectIndex(activeIndex + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blueSite text-textWhiteColor hover:bg-[#0c56a4] transition"
            aria-label="Next image"
          >
            <FaArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
