"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface JobPublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "success" | "error";
    onGoToJobs?: () => void;
}

const JobPublishModal: React.FC<JobPublishModalProps> = ({ isOpen, onClose, type, onGoToJobs }) => {
    const { t } = useTranslation();
    const {isRTL} = useLocaleDirection();

    const isSuccess = type === "success";

    const handleAction = () => {
        if (isSuccess && onGoToJobs) {
            onGoToJobs();
            onClose();
        } else {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showLine={true}>
            <div className="flex flex-col items-center text-center px-4 py-6">
                {/* Illustration */}
                <div className="relative w-[200px] h-[200px] mb-6">
                    <Image
                        src={isSuccess ? "/exceeded.png" : "/exceeded.png"}
                        alt={isSuccess ? "Success" : "Error"}
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Title */}
                <h2 className={`text-xl font-bold mb-3 ${isSuccess ? "text-[#00664F]" : "text-[#BF2033]"}`}>
                    {isSuccess
                        ? t("jobs.publish.success.title", "Successfully published")
                        : t("jobs.publish.error.title", "Publishing failed")}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
                    {isSuccess
                        ? t("jobs.publish.success.description", "Your job has been published successfully. You can manage it from the jobs table.")
                        : t("jobs.publish.error.description", "Something went wrong while publishing your job. Please try again.")}
                </p>

                {/* Action Button */}
                <Button
                    onClick={handleAction}
                    className="bg-[#00664F] hover:bg-[#005542] text-white px-10 py-3 rounded-lg font-medium transition-colors w-full max-w-xs flex justify-center items-center h-12"
                >
                    {isSuccess
                        ? t("buttons.goToJobs", "Go to Jobs Table")
                        : t("buttons.tryAgain", "Try Again")}
                </Button>
            </div>
        </Modal>
    );
};

export default JobPublishModal;
