"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Ticket, Package, RefreshCw } from "lucide-react";
import SLASettings from "./SlaRule/SLASettings";
import StorePolicies from "./StorePolicies/StorePolicies";

type TabKey = "sla" | "shipping" | "return" | "return2";

const StoreSettings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("sla");

  const tabs = [
    {
      key: "sla" as TabKey,
      label: t("store_management.sla"),
      icon: <Ticket size={18} />,
      disabled: false,
    },
    {
      key: "shipping" as TabKey,
      label: t("store_policies.shipping"),
      icon: <Package size={18} />,
      disabled: true,
    },
    {
      key: "return" as TabKey,
      label: t("store_policies.return"),
      icon: <RefreshCw size={18} />,
      disabled: true,
    },
    {
      key: "return2" as TabKey, // Duplicate return policies as per image
      label: t("store_policies.return"),
      icon: <RefreshCw size={18} />,
      disabled: true,
    },
  ];

  return (
    <div className="w-full px-3 md:px-5 py-3 md:py-5">
      <h2 className="text-xl md:text-2xl font-semibold text-subTitleColor mb-3 md:mb-4">
        {t("store_management.settings")}
      </h2>

      {/* Tabs Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center overflow-x-auto scrollbar-hide md:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => !tab.disabled && setActiveTab(tab.key)}
              disabled={tab.disabled}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap min-w-fit ${
                activeTab === tab.key
                  ? "text-[#347d6a]"
                  : tab.disabled
                  ? "text-gray-400 cursor-not-allowed opacity-60"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {activeTab === tab.key ? (
                <span className="bg-[#eaf4f1] p-1 rounded-full text-[#347d6a] flex-shrink-0">
                 {tab.icon}
                </span>
              ) : (
                  <span className={`bg-gray-200 p-1 rounded-full flex-shrink-0 ${tab.disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tab.icon}
                  </span>
              )}
              <span className="text-xs md:text-sm">{tab.label}</span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#347d6a] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-3 md:mt-4">
        {activeTab === "sla" && <SLASettings />}
        {activeTab === "shipping" && <StorePolicies type="shipping" />}
        {activeTab === "return" && <StorePolicies type="return" />}
      </div>
    </div>
  );
};

export default StoreSettings;
