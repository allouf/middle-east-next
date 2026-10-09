'use client';

import React, { useState, useRef } from "react";

const ImageZoom = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate position percentage for zoom
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Calculate zoom window position (to the right of the image)
    const zoomX = containerRect.right + 20; // 20px gap from image
    const zoomY = e.clientY; // Use absolute mouse Y position

    setPosition({ x, y });
    setZoomPosition({ x: zoomX, y: zoomY });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div
        ref={imageRef}
        className="relative w-full h-full cursor-crosshair overflow-hidden bg-white rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = "/dummy/prod21.png";
          }}
        />
      </div>

      {/* Zoomed image outside the frame */}
      {isZoomed && (
        <div
          className="fixed pointer-events-none z-50 w-96 h-96 border-4 border-gray-300 rounded-lg shadow-2xl overflow-hidden bg-white"
          style={{
            left: `${zoomPosition.x}px`,
            top: `${zoomPosition.y}px`,
            transform: "translateY(-50%)",
            display: "block",
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: "250%",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageZoom;
