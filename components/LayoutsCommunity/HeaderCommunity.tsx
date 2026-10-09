'use client';

import { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaVideo,
  FaTh,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsMessenger } from "react-icons/bs";
import Button from "../ui/Button";
import Switcher from "../../Pages/Community/Components/ui/Switcher";
import { t } from "i18next";
import { images }  param($m) 
        $path = $m.Groups[1].Value
        if ($m.Value -match "from\s+['""]@/") {
            "from '@/$path'"
        } else {
            $m.Value
        }
    ;

export default function HeaderCommunity() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="relative w-full px-32 py-2 bg-white shadow-sm rounded-b-2xl z-[50]">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="relative hidden sm:block">
            <FiSearch className="absolute top-2.5 left-3 text-blue-900" />
            <input
              type="text"
              placeholder={t("community.communityHeader.searchPlaceholder")}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none placeholder-gray-500 w-44 sm:w-56 md:w-64"
            />
          </div>
        </div>

        {/* Center: Desktop Nav Icons */}
        <nav className="hidden md:flex items-center gap-6 text-textColor">
          <IconButton icon={<FaHome />} hoverColor="hover:text-yellow-600" />
          <IconButton icon={<FaUsers />} hoverColor="hover:text-blueSiteHover" />
          <img
            src={images.Unknown}
            alt="User"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
          <IconButton icon={<FaVideo />} hoverColor="hover:text-blueSite" 
            link="/community/videos"
          
          />
          <IconButton icon={<FaTh />} hoverColor="hover:text-green-500" />
        </nav>

        {/* Right: Notifications + Messenger + Mobile Menu Toggle */}
        <div className="flex items-center gap-4 text-subTitleColor">
          <IconButton icon={<FaBell />} hoverColor="hover:text-blueSiteHover" />
          <Switcher/>

          <IconButton
            icon={<BsMessenger />}
            link='/chat'
            hoverColor="hover:text-blueSiteHover"
            className="text-blueSite"
          />
          <button className="md:hidden text-xl" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Animated Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 right-4 bg-white rounded-xl shadow-lg z-50 transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="flex flex-col p-4 gap-4 text-subTitleColor min-w-[200px]">
          <IconButton
            icon={<FaHome />}
            hoverColor="hover:text-yellow-600"
            label={t("community.communityHeader.home")}
          />
          <IconButton
            icon={<FaUsers />}
            hoverColor="hover:text-blueSiteHover"
            label={t("community.communityHeader.friends")}
          />
          <IconButton
            icon={<FaVideo />}
            hoverColor="hover:text-red-500"
            label={t("community.communityHeader.videos")}
            link="/community/videos"
          />
          <IconButton
            icon={<FaTh />}
            hoverColor="hover:text-green-500"
            label={t("community.communityHeader.apps")}
          />
        </div>
      </div>
    </header>
  );
}

function IconButton({
  icon,
  hoverColor = "",
  className = "",
  label = "",
  link = "",
}) {
  return (
    <Button
      unstyled
      to={link}
      className={`flex items-center gap-2 text-xl transition-colors ${hoverColor} ${className}`}
    >
      {icon}
      {label && <span className="text-base">{label}</span>}
    </Button>
  );
}