"use client";

import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import { useCompanyGalleryForm } from "../../../hooks/useCompanyGalleryForm";
import { JOBS_ENDPOINTS } from '@/shared/constants/api-endpoints';

interface AddGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddGalleryModal: React.FC<AddGalleryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const gallery = useCompanyGalleryForm({
    endpoint: JOBS_ENDPOINTS.addCompanyGallery,
    required: true,
    onSuccess: () => {
      // message.success(
      //   t("jobs.company.messages.gallery.uploaded", { defaultValue: "Gallery images uploaded successfully." })
      // );
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = async () => {
    if (gallery.images.length === 0) {
      message.error(t("jobs.company.messages.gallery.required", { defaultValue: "Please select at least one image." }));
      return;
    }

    const res = await gallery.submit();
    if (!res.ok) {
      message.error(t("jobs.company.messages.gallery.uploadFailed", { defaultValue: "Failed to upload gallery images." }));
    }
  };

  const handleCancel = () => {
    gallery.resetAll();
    onClose();
  };

  return (
    <Modal
      title={t("jobs.company.gallery.addGallery", { defaultValue: "Add Gallery" })}
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <div key="footer" className="flex gap-4">
          <button
            key="cancel"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t("common.cancel", { defaultValue: "Cancel" })}
          </button>
          <button
            key="submit"
            onClick={handleSubmit}
            disabled={gallery.loading || gallery.images.length === 0}
            className="px-4 py-2 bg-blueSite text-white rounded-lg hover:bg-blueSiteDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gallery.loading 
              ? t("common.uploading", { defaultValue: "Uploading..." })
              : t("common.upload", { defaultValue: "Upload" })
            }
          </button>
        </div>
      ]}
      width={600}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("jobs.company.gallery.selectImages", { defaultValue: "Select Images" })}
          </label>
          <MultiImageUpload
            onImagesChange={(imgs) => gallery.setImages(imgs)}
            value={gallery.images}
            acceptedTypes={["image/*"]}
          />
          {gallery.isSubmitted && gallery.errors.images && (
            <p className="mt-1 text-xs text-red-500">{gallery.errors.images}</p>
          )}
        </div>
        
        {gallery.images.length > 0 && (
          <div className="text-sm text-gray-600">
            {t("jobs.company.gallery.selectedCount", { 
              defaultValue: "{{count}} image(s) selected", 
              count: gallery.images.length 
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddGalleryModal;
