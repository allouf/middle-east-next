import React from 'react';

const Star = ({ percent = 0, size = 24, filled = false, useSvgBorder = false }) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  
  // SVG path from the provided vector
  const starPath = "M13.1797 6.93991C15.2908 3.15283 16.3463 1.25928 17.9245 1.25928C19.5026 1.25928 20.5581 3.15281 22.6691 6.9399L23.2153 7.91966C23.8153 8.99583 24.1152 9.53393 24.583 9.88896C25.0506 10.244 25.633 10.3758 26.798 10.6394L27.8587 10.8793C31.958 11.8069 34.0078 12.2706 34.4955 13.8388C34.9832 15.4069 33.5858 17.0411 30.791 20.3091L30.068 21.1546C29.2738 22.0833 28.8767 22.5476 28.698 23.1221C28.5195 23.6966 28.5795 24.3161 28.6995 25.5553L28.8088 26.6833C29.2313 31.0436 29.4426 33.2238 28.166 34.193C26.8891 35.1621 24.97 34.2785 21.1317 32.5113L20.1386 32.054C19.048 31.5518 18.5026 31.3006 17.9245 31.3006C17.3463 31.3006 16.801 31.5518 15.7103 32.054L14.7173 32.5113C10.879 34.2785 8.95978 35.1621 7.68307 34.193C6.40635 33.2238 6.61762 31.0436 7.04015 26.6833L7.14945 25.5553C7.26953 24.3161 7.32957 23.6966 7.15092 23.1221C6.97228 22.5476 6.5752 22.0833 5.78102 21.1546L5.05798 20.3091C2.26323 17.0411 0.865849 15.4069 1.35352 13.8388C1.84118 12.2706 3.89092 11.8069 7.99038 10.8793L9.05097 10.6394C10.2159 10.3758 10.7984 10.244 11.266 9.88896C11.7337 9.53393 12.0337 8.99585 12.6336 7.91966L13.1797 6.93991Z";

  // If rating is 0 and not using SVG border, show white/gray star
  if (!filled && percent === 0 && !useSvgBorder) {
    return (
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 36 36"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <path d={starPath} fill="#00664F" />
        </svg>
      </div>
    );
  }

  // If rating is 1 or more, use the SVG with border and background
  // filled=true means the star should be filled (blue), filled=false means empty (light blue background with border)
  const isFilled = filled && clampedPercent >= 100;
  const isPartial = filled && clampedPercent > 0 && clampedPercent < 100;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
      }}
    >
      {/* Base star - for partial stars, show full star with blue border and white fill */}
      {isPartial ? (
        // For partial stars: show full star outline with blue border, white fill
        <svg
          width={size}
          height={size}
          viewBox="0 0 36 36"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <path 
            d={starPath} 
            fill="#FFFFFF" 
            stroke="#00664F" 
            strokeWidth="2.51809"
          />
        </svg>
      ) : (
        // For full or empty stars: show SVG with border
        <svg
          width={size}
          height={size}
          viewBox="0 0 36 36"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <path 
            d={starPath} 
            fill={isFilled ? "#00664F" : "#FFFFFF"} 
            stroke="#00664F" 
            strokeWidth="2.51809"
          />
        </svg>
      )}

      {/* Filled portion overlay for partial stars - blue fill on top of the border */}
      {isPartial && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${clampedPercent}%`,
            height: '100%',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 36 36"
          >
            <path 
              d={starPath} 
              fill="#00664F" 
              stroke="#00664F" 
              strokeWidth="2.51809"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Star;
