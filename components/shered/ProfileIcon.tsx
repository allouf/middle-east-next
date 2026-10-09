'use client';

import React, { useState, useRef } from "react";

            param($match)
            $imports = $matches[1]
            $newImports = ""
            
            if ($imports -match "Link") {
                $newImports += "import Link from 'next/link';`n"
            }
            if ($imports -match "useNavigate") {
                $newImports += "import { useRouter } from 'next/navigation';`n"
            }
            if ($imports -match "useParams") {
                # useParams is handled differently in Next.js App Router
                $newImports += "// useParams - use params prop in page component`n"
            }
            if ($imports -match "useLocation") {
                $newImports += "import { usePathname } from 'next/navigation';`n"
            }
            if ($imports -match "useSearchParams") {
                $newImports += "import { useSearchParams } from 'next/navigation';`n"
            }
            
            return $newImports
        ;
import { FaUserCircle } from "react-icons/fa";
import { useAuth }  param($m) 
        $path = $m.Groups[1].Value
        if ($m.Value -match "from\s+['""]@/") {
            "from '@/$path'"
        } else {
            $m.Value
        }
    ;
import DropDown from "../ui/DropDown";
import { IoPersonSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import Button from "../ui/Button";
import { useLangSwitch }  param($m) 
        $path = $m.Groups[1].Value
        if ($m.Value -match "from\s+['""]@/") {
            "from '@/$path'"
        } else {
            $m.Value
        }
    ;
const ProfileIcon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();
  const router = useRouter();
  const {currentLang} = useLangSwitch()
  const isRTL = currentLang === "ar";
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  // Close dropdown when clicking outside

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button
        to="/profile"
        unstyled
        className="flex items-center text-textWhiteColor text-2xl focus:outline-none"
      >
        <FaUserCircle className="text-textWhiteColor text-2xl" />
      </Button>

      <DropDown
        isOpen={menuOpen}
        maxHeight={80}
        handleClose={() => setMenuOpen(false)}
        position={"top-16 -right-6"}
        unStyled={true}
        className={"bg-white rounded-md overflow-hidden"}
        containerRef={menuRef}
      >
        <div className="w-[120px]">
          <Link href="/profile"
            className=" px-2 py-2 text-subTitleColor hover:blueSiteSecondary group flex flex-row items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <IoPersonSharp className="text-[20px] text-blueSite group-hover:text-subTitleColor" />{" "}
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-2 text-subTitleColor hover:blueSiteSecondary group flex flex-row items-center gap-2"
          >
            <BiLogOut className="text-[20px] text-red-500 group-hover:text-subTitleColor" />{" "}
            Logout
          </button>
        </div>
      </DropDown>

      {/* {menuOpen && (
        <div
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50`}
        >
          <Link href="/profile"
            className="block px-4 py-2 text-subTitleColor hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-subTitleColor hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ProfileIcon;
