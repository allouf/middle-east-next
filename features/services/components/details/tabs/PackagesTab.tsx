"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import { FaCheck } from "react-icons/fa";
import { MdOutlineTimer, MdSync, MdOutlineSecurity } from "react-icons/md";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { CursorClicking } from "@/components/Icons/CursorClicking";
import { ServicePlan } from "../../../types/type";
import PackageModal, { PackageDef } from "../modals/PackageModal";

interface PackagesTabProps {
  plans: ServicePlan[];
  onPlanChange?: (planId: string) => void;
}

const PackagesTab: React.FC<PackagesTabProps> = ({
  plans = [],
  onPlanChange,
}) => {
  const { t } = useTranslation();
  const [selectedPackage, setSelectedPackage] = useState<PackageDef | null>(null);
  const [expandedPackageKeys, setExpandedPackageKeys] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedPackageKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Map API plans to PackageDef
  const packages: PackageDef[] = plans.map((plan) => ({
    key: plan.id.toString(),
    tabLabel: plan.title,
    title: plan.title,
    description: plan.revision_scope_rules || t("services.details.defaultPackageDescription", { defaultValue: "Comprehensive service package tailored to your needs." }),
    priceValue: `${plan.price} ${plan.currency}`,
    features: [
     typeof plan.estimated_delivery_time === 'object' 
      ? `${t("services.details.estimatedDeliveryCount", { count: plan.estimated_delivery_time.value ,unit:plan.estimated_delivery_time.unit })}`
      : t("services.details.estimatedDeliveryCount", { 
          count: (parseInt(plan.estimated_delivery_time as string) || "-") 
        }),
      `${t("services.details.revisionsIncludedCount", { count: plan.number_of_revisions || "-", defaultValue: "Included Revisions" })}`,
    ],
    delivery: typeof plan.estimated_delivery_time === 'object' 
      ? `${t("services.details.estimatedDeliveryCount", { count: plan.estimated_delivery_time.value ,unit:plan.estimated_delivery_time.unit })}`
      : t("services.details.estimatedDeliveryCount", { 
          count: (parseInt(plan.estimated_delivery_time as string) || "-") 
        }),
    revisions: t("services.details.revisionsIncludedCount", { count: plan.number_of_revisions || "-" }),
    modDays: typeof plan.revision_window === 'object'
      ? `${plan.revision_window.value} ${plan.revision_window.unit}`
      : t("services.details.revisionWindow", { count: plan.revision_window as any }),
  }));

  if (packages.length === 0) {
    return (
      <div className="container max-sm:px-4 2xl:max-w-[1440px] mx-auto py-10 text-center text-gray-500">
        {t("services.details.noPackagesAvailable", { defaultValue: "No packages available for this service." })}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 container max-sm:px-4 2xl:max-w-[1440px] mx-auto  space-y-6 py-10 2xl:py-16">
      <h3 className="text-[28px] font-bold text-subTitleColor">
        {t("services.details.packagesTabHeader", { defaultValue: "Service Packages" })}
      </h3>

      <div className="border border-[#E2E8F0] rounded-[22px] overflow-hidden bg-white">
        <Tabs
          defaultActiveKey="2"
          centered
          className="package-tabs w-full"
          items={packages.map((pkg) => ({
            key: pkg.key,
            label: (
              <div className="w-full text-center py-3 font-bold text-[15px]">
                {pkg.tabLabel}
              </div>
            ),
            children: (
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-[20px] font-bold text-subTitleColor mb-2">
                      {pkg.title}
                    </h4>
                    <p className={`text-[#474947] text-[14px] ${!expandedPackageKeys[pkg.key] ? "line-clamp-2" : ""}`}>
                      {pkg.description}{" "}
                      <button 
                        onClick={() => toggleExpand(pkg.key)}
                        className="text-[#00664F] font-bold hover:underline whitespace-nowrap"
                      >
                        {expandedPackageKeys[pkg.key] 
                          ? t("services.details.readLess", { defaultValue: "Read Less." })
                          : t("services.details.readMore", { defaultValue: "Read More." })}
                      </button>
                    </p>
                  </div>
                  <div className="text-[28px] font-bold text-[#00664F] whitespace-nowrap">
                    {pkg.priceValue}
                  </div>
                </div>

                <ul className="space-y-3 mt-6 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-[14px] text-[#474947]"
                    >
                      <FaCheck
                        className="text-[#00664F] mt-1 flex-shrink-0"
                        size={12}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#474947]">
                      <MdOutlineTimer className="text-[#00664F]" size={18} />
                      <span className="font-semibold">{pkg.delivery}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#474947]">
                      <MdSync className="text-[#00664F]" size={18} />
                      <span className="font-semibold">
                        {pkg.revisions}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-[#474947] max-w-xs mt-2">
                      <MdOutlineSecurity
                        className="text-[#00664F] mt-0.5"
                        size={18}
                      />
                      <span>
                        {t("services.details.revisionRequestInfoPart1", { defaultValue: "Request modifications within " })}
                        <span className="text-red-500 font-bold">
                          {t("services.details.revisionWindow", { count: pkg.modDays })}
                        </span>{" "}
                        {t("services.details.revisionRequestInfoPart2", { defaultValue: " of the delivery date" })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="w-full sm:w-auto px-10 py-2 bg-[#00664F] hover:bg-[#00523F] transition-colors text-white font-bold rounded-[8px] flex items-center justify-center gap-2"
                  >
                    <CursorClicking />
                    {t("services.details.select", { defaultValue: "Select" })}
                  </button>
                </div>
              </div>
            ),
          }))}
        />
      </div>

      <PackageModal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onSelect={() => {
          if (selectedPackage) {
            onPlanChange?.(selectedPackage.key);
          }
        }}
        selectedPackage={selectedPackage}
      />
    </div>
  );
};

export default PackagesTab;
