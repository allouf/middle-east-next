"use client";

import { useMemo, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { buildApplyFormData } from "../components/JobDetails/apply/buildApplyFormData";
import { ApplyAnswer, ApplyFormErrors, ApplyFormState } from "@/features/jobsServices/types/jobs.types";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function useApplyForm(args: {
  jobId: string | number;
  initialAnswers?: ApplyAnswer[];
  jobTemplate?: any; // Add job template to know which fields are required
  endpoint: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) {
  const { t } = useTranslation();
  const initialState: ApplyFormState = useMemo(
    () => ({
      cover_letter: "",
      answers: args.initialAnswers?.length ? args.initialAnswers : [],
    }),
    [args.initialAnswers]
  );

  const { formData, setFormData, handleChange, resetForm } = useFormData(initialState);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ApplyFormErrors>({});

  const { postData, loading } = usePostData(args.endpoint);

  const setAnswerValue = (index: number, value: string) => {
    setFormData((prev: ApplyFormState) => {
      const next = { ...prev, answers: [...prev.answers] };
      next.answers[index] = { ...next.answers[index], value };
      return next;
    });

    const key = `answers.${index}.value` as const;
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const addAnswer = (fieldId: number, value: string) => {
    setFormData((prev: ApplyFormState) => ({
      ...prev,
      answers: [...prev.answers, { field_id: fieldId, value }]
    }));
  };

  const validate = () => {
    const e: ApplyFormErrors = {};
    if (!formData.cover_letter.trim()) e.cover_letter = t("jobs.applyForm.coverLetterRequired", "Cover letter is required");
    
    // CV is required
    if (!cvFile) e.cv = t("jobs.applyForm.cvRequired", "CV is required");

    // Only validate required fields from job template
    if (args.jobTemplate?.fields) {
      args.jobTemplate.fields.forEach((field: any) => {
        if (field.is_required) {
          const answer = formData.answers.find(a => a.field_id === field.id);
          const answerIndex = formData.answers.findIndex(a => a.field_id === field.id);
          if (!answer || !String(answer.value).trim()) {
            e[`field_${field.id}`] = `${field.label} ${t("jobs.applyForm.isRequired", "is required")}`;
          }
        }
      });
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return { ok: false as const };

    const fd = buildApplyFormData({
      jobId: args.jobId,
      cvFile,
      data: formData,
    });

    const res = await postData(fd, {
      onSuccess: () => args.onSuccess?.(),
      onError: args.onError,
    });

    return { ok: !!res };
  };

  const resetAll = () => {
    resetForm();
    setCvFile(null);
    setErrors({});
  };

  const clearError = (field: string) => {
    if (errors[field as keyof ApplyFormErrors]) {
      setErrors((p) => ({ ...p, [field]: "" }));
    }
  };

  return {
    formData,
    handleChange,
    setAnswerValue,
    addAnswer,
    cvFile,
    setCvFile,
    errors,
    loading,
    submit,
    validate,
    resetAll,
    clearError,
  };
}
