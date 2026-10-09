"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

import Button from "@/components/ui/Button";
import { IoCopyOutline } from "react-icons/io5";
import { FaFacebook, FaPinterestP } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";

type ShareActionsProps = {
    title?: string;
    description?: string;
    className?: string;
    productId?: number | string;
};

const ShareActions: React.FC<ShareActionsProps> = ({
    title = "",
    description = "",
    className = "",
    productId,
}) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [messageApi, contextHolder] = message.useMessage();
    // ✅ استخراج locale من المسار (مثال: /en/products/1)
    const locale = useMemo(() => {
        if (!pathname) return "";
        const segment = pathname.split("/")[1];
        return segment || "";
    }, [pathname]);

    // ✅ Base URL (localhost OR production)
    const baseUrl = useMemo(() => {
        if (typeof window !== "undefined") {
            return window.location.origin; // http://localhost:3000 OR real domain
        }
        return process.env.NEXT_PUBLIC_SITE_URL || "";
    }, []);

    // ✅ Full absolute URL مع locale
    const url = `${baseUrl}/${locale}/products/${productId}`;


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
            className={`text-subTitleColor text-sm flex flex-row gap-2 items-center  ${className}`}
        >
            {contextHolder}
            <span>{t("cart.shareProduct")} :</span>

            <span className="flex flex-row gap-2">
                {/* Copy link */}
                <Button unstyled onClick={handleCopy} aria-label="Copy link">
                    <IoCopyOutline className="text-subTitleColor text-[16px]" />
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
                >
                    <FaFacebook className="text-blueIcons text-[16px]" />
                </Button>

                {/* Twitter / X */}
                <Button
                    unstyled
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
