"use client";

import React, { useMemo, useState } from "react";
import { PencilLine, X, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";
import InputField from "@/components/ui/InputField";
import { useCompanyProfileForm } from "../hooks/useCompanyProfileForm";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";

type InfoSectionProps = {
  companyName?: string;
  category?: string; // e.g. "software development"
  about: string;
  onEdit?: () => void;
  className?: string;
  refetch?: () => Promise<any> | null;
};

export const InfoSection: React.FC<InfoSectionProps> = ({
  companyName = "",
  category = "",
  about,
  className = "",
  refetch,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const profile = useCompanyProfileForm({
    endpoint: JOBS_ENDPOINTS.updateCompanyProfile,
    initial: { description: about },
    required: {
      description: false,
      logo: false,
      cover: false,
    },
    onSuccess: () => {
      // message.success(
      //   t("jobs.company.messages.profile.updated", { defaultValue: "Company profile updated successfully." })
      // );
      refetch?.();
      setIsEditing(false);
    },
  });

  const needsToggle = useMemo(() => (about?.length ?? 0) > 160, [about]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    profile.resetAll();
    setIsEditing(false);
  };
  const handleSave = async () => {
    const res = await profile.submit();
    if (!res.ok) {
      message.error("Failed to update profile");
    }
  };

  return (
    <section
      className={[
        "bg-white",
        "p-4 sm:p-5 md:p-6 lg:p-7",
        className,
      ].join(" ")}
    >
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base sm:text-lg md:text-xl font-semibold text-zinc-900">
            {companyName}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">{category}</p>
        </div>

        <div className="flex gap-2 shrink-0 self-end sm:self-auto">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className={[
                  "inline-flex items-center gap-1 sm:gap-2",
                  "h-8 sm:h-9 rounded-lg px-2 sm:px-3",
                  "bg-zinc-200 text-zinc-700",
                  "hover:bg-zinc-300 active:bg-zinc-400",
                  "transition-colors",
                  "text-xs font-medium",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600/40",
                ].join(" ")}
              >
                <X className="h-4 w-4" />
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={profile.loading}
                className={[
                  "inline-flex items-center gap-1 sm:gap-2",
                  "h-8 sm:h-9 rounded-lg px-2 sm:px-3",
                  "bg-blueSite text-white",
                  "hover:bg-blueSiteHover active:bg-blueSiteHover",
                  "transition-colors",
                  "text-xs font-medium",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40",
                  "disabled:opacity-60",
                ].join(" ")}
              >
                <Check className="h-4 w-4" />
                {profile.loading ? t('common.saving') : t('common.save')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className={[
                "inline-flex items-center gap-1 sm:gap-2 shrink-0",
                "h-8 sm:h-9 rounded-lg px-2 sm:px-3",
                "bg-blueSite text-white",
                "hover:bg-blueSiteHover active:bg-blueSiteHover",
                "transition-colors",
                "text-xs font-medium",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40",
              ].join(" ")}
            >
              <PencilLine className="h-4 w-4" />
              {t('common.editInformation')}
            </button>
          )}
        </div>
      </div>

      {/* About */}
      <div className="mt-4 sm:mt-5">
        <h3 className="text-sm sm:text-base font-semibold text-zinc-800">{t('common.about')}</h3>

        {isEditing ? (
          <InputField
            id="description"
            type="textarea"
            label=""
            value={profile.formData.description}
            onChange={(e: any) => profile.setDescription(e.target.value)}
            formErrors={profile.errors as any}
            placeholder={t("company.descriptionPlaceholder", { defaultValue: "Enter company description" })}
            withFieldset={false}
            required={false}
            isSubmited={profile.isSubmitted}
            onSubmit={false}
            rows={3}
            className="mt-2"
          />
        ) : (
          <p
            className={[
              "mt-2 text-sm leading-5 sm:leading-6 text-zinc-600",
              expanded ? "" : "line-clamp-2 sm:line-clamp-3",
            ].join(" ")}
          >
            {about}
          </p>
        )}

        {!isEditing && needsToggle && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            {expanded ? t('common.showLess') : t('common.seeMore')}
          </button>
        )}
      </div>
    </section>
  );
};