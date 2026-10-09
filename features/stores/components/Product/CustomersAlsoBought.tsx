'use client';

import React from "react";

const relatedProducts = [
  {
    id: 1,
    name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
    oldPrice: "$1,650",
    newPrice: "$1,500",
    image: "https://placehold.co/80x80",
  },
  {
    id: 2,
    name: "Simple Mobile 4G LTE Prepaid Smartphone",
    oldPrice: "$1,650",
    newPrice: "$1,500",
    image: "https://placehold.co/80x80/blue/white",
  },
  {
    id: 3,
    name: "4K UHD LED Smart TV With Chromecast Built-In",
    oldPrice: "$1,650",
    newPrice: "$1,500",
    image: "https://placehold.co/80x80/red/white",
  },
];

const CustomersAlsoBought = () => {
  return (
    <section className=" sm:px-4 bg-white">
      <h2 className="sm:text-[25px] text-[18px] font-bold text-blueSite mb-6">
        Customer who bought this item :
      </h2>

      {/* Product Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
            />

            <div className="flex flex-col">
              <p className="text-sm font-medium text-subTitleColor line-clamp-2">
                {product.name}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-textColor text-sm line-through">
                  {product.oldPrice}
                </span>
                <span className="text-blueSite font-semibold text-sm">
                  {product.newPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomersAlsoBought;
