"use client";

import { useMemo, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { buildUserProfileFormData } from "./buildUserProfileFormData";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";

export type UserProfileFormState = {
  name: string;
  bio: string;
};

export type UserProfileFormErrors = Partial<{
  name: string;
  bio: string;
  avatar: string;
  cover: string;
}>;

export function useUserProfileForm(args: {
  initial?: Partial<UserProfileFormState>;
  required?: {
    name?: boolean;
    bio?: boolean;
    avatar?: boolean;
    cover?: boolean;
  };

  onSuccess?: () => void;
}) {
  const initialState: UserProfileFormState = useMemo(
    () => ({
      name: args.initial?.name ?? "",
      bio: args.initial?.bio ?? "",
    }),
    [args.initial?.name, args.initial?.bio]
  );

  const { formData, setFormData, handleChange, resetForm } =
    useFormData<UserProfileFormState>(initialState);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<UserProfileFormErrors>({});

  const { postData, loading } = usePostData(JOBS_ENDPOINTS.updateProfileUser);

  const clearError = (key: keyof UserProfileFormErrors) => {
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const setAvatar = (file: File | null) => {
    setAvatarFile(file);
    clearError("avatar");
  };

  const setCover = (file: File | null) => {
    setCoverFile(file);
    clearError("cover");
  };

  const setName = (value: string) => {
    setFormData((p) => ({ ...p, name: value }));
    clearError("name");
  };

  const setBio = (value: string) => {
    setFormData((p) => ({ ...p, bio: value }));
    clearError("bio");
  };


  const validate = () => {
    const e: UserProfileFormErrors = {};
    const req = args.required ?? { name: true };

    if (req.name && !formData.name.trim()) {
      e.name = "Name is required";
    }

    if (req.bio && !formData.bio.trim()) {
      e.bio = "Bio is required";
    }

    if (req.avatar && !avatarFile) {
      e.avatar = "Avatar is required";
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

    const fd = buildUserProfileFormData({
      data: formData,
      avatarFile,
      coverFile,
    });

    const res = await postData(fd, {
      showMessage: false,
      onSuccess: () => {
        args.onSuccess?.();
        setIsSubmitted(false);
      },
    });

    return { ok: !!res };
  };

  const resetAll = () => {
    resetForm();
    setAvatarFile(null);
    setCoverFile(null);
    setErrors({});
  };

  return {
    // state
    formData,
    avatarFile,
    coverFile,
    errors,
    loading,
    isSubmitted,

    // handlers
    handleChange,
    setName,
    setBio,
    setAvatar,
    setCover,
    validate,
    submit,
    resetAll,
  };
}
