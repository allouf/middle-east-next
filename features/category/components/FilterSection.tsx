"use client";

import React, { FC, PropsWithChildren, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
}

const FilterSection: FC<PropsWithChildren<FilterSectionProps>> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-3">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center text-[18px] 2xl:text-[20px] text-subTitleColor mb-2 hover:text-blueSiteHover transition"
      >
        <span>{title}</span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <IoIosArrowDown />
        </motion.span>
      </button>

      {/* Animated Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="text-sm text-subTitleColor space-y-2 max-h-[80vh] overflow-y-auto pr-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSection;