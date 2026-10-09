"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Clock } from "lucide-react";
import { Input, Select } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Image from "next/image";

interface RejectedAd {
  id: string | number;
  title: string;
  image: string;
  reason: string;
  description: string;
  date: string;
}

const mockRejectedAds: RejectedAd[] = [
  {
    id: 1,
    title: "LG C2 42 (106CM) 4K SMART OLED EVO TV I WEB OS I CINEMA HDR",
    image: "/assets/images/placeholder.png", // Using a placeholder for now as I don't have the specific image
    reason:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    description:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    date: "2Weeks ago",
  },
  {
    id: 2,
    title: "LG C2 42 (106CM) 4K SMART OLED EVO TV I WEB OS I CINEMA HDR",
    image: "/assets/images/placeholder.png",
    reason:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    description:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    date: "2Weeks ago",
  },
  {
    id: 3,
    title: "LG C2 42 (106CM) 4K SMART OLED EVO TV I WEB OS I CINEMA HDR",
    image: "/assets/images/placeholder.png",
    reason:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    description:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    date: "2Weeks ago",
  },
  {
    id: 4,
    title: "LG C2 42 (106CM) 4K SMART OLED EVO TV I WEB OS I CINEMA HDR",
    image: "/assets/images/placeholder.png",
    reason:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    description:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    date: "2Weeks ago",
  },
  {
    id: 5,
    title: "LG C2 42 (106CM) 4K SMART OLED EVO TV I WEB OS I CINEMA HDR",
    image: "/assets/images/placeholder.png",
    reason:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    description:
      "Premium Noise-Cancelling Headphones with Bluetooth 5.2Premium Noise-Cancelling Headphones.",
    date: "2Weeks ago",
  },
];

interface UsedMarketInboxProps {
  onBack: () => void;
}

const UsedMarketInbox: React.FC<UsedMarketInboxProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="p-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#00664F] mb-6 hover:opacity-80 transition-opacity font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        {t("usedMarket.rejectedAds.goBack")}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl text-gray-800">
          {t("usedMarket.rejectedAds.title")} :
        </h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="flex-1 max-w-md">
          <Input
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            placeholder={t("usedMarket.rejectedAds.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 bg-white border-gray-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm whitespace-nowrap">
            {t("usedMarket.rejectedAds.sortBy")}
          </span>
          <Select
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "newest", label: t("usedMarket.rejectedAds.newest") },
            ]}
            className="w-32"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {mockRejectedAds.map((ad) => (
          <div
            key={ad.id}
            className="flex flex-col md:flex-row gap-4 p-4 bg-[#FCFCFC] rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow"
          >
            {/* Image */}
            <div className="w-[100px] md:w-[120px] h-[100px] bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative border border-gray-100">
              {/* Using a placeholder SVG if image fails or for demo */}
              <div className="w-12 h-12 text-gray-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              {/* In real implementation: 
               <Image src={ad.image} alt={ad.title} fill className="object-cover" /> 
               */}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                    {ad.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{ad.date}</span>
                  </div>
                </div>

                <div className="mb-1">
                  <span className="text-[#CA1417] text-xs font-semibold mr-1">
                    {t("usedMarket.rejectedAds.reason")}
                  </span>
                </div>

                <p className="text-gray-400 text-xs line-clamp-1">
                  {ad.reason}
                </p>
              </div>

              <div className="flex justify-end mt-2 md:mt-0">
                <button className="text-[#00664F] text-xs font-medium hover:underline border-b border-[#00664F] pb-0.5">
                  {t("usedMarket.rejectedAds.seeDetails")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsedMarketInbox;
