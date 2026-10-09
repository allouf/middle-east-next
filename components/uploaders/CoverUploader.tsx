'use client'
import ImageCropperModal from "@/components/uploaders/ImageCropperModal";
import { useImageCropper } from "@/lib/Hooks/useImageCropper";
import CameraButton from "@/components/uploaders/CameraButton";
import Image from "next/image";
import uploadImg from "@/assets/images/uploadImage.png";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface CoverUploaderProps {
  onChange: (value: string | File) => void | Promise<void>;
  handleDeleteImg?: () => void;
  hint?: string;
  coverPreview?: string;
  isEditing?: boolean;
  showDelete?: boolean;
  loading?: boolean;

}

const CoverUploader = ({
  onChange,
  hint,
  coverPreview,
  isEditing = true,
  showDelete = true,
  handleDeleteImg,
  loading = false
}: CoverUploaderProps) => {
  const { t } = useTranslation();
  const cropper = useImageCropper({
    onSave: onChange,
    nameImage: "coverStore"
  });

  const handleRemoveImage = () => {
    cropper.removeImage();
    onChange(null as any);
    handleDeleteImg?.();
  };

  return (
    <div className="relative w-full h-[120px] sm:h-[160px] md:h-48 lg:h-56 mb-16 sm:mb-20 !bg-[#ddd]">
      {cropper.isCropping && (
        <ImageCropperModal
          image={cropper.imageSrc}
          crop={cropper.crop}
          zoom={cropper.zoom}
          aspect={820 / 312}
          onCropChange={cropper.setCrop}
          onZoomChange={cropper.setZoom}
          onCropComplete={cropper.onCropComplete}
          onSave={cropper.saveCroppedImage}
          onCancel={cropper.closeCropper}
        />
      )}

      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse rounded-md">
          <div className="text-sm sm:text-base text-gray-500">{t("common.loading")}</div>
        </div>
      ) : cropper.preview || coverPreview ? (
        <img
          src={cropper.preview || coverPreview}
          className="w-full h-full object-cover rounded-md"
          alt={t("cover_uploader.preview_alt")}
        />
      ) : (
        <button
          onClick={cropper.openFileDialog}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-4 p-4 hover:bg-gray-100/50 transition-colors"
          type="button"
        >
          <Image
            src={uploadImg}
            alt={t("cover_uploader.upload_alt")}
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
          />
          <span className="text-xs sm:text-sm md:text-base text-gray-400 text-center">{t("cover_uploader.add_hint")}</span>
        </button>
      )}
      {isEditing && (
      <CameraButton
  size={24}
  cropper={cropper}
  bgColor="blueSite"
  className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4"
  hint={hint}
  showDelete={showDelete}
  handleDeleteImg={handleRemoveImage}
  logoPreview={coverPreview}  // Add this line
/>
      )}
    </div>
  );
};

export default CoverUploader;

