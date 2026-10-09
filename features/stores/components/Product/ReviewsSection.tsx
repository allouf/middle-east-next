'use client';

import React from "react";
import { motion } from "framer-motion";
import ProductRate from "../../../../components/cards/product/ProductRate";
import { useTranslation } from "@/lib/i18n/useTranslation";

const reviews = [
  {
    id: 1,
    name: "Annette Black",
    date: "26 Apr, 2021",
    avatar: "https://i.pravatar.cc/50?img=1",
    comment:
      "In a nisl commodo, porttitor ligula consequat, tincidunt dui. Nulla volutpat, metus eu aliquam malesuada, elit libero venenatis urna.",
    images: [
      "https://placehold.co/100x100",
      "https://placehold.co/100x100",
      "https://placehold.co/100x100",
    ],
  },
  {
    id: 2,
    name: "Devon Lane",
    date: "24 Apr, 2021",
    avatar: "https://i.pravatar.cc/50?img=2",
    comment:
      "Quisque eget tortor lobortis, facilisis metus eu, elementum est. Nunc sit amet erat quis ex convallis suscipit.",
  },
  {
    id: 3,
    name: "Jacob Jones",
    date: "19 Apr, 2021",
    avatar: "https://i.pravatar.cc/50?img=3",
    comment:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
  },
  {
    id: 4,
    name: "Jane Cooper",
    date: "18 Apr, 2021",
    avatar: "https://i.pravatar.cc/50?img=4",
    comment:
      "Pellentesque feugiat, nibh vel vehicula pretium, nibh nibh bibendum elit, a volutpat arcu dui nec orci.",
  },
  {
    id: 5,
    name: "Darrell Steward",
    date: "7 Apr, 2021",
    avatar: "https://i.pravatar.cc/50?img=5",
    comment: "Nulla molestie interdum ultrices.",
  },
];

const ratingData = [
  { stars: 5, percentage: 73 },
  { stars: 4, percentage: 55 },
  { stars: 3, percentage: 10 },
  { stars: 2, percentage: 49 },
  { stars: 1, percentage: 5 },
];
const ReviewsSection = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ translateY: -15 }}
      animate={{ translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
      {/* Left: Rating Summary */}
      <div className=" md:col-span-5 col-span-12 flex flex-col items-center justify-center text-center ">
        <h1 className="text-[70px] font-bold text-[#338572]">4.4</h1>
        <div className="flex items-center gap-1 mt-1">
          <ProductRate rating={4.4} size={40} hideText={true} />
        </div>
        <p className="text-subTitleColor font-semibold text-[24px] mt-2">
          {t("product.reviews.basedOn")} 532 {t("product.reviews.reviews")}
        </p>

        <div className="mt-6 w-full max-w-xs space-y-3">
          {ratingData.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="w-4 text-sm font-medium">{item.stars}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-[#32A7EF] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-textColor">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Comments */}
      <div className="md:col-span-7 col-span-12 px-6">
        <h2 className="text-lg font-semibold mb-6">{t("product.reviews.comments")}</h2>
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-4 border-b border-[#D0D5DD] pb-3">
              <img
                src={r.avatar}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-subTitleColor">{r.name}</p>
                  <p className="text-sm text-textColor">{r.date}</p>
                </div>
                <p className="text-subTitleColor mt-1">{r.comment}</p>

                {/* Optional images */}
                {r.images && (
                  <div className="flex gap-3 mt-3">
                    {r.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={t("product.reviews.review")}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 transition">
            {t("product.reviews.loadMore")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewsSection;
