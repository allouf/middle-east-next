"use client";

import React from "react";
import InputField from "@/components/ui/InputField";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Props = {
  personalInfo: any;
  handleChange: (k: string) => (e: any) => void;
  formErrors: any;
  handleAddError: any;
  isSubmited: boolean;
};

export const PersonalInfoSection: React.FC<Props> = ({
  personalInfo,
  handleChange,
  formErrors,
  handleAddError,
  isSubmited
}) => {
  const { t } = useTranslation();

  return (
    <section className="bg-white rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-7 bg-blueSite rounded" />
        <h2 className="text-[#3C4242] text-2xl">{t('checkout.personalInformationTitle')}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="first_name"
          label={t('checkout.firstNameLabel')}
          type="text"
          unstyled
          value={personalInfo.first_name}
          onChange={handleChange("first_name")}
          placeholder={t('checkout.firstNamePlaceholder')}
          required
          validate
          handleAddError={handleAddError}
          formErrors={formErrors}
          withFieldset
          onSubmit={true}
          isSubmited={isSubmited}
        />
        <InputField
          id="last_name"
          label={t('checkout.lastNameLabel')}
          type="text"
          value={personalInfo.last_name}
          onChange={handleChange("last_name")}
          placeholder={t('checkout.lastNamePlaceholder')}
          required
          unstyled
          validate
          handleAddError={handleAddError}
          formErrors={formErrors}
          withFieldset
          onSubmit={true}
          isSubmited={isSubmited}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <InputField
          id="phone"
          label={t('checkout.phoneLabel')}
          type="phone"
          value={personalInfo.phone}
          onChange={handleChange("phone")}
          placeholder={t('checkout.phonePlaceholder')}
          required
          unstyled
          validate
          handleAddError={handleAddError}
          formErrors={formErrors}
          withFieldset
          onSubmit={true}
          isSubmited={isSubmited}
        />
        <InputField
          id="email"
          label={t('checkout.emailLabel')}
          type="email"
          value={personalInfo.email}
          onChange={handleChange("email")}
          placeholder={t('checkout.emailPlaceholder')}
          required
          unstyled
          validate
          handleAddError={handleAddError}
          formErrors={formErrors}
          withFieldset
          onSubmit={true}
          isSubmited={isSubmited}
        />
      </div>
    </section>
  );
};
