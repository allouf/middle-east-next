'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo } from "react";
import { SuggestedProduct } from '@/features/product/types/type';

interface BestSellerProps {
  products?: SuggestedProduct[];
  title?: string;
  columns?: number;
}

interface ProcessedItem {
  id: number | string;
  name: string;
  imageUrl: string;
  oldPrice: number;
  newPrice: number;
  hasDiscount: boolean;
}

const splitIntoColumns = (items: ProcessedItem[], columns: number): ProcessedItem[][] => {
  const cols = Array.from({ length: columns }, () => [] as ProcessedItem[]);
  items.forEach((item, idx) => {
    cols[idx % columns].push(item);
  });
  return cols;
};

const BestSeller: React.FC<BestSellerProps> = ({ products = [], title = "Best Sellers :", columns = 3 }) => {
  const router = useRouter();

  const items = useMemo((): ProcessedItem[] => {
    return (products || [])
      .map((p: SuggestedProduct) => {
        const imageUrl =
          p?.gallery?.[0]?.file_path || "/dummy/prod21.png";
        const oldPrice = Number(p?.price_before_discount || 0);
        const newPrice = Number(p?.price || 0);
        const hasDiscount = oldPrice > 0 && oldPrice > newPrice;

        return {
          id: p.id,
          name: p.name || "",
          imageUrl,
          oldPrice,
          newPrice,
          hasDiscount,
        };
      })
      .filter((x) => x.id);
  }, [products]);

  const cols = useMemo(
    () => splitIntoColumns(items, Math.max(1, columns)),
    [items, columns]
  );

  if (!items.length) return null;

  return (
    <div className="mb-0 w-full">
      <h2 
        className="text-2xl md:text-3xl font-bold mb-6"
        style={{ color: '#0B5C8E' }}
      >
        {title}
      </h2>

      {/* Main Grid - Responsive Container */}
      <div 
        className="flex items-start gap-4 md:gap-6 lg:gap-8 xl:gap-12 justify-between w-full"
      >
        {cols.map((colItems, colIdx) => {
          const total = colItems.reduce(
            (sum, it) => sum + (Number(it.newPrice) || 0),
            0
          );

          return (
            <React.Fragment key={colIdx}>
              <div
                className="flex flex-col flex-1 min-w-0"
              >
                <div className="space-y-4 md:space-y-5">
                  {colItems.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/products/${String(p.id)}`)}
                      className="flex items-center gap-3 p-2 md:p-3 border border-gray-200 rounded-lg cursor-pointer hover:shadow-sm transition w-full"
                      style={{ 
                        minHeight: '100px'
                      }}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = "/dummy/prod21.png";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-subTitleColor line-clamp-2">
                          {p.name}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          {p.hasDiscount && (
                            <p className="text-xs line-through text-[#929FA5]">
                              ${p.oldPrice.toLocaleString()}
                            </p>
                          )}
                          <p className="font-semibold text-sm" style={{ color: '#2DA5F3' }}>
                            ${p.newPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 md:mt-5 bg-blueSite text-textWhiteColor rounded-md font-medium hover:bg-blueSiteHover transition w-full py-3 md:py-4"
                >
                  Buy All {total.toFixed(2)}$
                </button>
              </div>

              {/* Vertical divider line between columns */}
              {colIdx < cols.length - 1 && (
                <div 
                  className="hidden lg:block flex-shrink-0 self-stretch"
                  style={{
                    width: '2px',
                    minHeight: '400px',
                    backgroundColor: '#E4E7E9',
                    margin: '0 1rem'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BestSeller;
