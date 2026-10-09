'use client';

import React from "react";



const dummyProducts = Array(12).fill({
  id: 1,
  name: "Wired Over-Ear Gaming Headphones with USB",
  company: "Company name",
  category: "Electronic",
  price: "$1,500",
  rating: 5,
  image: "/dummy/prod21.png",
});

const ProductGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* {dummyProducts.map((product, i) => (
        <CategoryProductCard key={i} product={product}  />
      ))} */}
    </div>
  );
};

export default ProductGrid;
