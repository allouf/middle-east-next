"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import { FaCheck } from "react-icons/fa";
import { MdOutlineTimer, MdSync, MdOutlineSecurity } from "react-icons/md";
import { CursorClicking } from "@/components/Icons/CursorClicking";
import { useTranslation } from "@/lib/i18n/useTranslation";

import PackageModal, { PackageDef } from "./modals/PackageModal";
import { ServicePlan } from "../../types/type";

interface ServicePackagesSectionProps {
  plans: ServicePlan[];
  selectedPlanId?: string | null;
  onPlanChange?: (planId: string) => void;
}

const ServicePackagesSection: React.FC<ServicePackagesSectionProps> = ({
  plans = [],
  selectedPlanId,
  onPlanChange,
}) => {
  const { t } = useTranslation();
  const [selectedPackage, setSelectedPackage] = useState<PackageDef | null>(null);
  const [expandedPackageKeys, setExpandedPackageKeys] = useState<Record<string, boolean>>({});
  const [activeTabKey, setActiveTabKey] = useState<string | undefined>(
    selectedPlanId || (plans.length > 0 ? plans[0].id.toString() : undefined)
  );

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
    return null; // Don't show the section if no plans
  }

  return (
    <div className="space-y-6">
      <h3 className="text-[28px] font-bold text-subTitleColor">
        {t("services.details.packagesHeader", { defaultValue: "Service Packages" })}
      </h3>

      <div className="border border-[#E2E8F0] rounded-[22px] overflow-hidden bg-white">
        <Tabs
          activeKey={activeTabKey || (packages.length > 0 ? packages[0].key : undefined)}
          onChange={(key) => setActiveTabKey(key)}
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
                        className="text-blueSite font-bold hover:underline whitespace-nowrap"
                      >
                        {expandedPackageKeys[pkg.key] 
                          ? t("services.details.readLess", { defaultValue: "Read Less." })
                          : t("services.details.readMore", { defaultValue: "Read More." })}
                      </button>
                    </p>
                  </div>
                  <div className="text-[28px] font-bold text-blueSite whitespace-nowrap">
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
                        className="text-blueSite mt-1 flex-shrink-0"
                        size={12}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#474947]">
                      <MdOutlineTimer className="text-blueSite" size={18} />
                      <span className="font-semibold">{pkg.delivery}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#474947]">
                      <MdSync className="text-blueSite" size={18} />
                      <span className="font-semibold">
                        {pkg.revisions}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-[#474947] max-w-xs mt-2">
                      <MdOutlineSecurity
                        className="text-blueSite mt-0.5"
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
                    className="w-full sm:w-auto px-10 py-2 bg-blueSite hover:bg-[#00523F] transition-colors text-white font-bold rounded-[8px] flex items-center justify-center gap-2"
                  >
                    <CursorClicking />
                    {t("services.details.selectPackage", { defaultValue: "Select" })}
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

export default ServicePackagesSection;
