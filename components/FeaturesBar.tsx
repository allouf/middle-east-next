import React from "react";
import { motion } from "framer-motion";
import { FaShippingFast, FaUndo, FaLock, FaTrophy } from "react-icons/fa";
import Button from "./ui/Button";

// Feature list
const features = [
  {
    icon: <FaShippingFast size={28} className="text-blueSite" />,
    title: "Free Shipping",
    subtitle: "When Ordering Over 100$",
  },
  {
    icon: <FaUndo size={28} className="text-blueSite" />,
    title: "Free Return",
    subtitle: "Get Return Within 30 Day",
  },
  {
    icon: <FaLock size={28} className="text-blueSite" />,
    title: "Secure Payment",
    subtitle: "100% Secure Online Payment",
  },
  {
    icon: <FaTrophy size={28} className="text-blueSite" />,
    title: "Best Quality",
    subtitle: "Original Product Guaranteed",
  },
];

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesBar = () => {
  return (
    <motion.div
      className="max-w-6xl mx-auto p-4 bg-blue-100 rounded-2xl shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="flex flex-row md:flex-col items-center gap-3 text-center sm:text-left max-w-xs"
        >
          <Button
            unstyled
            onClick={() => {
              alert("test");
            }}
            className="flex flex-row md:flex-col items-center gap-3 text-center sm:text-left max-w-xs"
          >
            {feature.icon}
            <div className="flex flex-col items-start md:items-center">
              <p className="font-semibold text-subTitleColor text-sm">
                {feature.title}
              </p>
              <p className="text-sm text-subTitleColor">{feature.subtitle}</p>
            </div>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturesBar;
