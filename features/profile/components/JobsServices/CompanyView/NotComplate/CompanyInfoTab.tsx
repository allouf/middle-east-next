"use client";

import React, { useCallback } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";
import InputField from "@/components/ui/InputField";
import ImageField from "@/components/ui/ImageField";
import MultiImageUpload from "@/components/ui/MultiImageUpload";

import { useCompanyProfileForm } from "../hooks/useCompanyProfileForm";
import { useCompanyGalleryForm } from "../hooks/useCompanyGalleryForm";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import CompanyInfoTabSkeleton from "./CompanyInfoTabSkeleton";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-sm font-medium text-emerald-700">{children}</div>;
}
interface CompanyInfoTabProps {
    onBack: () => void;
    statusCode?: number;
    refetchJobs?: () => void;
    clearStatusCode?: () => void;
}

export default function CompanyInfoTab({ onBack ,statusCode, refetchJobs, clearStatusCode }: CompanyInfoTabProps) {
  const { t } = useTranslation();
  const { message } = App.useApp();

  // ✅ Company Profile (logo/cover/description)
  const profile = useCompanyProfileForm({
    endpoint: JOBS_ENDPOINTS.updateCompanyProfile,
    required: {
      description: true,
      logo: false,
      cover: false,
    },
    onSuccess: () => {
      message.success(
        t("jobs.company.messages.profile.updated", { defaultValue: "Company profile updated successfully." })
      );
      refetchJobs?.();
      onBack?.();
    },
  });

  // ✅ Gallery (separate API)
  const gallery = useCompanyGalleryForm({
    endpoint: JOBS_ENDPOINTS.addCompanyGallery,
    required: false,
    onSuccess: () => {
      message.success(
        t("jobs.company.messages.gallery.uploaded", { defaultValue: "Gallery images uploaded successfully." })
      );
    },
  });

  const onConfirm = useCallback(async () => {
    const resProfile = await profile.submit();
    if (!resProfile.ok) return;

    // ✅ only call gallery API if user selected images
    if (gallery.images.length > 0) {
      const resGallery = await gallery.submit();
      if (!resGallery.ok) return;
    }

    // Clear status code after successful profile update (removes error 480)
    clearStatusCode?.();

    // message.success(t("common.saved", { defaultValue: "Saved successfully" }));
  }, [profile, gallery, clearStatusCode]);

  // Show skeleton when forms are loading
  if (profile.loading || gallery.loading) {
    return <CompanyInfoTabSkeleton />;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="relative grid gap-5">
        {/* Logo + Cover */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ImageField
            id="logo"
            label={t("jobs.company.logo", { defaultValue: "Logo" })}
            withFieldset
            value={profile.logoFile ?? null}
            // image_path={!profile.logoFile ? "/defaulLogo.png" : undefined}
            onChange={(file) => profile.setLogo(file)}
            formErrors={profile.errors as any}
            isSubmited={profile.isSubmitted}
            onSubmit
          />

          <ImageField
            id="cover"
            label={t("jobs.company.cover", { defaultValue: "Cover" })}
            withFieldset
            value={profile.coverFile ?? null}
            // image_path={!profile.coverFile ? "/defaulLogo.png" : undefined}
            onChange={(file) => profile.setCover(file)}
            formErrors={profile.errors as any}
            isSubmited={profile.isSubmitted}
            onSubmit
          />
        </div>

        {/* Description */}
        <InputField
          id="description"
          type="textarea"
          label={t("jobs.company.description", { defaultValue: "Company Description" })}
          value={profile.formData.description}
          onChange={(e: any) => profile.setDescription(e.target.value)}
          formErrors={profile.errors as any}
          placeholder={t("jobs.company.descriptionPlaceholder", { defaultValue: "Enter company description" })}
          withFieldset
          required
          isSubmited={profile.isSubmitted}
          onSubmit
        />

        {/* Gallery (connected now) */}
        <div  >
          {/* <FieldLabel>{t("labels.gallery", { defaultValue: "The Gallery" })}</FieldLabel> */}

          <MultiImageUpload
            withFieldset
            label={t("jobs.company.gallerytab", { defaultValue: "The Gallery" })}
            onImagesChange={(imgs) => gallery.setImages(imgs)}
            value={gallery.images} // ✅ keeps it controlled
            acceptedTypes={["image/*"]}
            
          />

          {gallery.isSubmitted && gallery.errors.images && (
            <p className="mt-1 text-xs text-red-500">{gallery.errors.images}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-6">
          <button
            type="button"
            onClick={onConfirm}
            disabled={profile.loading || gallery.loading}
            className="h-11 min-w-[160px] rounded-xl bg-emerald-800 px-6 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {profile.loading || gallery.loading
              ? t("common.saving", { defaultValue: "Saving..." })
              : t("common.confirm", { defaultValue: "Confirm" })}
          </button>
          {/* <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-zinc-500 underline hover:text-zinc-700"
          >
            {t("common.back", { defaultValue: "Back" })}
          </button> */}
        </div>
      </div>
    </div>
  );
}