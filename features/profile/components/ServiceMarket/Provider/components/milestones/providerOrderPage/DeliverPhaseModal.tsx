"use client";

import { useRef, useState } from "react";
import { Loader2, X, Upload, FileText, Image as ImageIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  phaseName: string;
  submitting: boolean;
  onSubmit: (message: string, attachments: File[]) => Promise<void>;
};

export default function DeliverPhaseModal({
  isOpen,
  onClose,
  phaseName,
  submitting,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await onSubmit(message.trim(), attachments);
    setMessage("");
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (idx: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const isImage = (f: File) => f.type.startsWith("image/");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      showCloseButton={false}
      classNameContent="p-0"
      padding="p-0"
      className="!rounded-[16px] overflow-hidden"
      style={{ maxWidth: "650px", maxHeight: "95vh" }}
    >
      <div className="p-8 relative bg-white overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          aria-label={t("common.close", { defaultValue: "Close" })}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        >
          <X size={16} />
        </button>

        <header className="mb-5">
          <h2 className="text-xl font-bold text-subTitleColor">
            {t("providerMilestoneOrder.deliver.title", { defaultValue: "Deliver phase" })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-bold text-blueSite">{phaseName}</span>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("providerMilestoneOrder.deliver.message", { defaultValue: "Delivery message" })}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#00664F] focus:ring-1 focus:ring-[#00664F] outline-none transition resize-none"
              placeholder={t("providerMilestoneOrder.deliver.messagePlaceholder", {
                defaultValue: "Describe what's included in this delivery...",
              })}
              disabled={submitting}
            />
          </div>

          <fieldset className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <legend className="px-2 text-sm font-bold text-blueSite flex items-center gap-1">
              <Upload className="w-4 h-4" />
              {t("providerMilestoneOrder.deliver.attachments", { defaultValue: "Attachments" })}
            </legend>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-blueSite/50 rounded-xl p-5 text-center cursor-pointer bg-white transition"
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="mx-auto w-7 h-7 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                {t("providerMilestoneOrder.deliver.uploadPrompt", {
                  defaultValue: "Click to add files",
                })}
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg"
                  >
                    {isImage(file) ? (
                      <ImageIcon className="w-4 h-4 text-blue-500 mr-2" />
                    ) : (
                      <FileText className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[150px]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!message.trim() || submitting}
              className="flex-1 py-3 bg-[#00664F] text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting
                ? t("common.processing", { defaultValue: "Sending..." })
                : t("providerMilestoneOrder.deliver.submit", { defaultValue: "Send delivery" })}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
