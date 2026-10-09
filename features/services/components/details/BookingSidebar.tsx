"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { MdOutlineTimer, MdSync, MdOutlineSecurity } from "react-icons/md";
import { Layers } from "lucide-react";
import { ServiceDetails, ServicePlan } from "../../types/type";
import Image from "next/image";
import Link from "next/link";
import RequestMilestoneModal from "./modals/RequestMilestoneModal";

interface BookingSidebarProps {
  service: ServiceDetails;
  price: string;
  selectedPlan?: ServicePlan;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ service, price, selectedPlan }) => {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const provider = service.service_provider;
  const plans = service.plans || [];
  const defaultPlan = selectedPlan || (plans.length > 0 ? plans[0] : null);

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const handleOrderNow = () => {
    router.push(`/${locale}/dashboard?tab=service_market&subTab=create_order&serviceId=${service.id}${defaultPlan ? `&planId=${defaultPlan.id}` : ''}`);
  };

  return (
    <>
    <div className="lg:col-span-1  border-gray-100 lg:pl-12">
      <div className="sticky top-36 bg-white border border-gray-100 rounded-[12px] p-6 shadow-[0_25px_50px_rgb(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-[#e6f0ee] text-blueSite text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {defaultPlan ? defaultPlan.title : t("serviceCard.planTitle", { defaultValue: "PLAN TITLE" })}
          </span>
          <span className="text-[28px] font-bold text-[#00664F]">
            {defaultPlan ? `${defaultPlan.price} ${defaultPlan.currency}` : (parseFloat(price) ? `$${parseFloat(price).toLocaleString()}` : "$2,800")}
          </span>
        </div>

        <p className="text-[#474947] text-[13px] mb-6 mt-3 leading-relaxed">
          {t("services.details.packageSelectionInfo")}
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-[14px] text-subTitleColor font-medium">
            <MdOutlineTimer className="text-blueSite" size={18} />
            <span>
              {typeof defaultPlan?.estimated_delivery_time === 'object'
                ? `${t("services.details.estimatedDeliveryCount", { count: defaultPlan.estimated_delivery_time.value ,unit:defaultPlan.estimated_delivery_time.unit })}`
                : t("services.details.estimatedDeliveryCount", { 
                count: (parseInt(defaultPlan?.estimated_delivery_time as string) || "-") 
              })}
              </span>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-subTitleColor font-medium">
            <MdSync className="text-blueSite" size={18} />
            <span>{defaultPlan?.number_of_revisions ? t("services.details.revisionsIncludedCount", { count: defaultPlan.number_of_revisions }) : t("services.details.revisionsIncludedCount", { count: "-" })}</span>
          </div>
          <div className="flex items-start gap-3 text-[13px] text-subTitleColor mt-2">
            <MdOutlineSecurity
              className="text-blueSite mt-0.5 flex-shrink-0"
              size={16}
            />
            <span className="leading-snug">
              {t("services.details.revisionRequestInfoPart1")}
            <span className="text-red-500 font-bold">
              {typeof defaultPlan?.revision_window === 'object'
                ? `${defaultPlan.revision_window.value} ${defaultPlan.revision_window.unit}`
                : (defaultPlan?.revision_window || t("services.details.revisionWindow", { count: "-" }))}
            </span>
              {t("services.details.revisionRequestInfoPart2")}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleOrderNow}
            className=" text-[18px] w-full py-3 bg-blueSite hover:bg-[#00523F] transition-colors text-white font-bold rounded-lg pb-[14px]"
          >
            {t("services.details.orderNow")}
          </button>
          <button
            onClick={() => setIsMilestoneModalOpen(true)}
            className="text-[16px] w-full py-3 bg-white border border-[#00664F] text-[#00664F] hover:bg-[#00664F0A] transition-colors font-bold rounded-lg pb-[14px] inline-flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" />
            {t("services.details.requestMilestonePay", { defaultValue: "Request milestone-pay" })}
          </button>
          <button className=" text-[18px] w-full py-3 bg-[#eef2f1] hover:bg-[#e4ebec] transition-colors text-[#2C3E3A] font-bold rounded-lg pb-[14px]">
            {t("services.details.contactSeller")}
          </button>
        </div>

        <RequestMilestoneModal
          isOpen={isMilestoneModalOpen}
          onClose={() => setIsMilestoneModalOpen(false)}
          serviceId={service.id}
          serviceTitle={service.title}
        />

        <div className="mt-8  flex items-center gap-4 bg-[#FAFAFA] p-4 rounded-xl border border-gray-100">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            <Link href={`/services/provider_profile/${provider?.id}`} >
            <Image
              src={"/user.png"} // Update when provider photo is added to API
              alt={provider?.display_name || "Seller"}
              fill
              className="object-cover"
            />
            </Link>
          </div>
          <div>
            <Link href={`/services/provider_profile/${provider?.id}`} >
              <h4 className="font-bold text-sm text-subTitleColor line-clamp-1">
                {provider?.display_name || "Alex Thompson"}
              </h4>
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px] texg-blueSbg-blueSite font-semibold">
                {t("services.details.availableNow")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8">
          {t("services.details.trustedByBrands")}
        </p>
      </div>
    </div>
    
    </>
  );
};

export default BookingSidebar;
