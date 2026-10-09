"use client";

import React, { useEffect, useMemo, useState } from "react";
import InputField from "@/components/ui/InputField";
import ContactField from "@/components/ui/ContactField";
import SelectField from "@/components/ui/SelectFiled";
import ImageField from "@/components/ui/ImageField";
import StepIndicator from "@/components/ui/StepIndicator";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useRegisterCompanyForm } from "../hooks/useRegisterForm";
import ReferralPrompt from "./ReferralPrompt";
import { locationApi } from "@/shared/utils/locationApi";
import { getLocationCookie } from "@/lib/utils/auth-storage";

interface RegisterCompanyFormProps {
  defaultCountry?: string;
  defaultRegion?: string;
}

const RegisterCompanyForm: React.FC<RegisterCompanyFormProps> = ({ defaultCountry, defaultRegion }) => {
  const { t } = useTranslation();
  const {
    formData,
    handleChange,
    handleArrayChange,
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
  } = useRegisterCompanyForm();

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
      (c) =>
        String(c.shortName) === String(formData.country_code) ||
        String(c.id) === String(formData.country_code)
    );
  }, [countries, formData.country_code]);

  const regionCountryParam = useMemo(() => {
    return countryObject?.name || "";
  }, [countryObject]);

  const handleCountryChange = (value: any) => {
    const raw = value?.target?.value ?? value;
    const match = countries.find(
      (c) =>
        String(c.id) === String(raw) ||
        c.shortName === raw ||
        c.name === raw
    );
    const nextCountry = match?.shortName || raw;
    handleChange("country_code")({ target: { value: nextCountry } });
    handleChange("region")({ target: { value: "" } });
  };

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

  const handleRegionChange = (value: any) => {
    const raw = value?.target?.value ?? value;
    const match = regions.find((r: any) => String(r.id) === String(raw) || r.shortName === raw || r.name === raw);
    handleChange("region")({ target: { value: raw } });
    handleChange("region_name")({ target: { value: match?.name || raw } });
  };

  // Consolidate default values (Headers > localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Try Headers (detected from server)
    if (defaultCountry && !formData.country_code) {
      handleChange("country_code")({ target: { value: defaultCountry } });
      if (defaultRegion && !formData.region) {
        handleChange("region")({ target: { value: defaultRegion } });
        handleChange("region_name")({ target: { value: defaultRegion } });
      }
      return;
    }

    // 2. Try secure cookie if headers didn't provide anything
    if (!formData.country_code) {
      try {
        const stored = getLocationCookie();
        if (stored?.country?.shortName) {
          handleChange("country_code")({ target: { value: stored.country.shortName } });
          if (stored?.region?.name) {
            handleChange("region")({ target: { value: stored.region.id || stored.region.name } });
            handleChange("region_name")({ target: { value: stored.region.name } });
          }
        }
      } catch { /* ignore */ }
    }
  }, [defaultCountry, defaultRegion, formData.country_code, formData.region, handleChange]);

  return (
    <>
      {messageContext}
      <h2 className="text-[18px] sm:text-[24px] md:text-[32px] font-semibold text-blueSiteHover text-left mb-1">
        {t("text.singupTittleCompany")}
      </h2>
      <p className="text-[14px] sm:text-[16px] md:text-[14px] text-[#747474] text-left mb-4">
        {t("text.singupSubTittleCompany")}
      </p>
      <form
        className="w-full max-w-2xl space-y-4"
        onSubmit={
          currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()
        }
      >
        <StepIndicator
          step={currentStep}
          setStep={setCurrentStep}
          totalSteps={totalSteps}
          loading={loading}
          disabled={!isValid || !isCurrentStepValid()}
        >
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <InputField
                id="name"
                label={t("form.name")}
                placeholder={t("placeholders.nameUser")}
                type="text"
                value={formData.name || ""}
                onChange={handleChange("name")}
                handleAddError={handleAddError}
                unstyled={true}
                withFieldset={true}
                formErrors={errors}
                showErrorMessage={showErrors}
                validate={true}
                required
              />

              <InputField
                id="company_name"
                label={t("form.company_name")}
                placeholder={
                  t("placeholders.nameCompany")
                }
                type="text"
                value={formData.company_name || ""}
                onChange={handleChange("company_name")}
                handleAddError={handleAddError}
                formErrors={errors}
                unstyled={true}
                withFieldset={true}
                showErrorMessage={showErrors}
                validate={true}
                required
              />

              <ContactField
                id="contact"
                label={t("form.contact")}
                type="contact"
                value={formData.contact || ""}
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

              <InputField
                id="website"
                label={t("form.website")}
                placeholder={
                  t("placeholders.webSitelink")
                }
                type="url"
                value={formData.website || ""}
                onChange={handleChange("website")}
                handleAddError={handleAddError}
                unstyled={true}
                withFieldset={true}
                formErrors={errors}
                showErrorMessage={showErrors}
                validate={true}
              />
            </div>
          )}

          {/* Step 2: Location & Password */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <SelectField
                id="country_code"
                label={t("form.country")}
                value={formData.country_code || ""}
                unstyled={true}
                withFieldset={true}
                onChange={handleCountryChange}
                url={locationApi("/api/location/countries")}
                handleAddError={handleAddError}
                labelName="name"
                placeholder={t("placeholders.country")}
                onMouseDown={() => { }}
                onClick={() => { }}
              />

              <SelectField onMouseDown={() => { }}
                onClick={() => { }}
                id="region"
                key={regionCountryParam || "region-select"}
                label={t("form.region")}
                value={formData.region || ""}
                unstyled={true}
                withFieldset={true}
                onChange={handleRegionChange}
                url={
                  regionCountryParam
                    ? locationApi(`/api/location/regions?country=${encodeURIComponent(
                      regionCountryParam
                    )}`)
                    : ""
                }
                handleAddError={handleAddError}
                placeholder={t("placeholders.region")}
              />

              <InputField
                id="password"
                label={t("form.password")}
                type="password"
                value={formData.password || ""}
                placeholder={
                  t("placeholders.password")
                }
                onChange={handleChange("password")}
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

              <InputField
                id="confirm_password"
                label={t("form.conPassword")}
                placeholder={
                  t("placeholders.conPassword")
                }
                type="password"
                value={formData.confirm_password || ""}
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
            </div>
          )}

          {/* Step 3: Documents & Terms */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <ImageField
                id="logo"
                label={t("labels.logo")}
                placeholder={
                  t("placeholders.companyLogo")
                }
                value={formData.logo || ""}
                withFieldset={true}
                onChange={(file) => handleArrayChange("logo", file)}
              />

              <ImageField
                id="trade_license"
                label={t("labels.tradeLicense")}
                placeholder={
                  t("placeholders.companyLicence")
                }
                value={formData.trade_license || ""}
                onChange={(file) => handleArrayChange("trade_license", file)}
                withFieldset={true}
              />

              <InputField
                id="registration_no"
                label={t("form.registrationNumber")}
                placeholder={
                  t("placeholders.companyregistrationNumber")
                }
                type="text"
                value={formData.registration_no || ""}
                onChange={handleChange("registration_no")}
                handleAddError={handleAddError}
                unstyled={true}
                withFieldset={true}
                formErrors={errors}
                showErrorMessage={showErrors}
                validate={true}
              />

              <InputField
                id="vat_tax_id"
                label={t("form.vat")}
                placeholder={
                  t("placeholders.companyVatTaxId")
                }
                type="text"
                value={formData.vat_tax_id || ""}
                onChange={handleChange("vat_tax_id")}
                handleAddError={handleAddError}
                unstyled={true}
                withFieldset={true}
                formErrors={errors}
                showErrorMessage={showErrors}
                validate={true}
              />

              <div className="flex items-start gap-3 mx-1 mt-4">
                <input
                  id="agree_terms"
                  checked={formData.agree_terms || false}
                  type="checkbox"
                  onChange={(e) =>
                    handleChange("agree_terms")({
                      target: { value: e.target.checked },
                    })
                  }
                  className="mt-1 w-4 h-4 text-blueSiteHover border-gray-300 rounded focus:ring-blueBtn cursor-pointer"
                  required
                />
                <label
                  htmlFor="agree_terms"
                  className="text-sm text-subTitleColor leading-relaxed cursor-pointer"
                >
                  {t("text.agreePrivacy")?.split("Privacy Policy")[0] ||
                    "I agree to the "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-blueSiteHover font-semibold hover:underline"
                  >
                    {t("text.privacyPolicy")}
                  </a>{" "}
                  {t("text.and")}{" "}
                  <a
                    href="/terms-of-use"
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

export default RegisterCompanyForm;
