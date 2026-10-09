'use client';

import React from "react";
import { StoreProduct } from "../../types";

interface ProductsDetailsDataProps {
  product: StoreProduct;
}

const ProductsDetailsData: React.FC<ProductsDetailsDataProps> = ({ product }) => {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-subTitleColor mb-6">
          Product Specifications
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-subTitleColor font-medium">Category</span>
            <span className="font-semibold text-subTitleColor">
              {product.category?.name || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-subTitleColor font-medium">Availability</span>
            <span
              className={`font-semibold ${
                product.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.status === "active" ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-subTitleColor font-medium">Rating</span>
            <span className="font-semibold text-subTitleColor">
              {(product.avg_rating || 0).toFixed(1)} / 5.0
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-subTitleColor font-medium">Units Sold</span>
            <span className="font-semibold text-subTitleColor">
              {product.number_of_buys || 0}
            </span>
          </div>
          {product.price_before_discount &&
            product.price_before_discount > product.price && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-subTitleColor font-medium">You Save</span>
                <span className="font-semibold text-green-600">
                  ${(product.price_before_discount - product.price).toFixed(2)}
                </span>
              </div>
            )}
          {product.discount_value && product.discount_value > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-subTitleColor font-medium">Discount</span>
              <span className="font-semibold text-orange-600">
                {product.discount_type === "percentage"
                  ? `${product.discount_value}%`
                  : `$${product.discount_value}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsDetailsData;
