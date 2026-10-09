import React from "react";
import InputField from "@/components/ui/InputField";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { ChangePasswordUrl } from "@/shared/constants/urls";
import { useTranslation } from "@/lib/i18n/useTranslation";

const defaultData = {
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
};

const ChangePassword = () => {
  const {
    formData,
    handleChange,
    setFormData,
    errors,
    isValid,
    handleAddError,
  } = useFormData(defaultData);
  const { postData: resetPassword, loading: loadingPost } =
    usePostData(ChangePasswordUrl);
  const { t } = useTranslation();
  // Check password and return strength + missing suggestions
  const analyzePassword = (password: string) => {
    let strength = 0;

    if (password?.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return { strength };
  };

  const handleCancel = () => {
    setFormData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
  };

  const handleSave = async () => {
    if (!isValid) return;
    resetPassword(formData);
  };

  const { strength } = analyzePassword(formData.new_password);
  const strengthPercentage = (strength / 5) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Current Password */}
      <InputField
        id="current_password"
        label={t("labels.current_password")}
        type="password"
        value={formData.current_password}
        unstyled={true}
        withFieldset={true}
        onChange={handleChange("current_password")}
        validate={true}
        handleAddError={handleAddError}
        formErrors={errors}
        conditions={{
          password: {
            min: 8,
            requireUppercase: false,
            requireNumber: true,
            requireSpecial: false,
          },
        }}
      />

      {/* New Password */}
      <div>
        <InputField
          id="new_password"
          label={t("labels.new_password")}
          type="password"
          value={formData.new_password}
          unstyled={true}
          withFieldset={true}
          onChange={handleChange("new_password")}
          validate={true}
          handleAddError={handleAddError}
          formErrors={errors}
          conditions={{
            password: {
              min: 8,
              requireUppercase: false,
              requireNumber: true,
              requireSpecial: false,
            },
          }}
        />

        {/* Password Strength Indicator */}
        {formData.new_password && (
          <div className="mt-2">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${strengthPercentage}%`,
                  background:
                    strengthPercentage >= 80
                      ? "linear-gradient(to right, #22c55e, #a855f7)"
                      : strengthPercentage >= 60
                        ? "linear-gradient(to right, #eab308, #a855f7)"
                        : "linear-gradient(to right, #f97316, #a855f7)",
                }}
              />
            </div>
            <p className="text-xs text-subTitleColor mt-1">
              {t("changePassword.passwordStrength")}{" "}
              {strength >= 4 ? t("changePassword.strong") : strength >= 3 ? t("changePassword.medium") : t("changePassword.weak")}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <InputField
        id="new_password_confirmation"
        label={t("labels.new_password_confirm")}
        type="password"
        value={formData.new_password_confirmation}
        unstyled={true}
        withFieldset={true}
        onChange={handleChange("new_password_confirmation")}
        validate={true}
        handleAddError={handleAddError}
        formErrors={errors}
        conditions={{
          password: {
            min: 8,
            requireUppercase: false,
            requireNumber: true,
            requireSpecial: false,
          },
        }}
      />

      {/* Action Buttons */}
      <div className="flex flex-row gap-5 items-center w-full pt-2">
        <button
          type="button"
          className="bg-blueBtn text-textWhiteColor px-5 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={loadingPost || !isValid}
        >
          {loadingPost ? t("buttons.saving") : t("buttons.save_password")}
        </button>
        <button
          type="button"
          className="text-blueBtn px-5 py-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleCancel}
        >
          {t("buttons.cancel")}
        </button>
      </div>

      {!isValid && (
        <div className="space-y-1">
          {Object.entries(errors)
            .filter(([, value]) => value?.length > 0)
            .map(([key, value]) => (
              <p key={key} className="text-sm text-red-500">
                {key}: {value}
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
