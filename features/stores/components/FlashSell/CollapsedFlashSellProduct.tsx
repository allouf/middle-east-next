'use client';

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState } from "react";

import { FaAngleDown } from "react-icons/fa";
import { FlashSellProductDetails, FlashSellProductVariant } from "../../types/flashSell";

interface CollapsedFlashSellProductProps {
  pro: FlashSellProductDetails;
}

const CollapsedFlashSellProduct: React.FC<CollapsedFlashSellProductProps> = ({ pro }) => {
  const [openCollaps, setOpenCollaps] = useState(false);

  const variants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3 }
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }; 
  
  return (
    <div className="bg-[#FBFBFB] p-3 rounded-sm space-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 items-center">
          <img
            src={pro?.image||"https://placehold.co/60x60"}
            alt="product"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h3 className="text-lg">{pro.name}</h3>
        </div>

        <button onClick={() => setOpenCollaps((prev) => !prev)}>
          <FaAngleDown
            className={`text-xl transition-transform duration-300 ${
              openCollaps ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {openCollaps && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={variants}
            style={{ overflow: "hidden" }}
            className="flex flex-row gap-2"
          >
            {pro.variants?.length > 0 &&
              pro.variants.map((vari: FlashSellProductVariant, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1 bg-blueLight rounded"
                >
                  {vari.option_values?.map((optionValue, optionIndex) => (
                    <span key={optionIndex}>
                      {optionValue.value}
                      {optionIndex < (vari.option_values?.length || 0) - 1 && " / "}
                    </span>
                  ))}
                </span>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsedFlashSellProduct;
