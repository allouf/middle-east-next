'use client';

import React from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import AuthWrapper from "./AuthWrapper";
import { useResetPassword } from "../hooks/useResetPassword";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    formData,
    handleChange,
    handleAddError,
    errors,
    isValid,
    showErrors,
    handleSubmit,
    loading,
    passwordStrength,
    passwordSuggestions,
    messageContext,
  } = useResetPassword();

  const getBarColor = () => {
    if (passwordStrength >= 4) return "bg-green-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 1) return "bg-red-500";
    return "bg-gray-200";
  };

  return (
    <AuthWrapper>
      {messageContext}
      <div className="w-full flex flex-col h-full relative">
        <div className="w-full space-y-6">
          <header className="text-start space-y-2">
            <h2 className="text-[18px] sm:text-[24px] md:text-[35px] font-semibold text-blueSiteHover">
              {t("auth.forget_password")}
            </h2>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <InputField
                id="new_password"
                label={t("labels.new_password")}
                type="password"
                value={formData.new_password}
                unstyled
                withFieldset
                onChange={handleChange("new_password")}
                validate={true}
                handleAddError={handleAddError}
                formErrors={errors}
                showErrorMessage={showErrors}
                conditions={{
                  password: {
                    min: 8,
                    requireUppercase: false,
                    requireNumber: true,
                    requireSpecial: false,
                  },
                }}
              />

              <div className="flex gap-2 mt-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-[2px] w-[50px] rounded-full transition-all duration-300 ${
                      index < passwordStrength ? getBarColor() : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-textColor mt-1">
                {t("auth.password_strength")}: {passwordStrength}/5
              </p>

              {passwordSuggestions.length > 0 && (
                <ul className="mt-2 text-xs text-subTitleColor list-disc list-inside space-y-1">
                  {passwordSuggestions.map((tip, i) => (
                    <li key={i}>{t(tip)}</li>
                  ))}
                </ul>
              )}
            </div>

            <InputField
              id="new_password_confirmation"
              label={t("labels.new_password_confirm")}
              type="password"
              value={formData.new_password_confirmation}
              unstyled
              withFieldset
              onChange={handleChange("new_password_confirmation")}
              validate={true}
              handleAddError={handleAddError}
              formErrors={errors}
              showErrorMessage={showErrors}
              conditions={{
                password: {
                  min: 8,
                  requireUppercase: false,
                  requireNumber: true,
                  requireSpecial: false,
                },
              }}
            />

            <Button
              className="w-full py-2 px-4 bg-blueBtn text-textWhiteColor font-semibold rounded-md hover:bg-blueSiteHover transition"
              type="submit"
              unstyled
              disabled={loading || !isValid}
            >
              {loading
                ? t("auth.buttons.recovering")
                : t("auth.buttons.recovery_password")}
            </Button>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ResetPasswordPage;
