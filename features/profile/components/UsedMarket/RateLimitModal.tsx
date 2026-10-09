"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface RateLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoHome?: () => void;
}

const RateLimitModal: React.FC<RateLimitModalProps> = ({
    isOpen,
    onClose,
    onGoHome,
}) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose} showLine={true}>
            <div className="flex flex-col items-center text-center px-4">
                {/* Illustration */}
                <div className="relative w-[250px] h-[250px] mb-6">
                    <Image
                        src="/exceeded.png"
                        alt="Rate Limit Exceeded"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-red-500 mb-3">
                    {t("usedMarket.rateLimitModal.title")}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-8 max-w-xs">
                    {t("usedMarket.rateLimitModal.description")}
                </p>

                {/* Action Button */}
                <Button
                    onClick={onGoHome || onClose}
                    className="bg-[#00664F] hover:bg-[#00664F]/90 text-white px-10 py-3 rounded-lg font-medium transition-colors w-full max-w-xs flex justify-center items-center"
                >
                    {t("usedMarket.rateLimitModal.goToHome")}
                </Button>
            </div>
        </Modal>
    );
};

export default RateLimitModal;
