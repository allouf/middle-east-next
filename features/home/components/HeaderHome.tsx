"use client";

import React from "react";
import { ArrowRight, ArrowLeft, ArrowDown } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface HeaderHomeProps {
  text?: string;
  url?: string;
  onClick?: () => void;
  showText?: string;
}

const HeaderHome: React.FC<HeaderHomeProps> = ({
  text = "",
  url = "#",
  onClick,
  showText,
}) => {
  const { t, i18n } = useTranslation();
  const viewAllText = t("common.viewAll");
  const viewLessText =
    t("common.viewLess") || t("topOffers.viewFewer");
  const displayText = showText ?? viewAllText;
  const isExpanded = displayText === viewLessText;
  const isArabic = i18n.language === "ar";

  return (
    <div className="flex justify-between items-center mb-3 md:mb-6  pb-2 pr-2">
      {/* border width = text width */}
      <h2 className="inline-block text-lg sm:text-xl md:text-2xl pb-2 font-semibold text-subTitleColor border-b-4 border-blueSite pb-1 md:min-w-72">
        {text}
      </h2>

      <Button
        to={onClick ? undefined : url}
        onClick={onClick}
        unstyled
        className="flex items-center text-md lg:text-lg xl:text-xl 2xl:text-xl gap-1 font-medium hover:underline gap-2"
        style={{
          color: "#323232",
          fontSize: "34.73px",
          lineHeight: "39.07px",
        }}
      >
        {displayText}
        {isExpanded ? (
          <ArrowDown className="text-blueSite  lg:text-[28px] text-[16px]" />
        ) : (
          isArabic ? (
            <ArrowLeft className="text-blueSite lg:text-[28px] text-[16px]" />
          ) : (
            <ArrowRight className="text-blueSite lg:text-[28px] text-[16px]" />
          )
        )}
      </Button>
    </div>
  );
};

export default HeaderHome;
