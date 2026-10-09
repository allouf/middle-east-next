'use client';

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import LangSwitcher from "@/components/shared/LangSwithcer";
import { headerAuthData, headerData } from "@/shared/constants/data";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface NavBarProps {
  isScrolled?: boolean;
  isAuthenticated?: boolean;
}

const NavBar = ({ isScrolled, isAuthenticated }: NavBarProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className={`w-full z-50 left-0 px-4 py-2 text-textWhiteColor transition-all duration-500 
       ${
         isScrolled
           ? " bg-blueSite shadow-md opacity-90 lg:transform lg:scale-105"
           : "bg-blueSite"
       }
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center  justify-end lg:justify-center  relative">
        <div className="hidden lg:flex gap-6">
          {headerData.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className=" hover:text-gray-100  transition-colors"
            >
              {t(item.name)}
            </Link>
          ))}
          {!isAuthenticated &&
            headerAuthData.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className=" hover:text-gray-100  transition-colors"
              >
                {t(item.name)}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle Navigation"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="transition-transform duration-300" />
            ) : (
              <Menu className="transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden absolute left-0 w-full bg-blueSite z-50 flex flex-col space-y-4 py-6 px-6 shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
        style={{
          transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
        }}
      >
        {headerData.map((item, index) => (
          <Link
            key={item.name || index}
            href={item.path}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 hover:bg-blueSiteHover hover:rounded-xl transition delay-100 ease-in-out transform opacity-0 animate-fadeIn"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {t(item.name)}
          </Link>
        ))}
        {!isAuthenticated &&
          headerAuthData.map((item, index) => (
            <Link
              key={item.name || index}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 hover:bg-blueSiteHover hover:rounded-xl transition delay-100 ease-in-out transform opacity-0 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {t(item.name)}
            </Link>
          ))}
      </div>
    </nav>
  );
};

export default NavBar;
