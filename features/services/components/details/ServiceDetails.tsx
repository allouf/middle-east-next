"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { Breadcrumb, Tabs } from "antd";
import { Flag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ServiceDetails as IServiceDetails } from "../../types/type";
import { getCountryNameByCode } from "@/shared/utils/locationApi";
import ServiceDetailsHeroBanner from "./ServiceDetailsHeroBanner";
import OverviewTab from "./tabs/OverviewTab";
import PackagesTab from "./tabs/PackagesTab";
import PortfolioTab from "./tabs/PortfolioTab";
import FAQTab from "./tabs/FAQTab";
import AvailabilityTab from "./tabs/AvailabilityTab";
import ReportServiceModal from "./modals/ReportServiceModal";
import ReportSuccessModal from "./modals/ReportSuccessModal";
import ReviewModal from "./modals/ReviewModal";
import ReviewSuccessModal from "./modals/ReviewSuccessModal";
import "./ServiceDetails.css";

// Component Props interface

interface ServiceDetailsProps {
  service: IServiceDetails;
  similarServices?: any[];
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, similarServices = [] }) => {
  const { t } = useTranslation();
  const [countryName, setCountryName] = useState<string>('-');

  const {
    id,
    title,
    description,
    price_from,
    cover,
    media,
    service_provider,
    service_category,
    service_subcategory,
    type,
    plans,
    faqs,
    available_slots,
    created_at
  } = service;

  console.log("service Info",service)

  const [activeTab, setActiveTab] = useState("1");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportSuccessModalOpen, setIsReportSuccessModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReviewSuccessModalOpen, setIsReviewSuccessModalOpen] = useState(false);
  const [submittedReviewData, setSubmittedReviewData] = useState({ rating: 5, comment: "" });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    plans && plans.length > 0 ? plans[0].id.toString() : null
  );

  useEffect(() => {
    window.scrollTo({ top: 350, behavior: "smooth" });
  }, [activeTab]);

  useEffect(() => {
    const load = async () => {
      if (service_provider?.country_code) {
        const name = await getCountryNameByCode(service_provider.country_code);
        setCountryName(name);
      }
    };
    load();
  }, [service_provider?.country_code]);

  const serviceImages = cover?.url ? [cover.url] : (service.media && service.media.length > 0 ? [service.media[0].url] : ["/dummy/prod21.png"]);


  const handleReportSuccess = () => {
    setIsReportModalOpen(false);
    setIsReportSuccessModalOpen(true);
  };

  return (
    <div className="w-full">
      <ServiceDetailsHeroBanner 
        title={title}
        category={service_category?.name || "General"}
        categoryId={service_category?.id}
        subcategory={service_subcategory?.name || ""}
        subCategoryId={service_subcategory?.id}
        packageType={type ? t(`filters.service_types.${type}`) : t("services.fixedPricePackage", { defaultValue: "Fixed Price Package" })}
        rating={0} // To be added to API response later
        reviewsCount={0}
        sellerType={t("services.details.topRatedSeller", { defaultValue: "Top Rated Seller" })}
      />
      <div className="w-full pb-4 animate-in fade-in duration-500">
        <div className="border-b border-gray-200">
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            className="custom-tabs w-full"
            tabBarExtraContent={
              <div className="flex items-center gap-4">
                {/* <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors font-medium text-sm"
                >
                  <Star size={16} fill="currentColor" />
                  {t("services.addReview",{defaultValue:"Add Review"}) || "Add Review"}
                </button> */}
                <button 
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors font-medium text-sm"
                >
                  <Flag size={16} />
                  {t("services.details.reportService", { defaultValue: "Report Service" })}
                </button>
              </div>
            }
            items={[
              {
                key: '1',
                label: t("services.details.overview", { defaultValue: "OVERVIEW" }),
                children: (
                  <OverviewTab 
                    service={service}
                    title={title}
                    description={description||""}
                    price={price_from?.toString() || "0"}
                    id={id}
                    onTabChange={setActiveTab}
                    selectedPlanId={selectedPlanId}
                    onPlanChange={setSelectedPlanId}
                  />
                )
              },
              {
                key: '2',
                label: t("services.details.packages", { defaultValue: "PACKAGES" }),
                children: <PackagesTab plans={plans} onPlanChange={(planId) => {
                  setSelectedPlanId(planId);
                  setActiveTab("1");
                }} />,
              },
              {
                key: '3',
                label: t("services.details.portfolio", { defaultValue: "PORTFOLIO" }),
                children: <PortfolioTab onTabChange={setActiveTab} id={id} />,
              },
              {
                key: '4',
                label: t("services.details.faq", { defaultValue: "FAQ" }),
                children: <FAQTab faqs={faqs} />,
              },
              {
                key: '5',
                label: t("services.details.availability", { defaultValue: "AVAILABILITY" }),
                children: <AvailabilityTab availableSlots={available_slots} />,
              },
            ]}
          />
        </div>
      </div> 

      

      <ReportServiceModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={handleReportSuccess}
        serviceId={id}
        serviceTitle={title}
        serviceImage={serviceImages[0]}
        serviceDescription={description}
      />

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)}
        serviceId={id}
        serviceTitle={title}
        serviceImage={serviceImages[0]}
        onSuccess={(data) => {
          setIsReviewModalOpen(false);
          setSubmittedReviewData(data);
          setIsReviewSuccessModalOpen(true);
        }}
      />

      <ReviewSuccessModal
        isOpen={isReviewSuccessModalOpen}
        onClose={() => setIsReviewSuccessModalOpen(false)}
        onReturnToOrder={() => setIsReviewSuccessModalOpen(false)}
        rating={submittedReviewData.rating}
        comment={submittedReviewData.comment}
      />

      <ReportSuccessModal
        isOpen={isReportSuccessModalOpen}
        onClose={() => setIsReportSuccessModalOpen(false)}
        onReturnToService={() => setIsReportSuccessModalOpen(false)}
        serviceId={id}
        serviceTitle={title}
        serviceImage={serviceImages[0]}
        serviceDescription={description}
      />
    </div>
  );
};

export default ServiceDetails;
