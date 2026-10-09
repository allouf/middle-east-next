"use client";

import React from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Hourglass,
  X,
  LucideIcon,
} from "lucide-react";

type NotificationVariant = "verification" | "suspended" | "under_review";

type StatusNotificationProps = {
  variant?: NotificationVariant;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  estimate?: string;
  className?: string;
  onClose?: () => void;
};

type VariantStyle = {
  wrapper: string;
  iconBox: string;
  icon: LucideIcon;
  iconColor: string;
  titleColor: string;
  descColor: string;
  buttonClass?: string;
  badgeClass?: string;
};

const variantStyles: Record<NotificationVariant, VariantStyle> = {
  verification: {
    wrapper:
      "border-[#E7CF8B] bg-[#FFFBEF]",
    iconBox:
      "bg-[#FFF3D6]",
    icon: AlertTriangle,
    iconColor: "text-[#A16207]",
    titleColor: "text-[#9A5B17]",
    descColor: "text-[#6B7280]",
    buttonClass:
      "bg-[#A16207] text-white hover:bg-[#8A5207]",
  },
  suspended: {
    wrapper:
      "border-[#F2C7C7] bg-[#FDF1F1]",
    iconBox:
      "bg-[#FCE4E4]",
    icon: ShieldAlert,
    iconColor: "text-[#DC2626]",
    titleColor: "text-[#A61B1B]",
    descColor: "text-[#C24141]",
    buttonClass:
      "bg-[#EF2D2D] text-white hover:bg-[#d92626]",
  },
  under_review: {
    wrapper:
      "border-[#E7CF58] bg-[#FFFDEA]",
    iconBox:
      "bg-[#FFF1B8]",
    icon: Hourglass,
    iconColor: "text-[#C58A00]",
    titleColor: "text-[#18243D]",
    descColor: "text-[#475467]",
    badgeClass:
      "bg-[#F8EDB8] text-[#A16207]",
  },
};

export default function StatusNotification({
  variant = "verification",
  title,
  description,
  buttonText,
  onButtonClick,
  estimate,
  className = "",
  onClose,
}: StatusNotificationProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      className={[
        "relative w-full text-left rounded-lg border px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5",
        styles.wrapper,
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 md:h-14 md:w-14",
              styles.iconBox,
            ].join(" ")}
          >
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${styles.iconColor}`} />
          </div>

          <div className="min-w-0">
            <h3
              className={[
                "font-bold text-sm sm:text-base md:text-[16px]",
                styles.titleColor,
              ].join(" ")}
            >
              {title}
            </h3>

            <p
              className={[
                "mt-1 max-w-[760px] text-xs sm:text-sm leading-5 sm:leading-6 md:text-[15px]",
                styles.descColor,
              ].join(" ")}
            >
              {description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 self-end md:self-center">
          {estimate && variant === "under_review" && (
            <div
              className={[
                "inline-flex min-h-[36px] sm:min-h-[46px] items-center rounded-2xl px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-somar-semibold whitespace-nowrap",
                styles.badgeClass,
              ].join(" ")}
            >
              Estimated: {estimate}
            </div>
          )}

          {buttonText && (variant === "suspended" || variant === "verification") && (
            <button
              type="button"
              onClick={onButtonClick}
              className={[
                "inline-flex min-h-[36px] sm:min-h-[44px] items-center justify-center rounded-xl px-3 sm:px-5 text-xs sm:text-sm font-somar-semibold transition-colors",
                styles.buttonClass,
              ].join(" ")}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}