import React from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ProductGallery } from "@/features/product/types/type";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface ProductImagesProps {
  images?: ProductGallery[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  name?: string;
  discountPercent?: number;
}

const FALLBACK_IMAGE = "/dummy/prod21.png";

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  selectedImage,
  setSelectedImage,
  name,
  discountPercent,
}) => {
  const { isRTL } = useLocaleDirection();
  const gallery =
    images?.length ? images : [{ id: 1, file_path: FALLBACK_IMAGE }];

  const total = gallery.length;
  const activeIndex =
    selectedImage >= 0 && selectedImage < total ? selectedImage : 0;

  const selectIndex = (idx: number) => {
    const next = (idx + total) % total;
    setSelectedImage(next);
  };

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="space-y-4">
      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {gallery.map((img, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={img.id || index}
                onClick={() => selectIndex(index)}
                className={`relative w-24 h-24 flex-shrink-0 border transition-all bg-white shadow-sm
                  ${isActive
                    ? "border-blueSite ring-2 ring-blue-100 shadow-md"
                    : "border-gray-200 hover:border-blueSite/60"
                  }`}
              >
                <Image
                  src={img.file_path || FALLBACK_IMAGE}
                  alt={`${name || "Product"} - ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden flex items-center justify-center w-full aspect-[95/60] max-w-[950px]"
        style={{ padding: "10.05px" }}
      >
        {discountPercent ? (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-semibold rounded-md bg-[#f8d631] text-subTitleColor">
            {discountPercent}% OFF
          </span>
        ) : null}

        {/* Share button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-blueSite shadow-sm hover:shadow transition"
          aria-label="Share product"
        >
          <Image
            src="/icons/share-06.svg"
            alt="Share"
            width={20}
            height={20}
          />
        </button>

        <div className="relative w-full h-full">
          <Image
            src={gallery[activeIndex]?.file_path || FALLBACK_IMAGE}
            alt={name || "Product image"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 950px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      {total > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-subTitleColor">
            {formatNumber(activeIndex + 1)}{" "}
            <span className="text-blueSite">
              of {formatNumber(total)}
            </span>
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => selectIndex(activeIndex - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-blueSite text-blueSite bg-white hover:bg-blueLight transition"
              aria-label="Previous image"
            >
              {isRTL ? <FaArrowRight size={14} /> : <FaArrowLeft size={14} />}
            </button>

            <button
              type="button"
              onClick={() => selectIndex(activeIndex + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blueSite text-textWhiteColor hover:bg-blueSiteHover transition"
              aria-label="Next image"
            >
              {isRTL ? <FaArrowLeft size={14} /> : <FaArrowRight size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
