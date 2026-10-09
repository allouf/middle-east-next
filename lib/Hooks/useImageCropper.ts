import { useState, useRef, type ChangeEvent } from "react";
import getCroppedImg from "./../utils/getCroppedImg";
import { base64ToFile } from "../utils/helper";

type CroppedArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type UseImageCropperArgs = {
  circular?: boolean;
  onSave: (file: File) => void;
  nameImage?: string;
};

export const useImageCropper = ({
  circular = false,
  onSave,
  nameImage,
}: UseImageCropperArgs) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);

  const openFileDialog = () => {
    if (typeof document === "undefined") return;

    if (!fileInputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".jpg,.jpeg,.png";
      input.onchange = handleFileChange;
      fileInputRef.current = input;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    
    const isValidType = allowedTypes.includes(file.type);
    const isValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValidType || !isValidExtension) {
      alert('Please select a valid image file (JPG, JPEG, or PNG)');
      target.value = ''; // Clear the input
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageSrc(reader.result);
        setIsCropping(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_: CroppedArea, croppedPixels: CroppedArea) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const saveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const base64 = await getCroppedImg(imageSrc, croppedAreaPixels);
    const file = base64ToFile(base64, nameImage || 'image');

    setPreview(URL.createObjectURL(file));
    onSave(file);
    closeCropper();
  };

  const closeCropper = () => {
    setIsCropping(false);
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const removeImage = () => {
    setPreview(null);
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setIsCropping(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    crop,
    zoom,
    preview,
    imageSrc,
    isCropping,
    setCrop,
    setZoom,
    openFileDialog,
    onCropComplete,
    saveCroppedImage,
    closeCropper,
    removeImage,
  };
};

