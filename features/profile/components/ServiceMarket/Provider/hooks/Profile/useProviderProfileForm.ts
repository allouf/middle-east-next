"use client";

import { useMemo, useState, useEffect } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { ProviderProfileFormState, ProviderProfileFormErrors } from "../../types";
import { buildProviderProfileFormData } from "./buildProviderProfileFormData";

export function useProviderProfileForm(args: {
  initial?: Partial<ProviderProfileFormState>;
  required?: {
    display_name?: boolean;
    country_code?: boolean;
    region?: boolean;
    bio?: boolean;
    verification_notes?: boolean;
    language_ids?: boolean;
    identity_document?: boolean;
    logo?: boolean;
    cover?: boolean;
    // Legacy fields for backward compatibility
    provider_name?: boolean;
    description?: boolean;
    website?: boolean;
    location?: boolean;
    languages?: boolean;
  };
}) {
  const initialState: ProviderProfileFormState = useMemo(
    () => ({
      display_name: args.initial?.display_name ?? "",
      country_code: args.initial?.country_code ?? "",
      region: args.initial?.region ?? "",
      bio: args.initial?.bio ?? "",
      verification_notes: args.initial?.verification_notes ?? "",
      language_ids: args.initial?.language_ids ?? [],
      identity_document: args.initial?.identity_document ?? null,
      // Legacy fields for backward compatibility
      provider_name: args.initial?.provider_name ?? "",
      description: args.initial?.description ?? "",
      website: args.initial?.website ?? "",
      location: args.initial?.location ?? "",
      languages: args.initial?.languages ?? [],
    }),
    [args.initial?.display_name, args.initial?.country_code, args.initial?.region, args.initial?.bio, args.initial?.verification_notes, args.initial?.language_ids, args.initial?.identity_document, args.initial?.provider_name, args.initial?.description, args.initial?.website, args.initial?.location, args.initial?.languages]
  );

  const { formData, setFormData, handleChange, resetForm: resetFormData , isValid } =
    useFormData<ProviderProfileFormState>(initialState);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [identityDocumentFile, setIdentityDocumentFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<ProviderProfileFormErrors>({});

  // Validate form whenever formData changes
  useEffect(() => {
    validate();
  }, [formData]);

  // Form helpers
  const clearError = (key: keyof ProviderProfileFormErrors) => {
    if (errors[key]) setErrors((p: ProviderProfileFormErrors) => ({ ...p, [key]: "" }));
  };

  // File setters
  const setLogo = (file: File | null) => {
    setLogoFile(file);
    clearError("logo");
  };

  const setCover = (file: File | null) => {
    setCoverFile(file);
    clearError("cover");
  };

  const setIdentityDocument = (file: File | null) => {
    setIdentityDocumentFile(file);
    clearError("identity_document");
  };

  // New field setters
  const setDisplayName = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, display_name: value }));
    clearError("display_name");
  };

  const setCountryCode = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, country_code: value }));
    clearError("country_code");
  };

  const setRegion = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, region: value }));
    clearError("region");
  };

  const setBio = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, bio: value }));
    clearError("bio");
  };

  const setVerificationNotes = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, verification_notes: value }));
    clearError("verification_notes");
  };

  const setLanguageIds = (value: number[]) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, language_ids: value }));
    clearError("language_ids");
  };

  const setProviderName = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, provider_name: value }));
    clearError("provider_name");
  };

  const setDescription = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, description: value }));
    clearError("description");
  };

  const setWebsite = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, website: value }));
    clearError("website");
  };

  const setLocation = (value: string) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, location: value }));
    clearError("location");
  };

  const setLanguages = (value: string[]) => {
    setFormData((p: ProviderProfileFormState) => ({ ...p, languages: value }));
    clearError("languages");
  };

  const validate = () => {
    const e: ProviderProfileFormErrors = {};
    const req = args.required ?? { display_name: true, bio: true };

    // New field validations
    if (req.display_name && !formData.display_name?.trim()) {
      e.display_name = "Display name is required";
    }

    if (req.country_code && !formData.country_code?.trim()) {
      e.country_code = "Country code is required";
    }

    if (req.region && !formData.region?.trim()) {
      e.region = "Region is required";
    }

    if (req.bio && !formData.bio?.trim()) {
      e.bio = "Bio is required";
    }

    if (req.verification_notes && !formData.verification_notes?.trim()) {
      e.verification_notes = "Verification notes are required";
    }

    if (req.language_ids && (!formData.language_ids || formData.language_ids.length === 0)) {
      e.language_ids = "At least one language is required";
    }

    if (req.identity_document && !formData.identity_document && !identityDocumentFile) {
      e.identity_document = "Identity document is required";
    }

    // Legacy field validations
    if (req.provider_name && !formData.provider_name?.trim()) {
      e.provider_name = "Provider name is required";
    }

    if (req.description && !formData.description?.trim()) {
      e.description = "Description is required";
    }

    if (req.website && !formData.website?.trim()) {
      e.website = "Website is required";
    }

    if (req.location && !formData.location?.trim()) {
      e.location = "Location is required";
    }

    if (req.languages && (!formData.languages || formData.languages.length === 0)) {
      e.languages = "At least one language is required";
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

  const resetForm = () => {
    resetFormData();
    setLogoFile(null);
    setCoverFile(null);
    setIdentityDocumentFile(null);
    setErrors({});
    setIsSubmitted(false);
  };

  const preparePayload = () => {
    return buildProviderProfileFormData({
      data: {
        ...formData,
        identity_document: identityDocumentFile || formData.identity_document,
      },
      logoFile,
      coverFile,
    });
  };

  return {
    // Form state
    formData,
    logoFile,
    coverFile,
    identityDocumentFile,
    errors,
    isSubmitted,
    isValid,
    
    
    // Form handlers
    handleChange,
    setIsSubmitted,
    setDisplayName,
    setCountryCode,
    setRegion,
    setBio,
    setVerificationNotes,
    setLanguageIds,
    setIdentityDocument,
    setProviderName,
    setDescription,
    setWebsite,
    setLocation,
    setLanguages,
    setLogo,
    setCover,
    validate,
    resetForm,
    preparePayload,
  };
}
