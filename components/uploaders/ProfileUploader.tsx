import ImageCropperModal from "@/components/uploaders/ImageCropperModal";
import { useImageCropper } from "@/lib/Hooks/useImageCropper";
import CameraButton from "@/components/uploaders/CameraButton";
import Image from "next/image";
import uploadImg from "@/assets/images/uploadImage.png";

import { useTranslation } from "@/lib/i18n/useTranslation";

interface ProfileUploaderProps {
  onChange: (value: string | File) => void | Promise<void>;
  logoPreview?: string;
  isEditing?: boolean;
  loading?: boolean;
  showDelete?: boolean;
  handleDeleteImg?: () => void;
  size?: string;
  isBtnlight?: boolean
}


const ProfileUploader = ({
  onChange,
  logoPreview,
  isEditing = true,
  loading = false,
  showDelete = true,
  handleDeleteImg,
  size,
  isBtnlight = false
}: ProfileUploaderProps) => {
  const { t } = useTranslation();
  const cropper = useImageCropper({
    circular: true,
    onSave: onChange,
    nameImage: "logoStore",
  });

  const handleRemoveImage = () => {
    cropper.removeImage();
    onChange(null as any);
    handleDeleteImg?.();
  };


  const defaultSizeClasses = "w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] lg:w-[90px] lg:h-[90px] xl:w-[100px] xl:h-[100px]";

  return (
    <div className={`relative group ${size || `ms-4 sm:ms-6 md:ms-8 ${defaultSizeClasses}`}`}>
      {cropper.isCropping && (
        <ImageCropperModal
          image={cropper.imageSrc}
          crop={cropper.crop}
          zoom={cropper.zoom}
          aspect={1}
          circular
          onCropChange={cropper.setCrop}
          onZoomChange={cropper.setZoom}
          onCropComplete={cropper.onCropComplete}
          onSave={cropper.saveCroppedImage}
          onCancel={cropper.closeCropper}
        />
      )}

      {loading ? (
        <div
          className="w-full h-full rounded-full bg-gray-200 animate-pulse border-2 border-gray-100 shadow-inner"
        />
      ) : cropper.preview || logoPreview ? (
        <img
          src={cropper.preview || logoPreview}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <button
          onClick={cropper.openFileDialog}
          className="w-full h-full rounded-full flex items-center justify-center bg-[#eee] relative hover:bg-[#ddd] transition-colors"
        >
          <Image
            src={uploadImg}
            alt={t("cover_uploader.profile_upload_alt")}
            width={24}
            height={24}
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 object-contain"
          />
        </button>
      )}

      {isEditing && (
        <CameraButton
          size={30}
          cropper={cropper}
          logoPreview={logoPreview}
          isLogoPreview={true}
          handleDeleteImg={handleRemoveImage}
          showDelete={showDelete}
          isBtnlight
          iconColor={isBtnlight ? "blueSite" : "white"}
          className={`absolute ${isBtnlight ? "bg-white shadow-md text-blueSite" : "bg-blueBtn"} bottom-0 end-0 rounded-full shadow hover:opacity-90 transition p-0`}
        />
      )}
    </div>
  );
};

export default ProfileUploader;

