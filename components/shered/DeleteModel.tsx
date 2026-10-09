'use client'
import React from "react";
import { DeleteFilled } from "@ant-design/icons";
import useDeleteData from "../../lib/api/useDeleteData";
import { useTranslation } from "@/lib/i18n/useTranslation";
import CustomConfirmModal from "./CustomConfirmModal";

interface DeleteModalProps {
  isOpen: boolean;
  showMessage?: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  url: string;
  id: string | number;
  onSuccess?: (response?: any) => void;
  confirm?: boolean;
  refetch?: () => void;
  style?: {
    modal?: React.CSSProperties;
    cancelButton?: React.CSSProperties;
    okButton?: React.CSSProperties;
    iconWrap?: React.CSSProperties;
  };
  icon?: React.ReactNode;
}

const DeleteModal = ({
  isOpen,
  onClose,
  title = "modals.deleteModal.title",
  description = "modals.deleteModal.description",
  url,
  id,
  onSuccess,
  confirm = false,
  refetch,
  style = {},
  icon,
  showMessage = false,
}: DeleteModalProps) => {
  const { t } = useTranslation();
  const { deleteData, loading } = useDeleteData(url);

  const handleConfirm = async () => {
    await deleteData(id, {
      showMessage: showMessage,
      onSuccess: () => {
        onClose();
        if (refetch) {
          refetch();
        }

        if (onSuccess) {
          onSuccess();
        }
      },
      confirm: confirm,
      onError: () => {
        onClose();
      },
    });
  };

  return (
    <CustomConfirmModal
      open={isOpen}
      onClose={onClose}
      title={title}
      subtitle={description}
      type="danger"
      icon={icon || <DeleteFilled />}
      confirmText={t("modals.deleteModal.confirmDelete")}
      cancelText={t("modals.deleteModal.cancel")}
      onConfirm={handleConfirm}
      loading={loading}
      width={416}
      zIndex={9999}
      styles={{
        modal: style.modal,
        cancelButton: style.cancelButton,
        okButton: style.okButton,
        iconWrap: style.iconWrap,
      }}
    />
  );
};

export default DeleteModal;
