'use client';

import React from "react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import ContactField from "@/components/ui/ContactField";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLoginForm } from "../hooks/useLoginForm";
import GoogleLoginButton from "./GoogleLoginButton";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    showErrors,
    isValid,
    errors,
    handleAddError,
    messageContext,
  } = useLoginForm();

  return (
    <div className="w-full h-full space-y-6 flex flex-col">
      {messageContext}
      {/* Header */}
      <header>
        <h2 className="text-[18px] sm:text-[24px] md:text-[35px] font-semibold text-blueSiteHover ">
          {t("auth.login_title")}
        </h2>
        <p className="text-textColor mb-4 font-regular text-[14px]">{t("auth.desc_register")}</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center h-full">
        {/* Login Form */}
        <form className="w-full space-y-4 mt-2" onSubmit={handleSubmit}>
          <ContactField
            id="contact"
            label={t("form.contact")}
            type="contact"
            value={formData.contact}
            onChange={handleChange("contact")}
            unstyled={true}
            validate={true}
            handleAddError={handleAddError}
            formErrors={errors}
            isLogIn={true}
            isSubmitted={showErrors}
            conditions={{ text: { min: 10 } }}
            required
          />

          <InputField
            id="password"
            label={t("form.password")}
            type="password"
            value={formData.password}
            unstyled={true}
            withFieldset={true}
            onChange={handleChange("password")}
            handleAddError={handleAddError}
            formErrors={errors}
            isSubmited={showErrors}
            validate={true}
            conditions={{
              password: {
                min: 8,
                requireUppercase: false,
                requireSpecial: false,
              },
            }}
            required
          />

          <div className="flex items-center justify-end">
            {/* <label className="flex items-center gap-2 space-x-2">
              <input
                type="checkbox"
              // checked={rememberMe}
              // onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-sm text-subTitleColor">{t("form.rememberMe")}</span>
            </label> */}
            {/* Forgot password link removed - page deleted */}
            <Button
              to="/forget-password"
              unstyled
              className="text-sm  text-blueBtn hover:underline"
            >
              {t("form.forgotPassword")}?
            </Button>
          </div>

          <Button
            type="submit"
            scale={1.05}
            className="w-full py-3 px-4 bg-blueSite disabled:bg-lightGray text-[16px] text-bold text-textWhiteColor font-semibold rounded-md hover:bg-blueSiteHover transition"
            unstyled
            disabled={loading || !isValid}
          >
            {loading ? `${t("auth.buttons.login")}...` : t("auth.buttons.login")}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-8 w-full">
          <div className="border-t-2 border-[#E0E0E0] flex-grow flex-1 h-[2px]" />
          <span className="mx-4  text-base md:text-lg  text-textColor">{t("or")}</span>
          <div className="border-t-2 border-[#E0E0E0] flex-grow flex-1" />
        </div>

        {/* Google Login */}
        <GoogleLoginButton />

        {/* Register Link */}
        <div className="mt-8 text-[15px] text-subTitleColor text-center flex flex-row items-center justify-center">
          <span className="text-subTitleColor">
            {t("text.new_user")}
            {" : "}
          </span>
          <Button
            to="/register"
            unstyled
            className="text-blueSiteHover hover:underline font-bold hover:text-blueSiteHover ml-1"
          >
            {t("buttons.singUp_nav")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

