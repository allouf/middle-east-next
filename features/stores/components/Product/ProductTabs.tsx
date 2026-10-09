'use client';

import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import AdditionalInformation from "./AdditionalInformation";
import Questions from "./Questions";
import ReviewsSection from "./ReviewsSection";

const tabs = [
  { id: 1, key: "additional_information", name: "Additional Information" },
  { id: 2, key: "questions", name: "Questions" },
  { id: 3, key: "reviews", name: "Reviews" },
];

const ProductTabs = () => {
  const [selectedTab, setSelectedTab] = useState("additional_information");
  const [scaleValue, setScaleValue] = useState(1.5);

  useEffect(() => {
    // Function to update scale based on screen width
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Mobile (Tailwind's sm breakpoint)
        setScaleValue(1);
      } else {
        setScaleValue(1.5);
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <nav className="flex flex-row justify-evenly border-b border-gray-200 relative">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`relative sm:text-[20px] text-[16px] font-bold cursor-pointer py-3 ${
              selectedTab === tab.key && "border-t border-gray-200"
            }`}
            onClick={() => setSelectedTab(tab.key)}
          >
            {tab.name}

            {/* Animated underline */}
            <AnimatePresence>
              {selectedTab === tab.key && (
                <motion.div
                  className="absolute left-0 right-0 bottom-0 h-[2px] bg-blueSite"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: scaleValue }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Content */}
      <div className="sm:p-4 p-2">
        {selectedTab === "additional_information" && <AdditionalInformation />}
        {selectedTab === "questions" && <Questions />}
        {selectedTab === "reviews" && <ReviewsSection />}
      </div>
    </div>
  );
};

export default ProductTabs;
