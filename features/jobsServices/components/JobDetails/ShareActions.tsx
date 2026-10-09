"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

import Button from "@/components/ui/Button";
import { IoCopyOutline } from "react-icons/io5";
import { FaFacebook, FaPinterestP } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";
import { Link2 } from "lucide-react";

type ShareActionsProps = {
    title?: string;
    description?: string;
    className?: string;
    jobSlug: string|string[];
};

const ShareActions: React.FC<ShareActionsProps> = ({
    title = "",
    description = "",
    className = "",
    jobSlug,
}) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [messageApi, contextHolder] = message.useMessage();
    const locale = useMemo(() => {
        if (!pathname) return "";
        const segment = pathname.split("/")[1];
        return segment || "";
    }, [pathname]);

    const baseUrl = useMemo(() => {
        if (typeof window !== "undefined") {
            return window.location.origin;
        }
        return process.env.NEXT_PUBLIC_SITE_URL || "";
    }, []);

    const url = `${baseUrl}/${locale}/jobs/${jobSlug}`;


    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(url);
            messageApi.success({
                content: t("cart.linkCopied"),
                duration: 2,
            });
        } catch {
            messageApi.error({
                content: t("cart.copyFailed"),
                duration: 2,
            });
        }
    }, [url, t]);


    const openShare = (shareUrl: string) => {
        window.open(
            shareUrl,
            "_blank",
            "noopener,noreferrer,width=600,height=500"
        );
    };

    return (
        <div
            className={`text-subTitleColor text-sm flex flex-col gap-2 items-start  ${className}`}
        >
            {contextHolder}
            <span>{t("jobs.shareThisJob")} :</span>

            <span className="flex flex-row gap-2">
                {/* Copy link */}
                <Button unstyled onClick={handleCopy} aria-label="Copy link"
                    type="button"
                    className="inline-flex h-8  items-center gap-2 rounded bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                    <Link2 className="h-4 w-4" />{t("copyLink")}
                </Button>

                {/* Facebook */}
                <Button
                    unstyled
                    onClick={() =>
                        openShare(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                url
                            )}`
                        )
                    }
                    aria-label="Share on Facebook"
                    className="inline-flex h-8 items-center gap-2 rounded bg-blueSite px-3 text-xs font-semibold text-white "

                >
                    <FaFacebook className="text-white text-[16px]" />
                </Button>

                {/* Twitter / X */}
                <Button
                    unstyled
                    className="inline-flex h-8 items-center gap-2 rounded bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    onClick={() =>
                        openShare(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                url
                            )}&text=${encodeURIComponent(title)}`
                        )
                    }
                    aria-label="Share on Twitter"
                >
                    <FaXTwitter className="text-subTitleColor text-[16px]" />
                </Button>

                {/* Pinterest */}
                <Button
                    unstyled
                    className="inline-flex h-8 items-center gap-2 rounded bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    onClick={() =>
                        openShare(
                            `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                                url
                            )}&description=${encodeURIComponent(description || title)}`
                        )
                    }
                    aria-label="Share on Pinterest"
                >
                    <FaPinterestP className="text-subTitleColor text-[16px]" />
                </Button>
            </span>
        </div>
    );
};

export default ShareActions;
