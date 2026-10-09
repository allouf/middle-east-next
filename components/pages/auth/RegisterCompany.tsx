'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import usePostData from "@/lib/api/usePostData";
import useFormData from "@/lib/Hooks/useFormData";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  registerCompany,
  getCountry,
  getRegionsByCountry,
} from "@/shared/constants/urls";
import { ReferralPrompt } from "@/features/auth";
import Modal from "@/components/ui/Modal";
import SelectField from "@/components/ui/SelectFiled";
import StepIndicator from "@/components/ui/StepIndicator";
import { useAuth } from "@/lib/context/AuthContext";
import { message } from "antd";
import ContactField from "@/components/ui/ContactField";
import ImageField from "@/components/ui/ImageField";

export default function RegisterCompany() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth(); // ✅ Access auth context
  const locale = params?.locale as string || "en";
  const [currentStep, setCurrentStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isReferralHandled, setIsReferralHandled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(() => "/defaulLogo.png");
  const [licensePreviewUrl, setLicensePreviewUrl] = useState(
    () => "/defaulLogo.png"
  );

  const ref = searchParams.get("ref");

  const {
    formData,
    handleChange,
    handleAddError,
    isValid,
    errors,
    showErrors,
    handleArrayChange,
  } = useFormData();
  const { postData, loading } = usePostData(registerCompany);

  const handelAcceptRef = () => {
    handleChange("ref_code")({ target: { value: ref } });
    setIsReferralHandled(true);
    setModalOpen(false);
    setShouldSubmit(true);
  };

  const handelRejectRef = () => {
    handleChange("ref_code")({ target: { value: "" } });
    setIsReferralHandled(true);
    setModalOpen(false);
    setShouldSubmit(true);
  };
  const stepRequiredFields = {
    1: ["name", "company_name", "contact"],
    2: ["country_id", "region_id", "password", "confirm_password"],
    3: ["agree_terms"],
  };

  const isCurrentStepValid = () => {
    const requiredFields = stepRequiredFields[currentStep] || [];

    // check empty values
    const hasEmptyRequired = requiredFields.some(
      (field) =>
        formData[field] === undefined ||
        formData[field] === null ||
        formData[field] === ""
    );

    if (hasEmptyRequired) return false;

    // check validation errors from useFormData
    const hasErrors = requiredFields.some((field) => errors?.[field]);

    return !hasErrors;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (ref && !isReferralHandled) {
      setModalOpen(true);
      return;
    }
    try {
      postData(formData, {
        showMessage: false,
        onSuccess: (res: any) => {
          const userData = res?.data;
          const user = {
            email: userData.email,
            is_verified: userData.is_verified ?? false,
            role: userData.role ?? "consumer",
          };

          const tokens = {
            access_token: "",
            refresh_token: "",
          };
          const contact =
            res.data.phone && res.data.phone !== "null"
              ? res.data.phone
              : res.data.email;
          setAuthData({ tokens, user });
          router.push(`/${locale}`);
        },
      });
    } catch (err: any) {
      console.error("Registration failed:", err);
      message.error(err?.response?.data?.message || t("registrationFailed") || t("errors.unknown"));
    }
  };

  useEffect(() => {
    if (shouldSubmit && isReferralHandled) {
      setShouldSubmit(false);
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSubmit, isReferralHandled]);

  return (
    <>
      {/* Title */}
      <h2 className="text-[18px] sm:text-[24px] md:text-[40px] font-semibold text-blueSiteHover text-left mb-4">
        {t("text.singupTittleCompany")}
      </h2>
      {/* Form */}
      <form
        className="w-full max-w-2xl space-y-4"
        onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}
      >
        <StepIndicator
          step={currentStep}
          setStep={setCurrentStep}
          totalSteps={3}
          loading={loading}
          disabled={!isValid || !isCurrentStepValid()}
        >
          {currentStep === 1 && (
            <>
              {" "}
              <InputField
                id="name"
                label={t("form.name")}
                placeholder={t("placeholders.nameUser")}
                type="text"
                value={formData.name}
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
                placeholder={t("placeholders.nameCompany")}
                type="text"
                value={formData.company_name}
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
                value={formData.contact}
                onChange={handleChange("contact")}
                unstyled={true}
                withFieldset={true}
                validate={true}
                handleAddError={handleAddError}
                formErrors={errors}
                // showErrorMessage={showErrors}
                conditions={{ text: { min: 10 } }}
                required
              />
              <InputField
                id="website"
                label={t("form.website")}
                placeholder={t("placeholders.webSitelink")}
                type="url"
                value={formData.website}
                onChange={handleChange("website")}
                handleAddError={handleAddError}
                unstyled={true}
                withFieldset={true}
                formErrors={errors}
                showErrorMessage={showErrors}
                validate={true}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <SelectField
                id="country_id"
                label={t("form.country")}
                value={formData.country_id}
                unstyled={true}
                withFieldset={true}
                onChange={handleChange("country_id")}
                url={getCountry}
              />
              <SelectField
                id="region_id"
                label={t("form.region")}
                value={formData.region_id}
                unstyled={true}
                withFieldset={true}
                onChange={handleChange("region_id")}
                url={
                  formData.country_id
                    ? `${getRegionsByCountry}/${formData.country_id}`
                    : ""
                }
              />

              <InputField
                id="password"
                label={t("form.password")}
                type="password"
                value={formData.password}
                placeholder={t("placeholders.password")}
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
                placeholder={t("placeholders.conPassword")}
                type="password"
                value={formData.confirm_password}
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
              {/* <InputField
                id="logo"
                label="Company Logo"
                type="file"
                onChange={handleChange("logo")}
              />
              <InputField
                id="trade_license"
                label="Trade License"
                type="file"
                onChange={handleChange("trade_license")}
              /> */}
            </>
          )}
          {currentStep === 3 && (
            <>
              <ImageField
                id={"logo"}
                label={t("labels.logo")}
                placeholder={t("placeholders.companyLogo")}
                value={formData.logo}
                withFieldset={true}
                onChange={(value) => handleArrayChange("logo", value)}
                image_path={logoPreviewUrl}

                // disabled={!editable}
              />

              <ImageField
                id={"trade_license"}
                label={t("labels.tradeLicense")}
                placeholder={t("placeholders.companyLicence")}
                value={formData.trade_license}
                onChange={(value) => handleArrayChange("trade_license", value)}
                withFieldset={true}
                // image_path={licensePreviewUrl}

                // disabled={!editable}
              />
              <InputField
                id="registration_no"
                label={t("form.registrationNumber")}
                placeholder={t("placeholders.companyregistrationNumber")}
                type="text"
                value={formData.registration_no}
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
                placeholder={t("placeholders.companyVatTaxId")}
                type="text"
                value={formData.vat_tax_id}
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
                  {t("text.agreePrivacy")?.split("Privacy Policy")[0] || "I agree to the "}
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
            </>
          )}
        </StepIndicator>{" "}
      </form>
      {/* Referral Modal */}
      <Modal
        id="refall"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="flex flex-col justify-between items-center space-y-4 p-4 m-4 !max-w-screen-sm md:!max-w-screen-md my-10"
      >
        <ReferralPrompt onAccept={handelAcceptRef} onReject={handelRejectRef} />
      </Modal>
    </>
  );
}
