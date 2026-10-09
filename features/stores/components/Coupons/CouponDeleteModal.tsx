'use client';

import React from "react";
import Modal from "@/components/ui/Modal";
import useDeleteData from "@/lib/api/useDeleteData";
import { Trash2, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const  CouponDeleteModal = ({
  isOpen,
  onClose,
  title = "modals.deleteModal.title",
  description = "modals.deleteModal.description",
  url,
  id,
  onSuccess,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  url: string;
  id: string;
  onSuccess?: (response: any) => void;
  refetch?: () => void;
}) => {
  const { t } = useTranslation();
  const { deleteData, loading } = useDeleteData(url);

  const handleConfirm = async () => {
    await deleteData(id, {
      onSuccess: (response: any) => {
        onClose();
        refetch?.();
        onSuccess?.(response);
      },
      onError: () => {
        //onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-6 text-center"
      style={{ maxWidth: "500px" }}
    >
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center border-4 border-red-200">
            <AlertTriangle className="text-red-500" size={40} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-subTitleColor mb-3">
          {title || t("modals.deleteModal.title")}
        </h2>

        {/* Description */}
        <p className="text-subTitleColor mb-8 text-center leading-relaxed">
          {description || t("modals.deleteModal.description")}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border-2 border-gray-300 text-subTitleColor font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("modals.deleteModal.cancel")}
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blueBtn to-[#0B5C8E] text-textWhiteColor font-semibold rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blueSite/30"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-textWhiteColor"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("modals.deleteModal.deleting")}
              </>
            ) : (
              <>
                <Trash2 size={18} />
                {t("modals.deleteModal.confirmDelete")}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CouponDeleteModal;
