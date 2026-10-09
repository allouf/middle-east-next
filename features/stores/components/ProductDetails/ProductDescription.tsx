'use client';

import React from "react";
import { Package } from "lucide-react";

interface ProductDescriptionProps {
  description?: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description, expanded, setExpanded }) => (
  <div className="bg-white rounded-2xl border p-6">
    <h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
      <Package className="w-6 h-6 text-blueSite" />
      Product Description
    </h3>

    <p className="text-subTitleColor leading-relaxed">
      {expanded ? description : description?.slice(0, 300) + "..."}
    </p>

    {!expanded && description?.length > 300 && (
      <button
        className="text-blueSiteHover font-semibold mt-2"
        onClick={() => setExpanded(true)}
      >
        Read More →
      </button>
    )}
  </div>
);

export default ProductDescription;
