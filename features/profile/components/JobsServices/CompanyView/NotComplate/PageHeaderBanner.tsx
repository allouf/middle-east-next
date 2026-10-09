'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Crumb = { label: string; href?: string };

type Props = {
    title?: string;
    backLabel?: string | string[];
    backHref?: string;
    onBack?: () => void;
    bgClassName?: string;
    bgImageUrl?: string;
    showPatternOverlay?: boolean;
    className?: string;
    statusCode?: number;
};

export default function PageHeaderBanner({
    title,
    backLabel,
    backHref,
    onBack,
    bgClassName = "bg-emerald-50/70",
    className = "",
    statusCode
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
                className="absolute -top-10 right-0 h-32 sm:h-40 w-1/2 sm:w-2/3 pointer-events-none"
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
            
                    <div className="flex flex-col items-start mb-2 px-4 sm:px-6 md:px-8 lg:px-16 py-4 sm:py-6">
                          {statusCode !== 478 && (  <div>
                            {backHref ? (
                            <Link
                                href={backHref}
                                className="inline-flex m-2 sm:m-4 items-center gap-2 text-xs font-semibold tracking-wide text-emerald-700 hover:opacity-80"
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
                                className="inline-flex m-2 sm:m-4 items-center gap-2 text-xs font-semibold tracking-wide text-emerald-700 hover:opacity-80"
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
                         )}
                    </div>
               
              


                {/* row: title left, crumbs right */}
                {(title) &&
                    <div className="flex flex-col sm:flex-row px-16 mb-3 h-auto sm:h-10 items-center justify-between gap-3 py-2 sm:py-0">
                        {title &&
                            <h1 className="text-base md:text-2xl font-semibold border-r-4 border-blueSite pr-3 text-blueSite ">
                                {title}
                            </h1>
                        }
                    </div>
                }
            </div>
        </section>
    );
}
