'use client';

import React from "react";
import Button from "@/components/ui/Button";
import ContactField from "@/components/ui/ContactField";
import { useTranslation } from "@/lib/i18n/useTranslation";
import AuthWrapper from "./AuthWrapper";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgotPasswordPage: React.FC = () => {
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
    messageContext,
  } = useForgotPassword();

  return (
    <AuthWrapper>
      {messageContext}
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-full space-y-6 flex flex-col justify-between">
          {/* Title & Description */}
          <header className="text-start space-y-2">
            <h2 className="text-[18px] sm:text-[24px] md:text-[35px] font-semibold text-blueSiteHover">
              {t("auth.forget_password")}
            </h2>
            <p className="text-textColor text-sm leading-relaxed">
              {t("auth.descriptionForget_password")}
            </p>
          </header>

          {/* Form */}
          <form
            className="space-y-4 w-full flex-1 flex flex-col justify-top items-center pt-2"
            onSubmit={handleSubmit}
          >
            <div className="w-full">
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
                isSubmitted={showErrors}
                conditions={{ text: { min: 10 } }}
                required
              />
            </div>

            <Button
              scale={1.05}
              className={`w-full py-3 px-4 mt-2 text-[18px] text-textWhiteColor font-semibold rounded-md transition ${
                loading
                  ? "bg-blueSite cursor-not-allowed"
                  : "bg-blueBtn hover:bg-blueSiteHover"
              }`}
              type="submit"
              disabled={!isValid || loading}
              unstyled
            >
              {loading ? t("auth.buttons.sending") : t("auth.buttons.sendCode")}
            </Button>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ForgotPasswordPage;
