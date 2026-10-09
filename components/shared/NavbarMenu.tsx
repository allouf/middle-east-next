'use client';

import { useState } from "react";
import Link from "next/link";
import { sideNavData } from "@/shared/constants/data";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/lib/context/AuthContext";
import { LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/lib/context/AlertProvider";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

const NavbarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, loadingAuth, logout } = useAuth();
  const { message: alertMessage } = useAlert();
  const { locale, isRTL } = useLocaleDirection();

  // LTR -> Left, RTL -> Right
  const side = isRTL ? "right" : "left";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: isRTL ? 50 : -50, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  const navItems = sideNavData;

  return (
    <div className="relative z-50">
      <button
        aria-label="Toggle Navigation"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => {
          if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
            setHovered(true);
          }
        }}
        onMouseLeave={() => setHovered(false)}
        className={`flex flex-col items-center justify-center w-10 h-10 cursor-pointer group`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <span
          className={`block h-[3px] bg-white rounded-full transition-all duration-300 ease-in-out ${hovered ? "w-8" : "w-5"
            }`}
        ></span>
        <span
          className={`block h-[3px] bg-white rounded-full transition-all duration-300 ease-in-out my-[5px] w-8`}
        ></span>
        <span
          className={`block h-[3px] bg-white rounded-full transition-all duration-300 ease-in-out ${hovered ? "w-8" : "w-5"
            }`}
        ></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[900] cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              className={`fixed top-0 w-80 h-full bg-blueSite text-textWhiteColor z-[999] shadow-2xl flex flex-col font-somar overflow-hidden ${isRTL ? "right-0" : "left-0"
                }`}
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <span className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-white/40 blur-[100px] pointer-events-none"></span>
              <span className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white/40 blur-[100px] pointer-events-none"></span>
              <div className="flex items-center gap-4 px-6 py-8">
                <img src="/logo.svg" alt="Logo" className="w-[180px] h-[70px]" />
                {/* <button
                  onClick={() => setIsOpen(false)}
                  className="ms-auto p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="text-white" size={24} />
                </button> */}
              </div>


              <motion.nav
                className="flex-1 overflow-y-auto px-4 no-scrollbar"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isDisabled = item.disabled;

                  const content = (
                    <>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-md group-hover:bg-white/20 transition-colors ${isDisabled ? "bg-gray-400/50" : "bg-[#B0D0C866]"}`}>
                        {Icon && <Icon size={20} className={`text-white transition-all duration-300 ${isDisabled ? "opacity-50" : "opacity-90 group-hover:opacity-100"}`} />}
                      </div>
                      <span className={`text-[17px] font-medium flex-1 transition-colors duration-300 ${isDisabled ? "text-white/50" : "text-white/90 group-hover:text-white"}`}>
                        {t(item.name) || item.name}
                      </span>
                      <div className={`transition-opacity duration-300 ${isRTL ? "rotate-180" : ""} ${isDisabled ? "opacity-20" : "opacity-40 group-hover:opacity-100"}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </>
                  );

                  const commonClasses = `flex items-center gap-3 py-2.5 border-b border-white/30 transition-all duration-300 group relative flex-row ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`;

                  return (
                    <motion.div key={item.name || index} variants={itemVariants}>
                      {isDisabled ? (
                        <div
                          onClick={() => {
                            alertMessage.info(t("comingSoon") || "Coming Soon");
                          }}
                          className={commonClasses}
                        >
                          {content}
                        </div>
                      ) : (
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={commonClasses}
                        >
                          {content}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </motion.nav>

              <div className="p-6 mt-auto">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className={`flex items-center py-4 border-t border-white/30 gap-2 w-full group flex-row`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-md text-white group-hover:bg-red-600 transition-all duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                      </svg>
                    </div>
                    <span className="text-[17px] font-medium text-white/90 group-hover:text-white">
                      {t("logOut")}
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 border-t border-white/30 pt-4">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center py-2 gap-3 w-full group flex-row`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-md text-white group-hover:bg-white/20 transition-all duration-300">
                        <LogIn size={20} />
                      </div>
                      <span className="text-[17px] font-medium text-white/90 group-hover:text-white">
                        {t("login") || "Login"}
                      </span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center py-2 gap-3 w-full group flex-row`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-md text-white group-hover:bg-white/20 transition-all duration-300">
                        <UserPlus size={20} />
                      </div>
                      <span className="text-[17px] font-medium text-white/90 group-hover:text-white">
                        {t("register") || "Register"}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarMenu;

