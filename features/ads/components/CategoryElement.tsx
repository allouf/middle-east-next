"use client";

import React from "react";
import { AdCategory } from "../../ads/types/type";
import { TbCaretUpFilled } from "react-icons/tb";

interface CategoryElementProps {
  category: AdCategory;
  level: number;
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  isExpanded: boolean;
  hasChildren: boolean;
  parentId?: number;
  onToggleExpand: (categoryId: string) => void;
  parentName?: string;
  onSelect: (categoryId: string, level: number, name: string, parentId?: string, parentName?: string) => void;
}

const CategoryElement: React.FC<CategoryElementProps> = ({
  category,
  level,
  selectedCategory,
  selectedSubCategory,
  isExpanded,
  hasChildren,
  parentId,
  parentName,
  onToggleExpand,
  onSelect,
}) => {
  const isSelected = level === 0
    ? selectedCategory === String(category.id)
    : selectedSubCategory === String(category.id);

  return (
    <div key={category.id} className="flex flex-col">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 group cursor-pointer`}
        style={{ paddingInlineStart: `${level * 20 + 8}px` }}
      >
        {/* Expand/Collapse Arrow */}
        <div
          className={`size-5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggleExpand(String(category.id));
          }}
        >
          {hasChildren ? (
            <TbCaretUpFilled
              className={`text-[30px] ${isExpanded ? "text-[#00664F]" : "text-black"}`}
            />
          ) : (
            <div className="size-5" />
          )}
        </div>

        {/* Checkbox Icon */}
        <div
          className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${isSelected
            ? "bg-[#00664F] border-[#00664F]"
            : "border-emerald-500/30"
            }`}
          onClick={() => onSelect(String(category.id), level, category.name, level === 0 ? undefined : String(parentId), parentName)}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        {/* Category Name */}
        <span
          className={`text-sm tracking-tight font-medium ${isSelected
            ? "text-[#353635]"
            : "text-[#353635]"
            }`}
          onClick={() => onSelect(String(category.id), level, category.name, level === 0 ? undefined : String(parentId), parentName)}
        >
          {category.name}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {category.subcategories!.map((subCategory) => (
            <CategoryElement
              key={subCategory.id}
              category={subCategory as unknown as AdCategory}
              level={level + 1}
              parentId={category.id}
              parentName={category.name}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              isExpanded={false} // Subcategories don't have children in our data structure
              hasChildren={false}
              onToggleExpand={() => { }}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryElement;
