import React from "react";
import Star from "../../ui/Star";

const ProductRate = ({
  rating = 0,
  max = 5,
  size, // optional now; if not provided, we use responsive sizes
  hideText = false,
  isDark = false,
}) => {
  const fullStars = Math.floor(rating);
  const hasPartial = rating % 1 !== 0;
  const partialPercent = (rating % 1) * 100;

  // Responsive sizes (used only if `size` prop is NOT passed)
  // If you pass `size`, it will override all responsive sizing.
  const responsiveSize = {
    base: 14,
    sm: 16,
    md: 18,
    lg: 20,
  };

  // We'll use base size for the Star `size` prop (number),
  // and keep text responsive using Tailwind classes.
  const starSize = size ?? responsiveSize.base;

  const textColor = isDark ? "text-textWhiteColor" : "text-subTitleColor";

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap">
      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
        {Array.from({ length: max }).map((_, i) => {
          const isFull = i < fullStars;
          const isPartial = i === fullStars && hasPartial;

          const percent = isFull ? 100 : isPartial ? partialPercent : 0;

          return (
            <Star
              key={i}
              percent={percent}
              size={size ?? starSize}
              filled={percent > 0}
              useSvgBorder
              className={`
      shrink-0
      ${isFull ? "!text-subTitleColor" : "text-gray-300"}
    `}
            />
          );
        })}
      </div>

      {!hideText && (
        <span
          className={`${textColor} font-semibold leading-none text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]`}
          style={size ? { fontSize: `${size}px` } : undefined}
        >
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default ProductRate;
