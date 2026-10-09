"use client";

import { useMemo, useState } from "react";
import usePostData from "@/lib/api/usePostData";
import { buildCompanyGalleryFormData } from "../FormBuilder/buildCompanyGalleryFormData";

export type CompanyGalleryErrors = Partial<{
  images: string;
}>;

export function useCompanyGalleryForm(args: {
  endpoint: string;
  required?: boolean;
  onSuccess?: () => void;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<CompanyGalleryErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { postData, loading } = usePostData(args.endpoint);

  const validate = () => {
    const e: CompanyGalleryErrors = {};
    if (args.required && images.length === 0) {
      e.images = "Gallery images are required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setIsSubmitted(true);

    if (!validate()) return { ok: false as const };

    const fd = buildCompanyGalleryFormData({ images });

    const res = await postData(fd, {
      showMessage:false,
      onSuccess: () => args.onSuccess?.(),
    });

    return { ok: !!res };
  };

  const resetAll = () => {
    setImages([]);
    setErrors({});
    setIsSubmitted(false);
  };

  return {
    images,
    setImages, 
    errors,
    loading,
    isSubmitted,
    submit,
    validate,
    resetAll,
  };
}