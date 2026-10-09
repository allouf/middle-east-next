'use client';

import React, { useState } from "react";
import {
  Headphones,
  CreditCard,
  Handshake,
} from "lucide-react";
import MedalIcon from "@/assets/icons/Medal.svg";
import TruckIcon from "@/assets/icons/Truck.svg";
import ProductReviewsSection from "./ProductReviewsSection";
import { ProductDetails } from "@/features/product/types/type";

interface Feature {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}

interface ShippingInfo {
  label: string;
  value: string;
}

interface ProductTabsSectionProps {
  product: ProductDetails;
}

// SVG Icon Components
const Medal: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className,
  ...props
}) => (
  <img src={MedalIcon} alt="Medal" className={className} {...props} />
);

const Truck: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className,
  ...props
}) => (
  <img src={TruckIcon} alt="Truck" className={className} {...props} />
);

const ProductTabsSection: React.FC<ProductTabsSectionProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<"additional" | "reviews">("additional");

  const features: Feature[] = [
    {
      icon: Medal,
      text: "Free 1 Year Warranty",
    },
    {
      icon: Truck,
      text: "Free Shipping & Fasted Delivery",
    },
    {
      icon: Handshake,
      text: "100% Money-back guarantee",
    },
    {
      icon: Headphones,
      text: "24/7 Customer support",
    },
    {
      icon: CreditCard,
      text: "Secure payment method",
    },
  ];

  const shippingInfo: ShippingInfo[] = [
    {
      label: "Courier:",
      value: "2 - 4 days, free shipping",
    },
    {
      label: "Local Shipping:",
      value: "up to one week, $19.00",
    },
    {
      label: "UPS Ground Shipping:",
      value: "4 - 6 days, $29.00",
    },
    {
      label: "Unishop Global Export:",
      value: "3 - 4 days, $39.00",
    },
  ];


  return (
    <div className="mb-8">
      {/* Tabs */}
      <div className="border-b" style={{ borderColor: "#E4E7E9" }}>
        <div className="flex gap-4 lg:gap-[180px] flex-wrap">
          <button
            onClick={() => setActiveTab("additional")}
            className={`text-lg lg:text-[24px] font-normal leading-[1.21] transition-colors ${
              activeTab === "additional"
                ? "text-[#323232] bg-white"
                : "text-[#747474]"
            }`}
            style={{
              fontFamily: "Inter",
              padding: activeTab === "additional" ? "24.44px 27.15px" : "13.58px 27.15px",
              boxShadow:
                activeTab === "additional"
                  ? "inset 0px -4.07px 0px 0px rgba(50, 165, 239, 1), inset 0px 1.36px 0px 0px rgba(228, 231, 233, 1)"
                  : "none",
              borderRadius: activeTab === "additional" ? "2.72px" : "0",
            }}
          >
            Additional information
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`text-lg lg:text-[24px] font-normal leading-[1.21] transition-colors ${
              activeTab === "reviews"
                ? "text-[#323232] bg-white"
                : "text-[#747474]"
            }`}
            style={{
              fontFamily: "Inter",
              padding: activeTab === "reviews" ? "24.44px 27.15px" : "13.58px 27.15px",
              boxShadow:
                activeTab === "reviews"
                  ? "inset 0px -4.07px 0px 0px rgba(50, 165, 239, 1), inset 0px 1.36px 0px 0px rgba(228, 231, 233, 1)"
                  : "none",
              borderRadius: activeTab === "reviews" ? "2.72px" : "0",
            }}
          >
            The reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "additional" && (
          <div style={{ paddingTop: "60px" }}>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Return Policy / Description */}
              <div className="space-y-4 lg:pr-8">
                <h3 className="text-xl font-semibold text-subTitleColor">
                  Return Policy information :
                </h3>
                <p className="text-base text-subTitleColor leading-relaxed whitespace-pre-line">
                  The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life. Add to that a stunning Liquid Retina XDR display, the best camera and audio ever in a Mac notebook, and all the ports you need. The first notebook of its kind, this MacBook Pro is a beast. M1 Pro takes the exceptional performance of the M1 architecture to a whole new level for pro users.
                  {"\n\n"}
                  Even the most ambitious projects are easily handled with up to 10 CPU cores, up to 16 GPU cores, a 16‑core Neural Engine, and dedicated encode and decode media engines that support H.264, HEVC, and ProRes codecs.
                </p>
              </div>

              {/* More Features */}
              <div className="space-y-4 lg:px-4">
                <h3 className="text-xl font-semibold text-subTitleColor">
                  More Feature
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-subTitleColor"
                    >
                      <feature.icon
                        className="w-6 h-6 text-blueIcons"
                        strokeWidth={2.2}
                      />
                      <span className="text-base font-medium text-subTitleColor">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-4 lg:pl-8">
                <h3 className="text-xl font-semibold text-subTitleColor">
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  {shippingInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <span className={`text-base font-semibold text-subTitleColor ${
                        index === 0 ? "" : index === 1 ? "min-w-[120px]" : "min-w-[140px]"
                      }`}>
                        {info.label}
                      </span>
                      <span className="text-base text-subTitleColor">
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && <ProductReviewsSection product={product} />}
      </div>
    </div>
  );
};

export default ProductTabsSection;
