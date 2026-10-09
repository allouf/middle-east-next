'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ButtonProps {
  to?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  target?: "_self" | "_blank";
  unstyled?: boolean;
  disabled?: boolean;
  scale?: number;
  addDisableStyle?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  title?: string;
  role?: string;
  id?: string;
}

const Button = (props: ButtonProps) => {
  const {
    to = "",
    onClick = () => {},
    children,
    className = "",
    type = "button" as "button" | "submit" | "reset",
    target = "_self",
    unstyled = false,
    disabled = false,
    scale = 1.1,
    addDisableStyle = false,
    ariaLabel,
    ariaLabelledby,
    ariaExpanded,
    ariaControls,
    title,
    role,
    id,
  } = props;

  const ariaLabelAttr = (props as Record<string, unknown>)["aria-label"] as string | undefined;
  const ariaLabelledbyAttr = (props as Record<string, unknown>)["aria-labelledby"] as string | undefined;

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const accessibilityProps = {
    "aria-label": ariaLabel ?? ariaLabelAttr,
    "aria-labelledby": ariaLabelledby ?? ariaLabelledbyAttr,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
    title,
    role,
    id,
  };

  const baseStyles = unstyled
    ? ""
    : "inline-flex items-center px-4 py-2 rounded-xl text-textWhiteColor font-medium bg-blueBtn hover:bg-blueSiteHover transition duration-200";
  const disableStyle = "!bg-gray-400 ";

  if (to) {
    if (!isMounted) {
      // Render static div on server to avoid hydration mismatch
      return (
        <div>
          <Link href={to}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            {...accessibilityProps}
          >
            <div
              className={`${baseStyles} ${className}`}
            >
                  {children} 
            </div>
          </Link>
        </div>
      );
    }

    return (
      <motion.div 
        variants={cardVariants}
        animate="visible"
        whileHover={{ scale: scale }}
        whileTap={{ scale: 1 }}
      >
        <Link href={to}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          {...accessibilityProps}
          
        >
          <div
            className={`${baseStyles} ${className}`}
          >
                {children} 
          </div>
        </Link>
      </motion.div>
    );
  }

  if (!isMounted) {
    // Render static button on server to avoid hydration mismatch
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${baseStyles} ${disabled&&addDisableStyle ? disableStyle : ""} ${className}`}
        disabled={disabled}
        {...accessibilityProps}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      variants={cardVariants}
      animate="visible"
      whileHover={{ scale: scale }}
      whileTap={{ scale: 1 }}
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${disabled&&addDisableStyle ? disableStyle : ""} ${className}`}
      disabled={disabled}
      {...accessibilityProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
