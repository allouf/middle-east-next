'use client';

import React from "react";
import { StoreProduct } from "../../types";

interface ProductSpecsProps {
  product: StoreProduct;
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => (
  <div className="bg-white rounded-2xl border p-6">
    <h3 className="text-2xl font-bold mb-6">Product Specifications</h3>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 rounded bg-gray-50 flex justify-between">
        <span>Category</span>
        <span className="font-semibold">{product.category?.name}</span>
      </div>

      <div className="p-4 rounded bg-gray-50 flex justify-between">
        <span>Availability</span>
        <span
          className={
            product.status === "active" ? "text-green-600" : "text-red-600"
          }
        >
          {product.status === "active" ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="p-4 rounded bg-gray-50 flex justify-between">
        <span>Rating</span>
        <span className="font-semibold">{product.avg_rating} / 5.0</span>
      </div>

      <div className="p-4 rounded bg-gray-50 flex justify-between">
        <span>Units Sold</span>
        <span className="font-semibold">{product.number_of_buys}</span>
      </div>
    </div>
  </div>
);

export default ProductSpecs;
