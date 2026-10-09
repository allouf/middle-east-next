import { useTranslation } from '@/lib/i18n/useTranslation';
import { Video } from 'lucide-react';

const VideoUploader = ({ preview, onChange, onRemove }) => {
    const { t } = useTranslation();
  
  if (preview) {
    return (
      <div className="relative">
        <video src={preview} className="w-full h-auto max-h-64 rounded-lg" controls />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-textWhiteColor rounded-full p-1"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Video className="w-10 h-10 mb-3 text-textColor" />
        <p className="mb-2 text-sm text-textColor">
          <span className="font-semibold">{t("community.reelForm.clickToUpload")}</span>
        </p>
        <p className="text-xs text-textColor">{t("community.reelForm.videoFormats")}</p>
      </div>
      <input
        type="file"
        className="hidden"
        accept="video/*"
        onChange={onChange}
      />
    </label>
  );
};
export default VideoUploader

