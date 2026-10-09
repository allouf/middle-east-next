// components/CategoryCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { storageURL } from "../../constants/data";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CategoryCard = ({ category, handleCategorySelect }) => {
  const Icon = category.icon;

  return (
    <motion.div
      className="group flex flex-col items-center space-y-2 w-full  text-center cursor-pointer"
      onClick={() => handleCategorySelect(category)}
      variants={cardVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1 }}
    >
      <div className="flex items-center justify-center transition-colors duration-300 ">
        {/* <Icon size={24} className="text-subTitleColor sm:text-[28px]" /> */}
        <img
          src={`${category?.icon}`}
          alt={category.name}
          size={24}
          loading="lazy"
        />
      </div>
      <p className="text-xs font-semibold text-subTitleColor sm:text-sm">
        {category.name}
      </p>
    </motion.div>
  );
};

export default CategoryCard;
