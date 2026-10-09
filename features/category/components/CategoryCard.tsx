"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion } from "framer-motion";
import useCategoryStore from "@/lib/store/useCategoryStore";

interface Category {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  children: Category[];
}

interface CategoryCardProps {
  category: Category;
  locale: string;
  isChild?: boolean;
  index?: number; // optional (for stagger)
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  locale,
  isChild = false,
  index = 0,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
      const { setSelectedCategoryName} = useCategoryStore();

  const handleCategoryClick = () => {
    setSelectedCategoryName(category.name);
    router.push(`/${locale}/categories?category=${category.id}`);
  };

  return (
    <motion.div
      onClick={handleCategoryClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCategoryClick();
      }}
      className="flex flex-col items-center text-center group cursor-pointer bg-grayLight p-5 rounded-[10px] gap-2 outline-none"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.03 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon circle */}
      <motion.div
        className="rounded-full flex items-center justify-center"
        initial={false}
        whileHover={{ scale: 1.08, rotate: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <motion.div
          initial={false}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 500, damping: 24 }}
          className="
      relative
      w-24 h-20
      sm:w-24 sm:h-24
      md:w-28 md:h-28
      lg:w-32 lg:h-32
      bg-[#FAFAFA]
      rounded-full
      overflow-hidden
      mb-3
      transition
      group-hover:shadow-lg
    "
        >

          <Image
            src={category.icon || "/dummy/smartPhone.png"}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 160px"
            className="
        object-cover
        transition-transform
        duration-300
        group-hover:scale-110
      "
          />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.span
        className="text-[20px] font-medium text-subTitleColor"
        initial={false}
        whileHover={{ letterSpacing: 0.2 }}
        transition={{ duration: 0.2 }}
      >
        {category.name}
      </motion.span>

      {/* Button (stop click bubbling so card click still works nicely) */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <Button
          scale={1.03}
          onClick={()=>handleCategoryClick()}
          // to={`/categories?category=${category.id}`}
          unstyled
          className="text-blueSite text-sm flex items-center gap-2"
        >
          {t("product.seeDetails")}
          <motion.span
            className="inline-flex"
            initial={false}
            whileHover={{ x: 4, rotate: 8 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            <HiArrowTrendingUp />
          </motion.span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CategoryCard;
