"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { EyeOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export type GalleryImage = {
  id: string | number;
  url: string;
  alt?: string;
};

type Props = {
  title?: string;
  totalPhotos: number;
  images: GalleryImage[];
  rightCols?: number;
};

const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgZmlsbD0nI2UyZTJlMicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJy8+";

export default function CompanyGalleryMosaic({
  title,
  totalPhotos,
  images,
  rightCols = 4,
}: Props) {
  const { t, locale } = useTranslation();
  const [page, setPage] = useState(0);
  const [preview, setPreview] = useState<GalleryImage | null>(null);
  
  const isRTL = locale === 'ar';

  const perPage = 1 + rightCols * 2;
  const maxPage = Math.max(0, Math.ceil(images.length / perPage) - 1);

  const currentImages = useMemo(() => {
    const start = page * perPage;
    return images.slice(start, start + perPage);
  }, [images, page, perPage]);

  const big = currentImages[0];
  const small = currentImages.slice(1);

  const canPrev = page > 0;
  const canNext = page < maxPage;

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {title || t("jobs.gallery.title")} ({totalPhotos} Photos)
        </h2>

        {images.length > perPage && (
          <div className="flex items-center gap-2 text-blueSite">
            <NavButton
              icon={<ArrowLeft />}
              disabled={!canPrev}
              onClick={() => canPrev && setPage((p) => p - 1)}
              isRTL={isRTL}
            />
            <NavButton
              icon={<ArrowRight />}
              disabled={!canNext}
              onClick={() => canNext && setPage((p) => p + 1)}
              isRTL={isRTL}
            />
          </div>
        )}
      </div>

      {/* Mosaic */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
        {/* Big */}
        {big && (
          <ImageCard
            image={big}
            large
            // ✅ أولوية للكبير
            priority
            fetchPriority="high"
            loading="eager"
            onPreview={setPreview}
          />
        )}

        {/* ✅ Small: تُعرض فورًا بدون انتظار bigReady */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${rightCols}, minmax(0, 1fr))` }}
        >
          {small.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onPreview={setPreview}
              // ✅ الصغير Lazy + أولوية منخفضة
              loading="lazy"
              fetchPriority="low"
            />
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        open={!!preview}
        onCancel={() => setPreview(null)}
        footer={null}
        centered
        width={900}
      >
        {preview && (
          <div className="relative w-full h-[60vh] bg-black rounded-lg overflow-hidden">
            <Image
              src={preview.url}
              alt={preview.alt || "preview"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              // لو تبغى أيضًا تلغي البلور بالمعاينة:
              // placeholder="empty"
              placeholder="blur"
              blurDataURL={BLUR}
            />
          </div>
        )}
      </Modal>
    </section>
  );
}

function NavButton({
  icon,
  disabled,
  onClick,
  isRTL = false,
}: {
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  isRTL?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-8 w-8 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
    >
      {icon}
    </button>
  );
}

function ImageCard({
  image,
  large,
  priority,
  loading,
  fetchPriority,
  onPreview,
}: {
  image: GalleryImage;
  large?: boolean;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  onPreview: (img: GalleryImage) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-zinc-100 ${
        large ? "min-h-[240px] lg:min-h-[280px]" : "aspect-[16/9]"
      }`}
    >
      <Image
        src={image.url}
        alt={image.alt || t("jobs.gallery.alt")}
        fill
        className="object-cover"
        sizes={
          large
            ? "(max-width: 768px) 100vw, 50vw"
            : "(max-width: 768px) 50vw, 25vw"
        }
        placeholder="blur"
        blurDataURL={BLUR}
        priority={priority}
        loading={loading}
        fetchPriority={fetchPriority}
      />

      <button
        type="button"
        onClick={() => onPreview(image)}
        className="group absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/25 transition"
      >
        <span className="opacity-0 group-hover:opacity-100 transition rounded-full bg-white/90 text-zinc-800 px-3 py-2 text-xs font-semibold flex items-center gap-2">
          <EyeOutlined /> Preview
        </span>
      </button>
    </div>
  );
}
