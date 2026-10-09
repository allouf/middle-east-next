"use client";

import React, { useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";
import { Loader2, FileText, Image as ImageIcon, X, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { useAlert } from "@/lib/context/AlertProvider";
import { clientOrderService } from "@/features/profile/components/ServiceMarket/Client/services/client-order.service";
import { ORDERABLE_TYPE } from "@/shared/constants/api-endpoints";

interface RequestMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  serviceTitle: string;
}

/**
 * Buyer's "Request milestone-pay" modal. Sibling to the single-pay
 * Order modal but takes a different path on the backend.
 *
 * The buyer is on a service-offer detail page, sees "Order Now" (single
 * Stripe Checkout for the whole offer) and "Request milestone-pay"
 * (this modal). Clicking the latter opens this form to capture notes /
 * attachments, then POSTs to /service-orders with
 *   orderable_type='milestone_template'
 *   service_offer_id=<this offer>
 *
 * The backend creates a status=Negotiation order with no phases yet and
 * no payment. The provider then defines the milestone template inline
 * via POST /provider-orders/{id}/define-milestone, which transitions the
 * order to PendingPayment so the existing per-phase pay flow takes over.
 *
 * On success we route to the buyer's milestones order page — where the
 * Negotiation-state UI (waiting for provider) is rendered.
 */
const RequestMilestoneModal: React.FC<RequestMilestoneModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  serviceTitle,
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
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      message.error(
        t("services.requestMilestoneModal.notesRequired", {
          defaultValue: "Please describe what you need.",
        }),
      );
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("orderable_type", ORDERABLE_TYPE.MilestoneTemplate);
    formData.append("service_offer_id", String(serviceId));
    formData.append("notes", notes);
    attachments.forEach((file) => formData.append("attachments[]", file));

    const response = await clientOrderService.createOrder(formData, {
      onError: (err: any) => {
        const status = err?.response?.status;
        const apiMessage = err?.response?.data?.message ?? err?.message;
        if (status === 422 && typeof apiMessage === "string" && /stripe|onboarding|payment/i.test(apiMessage)) {
          message.error(
            t("services.requestMilestoneModal.sellerOnboardingPending", {
              defaultValue:
                "This seller hasn't finished payment onboarding yet, so they can't accept orders.",
            }),
          );
        } else {
          message.error(apiMessage || t("common.errorOccurred", { defaultValue: "An error occurred." }));
        }
      },
    });

    setIsSubmitting(false);

    if (!response?.status) return;

    message.success(
      t("services.requestMilestoneModal.success", {
        defaultValue: "Request sent. The provider will define the milestones for your review.",
      }),
    );
    onClose();

    // Backend returns { order, invoice=null } for milestone-template orders
    // (no payment yet). Route to the buyer's milestones page where we render
    // the Negotiation waiting state.
    const orderId = response.data?.order?.id;
    router.push(
      orderId
        ? `/dashboard?tab=service_market&subTab=customer_order_milestones&orderId=${orderId}`
        : "/dashboard?tab=service_market&subTab=my_order_customer",
    );
  };

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
      style={{ maxWidth: "700px", maxHeight: "95vh" }}
    >
      <div className="p-8 pb-10 relative bg-white overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm z-10"
          aria-label={t("common.close", { defaultValue: "Close" })}
        >
          <AiOutlineClose size={14} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-[#00664F]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#00664F]">
              {t("services.requestMilestoneModal.label", { defaultValue: "Milestone-pay request" })}
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-subTitleColor mb-1">
            {t("services.requestMilestoneModal.title", { defaultValue: "Request milestone-based payment" })}
          </h2>
          <p className="text-textGrayColor text-[14px]">
            {t("services.requestMilestoneModal.subtitle", {
              defaultValue: "For",
            })}
            : <span className="font-bold text-blueSite">{serviceTitle}</span>
          </p>
          <p className="text-[13px] text-gray-500 mt-2">
            {t("services.requestMilestoneModal.flowHint", {
              defaultValue:
                "The provider will define the phases (with budgets and delivery dates), then you'll pay each phase as work begins.",
            })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[15px] font-bold text-subTitleColor">
              {t("services.requestMilestoneModal.notesLabel", {
                defaultValue: "What do you need?",
              })}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[150px] p-4 rounded-xl border border-[#E2E8F0] focus:border-blueSite focus:ring-1 focus:ring-blueSite outline-none transition-all resize-none text-[14px]"
              placeholder={t("services.requestMilestoneModal.notesPlaceholder", {
                defaultValue: "Describe the scope, timeline, and any constraints the provider should know about...",
              })}
              required
            />
          </div>

          <fieldset className="p-5 border border-[#E2E8F0] rounded-[16px] transition-colors bg-[#FAFAFA]">
            <legend className="px-3 text-blueSite font-bold text-[14px] flex items-center gap-2">
              <AiOutlineCloudUpload size={18} />
              {t("services.requestMilestoneModal.attachmentsLabel", { defaultValue: "Reference files" })}
            </legend>

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E2E8F0] hover:border-blueSite/50 rounded-xl p-6 text-center cursor-pointer bg-white transition-all group"
              >
                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <AiOutlineCloudUpload className="mx-auto w-8 h-8 text-gray-400 group-hover:text-blueSite mb-2" />
                <p className="text-[14px] text-textGrayColor group-hover:text-subTitleColor font-medium">
                  {t("services.requestMilestoneModal.uploadPrompt", { defaultValue: "Click to attach reference files" })}
                </p>
              </div>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg shadow-sm"
                    >
                      {isImage(file) ? (
                        <ImageIcon className="w-5 h-5 text-blue-500 mr-2" />
                      ) : (
                        <FileText className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span className="text-[13px] font-medium text-subTitleColor truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="ml-2 p-0.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
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
              className="flex-1 py-3.5 bg-blueSite hover:bg-blueSiteHover transition-colors text-white font-bold rounded-xl flex items-center justify-center gap-2 text-[16px] shadow-lg shadow-blueSite/10 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("common.processing", { defaultValue: "Sending..." })}
                </>
              ) : (
                t("services.requestMilestoneModal.submit", { defaultValue: "Send request" })
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-3.5 text-subTitleColor font-bold text-[16px] hover:bg-gray-50 rounded-xl"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RequestMilestoneModal;
