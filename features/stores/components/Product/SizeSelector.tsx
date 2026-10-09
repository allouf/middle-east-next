'use client';

import React from "react";

const SizeSelector = ({ sizes = [], selectedSize, setSelectedSize }) => {
  return (
    <div className="flex items-center gap-2">
       <span className='text-[#0B5C8E] sm:text-[20px] text-[16px]'>Sizes :</span>
      <div className="flex items-center gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => setSelectedSize(size.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium transition-all
              ${
                selectedSize === size.id
                  ? "bg-blue-100 border-blueSite texblueSite scale-110 shadow-sm"
                  : "bg-gray-100 text-subTitleColor border-transparent hover:bg-gray-200"
              }`}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
