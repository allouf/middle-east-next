'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Crumb = { label: string; href?: string };

type Props = {
  title?: string;
  crumbs?: Crumb[];
  backLabel?: string | string[];
  backHref?: string;
  onBack?: () => void;
  bgClassName?: string;
  bgImageUrl?: string;
  showPatternOverlay?: boolean;
  className?: string;
  classButtonBack?: string;
};

export default function PageHeaderBanner({
  title,
  crumbs = [],
  backLabel,
  backHref,
  onBack,
  bgClassName = "bg-emerald-50/70",
  className = "",
  classButtonBack,
}: Props) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const handleBack = () => {
    if (onBack) return onBack();
    if (backHref) return; // handled by Link
    // Simple back navigation - language consistency is now handled in layout.tsx
    router.back();
  };

  return (
    <section
      className={[
        "relative  overflow-hidden w-fill  border border-emerald-100",
        "rounded-none border-b border-emerald-100",
        className,
      ].join(" ")}

    >
      <div className={["absolute inset-0", bgClassName].join(" ")} />

      <div
        className="absolute -top-10 right-0 h-32 sm:h-40 w-[75%] pointer-events-none"
        style={{
          backgroundImage: "url('/bgBack.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center right",
          backgroundSize: "cover", // أو cover حسب شكل الصورة
        }}
        aria-hidden="true"
      />

      <div className=" relative">
        {/* back */}
        <div className={`flex flex-col items-start mb-2  py-4 sm:py-6 ${classButtonBack}`}>
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex m-2 sm:m-4 items-center gap-2 text-base font-medium tracking-wide text-blueSite hover:opacity-80"
            >
              {isRTL ? (
                <>
                  <ArrowLeft size={16} strokeWidth={2} />
                  {Array.isArray(backLabel) ? backLabel.join(' ') : t("buttons.goBack")}

                </>
              ) : (
                <>
                  <ArrowLeft size={16} strokeWidth={2} />
                  {Array.isArray(backLabel) ? backLabel.join(' ') : t("buttons.goBack")}
                </>
              )}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex mx-2 sm:m-4 items-center gap-2 text-base font-medium tracking-wide text-blueSite hover:opacity-80"
            >
              {isRTL ? (
                <>
                  <ArrowRight size={16} strokeWidth={2} />
                  {Array.isArray(backLabel) ? backLabel.join(' ') : t("buttons.goBack")}

                </>
              ) : (
                <>
                  <ArrowLeft size={16} strokeWidth={2} />
                  {Array.isArray(backLabel) ? backLabel.join(' ') : t("buttons.goBack")}
                </>
              )}
            </button>
          )}
        </div>

        {/* row: title left, crumbs right */}
        {(title || crumbs.length > 0) &&
          <div className="flex flex-col sm:flex-row bg-[#00664F33] px-4 sm:px-6 md:px-8 lg:px-36 h-auto sm:h-10 items-center justify-between gap-3 py-3 sm:py-0">
            {title &&
              <h1 className="text-sm font-semibold text-blueSite sm:text-base order-1 sm:order-none">
                {title}
              </h1>
            }
            {crumbs.length ? (
              <nav className="flex items-start text-start gap-1 text-xs text-text-blueSite order-2 sm:order-none flex-wrap">
                {crumbs.map((c, idx) => {
                  const isLast = idx === crumbs.length - 1;

                  const item = c.href && !isLast ? (
                    <Link href={c.href} className="text-blueSite hover:text-blueSiteHover hover:underline">
                      {t(c.label) || c.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-blueSite font-medium" : ""}>
                      {t(c.label) || c.label}
                    </span>
                  );

                  return (
                    <React.Fragment key={`${c.label}-${idx}`}>
                      {item}
                      {!isLast ? <span className="mx-1 select-none">/</span> : null}
                    </React.Fragment>
                  );
                })}
              </nav>
            ) : null}
          </div>
        }
      </div>
    </section>
  );
}
