"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface AddAdSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onViewDetails?: () => void;
}

const AddAdSuccessModal: React.FC<AddAdSuccessModalProps> = ({
    isOpen,
    onClose,
    onViewDetails,
}) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose} showLine={true}>
            <div className="flex flex-col items-center text-center px-4">
                {/* Illustration */}
                <div className="relative w-[250px] h-[250px] mb-6">
                    <Image
                        src="/gallary.png"
                        alt="Success"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-[#00664F] mb-3">
                    {t("usedMarket.successModal.title")}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-8 max-w-xs">
                    {t("usedMarket.successModal.description")}
                </p>

                {/* Action Button */}
                <Button
                    onClick={onViewDetails || onClose}
                    className="bg-[#00664F] hover:bg-[#00664F]/90 text-white px-10 py-3 rounded-lg font-medium transition-colors w-full max-w-xs flex justify-center items-center"
                >
                    {t("usedMarket.successModal.viewDetails")}
                </Button>
            </div>
        </Modal>
    );
};

export default AddAdSuccessModal;
