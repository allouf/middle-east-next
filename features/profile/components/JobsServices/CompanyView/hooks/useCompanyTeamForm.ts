"use client";

import { useCallback, useMemo, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { buildCompanyTeamMemberFormData } from "../FormBuilder/buildCompanyTeamFormData";

export type TeamMemberRow = {
  name: string;
  position: string;
  imageFile: File | null;
  // optional: لو عندك صورة قديمة من API
  image_path?: string | null;
};

export type CompanyTeamFormState = {
  team: TeamMemberRow[];
};

export type CompanyTeamFormErrors = Record<string, string>;

const emptyMember = (): TeamMemberRow => ({
  name: "",
  position: "",
  imageFile: null,
  image_path: null,
});

export function useCompanyTeamForm(args: {
  endpoint: string;
  required?: {
    name?: boolean;
    position?: boolean;
    image?: boolean;
  };
  onSuccess?: () => void;
}) {
  const req = useMemo(
    () => args.required ?? { name: true, position: true, image: true },
    [args.required]
  );

  const initialState: CompanyTeamFormState = useMemo(
    () => ({ team: [emptyMember()] }),
    []
  );

  const { formData, handleArrayChange, resetForm, errors, setErrors } =
    useFormData<CompanyTeamFormState>(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { postData, loading } = usePostData(args.endpoint);

  const addMember = useCallback(() => {
    handleArrayChange("team", [...formData.team, emptyMember()]);
  }, [formData.team, handleArrayChange]);

  const removeMember = useCallback(
    (index: number) => {
      if (formData.team.length <= 1) return;

      const next = formData.team.filter((_, i) => i !== index);
      handleArrayChange("team", next);

      setErrors({});
    },
    [formData.team, handleArrayChange, setErrors]
  );

  const updateMember = useCallback(
    (index: number, patch: Partial<TeamMemberRow>) => {
      const next = [...formData.team];
      next[index] = { ...next[index], ...patch };
      handleArrayChange("team", next);

      setErrors((prev) => {
        const n = { ...prev } as CompanyTeamFormErrors;
        if (patch.name !== undefined) delete n[`team.${index}.name`];
        if (patch.position !== undefined) delete n[`team.${index}.position`];
        if (patch.imageFile !== undefined) delete n[`team.${index}.image`];
        return n;
      });
    },
    [formData.team, handleArrayChange, setErrors]
  );

  const validate = useCallback(() => {
    const e: CompanyTeamFormErrors = {};

    formData.team.forEach((m, i) => {
      const touched = !!m.name.trim() || !!m.position.trim() || !!m.imageFile;

      const shouldValidate =
        !!req.name || !!req.position || !!req.image ? true : touched;

      if (!shouldValidate) return;

      if (req.name && !m.name.trim()) e[`team.${i}.name`] = "Member name is required";
      if (req.position && !m.position.trim())
        e[`team.${i}.position`] = "Job position is required";
      if (req.image && !m.imageFile) e[`team.${i}.image`] = "Member image is required";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData.team, req, setErrors]);

  const submitMember = useCallback(
    async (index: number) => {
      setIsSubmitted(true);
      if (!validate()) return { ok: false as const };

      const m = formData.team[index];
      if (!m) return { ok: false as const };

      const fd = buildCompanyTeamMemberFormData({
        name: m.name,
        position: m.position,
        imageFile: m.imageFile,
      });

      const res = await postData(fd , {
          showMessage:false,
      });
      return { ok: !!res };
    },
    [formData.team, postData, validate]
  );

  const submitAll = useCallback(async () => {
    setIsSubmitted(true);
    if (!validate()) return { ok: false as const, sent: 0, failedAt: 0 };

    let sent = 0;

    for (let i = 0; i < formData.team.length; i++) {
      const m = formData.team[i];

      const touched = !!m.name.trim() || !!m.position.trim() || !!m.imageFile;
      if (!touched) continue;

      const fd = buildCompanyTeamMemberFormData({
        name: m.name,
        position: m.position,
        imageFile: m.imageFile,
      });

      const res = await postData(fd);
      if (!res) return { ok: false as const, sent, failedAt: i + 1 };

      sent += 1;
    }

    args.onSuccess?.();
    setIsSubmitted(false);
    return { ok: true as const, sent, failedAt: 0 };
  }, [args, formData.team, postData, validate]);

  const resetAll = useCallback(() => {
    resetForm();
    setErrors({});
    setIsSubmitted(false);
  }, [resetForm, setErrors]);

  return {
    formData, 
    errors,
    loading,
    isSubmitted,

    addMember,
    removeMember,
    updateMember,

    validate,
    submitMember,
    submitAll,
    resetAll,
  };
}