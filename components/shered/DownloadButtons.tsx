'use client';

import React from 'react'
import { FaApple } from 'react-icons/fa'
import { useTranslation } from "@/lib/i18n/useTranslation";

const DownloadButtons = () => {
  const { t } = useTranslation();
  return (
   <div className="w-fit">
      <h2 className="text-md font-bold text-textWhiteColor mb-3">
        {t("footer.download.heading")}
      </h2>
      <div className="flex flex-col gap-3">
        <a
          href="https://www.apple.com/app-store/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white text-subTitleColor rounded-lg px-4 py-2 w-fit justify-center shadow-md hover:scale-105 transition-transform"
        >
          <FaApple size={26} />
          <div className="text-left leading-tight">
            <span className="text-xs text-subTitleColor block">
              {t("footer.download.apple.subtitle")}
            </span>
            <span className="font-semibold text-sm">
              {t("footer.download.apple.title")}
            </span>
          </div>
        </a>

      {/* Google Play Button */}
        <a
          href="https://play.google.com/store/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white text-subTitleColor rounded-lg px-4 py-2  w-fit justify-center shadow-md hover:scale-105 transition-transform"
        >
          <img src="/Playstore.png" alt="play store" className="w-[25px] h-[25px]"/>
          <div className="text-left leading-tight">
            <span className="text-xs text-subTitleColor block">
              {t("footer.download.google.subtitle")}
            </span>
            <span className="font-semibold text-sm">
              {t("footer.download.google.title")}
            </span>
          </div>
        </a>
    </div>
    </div>
  )
}

export default DownloadButtons
