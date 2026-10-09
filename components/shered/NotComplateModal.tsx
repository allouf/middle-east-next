'use client';

import React from "react";
import Modal from "@/components/ui/Modal";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const NotComplateModal = ({
  modalOpen,
  setModalOpen,
  setIsCompleteProfile,
}) => {
  const router = useRouter();

  const handleGoToProfile = () => {
    setModalOpen(false);
    router.push('/profile');
  };

  return (
    <Modal
      id="not-complete-profile"
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen(false), setIsCompleteProfile(false);
      }}
      className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-subTitleColor">
          {t("profileIncomplete.title")}
        </h2>

        <p className="text-textColor mt-2">
          {t("profileIncomplete.description")}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-6">
        <Button onClick={handleGoToProfile}>
          {t("profileIncomplete.goToProfile")}
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setModalOpen(false), setIsCompleteProfile(false);
          }}
        >
          {t("profileIncomplete.close")}
        </Button>
      </div>
    </Modal>
  );
};

export default NotComplateModal;
