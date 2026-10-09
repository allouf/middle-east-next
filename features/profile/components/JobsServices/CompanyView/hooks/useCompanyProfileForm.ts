"use client";

import { useMemo, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import useDeleteData from "@/lib/api/useDeleteData";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { buildCompanyProfileFormData } from "../FormBuilder/buildCompanyProfileFormData";

export type CompanyProfileFormState = {
  description: string;
};

export type CompanyProfileFormErrors = Partial<{
  description: string;
  logo: string;
  cover: string;
}>;

export function useCompanyProfileForm(args: {
  endpoint: string;
  initial?: Partial<CompanyProfileFormState>;
  required?: {
    description?: boolean;
    logo?: boolean;
    cover?: boolean;
  };

  onSuccess?: () => void;
}) {
  const initialState: CompanyProfileFormState = useMemo(
    () => ({
      description: args.initial?.description ?? "",
    }),
    [args.initial?.description]
  );

  const { formData, setFormData, handleChange, resetForm } =
    useFormData<CompanyProfileFormState>(initialState);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<CompanyProfileFormErrors>({});

  const { postData, loading } = usePostData(args.endpoint);
  const { deleteData: deleteLogoData, loading: deletingLogo } = useDeleteData(JOBS_ENDPOINTS.deleteLogoProfile);
  const { deleteData: deleteCoverData, loading: deletingCover } = useDeleteData(JOBS_ENDPOINTS.deleteCoverProfile);

  const clearError = (key: keyof CompanyProfileFormErrors) => {
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const setLogo = (file: File | null) => {
    setLogoFile(file);
    clearError("logo");
  };

  const setCover = (file: File | null) => {
    setCoverFile(file);
    clearError("cover");
  };

  const setDescription = (value: string) => {
    setFormData((p) => ({ ...p, description: value }));
    clearError("description");
  };

  const validate = () => {
    const e: CompanyProfileFormErrors = {};
    const req = args.required ?? { description: true };

    if (req.description && !formData.description.trim()) {
      e.description = "Description is required";
    }

    if (req.logo && !logoFile) {
      e.logo = "Logo is required";
    }

    if (req.cover && !coverFile) {
      e.cover = "Cover is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setIsSubmitted(true);
    if (!validate()) return { ok: false as const };

    const fd = buildCompanyProfileFormData({
      data: formData,
      logoFile,
      coverFile,
    });

    const res = await postData(fd, {
        showMessage:false,
      onSuccess: () => {
        args.onSuccess?.();
        setIsSubmitted(false);
      },
    });

    return { ok: !!res };
  };

  const resetAll = () => {
    resetForm();
    setLogoFile(null);
    setCoverFile(null);
    setErrors({});
  };

  const deleteLogo = async () => {
    try {
      const result = await deleteLogoData(undefined, {
        showMessage: false,
        onSuccess: () => {
          setLogoFile(null);
          setErrors({});
        },
      });
      
      return { ok: !!result };
    } catch (error) {
      console.error('Error deleting logo:', error);
      return { ok: false as const };
    }
  };

  const deleteCover = async () => {
    try {
      const result = await deleteCoverData(undefined, {
        showMessage: false,
        onSuccess: () => {
          setCoverFile(null);
          setErrors({});
        },
      });
      
      return { ok: !!result };
    } catch (error) {
      console.error('Error deleting cover:', error);
      return { ok: false as const };
    }
  };

  return {
    // state
    formData,
    logoFile,
    coverFile,
    errors,
    loading,
    isSubmitted,
    deletingLogo,
    deletingCover,

    // handlers
    handleChange,
    setDescription,
    setLogo,
    setCover,
    validate,
    submit,
    resetAll,
    deleteLogo,
    deleteCover,
  };
}