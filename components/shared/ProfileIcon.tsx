'use client';

import React, { useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import DropDown from "@/components/ui/DropDown";
import { IoPersonSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import Button from "@/components/ui/Button";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";
import Link from "next/link";

const ProfileIcon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();
  const router = useRouter();
  const { currentLang } = useLangSwitch();
  const isRTL = currentLang === "ar";

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <DropDown
        isOpen={menuOpen}
        maxHeight={120}
        handleClose={() => setMenuOpen(false)}
        unStyled={true}
        className={"bg-white rounded-md shadow-md border border-gray-100"}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="cursor-pointer"
        >
          <FaUserCircle className="text-textWhiteColor text-3xl" />
        </div>
        <div className="w-[120px]">
          <Link href="/profile"
            className=" px-2 py-2 text-subTitleColor hover:bg-gray-100 group flex flex-row items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <IoPersonSharp className="text-[20px] text-blueSite group-hover:text-subTitleColor" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-2 text-subTitleColor hover:bg-gray-100 group flex flex-row items-center gap-2"
          >
            <BiLogOut className="text-[20px] text-red-500 group-hover:text-subTitleColor" />
            Logout
          </button>
        </div>
      </DropDown>
    </div>
  );
};

export default ProfileIcon;

