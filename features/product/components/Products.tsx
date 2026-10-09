'use client';

import React from "react";

import ProductGrid from "@/features/stores/components/Categories/ProductGrid";
import PromoBanner from "@/_pages/Home/Components/PromoBanner";


const Products: React.FC = () => {
  return (
    
      // <ProductGrid />
      <div className="my-10">
        <PromoBanner />
      </div>
    
  );
};

export default Products;
