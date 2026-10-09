"use client";

import React, { ReactNode } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

const backgroundImages = ["/bg-auth.png", "/bg-auth-1.png"];

const socialMediaLinks = [
  {
    name: "facebook",
    url: "https://www.facebook.com/mideastcommerce/",
    icon: <FaFacebook className="w-7 h-7" />,
  },
  {
    name: "twitter",
    url: "https://x.com/mideastcommerce",
    icon: <FaXTwitter className="w-7 h-7" />,
  },
  {
    name: "instagram",
    url: "https://www.instagram.com/mideastcommerce/",
    icon: <FaInstagram className="w-7 h-7" />,
  },
  {
    name: "tiktok",
    url: "https://www.tiktok.com/@mideastcommerce",
    icon: <FaTiktok className="w-7 h-7" />,
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/@mideastcommerce",
    icon: <FaYoutube className="w-7 h-7" />,
  },
];

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row h-screen items-center mx-auto">
      {/* LEFT SIDE — Swiper background with overlay content */}
      <div className="relative w-full md:w-[45%] h-1/3 md:h-screen text-white p-16 bg-bgOffWhite">
        {/* Overlay Content (Centered on top of slider) */}
        <div className="relative z-20 flex flex-col  text-center w-full h-full items-center justify-around">
          <Image
            src="/logoWide.svg"
            alt="Middle East E-Commerce"
            width={320}
            height={80}
            sizes="(max-width: 768px) 200px, 320px"
            className="h-auto object-contain animate-fadeIn"
            priority
          />
          <div className="max-w-md px-4 sm:px-0 ">
            <h1 className="hidden md:block   text-2xl sm:text-3xl md:text-[26px] lg:text-[38px] font-medium mb-3 animate-fadeIn delay-200 text-blueSite">
              {t("auth.welcome")}
            </h1>

            <p className="hidden md:block text-gray-200 mb-6 font-medium text-sm md:text-base lg:text-[18px] animate-fadeIn delay-300 text-textGrayColor">
              {t("auth.description1")}
            </p>
          </div>

          <div className="hidden md:flex gap-7 text-xl mt-4 animate-fadeIn items-center delay-400">
            {socialMediaLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="text-blueSite"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile gradient fade */}
        <div className="md:hidden absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white/100 to-transparent z-10 pointer-events-none" />
      </div>

      {/* RIGHT SIDE — Form content */}
      <div className="relative w-full h-full md:w-1/2 bg-white border-transparent px-8 py-16 overflow-y-auto overflow-x-hidden max-w-lx mx-auto">
        <div className="relative z-20  w-full h-full ">{children}</div>
      </div>
    </div>
  );
};

export default AuthWrapper;
