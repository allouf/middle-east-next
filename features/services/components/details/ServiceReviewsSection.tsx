"use client";

import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface Review {
  id: string;
  initials: string;
  name: string;
  date: string;
  rating: number;
  text: string;
}

const DUMMY_REVIEWS: Review[] = [
  {
    id: "1",
    initials: "JD",
    name: "Jason D.",
    date: "12:12 pm · 2 days ago",
    rating: 5,
    text: "Alex absolutely nailed the brand vision. The guidelines are so thorough that our team was able to start using them immediately. Communication was 10/10.",
  },
  {
    id: "2",
    initials: "JD",
    name: "Jason D.",
    date: "12:12 pm · 2 days ago",
    rating: 5,
    text: "Alex absolutely nailed the brand vision. The guidelines are so thorough that our team was able to start using them immediately. Communication was 10/10.",
  },
  {
    id: "3",
    initials: "SM",
    name: "Sarah M.",
    date: "09:45 am · 4 days ago",
    rating: 5,
    text: "Exceeded all expectations. The design system provided is scalable, modern, and exactly what we needed to take our platform to the next level.",
  },
];

const ServiceReviewsSection: React.FC = () => {
  const { t } = useTranslation();
  const {isRTL} = useLocaleDirection();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Approximate card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="pt-8 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-[28px] font-bold text-subTitleColor">
          {t("services.details.customerReviewsHeader", { defaultValue: "Customer Reviews" })}
        </h3>
        
        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-[5px] bg-[#00664F33] text-[#00664F] flex items-center justify-center hover:bg-[#c9e1d9] transition-colors"
            aria-label={t("services.details.scrollLeft", { defaultValue: "Scroll Left" })}
          >
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-[5px] bg-[#00664F33] text-[#00664F] flex items-center justify-center hover:bg-[#c9e1d9] transition-colors"
            aria-label={t("services.details.scrollRight", { defaultValue: "Scroll Right" })}
          > 
           {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          
          </button>
        </div>
      </div>

      {/* Reviews container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {DUMMY_REVIEWS.map((review) => (
          <div 
            key={review.id} 
            className="min-w-[320px] max-w-[400px] flex-shrink-0 snap-start bg-white border border-[#E2E8F0] rounded-[24px] p-6 lg:p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#DDEBE7] text-[#00664F] font-bold text-[16px] flex items-center justify-center flex-shrink-0">
                {review.initials}
              </div>
              <div>
                <h4 className="font-bold text-[#1E293B] text-[16px]">
                  {review.name}
                </h4>
                <p className="text-[#94A3B8] text-[13px]">
                  {review.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                i < review.rating ? (
                  <FaStar key={i} className="text-[#FBBF24]" size={15} />
                ) : (
                  <FaRegStar key={i} className="text-[#E2E8F0]" size={15} />
                )
              ))}
            </div>

            <p className="text-[#475569] text-[15px] leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceReviewsSection;
