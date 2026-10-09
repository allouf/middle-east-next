'use client';

import React from "react";
import ShoppingCartIcon from "@/assets/icons/shopping-cart.svg";
import RotateLeftIcon from "@/assets/icons/rotate-left.svg";
import KeyholeIcon from "@/assets/icons/keyhole.svg";
import TrophyIcon from "@/assets/icons/trophy.svg";

const ProductHighlights = () => {
  const highlights = [
    {
      icon: ShoppingCartIcon,
      title: "Free Shipping",
      desc: "When ordering over 100$",
    },
    {
      icon: RotateLeftIcon,
      title: "Free Return",
      desc: "Get return within 30 day",
    },
    {
      icon: KeyholeIcon,
      title: "Secure payment",
      desc: "100% secure online payment",
    },
    {
      icon: TrophyIcon,
      title: "Best Quality",
      desc: "Original product Guarenteed",
    },
  ];

  return (
    <div 
      className="rounded-[10px] px-4 md:px-6 lg:px-8 xl:px-[50px] mb-8 w-full flex items-center overflow-hidden"
      style={{ 
        backgroundColor: "#E7F5FD",
        minHeight: "137px"
      }}
    >
      <div className="flex items-center justify-between w-full gap-3 md:gap-4 lg:gap-6 xl:gap-8">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-1 min-w-0"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <h3
                className="font-bold uppercase whitespace-nowrap"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(12px, 1vw, 18px)",
                  lineHeight: "1.2em",
                  color: "#32A7EF",
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

