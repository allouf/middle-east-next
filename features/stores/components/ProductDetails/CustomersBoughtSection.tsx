'use client';

import { useRouter } from 'next/navigation';
import React from "react";
import { SuggestedProduct } from '@/features/product/types/type';

interface CustomersBoughtSectionProps {
  products?: SuggestedProduct[];
}

const CustomersBoughtSection: React.FC<CustomersBoughtSectionProps> = ({ products = [] }) => {
  const router = useRouter();

  // Limit to maximum 3 products
  const displayProducts = products.slice(0, 3);

  if (!displayProducts || displayProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-8">
      <h2 
        className="text-2xl md:text-[32px] font-bold mb-6"
        style={{ 
          fontFamily: "Inter, sans-serif",
          color: '#0B5C8E',
          lineHeight: "1.2102272510528564em"
        }}
      >
        Customer who bought this item :
      </h2>

      <div className="flex flex-wrap items-center gap-4 md:gap-[29px]">
        {displayProducts.map((product: SuggestedProduct) => {
          const imageUrl = 
            product.gallery?.[0]?.file_path ||
            "/dummy/prod21.png";
          
          const hasDiscount = 
            product.price_before_discount && 
            product.price_before_discount > product.price;
          
          const oldPrice = product.price_before_discount || product.price;
          const newPrice = product.price;

          return (
            <div
              key={product.id}
              onClick={() => router.push(`/products/${String(product.id)}`)}
              className="flex items-center gap-3 p-3 bg-white border border-[#E4E7E9] rounded-[10px] cursor-pointer hover:shadow-md transition-all w-full lg:max-w-[557px] min-h-[156px]"
            >
              {/* Product Image */}
              <div 
                className="flex-shrink-0 bg-gray-100 rounded overflow-hidden"
                style={{
                  width: "80px",
                  height: "80px",
                }}
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = "/dummy/prod21.png";
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {/* Product Name */}
                <h3
                  className="font-normal text-[#191C1F] line-clamp-2"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.2102272510528564em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-1">
                  {hasDiscount && (
                    <span
                      className="line-through"
                      style={{
                        fontFamily: "Public Sans, sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.4285714285714286em",
                        color: "#929FA5",
                        fontWeight: 400,
                      }}
                    >
                      ${typeof oldPrice === 'number' ? oldPrice.toLocaleString() : oldPrice}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "18px",
                      lineHeight: "1.2102272245619032em",
                      color: "#2DA5F3",
                      fontWeight: 600,
                    }}
                  >
                    ${typeof newPrice === 'number' ? newPrice.toLocaleString() : newPrice}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomersBoughtSection;

