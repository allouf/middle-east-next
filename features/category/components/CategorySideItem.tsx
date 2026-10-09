"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Category } from "../types/type";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import useCategoryStore from "@/lib/store/useCategoryStore";

interface CategoryItemProps {
  category: Category;
  level?: number;
  selectedId?: string | null;
  onSelect: (id: number) => void;
}

const CategorySideItem: React.FC<CategoryItemProps> = ({
  category,
  level = 0,
  selectedId,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(true);
  const hasChildren = Boolean(category.children?.length);
  const isSelected = String(category.id) === selectedId;
  const {isRTL}  = useLocaleDirection();
    const { setCategoryLoading, categoryLoading ,setSelectedCategoryName} = useCategoryStore();

  return (
    <div>
      {/* Header */}
      <div
        className={`flex items-center gap-2 py-1 cursor-pointer ${
          hasChildren ? "text-subTitleColor " : "text-textColor"
        } ${isSelected ? " " : ""}`}
        style={{ paddingInlineStart: `${level * 16}px` }}
      >
        {/* Expand / Collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-4 h-4 flex items-center justify-center"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <motion.span
              animate={{ rotate: open ? 0 :isRTL?90: -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.span>
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {onSelect(Number(category.id))
            setSelectedCategoryName(category.name)
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 accent-blueSite cursor-pointer"
        />

        {/* Label */}
        <span
          onClick={() => {onSelect(Number(category.id))
            setSelectedCategoryName(category.name)
          }}
          className="select-none"
        >
          {category.name}
        </span>
      </div>

      {/* Animated Children */}
      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {category.children!.map((child) => (
              <CategorySideItem
                key={child.id}
                category={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySideItem;
