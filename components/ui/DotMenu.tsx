'use client';

import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisH, FaEllipsisV } from "react-icons/fa";
import i18next from "i18next";

interface MenuItem {
  icon?: React.ReactNode;
  label?: string;
  action: () => void;
  separator?: boolean;
}

interface DotMenuProps {
  items?: MenuItem[];
  direction?: "horizontal" | "vertical";
  bgBtnColor?: string;
  bgBtnHover?: string;
  iconBg?: string;
  menuBg?: string;
  shadow?: string;
  className?: string;
}

const DotMenu = ({
  items = [],
  direction = "horizontal",
  bgBtnColor = "bg-white",
  bgBtnHover = "bg-grayLight2",
  iconBg = "hover:bg-gray-100",
  menuBg = "bg-white",
  shadow = "shadow-lg",
  className = "",
}: DotMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  const handleMenuItemClick = (action: () => void) => {
    setIsMenuOpen(false);
    if (typeof action === "function") action();
  };

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Choose dot icon based on direction
  const Icon = direction === "vertical" ? FaEllipsisV : FaEllipsisH;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={handleMenuToggle}
        className={`p-2 rounded-md transition-colors ${iconBg}`}
        aria-label="Menu options"
      >
        <Icon className={`text-textWhiteColor text-lg" `} />
      </button>

      {isMenuOpen && (
        <div
          className={`absolute top-full mt-1  w-48 ${menuBg} rounded-lg border border-grayLight ${shadow} z-[200] py-1 transition-all duration-150 ease-in-out ${className}
            ${i18next.language === "ar" ? "left-0" : "right-0"}`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item.action)}
              className={`
      w-full px-2 py-2 text-left my-1 text-sm  rounded-md flex items-center gap-2 transition-colors ${bgBtnColor} ${bgBtnHover} ${
                item.separator ? "border-t border-gray-200 mt-1" : ""
              }
    `}
            >
              {item.icon && <span className="text-base">{item.icon}</span>}
              {item.label && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DotMenu;
