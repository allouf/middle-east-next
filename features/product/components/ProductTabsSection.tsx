'use client';

import React, { useState } from "react";
import {
  Headphones,
  CreditCard,
  Handshake,
} from "lucide-react";
import MedalIcon from "@/assets/icons/Medal.svg";
import TruckIcon from "@/assets/icons/Truck.svg";
import ProductReviewsSection from "@/features/stores/components/ProductDetails/ProductReviewsSection";
import { ProductDetails } from "@/features/product/types/type";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";

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
  width,
  height,
  ...props
}) => (
  <Image 
    src={MedalIcon} 
    alt="Medal" 
    className={className} 
    width={typeof width === 'string' ? parseInt(width) || undefined : width}
    height={typeof height === 'string' ? parseInt(height) || undefined : height}
    {...props} 
  />
);

const Truck: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className,
  width,
  height,
  ...props
}) => (
  <Image 
    src={TruckIcon} 
    alt="Truck" 
    className={className} 
    width={typeof width === 'string' ? parseInt(width) || undefined : width}
    height={typeof height === 'string' ? parseInt(height) || undefined : height}
    {...props} 
  />
);

const ProductTabsSection: React.FC<ProductTabsSectionProps> = ({ product }) => {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<"additional" | "reviews">("additional");
  const [messageApi, contextHolder] = message.useMessage();

  const features: Feature[] = [
    {
      icon: Medal,
      text: t('product.freeYearWarranty'),
    },
    {
      icon: Truck,
      text: t('product.freeShippingFastDelivery'),
    },
    {
      icon: Handshake,
      text: t('product.moneyBackGuarantee'),
    },
    {
      icon: Headphones,
      text: t('product.customerSupport'),
    },
    {
      icon: CreditCard,
      text: t('product.securePayment'),
    },
  ];

  const shippingInfo: ShippingInfo[] = [
    {
      label: t('product.courier'),
      value: t('product.courierValue'),
    },
    {
      label: t('product.localShipping'),
      value: t('product.localShippingValue'),
    },
    {
      label: t('product.upsGroundShipping'),
      value: t('product.upsGroundShippingValue'),
    },
    {
      label: t('product.unishopGlobalExport'),
      value: t('product.unishopGlobalExportValue'),
    },
  ];


  return (
    <div className="mb-8">
      {/* Tabs */} 
      {contextHolder}
      <div className="border-b" style={{ borderColor: "#E4E7E9" }}>
        <div className="flex justify-around gap-4 lg:gap-[180px] flex-wrap">
          <button
            onClick={() => setActiveTab("additional")}
            className={`text-md md:text-lg lg:text-[24px] font-normal leading-[1.21] transition-colors ${
              activeTab === "additional"
                ? "text-subTitleColor bg-white border-b-2 border-blueSite px-4 py-3 rounded-sm"
                : "text-textColor px-3 py-3"
            }`}
 
          >
            {t('product.additionalInformation')}
          </button>
          <button
            onClick={() => {
              setActiveTab("reviews");
              messageApi.info(t('product.dummyDataMessage'));
            }}
            className={`text-md md:text-lg lg:text-[24px] font-normal leading-[1.21] transition-colors ${
              activeTab === "reviews"
                ? "text-subTitleColor bg-white border-b-2 border-blueSite px-4 py-3 rounded-sm"
                : "text-textColor px-3 py-3"
            }`}

          >
            {t('product.theReviews')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "additional" && (
          <div className="md:pt-8 pt-5">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Return Policy / Description */}
              <div className="space-y-4 lg:pr-8">
                <h3 className="md:text-xl text-lg font-semibold text-subTitleColor">
                  {t('product.returnPolicyInfo')}
                </h3>
                <p className="sm:text-base text-sm text-subTitleColor leading-relaxed whitespace-pre-line">
                  {t('product.returnPolicyDescription')}
                </p>
              </div>

              {/* More Features */}
              <div className="space-y-4 lg:px-4">
                <h3 className="md:text-xl text-lg font-semibold text-subTitleColor">
                  {t('product.moreFeature')}
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
                <h3 className="md:text-xl text-lg font-semibold text-subTitleColor">
                  {t('product.shippingInformation')}
                </h3>
                <div className="space-y-3">
                  {shippingInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <span className={`sm:text-base text-sm font-semibold text-subTitleColor ${
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
