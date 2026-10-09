import React from "react";

/**
 * Dynamic background glow effect component
 *
 * Props:
 * - color: glow color (e.g. "#32A7EF" or "rgba(50,167,239,0.7)")
 * - position: Tailwind-style position (e.g. "bottom-0 left-0", "top-10 right-20")
 * - size: width/height classes (e.g. "w-[400px] h-[400px]")
 * - blur: Tailwind blur intensity (default: "blur-[160px]")
 * - opacity: Tailwind opacity (default: "opacity-70")
 * - offset: move glow outside container (e.g. "-translate-x-1/4 translate-y-1/4")
 */
const GlowLight = ({
  color = "#32A7EF",
  position = "bottom-0 left-0",
  size = "w-[400px] h-[400px]",
  blur = "blur-[160px]",
  opacity = "opacity-70",
  offset = "-translate-x-1/3 translate-y-1/3", // pushes circle slightly outside
}) => {
  return (
    <div
      className={`absolute ${position} ${size} ${blur} ${opacity} ${offset} pointer-events-none rounded-full`}
      style={{
        background: color,
        filter: blur,
        zIndex: 1,
      }}
    ></div>
  );
};

export default GlowLight;
