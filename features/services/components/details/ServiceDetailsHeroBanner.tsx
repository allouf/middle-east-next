'use client';
import { useTranslation } from "@/lib/i18n/useTranslation";
import useServicesFilterStore from "@/lib/store/useServicesFilterStore";
import Link from "next/link";
import { FaStar, FaRegStar } from "react-icons/fa";

type Props = {
  title?: string;
  category?: string;
  subcategory?: string;
  packageType?: string;
  rating?: number;
  reviewsCount?: number;
  sellerType?: string;
  categoryId?: number;
  subCategoryId?: number;
};

export default function ServiceDetailsHeroBanner({
  title = "Premium UI/UX Design & Digital Strategy",
  category = "Design Services",
  subcategory = "UI/UX Strategy",
  packageType = "Premium Package",
  rating = 5.0,
  reviewsCount = 128,
  sellerType = "Top Rated Seller",
  categoryId,
  subCategoryId,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { setSelectedCategoryName, setSelectedSubCategoryName } = useServicesFilterStore()

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 w-4 h-4" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400 w-4 h-4" />
        )
      );
    }
    return stars;
  };

  return (
    <section className="relative w-full h-[350px] overflow-hidden flex items-end pb-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/services/ServiceDetailsHeroBackground.png')",
          transform: isRTL ? "scaleX(-1)" : "scaleX(1)",
        }}
      />

      {/* Overlay for soft readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 md:px-[80px] relative z-10 w-full">
        {/* Glass panel */}
        <div className="px-6 py-6 sm:px-8 sm:py-8 flex flex-col gap-3 max-w-[700px] bg-[#FFFFFF33] backdrop-blur-sm border border-white/20 rounded-[12px] shadow-sm">
          
          {/* Breadcrumbs */}
          <div className="flex items-center flex-wrap gap-2 text-white/90 text-sm font-medium tracking-wide">
            {categoryId ? (
               <Link href={`/services?category=${categoryId}`} className="hover:text-white transition-colors underline-offset-4 hover:underline" 
               onClick={()=>{
                setSelectedCategoryName(category)
                }}>
                 {category}
               </Link>
            ) : (
               <span>{category}</span>
            )}
            {subcategory && (
              <>
                <span className="text-white/60">/</span>
                {subCategoryId ? (
                  <Link href={`/services?sub_category=${subCategoryId}`} className="hover:text-white transition-colors underline-offset-4 hover:underline"
                  onClick={()=>{
                    setSelectedSubCategoryName(subcategory)
                  }}>
                    {subcategory}
                  </Link>
                ) : (
                  <span>{subcategory}</span>
                )}
              </>
            )}
             <span className="text-white/60">/</span>
            <span>{packageType}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-tight font-bold text-white mb-2">
            {title}
          </h1>

          {/* Rating and Reviews */}
          <div className="flex items-center flex-wrap gap-3 mt-1 text-white text-[16px] font-medium">
            <div className="flex items-center gap-1.5">
              {renderStars()}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{rating ? rating.toFixed(1) : "0.0"} <span className="font-medium text-white/90">({t("services.details.reviews", { count: reviewsCount || 0 })})</span></span>
              {sellerType && (
                <>
                  <span className="text-white/50 mx-1">|</span>
                  <span className="text-white/90">{sellerType}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
