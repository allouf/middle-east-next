'use client';

import React from "react";

const ColorSelector = ({ colors = [], selectedColor, setSelectedColor }) => {
  return (
    <div className="flex items-center gap-2">
         <span className='text-[#0B5C8E] sm:text-[20px] text-[16px]'>Colors :</span>
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => setSelectedColor(color)}
          className={`w-8 h-8 rounded-full transition-transform duration-200 border-2 
            ${selectedColor === color ? "scale-110 shadow-md border-blueSite" : "border-transparent"}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
