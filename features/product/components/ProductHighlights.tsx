import React from "react";
import Image from "next/image";
import ShoppingCartIcon from "@/assets/icons/shopping-cart.svg";
import RotateLeftIcon from "@/assets/icons/rotate-left.svg";
import KeyholeIcon from "@/assets/icons/keyhole.svg";
import TrophyIcon from "@/assets/icons/trophy.svg";
import { useTranslation } from "@/lib/i18n/useTranslation";

const ProductHighlights = () => {
  const {t} = useTranslation();
  const highlights = [
    {
      icon: ShoppingCartIcon,
      title: t('product.freeShippingHighlight'),
      desc: t('product.freeShippingDesc'),
    },
    {
      icon: RotateLeftIcon,
      title: t('product.freeReturn'),
      desc: t('product.freeReturnDesc'),
    },
    {
      icon: KeyholeIcon,
      title: t('product.securePaymentHighlight'),
      desc: t('product.securePaymentDesc'),
    },
    {
      icon: TrophyIcon,
      title: t('product.bestQuality'),
      desc: t('product.bestQualityDesc'),
    },
  ];

  return (
    <div 
      className="rounded-[10px] py-8 bg-blueLight px-4 md:px-6 lg:px-8 xl:px-[50px] mb-8 w-full flex items-center overflow-hidden"

    >
      <div className="flex flex-row flex-wrap items-center justify-between w-full max-lg:gap-y-6 gap-3 md:gap-4 lg:gap-6 xl:gap-8">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex min-w-[160px] items-center gap-2 md:gap-3 lg:gap-4 flex-1 "
          >
            <Image
              src={item.icon}
              alt={item.title}
              width={48}
              height={48}
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <h3
                className="font-bold text-blueSite uppercase whitespace-nowrap"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(12px, 1vw, 18px)",
                  lineHeight: "1.2em",
                  
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </h3>
              <p
                className="font-normal uppercase"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(10px, 0.9vw, 16px)",
                  lineHeight: "1.2em",
                  color: "#323232",
                }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlights;

