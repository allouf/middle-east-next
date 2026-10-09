'use client';

import { useTranslation } from "@/lib/i18n/useTranslation";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { BsCameraFill } from "react-icons/bs";
import { FaCamera, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { message } from "antd";

interface CropperObject {
  preview?: string;
  openFileDialog?: () => void;
  removeImage?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface CameraButtonProps {
  size?: number;
  bgColor?: string;
  iconColor?: string;
  cropper: CropperObject;
  className?: string;
  hint?: string;
  showDelete?: boolean;
  isLogoPreview?: boolean;
  logoPreview?: string;
  handleDeleteImg?: () => void;
}

const CameraButton = ({
  size = 40,
  bgColor = "bg-gray-300",
  iconColor = "white",
  cropper,
  className = "",
  hint,
  logoPreview,
  handleDeleteImg,
  isLogoPreview = false,
  showDelete = true,
}: CameraButtonProps) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleClick = () => {
    if (!cropper.preview && !logoPreview) {
      cropper.openFileDialog?.();
      return;
    }

    if (!menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 176; // w-44 = 11rem = 176px
      const spaceRight = window.innerWidth - rect.right;

      // Position: prefer opening to the left of the button, fall back to right
      let left: number;
      if (spaceRight >= menuWidth) {
        left = rect.left;
      } else {
        left = rect.right - menuWidth;
      }

      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 6,
        left: Math.max(8, left),
        width: menuWidth,
        zIndex: 2147483647, // Maximum possible z-index
        backgroundColor: "#ffffff",
      });
    }

    setMenuOpen((prev) => !prev);
  };

  const handleUploadNew = () => {
    cropper.openFileDialog?.();
    setMenuOpen(false);
  };

  const handleDelete = () => {
    cropper.removeImage?.();
    handleDeleteImg?.();
    setMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg'];
    const allowedExtensions = ['.jpeg'];

    const isValidType = allowedTypes.includes(file.type);
    const isValidExtension = allowedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValidType || !isValidExtension) {
      messageApi.error('Please select a valid image file (JPG, JPEG, or PNG)');
      e.target.value = '';
      return;
    }

    cropper.onFileChange?.(e);
  };

  if (!cropper) {
    console.warn("CameraButton requires a cropper object");
    return null;
  }

  const dropdownMenu = mounted && menuOpen && (logoPreview || cropper.preview)
    ? createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="rounded-lg shadow-2xl overflow-hidden border border-gray-100"
        >
          <button
            onClick={handleUploadNew}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:text-blueSite hover:bg-gray-50 transition-colors"
            type="button"
          >
            <FaCamera size={14} />
            {t("common.upload_new")}
          </button>
          {showDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              type="button"
            >
              <FaTrash size={14} />
              {t("common.delete")}
            </button>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {contextHolder}
      {dropdownMenu}
      <div className={`${className}`}>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={handleClick}
            className={`flex items-center w-auto justify-center bg-${bgColor} text-${iconColor} rounded-full shadow`}
            style={{ width: size, height: size }}
            type="button"
          >
            {isLogoPreview || cropper.preview ? (
              <MdEdit size={size / 2} />
            ) : (
              <BsCameraFill size={size / 2} className="text-white" />
            )}
          </button>

          <input
            ref={cropper.inputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            hidden
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
};

export default CameraButton;
