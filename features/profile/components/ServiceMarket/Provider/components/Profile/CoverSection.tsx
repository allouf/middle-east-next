"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CoverUploader from '@/components/uploaders/CoverUploader'
import ProfileUploader from '@/components/uploaders/ProfileUploader'

import { ProviderProfile } from '../../types';
import { useProviderProfile } from '../../hooks/Profile/useProviderProfile';

interface CoverSectionProps {
  provider?: ProviderProfile | null;
  refetch?: () => Promise<any> | null;
  onBack?: () => void;
}

const CoverSection: React.FC<CoverSectionProps> = ({ provider, refetch, onBack }) => {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const [pendingUpdate, setPendingUpdate] = useState<{ type: "logo" | "cover"; file: File } | null>(null);
  const isRTL = i18n.language === "ar";

  const profileUpdate = useProviderProfile({
    initial: {
      display_name: provider?.display_name || "",
      bio: provider?.bio || "",
    },
    onSuccess: () => {
      message.success(
        t("provider.messages.profile.updated", { defaultValue: "Provider profile updated successfully." })
      );
      refetch?.();
      setPendingUpdate(null);
    },
  });

  // Handle pending update when state is ready
  useEffect(() => {
    if (pendingUpdate && !profileUpdate.loading) {
      const submitUpdate = async () => {
        const res = await profileUpdate.submitForm();
        if (!res.ok) {
          message.error("Failed to update image");
          setPendingUpdate(null);
        }
      };
      submitUpdate();
    }
  }, [pendingUpdate, profileUpdate.loading, profileUpdate.logoFile, profileUpdate.coverFile]);

  const handleUpdateImage = (type: "logo" | "cover", img: File) => {
    if (type === "logo") {
      profileUpdate.setLogo(img);
    } else {
      profileUpdate.setCover(img);
    }
    setPendingUpdate({ type, file: img });
  };

  const handleRemoveImage = async (type: 'logo' | 'cover'): Promise<void> => {
    if (!provider?.id || !type) {
      message.error('Invalid request parameters');
      return;
    }

    // Set file to null to remove it
    if (type === 'logo') {
      profileUpdate.setLogo(null);
    } else {
      profileUpdate.setCover(null);
    }

    // Submit form
    const res = await profileUpdate.submitForm();
    if (!res.ok) {
      message.error('Failed to remove image');
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
             
              {t("buttons.goBack")}
               <ArrowRight size={16} strokeWidth={2} />
            </>
          )}
        </button>
      )}

      <CoverUploader
        coverPreview={provider?.cover || undefined}
        onChange={handleCoverChange}
        isEditing={true}
        handleDeleteImg={() => handleRemoveImage('cover')}
        showDelete={!!provider?.cover}
        loading={profileUpdate.loading && !!profileUpdate.logoFile}
      />

      <div className="absolute -bottom-4 sm:-bottom-6 left-3 sm:left-5">
        <ProfileUploader
          logoPreview={provider?.logo || undefined}
          onChange={handleLogoChange}
          showDelete={!!provider?.logo}
          isEditing={true}
          handleDeleteImg={() => handleRemoveImage('logo')}
          loading={profileUpdate.loading && !!profileUpdate.logoFile}
        />
      </div>
    </div>
  );
};

export default CoverSection;