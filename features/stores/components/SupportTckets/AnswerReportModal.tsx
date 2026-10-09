"use client";

import React, { useState } from "react";
import { App, message } from "antd";

import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import MultiImageUpload from "@/components/ui/MultiImageUpload";

import { useTranslation } from "@/lib/i18n/useTranslation";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { Support_Tikctes } from "@/shared/constants/urls";

type Ticket = {
    id: number | string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    ticket: Ticket;
    refetch?: () => void;
    onSubmit?: (payload: { message: string; attachments: File[] }) => void;
};

type ReplyFormState = {
    message: string;
    attachments: File[];
};

const initialFormState: ReplyFormState = {
    message: "",
    attachments: [],
};

const AnswerReportModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, ticket, refetch }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();

    const { postData, loading } = usePostData();
    const [isSubmited, setIsSubmited] = useState(false);

    const { formData, handleChange, handleArrayChange, errors, handleAddError, isValid, resetForm } =
        useFormData<ReplyFormState>(initialFormState);
    // console.log("ticket", ticket);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit?.({ message: formData.message, attachments: formData.attachments });

        if (!isValid || !formData.attachments || formData.attachments.length === 0) {
            setIsSubmited(true);
            message.error(
                t("store.error.required", { defaultValue: "Please fill required fields" })
            );
            return;
        }


        // const fd = new FormData();
        // fd.append("message", formData.message);

        // formData.attachments?.forEach((file) => {
        //     fd.append("attachments[]", file);
        // });

        await postData(formData, {
            endpoint: Support_Tikctes.replyTikets(ticket.id),
            onSuccess: () => {
                setTimeout(() => {
                    message.success(
                        t("", { defaultValue: "Sent successfully" })
                    );
                    resetForm();
                    refetch?.();
                    onClose();
                    setIsSubmited(false);
                }, 3000); // 3 seconds
            },
            onError: (err: any) => {
                const apiMsg =
                    err?.response?.data?.message ||
                    t("store.error.general", { defaultValue: "Something went wrong" });
                message.error(apiMsg);
            },
        });

    };

    return (
        <Modal
            id="answer-report"
            isOpen={isOpen}
            onClose={onClose}
            className="p-0 "
            classNameContent=""
            style={{ maxWidth: "650px" }}
            showLine={true}
        >

            {/* ✅ Responsive container */}
            <div className="bg-white rounded-2xl sm:rounded-[28px] ">
                <div className="p-4 sm:p-6 md:p-8">
                    {/* Header */}
                    <div className="space-y-1 sm:space-y-2">
                        <h2 className="text-[18px] sm:text-[22px] md:text-[26px] font-semibold text-subTitleColor leading-snug">
                            {t("tickets.reply_title", { defaultValue: "Reply to this ticket" })}
                        </h2>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] text-textGrayColor">
                            {t("tickets.reply_subtitle", {
                                defaultValue: "Write your response and attach any files if needed.",
                            })}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="mt-5 sm:mt-6 md:mt-7 space-y-5 sm:space-y-6" >
                        {/* Message */}
                        <div>
                            <InputField
                                id="message"
                                label={t("tickets.reply_message_label", { defaultValue: "Your reply" })}
                                type="text"
                                placeholder={t("tickets.reply_message_placeholder", {
                                    defaultValue: "Write your reply...",
                                })}
                                value={formData.message}
                                onChange={handleChange("message")}
                                unstyled
                                withFieldset
                                required
                                validate
                                formErrors={errors}
                                handleAddError={handleAddError}
                                onSubmit={true}
                                isSubmited={isSubmited}

                            />
                        </div>

                        {/* Attachments */}
                        {/* Attachments */}
                        <div className="space-y-2">
                            <p className="text-[13px] sm:text-[14px] font-medium text-subTitleColor">
                                {t("tickets.attachments", { defaultValue: "Attachments" })}
                            </p>

                            {/* ✅ prevents overflow when too many images */}
                            <div className="rounded-xl border border-gray-200 bg-white p-3">
                                <div className="max-h-[240px] overflow-y-auto pr-1">
                                    <MultiImageUpload
                                        value={formData.attachments || []}
                                        required
                                        onImagesChange={(images) => handleArrayChange("attachments", images)}
                                        acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/avi', 'video/quicktime']}
                                        label={t("store.label.photoss", { defaultValue: "Upload files" })}
                                    />
                                </div>
                            </div>

                            <p className="text-[11px] sm:text-[12px] text-textGrayColor">
                                {t("tickets.attachments_hint", {
                                    defaultValue: "You can upload multiple files (images/docs).",
                                })}
                            </p>
                        </div>


                        {/* Actions */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full sm:w-auto sm:min-w-[220px] h-11 sm:h-12 px-6 rounded-xl text-white text-[14px] sm:text-[15px] font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ backgroundColor: "var(--SiteColor)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "var(--blueSiteHover)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "var(--SiteColor)")
                                }
                            >
                                {loading
                                    ? t("store.loading", { defaultValue: "Sending..." })
                                    : t("tickets.answer", { defaultValue: "Answer" })}
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-xl border border-gray-200 text-[14px] sm:text-[15px] font-medium text-textColor hover:bg-gray-50 transition"
                            >
                                {t("store.cancel", { defaultValue: "Cancel" })}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AnswerReportModal;
