"use client";

import React from "react";
import { MdLocationOn, MdOutlineCategory } from "react-icons/md";
import { useTranslation } from "@/lib/i18n/useTranslation";

import ServicePackagesSection from "../ServicePackagesSection";
import BookingSidebar from "../BookingSidebar";
import FAQTab from "./FAQTab";
import ServiceProjectsSection from "../ServiceProjectsSection";
import ServiceReviewsSection from "../ServiceReviewsSection";
import { ServiceDetails } from "@/features/services/types/type";
import useGetData from "@/lib/api/useGetData";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import SafeHtml from "@/components/shared/SafeHtml";
import { TbFileEuro } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import { useState } from "react";

interface OverviewTabProps {
  service: ServiceDetails;
  title: string;
  description: string;
  price: string;
  onTabChange?: (key: string) => void;
  id: number;
  selectedPlanId: string | null;
  onPlanChange: (planId: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  service,
  title,
  description,
  price,
  onTabChange,
  id,
  selectedPlanId,
  onPlanChange
}) => {
  const { t } = useTranslation();
  const { service_category, type, plans, faqs } = service;
  
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { data, loading, error } = useGetData({
    url: SERVICES_PUBLIC_ENDPOINTS.getServiceProjects(id)
  });

  const apiProjects = data?.data.projects || [];
  
  const selectedPlan = plans?.find((p) => p.id.toString() === selectedPlanId) || (plans?.length > 0 ? plans[0] : undefined);

  return (
    <div className="animate-in fade-in duration-500 container max-sm:px-4 2xl:max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 py-10 2xl:py-16">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-12">
        {/* Description Section */}
        <div className="space-y-6">
          <h2 className="text-[28px] sm:text-[32px] font-bold text-subTitleColor leading-tight">
            {title ||
              t("services.details.overviewDefaultTitle", { defaultValue: "Transforming your digital vision into high-converting experiences" })}
          </h2>
 
          <div className="flex flex-col gap-2 text-[#475569] leading-relaxed text-[16px] sm:text-[18px]">
            <SafeHtml
              className={`text-[#475569] leading-relaxed text-[16px] sm:text-[18px] ${!isDescriptionExpanded ? "line-clamp-3" : ""}`}
              html={
                description ||
                t("services.details.overviewDefaultDesc", { defaultValue: "I specialize in crafting premium digital products that don't just look beautiful but drive real business results. My approach combines rigorous user research with world-class aesthetic execution, ensuring every pixel serves a purpose." })
              }
              config="MODERATE"
            />
            <button 
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-blueSite font-bold hover:underline self-start"
            >
              {isDescriptionExpanded 
                ? t("services.details.seeLess", { defaultValue: "See Less." })
                : t("services.details.seeMore", { defaultValue: "See More." })}
            </button>
          </div>

          {/* Attribute Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-[#00664F0D] p-5 rounded-[12px] flex flex-col items-center justify-center text-center gap-2 border border-gray-100">
              <MdOutlineCategory size={24} className="text-[#00664F]" />
              <div>
                <span className="text-subTitleColor text-[14px]  uppercase tracking-wider block mb-1">
                  {t("services.details.categoryLabel", { defaultValue: "CATEGORY" })}
                </span>
                <span className="text-subTitleColor font-bold text-[18px]">
                  {service_category?.name || t("services.details.defaultCategory", { defaultValue: "UI/UX Design" })}
                </span>
              </div>
            </div>

            <div className="bg-[#00664F0D] p-5 rounded-[12px] flex flex-col items-center justify-center text-center gap-2 border border-gray-100">
              <TbFileEuro size={24} className="text-[#00664F]" />
              <div>
                <span className="text-subTitleColor text-[14px]  uppercase tracking-wider block mb-1">
                  {t("services.details.serviceTypeLabel", { defaultValue: "SERVICE TYPE" })}
                </span>
                <span className="text-subTitleColor font-bold capitalize text-[18px]">
                  {type ? t(`filters.service_types.${type}`) : t("services.details.defaultServiceType", { defaultValue: "Custom Project" })}
                </span>
              </div>
            </div>
            <div className="bg-[#00664F0D] p-5 rounded-[12px] flex flex-col items-center justify-center text-center gap-2 border border-gray-100">
              <PiMapPinAreaFill size={24} className="text-[#00664F]" />
              <div>
                <span className="text-subTitleColor text-[14px]  uppercase tracking-wider block mb-1">
                  {t("services.details.serviceModelLabel", { defaultValue: "SERVICE MODEL" })}
                </span>
                <span className="text-subTitleColor text-[18px] font-bold">
                  {t("services.details.fullyRemote", { defaultValue: "Fully Remote" })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Packages Section */}
        <ServicePackagesSection 
          plans={plans} 
          selectedPlanId={selectedPlanId}
          onPlanChange={onPlanChange}
        />

        {/* FAQ Section */}
        <div className="pt-2">
          <FAQTab faqs={faqs} isEmbedded={true} />
        </div>

        {/* Projects Section */}
        {apiProjects.length > 0 && (
          <div className="pt-2">
            <ServiceProjectsSection projects={apiProjects} onTabChange={onTabChange} />
          </div>
        )}

        {/* Reviews Section */}
        <div className="pt-2">
          <ServiceReviewsSection />
        </div>
      </div>

      {/* Right Column - Sticky Sidebar */}
      <BookingSidebar service={service} price={price} selectedPlan={selectedPlan} />
    </div>
  );
};

export default OverviewTab;
