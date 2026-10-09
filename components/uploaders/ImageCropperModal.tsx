import React from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Slider, Button, Space } from 'antd';

const Cropper = dynamic(() => import('react-easy-crop'), { 
  ssr: false, 
  loading: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Loading Editor...</div> 
}) as any;

interface ImageCropperModalProps {
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  circular?: boolean;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ImageCropperModal = ({
  image,
  crop,
  zoom,
  aspect,
  circular = false,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onSave,
  onCancel,
}: ImageCropperModalProps) => {

  const { t } = useTranslation();

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen z-[9999] flex items-center justify-center bg-black/70 overflow-y-auto">
      <div className="w-full max-w-[600px] min-h-[400px] bg-white rounded-xl p-5 flex flex-col my-auto shadow-2xl">
        <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={circular ? "round" : "rect"}
            showGrid={!circular}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex justify-between items-center gap-4">
          <div className="flex-1">
            <Slider
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={onZoomChange}
              tooltip={{ open: false }}
            />
          </div>

          <Space size="middle" className="px-2">
            <Button
              onClick={onSave}
              type="primary"
              className="rounded-lg h-[40px] min-w-[120px] font-medium"
            >
              {t("common.crop_save")}
            </Button>
            <Button
              onClick={onCancel}
              className="rounded-lg h-[40px] min-w-[100px] bg-gray-100 border-none hover:!bg-gray-200"
            >
              {t("common.cancel")}
            </Button>
          </Space>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageCropperModal;

