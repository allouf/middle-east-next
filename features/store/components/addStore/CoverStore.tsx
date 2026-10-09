import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import CoverUploader from "../../../../components/uploaders/CoverUploader";
import ProfileUploader from "../../../../components/uploaders/ProfileUploader";

interface CoverStoreProps {
  handleChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeLogo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImgProfile: () => void;
  handleDeleteImgCover: () => void;
  coverPreview?: string;
  logoPreview?: string;
  isEditing?: boolean;
  showDelete?: boolean;
  onLogoUpload?: (file: File) => Promise<void>;
  onCoverUpload?: (file: File) => Promise<void>;
  loadingLogo?: boolean;
  loadingCover?: boolean;
}

const CoverStore = ({
  handleChange,
  handleChangeLogo,
  coverPreview = "",
  logoPreview = "",
  isEditing = true,
  showDelete = true,
  handleDeleteImgProfile,
  handleDeleteImgCover,
  onLogoUpload,
  onCoverUpload,
  loadingLogo = false,
  loadingCover = false,
}: CoverStoreProps) => {
  const { t } = useTranslation();

  const handleLogoChange = async (value: string | File) => {
    if (value instanceof File) {
      // Upload the file directly
      if (onLogoUpload) {
        await onLogoUpload(value);
      }
    } else {
      // Update form state
      const syntheticEvent = {
        target: { value },
      } as React.ChangeEvent<HTMLInputElement>;
      handleChangeLogo(syntheticEvent);
    }
  };

  const handleCoverChange = async (value: string | File) => {
    if (value instanceof File) {
      // Upload the file directly
      if (onCoverUpload) {
        await onCoverUpload(value);
      }
    } else {
      // Update form state
      const syntheticEvent = {
        target: { value },
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange("cover")(syntheticEvent);
    }
  };

  return (
    <div className="relative">
      <CoverUploader
        onChange={handleCoverChange}
        hint={t("cover_uploader.dimensions_hint")}
        coverPreview={coverPreview}
        isEditing={isEditing || !coverPreview}
        handleDeleteImg={handleDeleteImgCover}
        showDelete={showDelete}
        loading={loadingCover}
      />

      <div className="absolute -bottom-4 start-5 ">
        <ProfileUploader
          onChange={handleLogoChange}
          logoPreview={logoPreview}
          showDelete={showDelete}
          isEditing={isEditing || !logoPreview}
          handleDeleteImg={handleDeleteImgProfile}
          loading={loadingLogo}
        />
      </div>
    </div>
  );
};

export default CoverStore;
