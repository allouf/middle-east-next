"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import { message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useApplyForm } from "../../../hooks/useApplyForm";
import { Job } from "@/features/jobsServices/types/jobs.types";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import CustomConfirmModal from "@/components/shered/CustomConfirmModal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import NotCompleteModal from "./NotCompleteModal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { RiSendPlaneFill } from "react-icons/ri";

export default function ApplyForm({
  open,
  handleClose,
  job,
  onCreated,
}: {
  open?: boolean;
  handleClose: () => void;
  job: Job;
  onCreated?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notCompleteModalOpen, setNotCompleteModalOpen] = useState(false);

  const isRTL = i18n.language === "ar";

  const form = useApplyForm({
    jobId: job.id,
    jobTemplate: job.job_template,
    endpoint: JOBS_ENDPOINTS.applyJob,
    onSuccess: () => {
      message.success(t("jobs.applyForm.success"));
      onCreated?.();
      handleClose();
    },
    onError: (err) => {
      if (err?.response?.status === 480) {
        setConfirmOpen(false);
        setNotCompleteModalOpen(true);
      }
    },
  });

  const close = () => {
    form.resetAll();
    handleClose();
  };

  const handleAskConfirm = async () => {
    const isValid = form.validate();

    if (!isValid) {
      message.error(t("jobs.applyForm.requiredFields"));
      return;
    }

    setConfirmOpen(true);
  };

  return (
    <>
      <CustomConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        type="success"
        title={t("jobs.applyForm.confirmTitle", { title: job.title })}
        subtitle={t("jobs.applyForm.confirmSubtitle")}
        confirmText={t("jobs.applyForm.confirm")}
        cancelText={t("jobs.applyForm.cancel")}
        loading={form.loading}
        onConfirm={async () => {
          const r = await form.submit();

          if (!r.ok) {
            message.error(t("jobs.applyForm.fixErrors"));
            return false;
          }

          return true;
        }}
        width={520}
        styles={{
          modal: { borderRadius: 20, zIndex: 9999 },
          okButton: { borderRadius: 12, padding: "10px 28px", minWidth: 180 },
          cancelButton: { borderRadius: 12, padding: "10px 28px", minWidth: 180 },
          title: { fontSize: 18, fontWeight: 700 },
          subtitle: { maxWidth: 520, margin: "0 auto" },
        }}
        confirmButtonProps={{ className: "min-w-[180px]" }}
        cancelButtonProps={{ className: "min-w-[180px]" }}
      />

      <Modal
        isOpen={!!open}
        onClose={close}
        style={{ maxWidth: "600px" }}
        padding="py-0"
        showLine={false}
        className="!rounded-[36px]"
        classNameContent="relative !p-0 overflow-scroll max-h-[calc(100vh-100px)]"
      >
        <div className="relative bg-white rounded-[32px] overflow-hidden">
          {/* Header background pattern (diamond grid) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 h-40"
            style={{
              backgroundColor: "#F7FAF9",
              backgroundImage: `
          repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 32px),
          repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 32px)
        `,
              backgroundPosition: "top right",
            }}
          />
          <div className="relative px-6 sm:px-8 pt-6 pb-8">

            <button
              type="button"
              onClick={close}
              className="inline-flex  items-center gap-2 text-base font-medium tracking-wide text-blueSite hover:opacity-80"
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              {t("buttons.goBack").toUpperCase()}
            </button>

            <h2 className="mt-2 text-[22px] font-semibold text-blueSite">
              {t("jobs.applyForm.title")}
            </h2>

            <div className="mt-6 space-y-5">
              <div className="space-y-5 ">
                <InputField
                  id="applicant_details"
                  label={t("jobs.applyForm.applicantDetails")}
                  type="textarea"
                  placeholder={t("jobs.applyForm.applicantDetailsPlaceholder")}
                  value={form.formData.cover_letter}
                  onChange={form.handleChange("cover_letter")}
                  error={form.errors.cover_letter}
                  unstyled
                  
                  withFieldset
                />

                {job.job_template?.fields.map((field) => {
                  const answerIndex = form.formData.answers.findIndex(
                    (a) => a.field_id === field.id
                  );
                  const hasAnswer = answerIndex >= 0;

                  return (
                    <InputField
                      key={field.id}
                      id={`field_${field.id}`}
                      label={field.label}
                      placeholder={t("jobs.applyForm.fieldPlaceholder", {
                        label: field.label.toLowerCase(),
                      })}
                      type={(() => {
                        switch (field.type) {
                          case "text":
                            return "text";
                          case "number":
                            return "number";
                          case "textarea":
                            return "textarea";
                          case "email":
                            return "email";
                          case "select":
                            return "select";
                          case "checkbox":
                            return "checkbox";
                          case "date":
                            return "date";
                          case "time":
                            return "time";
                          default:
                            // Handle radio and other types as text/select
                            return field.type === "radio" ? "select" : "text";
                        }
                      })()} // trigger ts
                      value={hasAnswer ? form.formData.answers[answerIndex].value : ""}
                      onChange={(v) => {
                        let stringValue = "";

                        if (typeof v === "string") {
                          stringValue = v;
                        } else if (v && typeof v === "object" && "target" in v) {
                          stringValue = (v.target as HTMLInputElement).value;
                        } else if (v && typeof v === "object") {
                          stringValue = v.toString();
                        } else {
                          stringValue = String(v || "");
                        }

                        if (hasAnswer) {
                          form.setAnswerValue(answerIndex, stringValue);
                        } else {
                          form.addAnswer(field.id, stringValue);
                        }
                        form.clearError(`field_${field.id}`);
                      }}
                      error={form.errors[`field_${field.id}`]}
                      required={field.is_required}
                      unstyled
                      withFieldset
                    />
                  );
                })}

                <div className="!w-full">
                  <label className="block text-sm font-medium mb-2">
                    {t("jobs.applyForm.uploadCv")}
                  </label>
                  <Upload
                    accept=".pdf,.doc,.docx"
                    beforeUpload={(file) => {
                      form.setCvFile(file);
                      return false; // Prevent automatic upload
                    }}
                    onRemove={() => {
                      form.setCvFile(null);
                    }}
                    maxCount={1}
                    className="w-full [&_.ant-upload]:w-full"
                  >
                    <button
                      type="button"
                      className="!w-full border border-gray-200 rounded-lg p-4 text-sm text-left flex items-center gap-2 hover:bg-gray-50"
                    >
                      <UploadOutlined />
                      {form.cvFile ? form.cvFile.name : t("jobs.applyForm.uploadCv")}
                    </button>
                  </Upload>
                  {form.errors.cv ? (
                    <p className="text-red-500 text-xs mt-1">{form.errors.cv}</p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleAskConfirm}
                  disabled={form.loading}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blueSite text-white font-semibold hover:bg-emerald-800 disabled:opacity-60"
                >
                  <RiSendPlaneFill className="h-4 w-4" />
                  {form.loading
                    ? t("jobs.applyForm.submitting")
                    : t("jobs.applyForm.submit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <NotCompleteModal
        open={notCompleteModalOpen}
        handleClose={() => setNotCompleteModalOpen(false)}
      />
    </>
  );
}