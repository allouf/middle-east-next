'use client';

import React, { useEffect, useMemo, useState } from 'react';
import InputField from '@/components/ui/InputField';
import ContactField from '@/components/ui/ContactField';
import SelectField from '@/components/ui/SelectFiled';
import StepIndicator from '@/components/ui/StepIndicator';
import Modal from '@/components/ui/Modal';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useRegisterUserForm } from '../hooks/useRegisterForm';
import ReferralPrompt from './ReferralPrompt';
import { locationApi } from '@/shared/utils/locationApi';
import { getLocationCookie } from '@/lib/utils/auth-storage';

interface RegisterUserFormProps {
  defaultCountry?: string;
  defaultRegion?: string;
}

const RegisterUserForm: React.FC<RegisterUserFormProps> = ({ defaultCountry, defaultRegion }) => {
  const { t } = useTranslation();
  const {
    formData,
    handleChange,
    errors,
    handleAddError,
    isValid,
    showErrors,
    currentStep,
    setCurrentStep,
    totalSteps,
    isCurrentStepValid,
    handleSubmit,
    loading,
    modalOpen,
    setModalOpen,
    handleAcceptRef,
    handleRejectRef,
    messageContext,
  } = useRegisterUserForm();

  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch(locationApi("/api/location/countries"));
        const payload = await res.json();
        
        if (res.ok && payload?.status === "OK" && Array.isArray(payload.data)) {
          setCountries(payload.data);
        }
      } catch {
        /* ignore */
      }
    };
    loadCountries();
  }, []);

  const countryObject = useMemo(() => {
    return countries.find(
      (c) => String(c.shortName) === String(formData.country_code)
    );
  }, [countries, formData.country_code]);

  const regionCountryParam = useMemo(() => {
    return countryObject?.name || "";
  }, [countryObject]);

  useEffect(() => {
    const loadRegions = async () => {
      if (!regionCountryParam) {
        setRegions([]);
        return;
      }
      try {
        const res = await fetch(
          locationApi(`/api/location/regions?country=${encodeURIComponent(regionCountryParam)}`)
        );
        const payload = await res.json();
        if (res.ok && payload?.status === "OK" && Array.isArray(payload.data)) {
          setRegions(payload.data);
        } else {
          setRegions([]);
        }
      } catch {
        setRegions([]);
      }
    };
    loadRegions();
  }, [regionCountryParam]);

  const handleCountryChange = (value: any) => {
    const raw = value?.target?.value ?? value;
    const match = countries.find(
      (c) => String(c.id) === String(raw) || c.shortName === raw || c.name === raw
    );
    const code = match?.shortName || raw;
    handleChange("country_code")({ target: { value: code } });
    handleChange("region")({ target: { value: "" } });
  };

  const handleRegionChange = (value: any) => {
    const raw = value?.target?.value ?? value;
    const match = regions.find((r: any) => String(r.id) === String(raw) || r.shortName === raw || r.name === raw);
    handleChange("region")({ target: { value: raw } });
    handleChange("region_name")({ target: { value: match?.name || raw } });
  };

  // Consolidate default values (Headers > localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Try Headers (detected from server)
    if (defaultCountry && !formData.country_code) {
      handleChange('country_code')({ target: { value: defaultCountry } });
      if (defaultRegion && !formData.region) {
        // region is full name from headers
        handleChange('region')({ target: { value: defaultRegion } });
        handleChange('region_name')({ target: { value: defaultRegion } });
      }
      return;
    }

    // 2. Try secure cookie if headers didn't provide anything
    if (!formData.country_code) {
      try {
        const stored = getLocationCookie();
        if (stored?.country?.shortName) {
          handleChange('country_code')({ target: { value: stored.country.shortName } });
          if (stored?.region?.name) {
            handleChange('region')({ target: { value: stored.region.id || stored.region.name } });
            handleChange('region_name')({ target: { value: stored.region.name } });
          }
        }
      } catch { /* ignore */ }
    }
  }, [defaultCountry, defaultRegion, formData.country_code, formData.region, handleChange]);

  return (
    <>
      {messageContext}
      <h2 className="text-[18px] sm:text-[24px] md:text-[40px] font-semibold text-blueSiteHover text-left mb-4">
        {t("text.singupTittleUser")}
      </h2>

      <form
        className="w-full max-w-3xl space-y-4"
        onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}
      >
        <StepIndicator
          step={currentStep}
          setStep={setCurrentStep}
          totalSteps={totalSteps}
          loading={loading}
          disabled={!isValid || !isCurrentStepValid()}
        >
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <InputField
                id="name"
                label={t("form.name")}
                type="text"
                placeholder={t("placeholders.nameUser") || t("form.name")}
                value={formData.name ?? ""}
                onChange={handleChange("name")}
                unstyled={true}
                withFieldset={true}
                handleAddError={handleAddError}
                formErrors={errors}
                showErrorMessage={showErrors}
                validate={true}
                conditions={{ text: { min: 1 } }}
                required
              />

              <ContactField
                id="contact"
                label={t("form.contact")}
                type="contact"
                value={formData.contact ?? ""}
                placeholder={
                  t("placeholders.contact") ||
                  t("placeholders.email") ||
                  t("form.contact")
                }
                onChange={handleChange("contact")}
                unstyled={true}
                withFieldset={true}
                validate={true}
                handleAddError={handleAddError}
                formErrors={errors}
                isSubmitted={showErrors}
                conditions={{ text: { min: 10 } }}
                required
              />
            </div>
          )}

          {/* Step 2: Location & Password */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <SelectField
                id="country_code"
                label={t("form.country")}
                value={formData.country_code ?? ""}
                placeholder={t("labels.select") + " " + (t("form.country"))}
                labelName="name"
                onChange={handleCountryChange}
                unstyled={true}
                withFieldset={true}
                url={locationApi("/api/location/countries")}
              />

              <SelectField
                id="region"
                key={regionCountryParam || "region-select"}
                label={t("form.region")}
                value={formData.region ?? ""}
                placeholder={t("labels.select") + " " + (t("form.region"))}
                onChange={handleRegionChange}
                unstyled={true}
                withFieldset={true}
                url={
                  regionCountryParam
                    ? locationApi(`/api/location/regions?country=${encodeURIComponent(
                      regionCountryParam
                    )}`)
                    : ""
                }
              />

              <InputField
                id="password"
                label={t("form.password")}
                type="password"
                placeholder={t("placeholders.password") || t("form.password")}
                value={formData.password ?? ""}
                onChange={handleChange("password")}
                unstyled={true}
                withFieldset={true}
                handleAddError={handleAddError}
                formErrors={errors}
                showErrorMessage={showErrors}
                validate={true}
                conditions={{
                  password: {
                    min: 8,
                    requireUppercase: true,
                    requireSpecial: true,
                  },
                }}
                required
              />

              <InputField
                id="confirm_password"
                label={t("form.conPassword")}
                type="password"
                value={formData.confirm_password ?? ""}
                placeholder={
                  t("placeholders.conPassword") ||
                  t("form.conPassword")
                }
                onChange={handleChange("confirm_password")}
                handleAddError={handleAddError}
                formErrors={errors}
                unstyled={true}
                withFieldset={true}
                showErrorMessage={showErrors}
                validate={true}
                conditions={{
                  password: {
                    min: 8,
                    requireUppercase: true,
                    requireSpecial: true,
                  },
                }}
                required
              />

              <div className="flex items-start gap-3 mx-1 mt-4">
                <input
                  id="agree_terms"
                  type="checkbox"
                  checked={formData.agree_terms || false}
                  onChange={(e) =>
                    handleChange("agree_terms")({
                      target: { value: e.target.checked },
                    })
                  }
                  className="mt-1 w-4 h-4 text-blueSiteHover border-gray-300 rounded focus:ring-blueSiteHover cursor-pointer"
                  required
                />
                <label
                  htmlFor="agree_terms"
                  className="text-sm text-subTitleColor leading-relaxed cursor-pointer"
                >
                  {t("text.agreePrivacy")?.split("Privacy Policy")[0]}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-blueSiteHover font-semibold hover:underline"
                  >
                    {t("text.privacyPolicy")}
                  </a>{" "}
                  {t("text.and")}{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-blueSiteHover font-semibold hover:underline"
                  >
                    {t("text.termsOfUse")}
                  </a>
                </label>
              </div>
            </div>
          )}
        </StepIndicator>
      </form>

      {/* Referral Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="flex flex-col justify-between items-center space-y-4 p-4 m-4 !max-w-screen-sm md:!max-w-screen-md my-10"
      >
        <ReferralPrompt onAccept={handleAcceptRef} onReject={handleRejectRef} />
      </Modal>
    </>
  );
};

export default RegisterUserForm;

