"use client";

import React, { useState, useRef } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";
import { Loader2, FileText, Image as ImageIcon, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { clientOrderService } from "@/features/profile/components/ServiceMarket/Client/services/client-order.service";
import { useAlert } from "@/lib/context/AlertProvider";
import { useRouter } from "next/navigation";
import { ORDERABLE_TYPE } from "@/shared/constants/api-endpoints";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  planId: number;
  planTitle: string;
}

const FileIconPdf = () => (
  <FileText className="w-5 h-5 text-red-500 mr-2" />
);

const FileIconImg = () => (
  <ImageIcon className="w-5 h-5 text-blue-500 mr-2" />
);

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  planId,
  planTitle,
}) => {
  const { t } = useTranslation();
  const { message } = useAlert();
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      message.error(t("services.orderModal.notesRequired", { defaultValue: "Please provide order notes/requirements." }));
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("orderable_type", ORDERABLE_TYPE.ServiceOffer);
    formData.append("orderable_id", serviceId.toString());
    formData.append("plan_id", planId.toString());
    formData.append("notes", notes);

    attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });

    const response = await clientOrderService.createOrder(formData, {
      onError: (error: any) => {
        const status = error?.response?.status;
        const apiMessage = error?.response?.data?.message ?? error?.message;

        // The seller hasn't completed Stripe Connect onboarding — surface
        // a clear message rather than the raw backend string.
        if (status === 422 && typeof apiMessage === "string" && /stripe|onboarding|payment/i.test(apiMessage)) {
          message.error(
            t("services.orderModal.sellerOnboardingPending", {
              defaultValue: "This seller hasn't finished payment onboarding yet, so they can't accept orders. Please try again later.",
            }),
          );
        } else {
          message.error(apiMessage || t("common.errorOccurred", { defaultValue: "An error occurred. Please try again." }));
        }
      },
    });

    setIsSubmitting(false);

    if (!response?.status) {
      return;
    }

    // Backend returns { order, checkout_url }. For single-offer orders
    // checkout_url is always present — redirect the buyer to Stripe
    // Checkout. The order stays in PendingPayment until the webhook lands.
    const checkoutUrl: string | null | undefined = response.data?.checkout_url;

    if (checkoutUrl) {
      message.success(t("services.orderModal.redirectingToCheckout", { defaultValue: "Redirecting to checkout..." }));
      onClose();
      window.location.href = checkoutUrl;
      return;
    }

    // Defensive fallback: no checkout_url. Should not happen for single-offer.
    message.success(t("services.orderModal.success", { defaultValue: "Order created successfully!" }));
    onClose();
    router.push("/profile?tab=service_market&subTab=my_order_customer");
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      showCloseButton={false}
      classNameContent="p-0"
      padding="p-0"
      className="!rounded-[16px] overflow-hidden"
      style={{ maxWidth: "700px", maxHeight: "95vh" }}
    >
      <div className="p-8 pb-10 relative bg-white overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm z-10"
          aria-label={t("common.close", { defaultValue: "Close" })}
        >
          <AiOutlineClose size={14} />
        </button>

        <div className="mb-8">
          <h2 className="text-[24px] font-bold text-subTitleColor mb-1">
            {t("services.orderModal.title", { defaultValue: "Place Your Order" })}
          </h2>
          <p className="text-textGrayColor text-[14px]">
            {t("services.orderModal.subtitle", { defaultValue: "Specify your requirements for" })}:{" "}
            <span className="font-bold text-blueSite">{planTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notes Section */}
          <div className="space-y-2">
            <label className="block text-[15px] font-bold text-subTitleColor">
              {t("services.orderModal.notesLabel", { defaultValue: "Order Requirements & Notes" })}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[150px] p-4 rounded-xl border border-[#E2E8F0] focus:border-blueSite focus:ring-1 focus:ring-blueSite outline-none transition-all resize-none text-[14px]"
              placeholder={t("services.orderModal.notesPlaceholder", { defaultValue: "Describe what you need in detail..." })}
              required
            />
          </div>

          {/* Attachments Section - Fieldset style mirroring RevisionDetailsCard */}
          <fieldset className="p-5 border border-[#E2E8F0] rounded-[16px] transition-colors bg-[#FAFAFA]">
            <legend className="px-3 text-blueSite font-bold text-[14px] flex items-center gap-2">
              <AiOutlineCloudUpload size={18} />
              {t("services.orderModal.attachmentsLabel", { defaultValue: "Reference Files & Attachments" })}
            </legend>
            
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E2E8F0] hover:border-blueSite/50 rounded-xl p-6 text-center cursor-pointer bg-white transition-all group"
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <AiOutlineCloudUpload className="mx-auto w-8 h-8 text-gray-400 group-hover:text-blueSite mb-2" />
                <p className="text-[14px] text-textGrayColor group-hover:text-subTitleColor font-medium">
                  {t("services.orderModal.uploadPrompt", { defaultValue: "Click to upload or drag and drop files" })}
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  {t("services.orderModal.uploadLimits", { defaultValue: "Images, PDFs, Documents up to 10MB each" })}
                </p>
              </div>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {attachments.map((file, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center group relative px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg shadow-sm animate-in fade-in zoom-in duration-200"
                    >
                      {isImage(file) ? <FileIconImg /> : <FileIconPdf />}
                      <span className="text-[13px] font-medium text-subTitleColor truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="ml-2 p-0.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-blueSite hover:bg-blueSiteHover transition-colors text-white font-bold rounded-xl flex items-center justify-center gap-2 text-[16px] shadow-lg shadow-blueSite/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("common.processing", { defaultValue: "Processing..." })}
                </>
              ) : (
                t("services.orderModal.submitButton", { defaultValue: "Confirm & Place Order" })
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-3.5 text-subTitleColor font-bold text-[16px] hover:bg-gray-50 rounded-xl transition-colors"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default OrderModal;
