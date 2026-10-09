"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CoverUploader from '@/components/uploaders/CoverUploader'
import ProfileUploader from '@/components/uploaders/ProfileUploader'
import { CompanyProfile } from '../types'
import { useCompanyProfileForm } from '../hooks/useCompanyProfileForm'
import { JOBS_ENDPOINTS } from '@/shared/constants/api-endpoints';

interface CoverSectionProps {
  company?: CompanyProfile | null;
  refetch?: () => Promise<any> | null;
  onBack?: () => void;
}

const CoverSection: React.FC<CoverSectionProps> = ({ company, refetch, onBack }) => {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const [pendingUpdate, setPendingUpdate] = useState<{ type: "logo" | "cover"; file: File } | null>(null);
  const isRTL = i18n.language === "ar";

  const profile = useCompanyProfileForm({
    endpoint: JOBS_ENDPOINTS.updateCompanyProfile,
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
      setPendingUpdate(null);
    },
  });

  // Handle pending update when state is ready
  useEffect(() => {
    if (pendingUpdate && !profile.loading) {
      const submitUpdate = async () => {
        const res = await profile.submit();
        if (!res.ok) {
          message.error("Failed to update image");
          setPendingUpdate(null);
        }
      };
      submitUpdate();
    }
  }, [pendingUpdate, profile.loading, profile.logoFile, profile.coverFile]);

  const handleUpdateImage = (type: "logo" | "cover", img: File) => {
    if (type === "logo") {
      profile.setLogo(img);
    } else {
      profile.setCover(img);
    }
    setPendingUpdate({ type, file: img });
  };

  const handleRemoveImage = async (type: 'logo' | 'cover'): Promise<void> => {
    if (!type) {
      message.error('Invalid request parameters');
      return;
    }

    try {
      let result;
      if (type === 'logo') {
        result = await profile.deleteLogo();
      } else {
        result = await profile.deleteCover();
      }

      if (!result.ok) {
        message.error(`Failed to remove ${type}`);
        return;
      }

      // Refetch the company data to update the UI
      refetch?.();
      message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`);
    } catch (error) {
      console.error(`Error removing ${type}:`, error);
      message.error(`Failed to remove ${type}`);
    }
  };

  const handleCoverChange = (value: string | File) => {
    if (value instanceof File) {
      handleUpdateImage('cover', value);
    }
  };

  const handleLogoChange = (value: string | File) => {
    if (value instanceof File) {
      handleUpdateImage('logo', value);
    }
  };

  return (
    <div className="relative mt-4 md:mt-0">
      {/* Back Button */}

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-2 sm:top-4 end-4 z-[40] inline-flex items-center gap-1 sm:gap-2 text-sm md:text-lg font-semibold tracking-wide text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
        >
          {isRTL ? (
            <>

              {t("buttons.goBack")}
              <ArrowLeft size={16} strokeWidth={2} />

            </>
          ) : (
            <>
              <ArrowLeft size={16} strokeWidth={2} />
              {t("buttons.goBack")}
            </>
          )}
        </button>
      )}

      <CoverUploader
        coverPreview={company?.cover || undefined}
        onChange={handleCoverChange}
        isEditing={true}
        handleDeleteImg={() => handleRemoveImage('cover')}
        showDelete={false}
        loading={profile.loading && !!profile.coverFile}
      />

      <div className="absolute -bottom-4 sm:-bottom-6 left-3 sm:left-5">
        <ProfileUploader
          logoPreview={company?.logo || undefined}
          onChange={handleLogoChange}
          showDelete={false}
          isEditing={true}
          handleDeleteImg={() => handleRemoveImage('logo')}
          loading={profile.loading && !!profile.logoFile}
        />
      </div>
    </div>
  );
};

export default CoverSection;