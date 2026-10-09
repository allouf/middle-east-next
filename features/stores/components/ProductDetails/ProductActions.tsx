'use client';

import React from "react";
import { ShoppingCart } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface ProductActionsProps {
  quantity: number;
  handleQty: (delta: number) => void;
  handleAddToCart: () => void;
  handleToggleWishlist: () => void;
  isAdding: boolean;
  isToggling: boolean;
  isInWishlist: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  quantity,
  handleQty,
  handleAddToCart,
  handleToggleWishlist,
  isAdding,
  isToggling,
  isInWishlist,
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-subTitleColor">Quantity:</span>

      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
        <button onClick={() => handleQty(-1)} className="px-4 py-2 text-lg">
          -
        </button>
        <span className="px-6 py-2 bg-gray-50 text-lg">{quantity}</span>
        <button onClick={() => handleQty(1)} className="px-4 py-2 text-lg">
          +
        </button>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-1 bg-blueSite text-textWhiteColor py-4 rounded-xl flex items-center justify-center gap-2 text-lg"
      >
        {isAdding ? (
          "Adding..."
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </>
        )}
      </button>

      <button
        onClick={handleToggleWishlist}
        disabled={isToggling}
        className={`px-6 py-4 rounded-xl border-2 text-lg flex items-center gap-2 ${
          isInWishlist
            ? "bg-red-50 border-red-300 text-red-600"
            : "bg-white border-gray-300"
        }`}
      >
        {isInWishlist ? <FaHeart /> : <FaRegHeart />}
        {isInWishlist ? "Saved" : "Save"}
      </button>
    </div>
  </div>
);

export default ProductActions;
