"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { RiBox3Fill } from "react-icons/ri";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
};

export const DeleteConfirmModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="p-0" showLine={false}>
            <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-8 text-center"
            >
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <RiBox3Fill className="text-blueSite" size={28} />
                </div>

                <div className="text-xl text-[#323232] mb-8">{t("cart.deleteConfirmationMessage")}</div>

                <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
                    <button onClick={onClose} className="py-3 rounded bg-gray-100 text-[#323232] font-semibold">
                        {t("buttons.cancel")}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="py-3 rounded bg-[#D02F44] text-textWhiteColor font-semibold"
                    >
                        {isDeleting ? t("buttons.deleting") : t("buttons.confirm")}
                    </button>
                </div>
            </motion.div>
        </Modal>
    );
};
