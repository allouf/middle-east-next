"use client";

import React from "react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useRouter } from "next/navigation";

type NotCompleteModalProps = {
    open: boolean;
    handleClose: () => void;
    onGoToProfile?: () => void;
};

const NotCompleteModal: React.FC<NotCompleteModalProps> = ({
    open,
    handleClose,
    onGoToProfile,
}) => {
    const { t } = useTranslation();
    const router = useRouter();

    const handleGoToProfile = () => {
        if (onGoToProfile) {
            onGoToProfile();
        } else {
            router.push("/profile?tab=jobs_services&view=user_profile");
        }
        handleClose();
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            className="text-center"
            style={{ maxWidth: 560, width: "92%" }}
            padding="py-0"
            showLine={false}
            classNameContent="!p-0 overflow-hidden !rounded-2xl"
        >
            <div className="flex flex-col items-center text-center px-6 py-8">
                {/* Illustration - Using a relevant image if available, else fallback */}
                <div className="relative w-[220px] h-[220px] md:w-[250px] md:h-[250px] mb-5">
                    <Image
                        src="/gallary.png"
                        alt="Profile Incomplete"
                        fill
                        priority
                        className="object-contain grayscale opacity-60"
                    />
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                    {t("jobs.applyForm.profileIncompleteTitle", { defaultValue: "Your profile is not complete" })}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm md:text-base mb-7 max-w-sm leading-6">
                    {t("jobs.applyForm.profileIncompleteDescription", {
                        defaultValue: "You have to complete your profile before applying to a job."
                    })}
                </p>

                {/* Actions */}
                <div className="flex flex-col w-full gap-3">
                    <Button
                        type="button"
                        onClick={handleGoToProfile}
                        unstyled
                        className="
              w-full max-w-xs mx-auto
              h-11
              rounded-xl
              bg-[#00664F]
              hover:bg-[#00664F]/90
              text-white
              font-medium
              transition
              flex items-center justify-center
            "
                    >
                        {t("jobs.applyForm.goToProfile", { defaultValue: "Go to Profile" })}
                    </Button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="mt-2 text-sm text-gray-500 hover:text-gray-800 underline underline-offset-4"
                    >
                        {t("common.cancel", { defaultValue: "Cancel" })}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default NotCompleteModal;
