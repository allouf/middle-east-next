"use client";

import React, { useEffect, useMemo, useState } from "react";
import NavBar from "@/components/layouts/NavBar";
import { Header } from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { useLoading } from "@/lib/context/LoadingContext";
import { useDarkMode } from "@/lib/context/DarkModeContext";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";
import useCompleteProfile from "@/lib/store/useCompleteProfile";
import NotComplateModal from "@/components/shered/NotComplateModal";
import HeaderBeta from "./HeaderBeta";
import OnboardingModal from "../../features/tutorial/OnboardingModal";
import { usePathname } from "next/navigation";
import PageTransition from "./PageTransition";

interface LayoutsProps {
  children: React.ReactNode;
  header?: boolean;
  footer?: boolean;
  nav?: boolean;
  topText?: boolean;
  padding?: boolean;
  paddingTop?: boolean;
}

const Layouts: React.FC<LayoutsProps> = ({
  children,
  header = true,
  footer = true,
  nav = true,
  topText = true,
  padding = true,
  paddingTop = true,
}) => {
  const pathname = usePathname() || "";

  const { currentLang } = useLangSwitch();
  const isRTL = currentLang === "ar";
  const { isCompleteProfile, setIsCompleteProfile } = useCompleteProfile();
  const [openInComplateModal, setOpenInComplateModal] =
    useState(isCompleteProfile);
  const { loading, setLoading } = useLoading();
  const { isDarkMode } = useDarkMode();
  const hideHeaderBeta = useMemo(() => pathname.includes("/login"), [pathname]); // ✅ هنا

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, [setLoading]);

  return (
    <div
      className={`flex flex-col relative container min-w-full mx-auto ${footer ? "min-h-screen" : "h-full"
        } ${isDarkMode ? "dark" : ""}`}
    >
      <div
        className={`w-full z-[999] left-0 text-textWhiteColor transition-all duration-500 fixed mb-4  `}
      >
        {!hideHeaderBeta && <HeaderBeta />}
        {header && <Header />}
      </div>
      <div
        className={`relative container max-w-[1990px] ${!hideHeaderBeta ? " mt-[58px] md:mt-[50px]" : "mt-0"}  mx-auto flex-grow ${header && paddingTop && "pt-[90px]"
          }  ${padding ? "md:px-8 px-4" : ""} z-10`}
      >
        <main className="flex-grow ">
          <OnboardingModal />
          <NotComplateModal
            modalOpen={openInComplateModal}
            setModalOpen={setOpenInComplateModal}
            setIsCompleteProfile={setIsCompleteProfile}
          />
          <PageTransition>{children}</PageTransition>
        </main>
      </div>  
      {footer && <Footer />}
    </div>
  );
};

export default Layouts;
