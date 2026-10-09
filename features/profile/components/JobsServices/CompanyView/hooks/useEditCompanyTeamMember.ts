"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { buildCompanyTeamMemberFormData } from "../FormBuilder/buildCompanyTeamFormData";
import { TeamMember } from "../types";

export type TeamMemberEditState = {
  name: string;
  position: string;
  imageFile: File | null;
  image_path?: string | null;
};

export type TeamMemberEditErrors = {
  name?: string;
  position?: string;
  image?: string;
  general?: string;
};

export type SubmitResult = 
  | { ok: true; reason: "OK" }
  | { ok: false; reason: "NO_MEMBER" | "INVALID" | "FAILED" | "ERROR" };

export function useEditCompanyTeamMember(args: {
  endpointBase: string;

  member: TeamMember | null;
  required?: {
    name?: boolean;
    position?: boolean;
    image?: boolean;
  };

  onSuccess?: () => void;
}) {
  const req = useMemo(
    () => args.required ?? { name: true, position: true, image: false },
    [args.required]
  );

  const [formState, setFormState] = useState<TeamMemberEditState>({
    name: "",
    position: "",
    imageFile: null,
    image_path: null,
  });

  const [errors, setErrors] = useState<TeamMemberEditErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const memberId = args.member?.id;

  const endpoint = useMemo(() => {
    if (!memberId) return args.endpointBase;
    const base = args.endpointBase.endsWith("/")
      ? args.endpointBase.slice(0, -1)
      : args.endpointBase;
    return `${base}/${memberId}`;
  }, [args.endpointBase, memberId]);

  // ✅ Prefill
  useEffect(() => {
    if (!args.member) return;

    setFormState({
      name: args.member.name ?? "",
      position: args.member.position ?? "",
      imageFile: null,
      image_path: args.member.image ?? null,
    });

    setErrors({});
    setIsSubmitted(false);
  }, [args.member]);

  const updateField = useCallback((patch: Partial<TeamMemberEditState>) => {
    setFormState((prev) => ({ ...prev, ...patch }));

    setErrors((prev) => {
      const n: TeamMemberEditErrors = { ...prev };
      if (patch.name !== undefined) delete n.name;
      if (patch.position !== undefined) delete n.position;
      if (patch.imageFile !== undefined) delete n.image;
      if (patch.image_path !== undefined) delete n.image;
      delete n.general;
      return n;
    });
  }, []);

  const validate = useCallback(() => {
    const e: TeamMemberEditErrors = {};

    if (req.name && !formState.name.trim()) e.name = "Member name is required";
    if (req.position && !formState.position.trim())
      e.position = "Job position is required";

    if (req.image) {
      const hasOld = !!formState.image_path;
      const hasNew = !!formState.imageFile;
      if (!hasOld && !hasNew) e.image = "Member image is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [
    formState.imageFile,
    formState.image_path,
    formState.name,
    formState.position,
    req.image,
    req.name,
    req.position,
  ]);

  const submit = useCallback(async (): Promise<SubmitResult> => {
    setIsSubmitted(true);

    if (!memberId) return { ok: false as const, reason: "NO_MEMBER" as const };
    if (!validate()) return { ok: false as const, reason: "INVALID" as const };

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const fd = buildCompanyTeamMemberFormData({
        name: formState.name,
        position: formState.position,
        imageFile: formState.imageFile ?? undefined,
      });

      // axios (api) يضبط Content-Type تلقائياً مع FormData
      const res = await api.post(endpoint, fd);

      const ok = !!(res?.data?.status ?? true); // حسب شكل API عندك
      if (!ok) {
        setErrors((prev) => ({
          ...prev,
          general: res?.data?.message || "Update failed",
        }));
        return { ok: false as const, reason: "FAILED" as const };
      }

      args.onSuccess?.();
      setIsSubmitted(false);
      setFormState((prev) => ({ ...prev, imageFile: null }));
      return { ok: true as const, reason: "OK" as const };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";
      setErrors((prev) => ({ ...prev, general: msg }));
      return { ok: false as const, reason: "ERROR" as const };
    } finally {
      setLoading(false);
    }
  }, [args, endpoint, formState.imageFile, formState.name, formState.position, memberId, validate]);

  const reset = useCallback(() => {
    if (!args.member) {
      setFormState({ name: "", position: "", imageFile: null, image_path: null });
    } else {
      setFormState({
        name: args.member.name ?? "",
        position: args.member.position ?? "",
        imageFile: null,
        image_path: args.member.image ?? null,
      });
    }

    setErrors({});
    setIsSubmitted(false);
    setLoading(false);
  }, [args.member]);

  return {
    endpoint,
    formState,
    errors,
    loading,
    isSubmitted,
    updateField,
    validate,
    submit,
    reset,
  };
}