'use client';

import React from "react";
import {
  FaShieldAlt,
  FaShippingFast,
  FaUndo,
  FaHeadset,
  FaCreditCard,
  FaHandshake,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaShieldAlt className="text-blueIcons" />,
    text: "Free 1 Year Warranty",
  },
  {
    icon: <FaShippingFast className="text-blueIcons" />,
    text: "Free Shipping & Fast Delivery",
  },
  {
    icon: <FaHandshake className="text-blueIcons" />,
    text: "100% Money-back guarantee",
  },
  {
    icon: <FaHeadset className="text-blueIcons" />,
    text: "24/7 Customer support",
  },
  {
    icon: <FaCreditCard className="text-blueIcons" />,
    text: "Secure payment method",
  },
];

const shippingOptions = [
  { method: "Counter", duration: "2-4 days", cost: "Free shipping" },
  { method: "Local Shipping", duration: "up to one week", cost: "$18.00" },
  { method: "UPS Ground Shipping", duration: "4-6 days", cost: "$28.00" },
  { method: "UniShop Global Export", duration: "3-4 days", cost: "$38.00" },
];

const AdditionalInformation = () => {
  return (
    <motion.div
      initial={{ translateY: -15 }}
      animate={{ translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full grid grid-cols-2 lg:grid-cols-12 py-8 gap-y-8 lg:gap-y-0"
    >
      {/* Return Policy Section */}
      <div className="lg:col-span-5 col-span-2 px-4">
        <h2 className="text-subTitleColor text-[20px] mb-4">Return Policy Information</h2>
        <p className="text-[16px] text-textColor">
          The most powerful MacBook Pro ever is here. With the blazing-fast M1
          Pro or M1 Max chip — the first Apple silicon designed for pros — you
          get groundbreaking performance and amazing battery life. Add to that a
          stunning Liquid Retina XDR display, the best camera and audio ever in
          a Mac notebook, and all the ports you need. The first notebook of its
          kind, this MacBook Pro is a beast. M1 Pro takes the exceptional
          performance of the M1 architecture to a whole new level for pro users.
        </p>
      </div>

      {/* Features Section */}
      <div className="lg:col-span-3 sm:col-span-1 col-span-2 px-4 lg:border-s border-[#E4E7E9]">
        <h2 className="text-subTitleColor text-[20px] mb-3">More Features</h2>
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 py-2 rounded-lg"
          >
            <div className="text-xl">{feature.icon}</div>
            <span className="text-subTitleColor font-medium">{feature.text}</span>
          </div>
        ))}
      </div>

      {/* Shipping Info Section */}
      <div className="lg:col-span-4 sm:col-span-1 col-span-2 px-4 sm:border-s border-[#E4E7E9]">
        <h2 className="text-subTitleColor text-[20px] mb-3">Shopping Information</h2>

        {shippingOptions.map((option, index) => (
          <div
            key={index}
            className="w-full flex flex-col sm:flex-row sm:gap-1 py-2"
          >
            <h3 className="text-subTitleColor font-semibold text-[18px]">
              {option.method}:
            </h3>
            <p className="text-textColor sm:ml-1">
              {option.duration}, {option.cost}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdditionalInformation;
