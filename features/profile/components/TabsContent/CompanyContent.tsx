"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import ImageField from "@/components/ui/ImageField";
import ProfileSkeleton from "@/components/ui/Loaders/ProfileSkeleton";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { updateUserProfile } from "@/shared/constants/urls";
import { locationApi } from "@/shared/utils/locationApi";
import { ProfileContentProps } from "../../types";
import useCompleteProfile from "@/lib/store/useCompleteProfile";
import UpdateRole from "./UpdateRole";
import { message } from "antd";

const defaultUserData = {
  company_name: "",
  email: "",
  phone: "",
  registration_no: "",
  country_code: "",
  region: "",
  website: "",
  vat_tax_id: "",
  logo: null as any,
  trade_license: null as any,
};

const CompanyContent: React.FC<ProfileContentProps> = ({
  userData,
}) => {
  const [editable, setEditable] = useState(false);
  const { t } = useTranslation();
  const { isCompleteProfile } = useCompleteProfile();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    formData,
    handleChange,
    setFormData,
    handleArrayChange,
    errors,
    handleAddError,
    setErrors,
    isValid,
  } = useFormData(defaultUserData);
  const isLoading = false;

  const [logoPreviewUrl, setLogoPreviewUrl] = useState("/defaulLogo.png");
  const [licensePreviewUrl, setLicensePreviewUrl] = useState("/defaulLogo.png");

  const {
    postData: updateUserData,
    loading: loadingPost,
  } = usePostData(updateUserProfile);
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const clearRegion = () => handleChange("region")({ target: { value: "" } });

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


  const regionCountryParam = useMemo(() => {
    const match = countries.find(
      (c) =>
        String(c.id) === String(formData.country_code) ||
        c.shortName === formData.country_code
    );
    return match?.name || "";
  }, [countries, formData.country_code]);

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
      (c) =>
        String(c.id) === String(raw) ||
        c.shortName === raw ||
        c.name === raw
    );
    const nextCountry = match?.shortName || raw;
    handleChange("country_code")({ target: { value: nextCountry } });
    clearRegion();
  };

  const handleRegionChange = (value: any) => {
    const raw = value?.target?.value ?? value;
    const match = regions.find((r: any) => String(r.id) === String(raw) || r.shortName === raw);
    handleChange("region")({ target: { value: match?.name || raw } });
  };

  const handleCancel = () => {
    if (!isLoading) {
      const u = userData?.data?.user;
      setFormData({
        company_name: u?.company_name || "",
        email: u?.email || "",
        phone: Array.isArray(u?.phone) ? u?.phone[0] || "" : (u?.phone as string) || "",
        region: String(u?.region || ""),
        country_code: String(u?.country_code || ""),
        registration_no: u?.registration_no || "",
        website: u?.website || "",
        vat_tax_id: u?.vat_tax_id || "",
        logo: u?.logo || null,
        trade_license: u?.trade_license || null,
      });

      setLogoPreviewUrl(u?.logo || "/defaulLogo.png");
      setLicensePreviewUrl(u?.trade_license || "/defaulLogo.png");
    }

    setEditable(false);
    setErrors({});
  };

  useEffect(() => {
    if (!isLoading) {
      setFormData({
        company_name: userData?.data?.user?.company_name || "",
        email: userData?.data?.user?.email || "",
        phone: userData?.data?.user?.phone || "",
        region: userData?.data?.user?.region || "",
        country_code: userData?.data?.user?.country_code || "",
        registration_no: userData?.data?.user?.registration_no || "",
        website: userData?.data?.user?.website || "",
        vat_tax_id: userData?.data?.user?.vat_tax_id || "",
      });

      setLogoPreviewUrl(userData?.data?.user?.logo || "/defaulLogo.png");
      setLicensePreviewUrl(
        userData?.data?.user?.trade_license || "/defaulLogo.png"
      );
    }
  }, [userData, isLoading, setFormData]);


  const handleSave = () => {
    if (!isValid) return;
    updateUserData(
      { ...formData, name: userData?.data?.user?.name || "" },
      {
        showMessage: false,
        onSuccess: () => {
          messageApi.success(t("profile.edit_success"));
          setEditable(false);
        },
        onError: (err) => {
          console.log("update error", err)
          // messageApi.error(t("profile.edit_error"));
        }
      }
    );
  };

  if (isCompleteProfile) return <UpdateRole />;

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="flex flex-col gap-6 ">
      {contextHolder}
      <div>
        {contextHolder}
        <h1 className="flex flex-col text-[16px] xs:text-[20px] sm:text-[24px] 2xl:text-[30px] font-semibold text-subTitleColor">
          <span>{t("profile.title1")}</span>
          <span>{t("profile.title2")}</span>
        </h1>
      </div>
      <div className="flex flex-col gap-6">
        {/* Company & Email */}
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="company_name"
            label={t("labels.companyName")}
            value={formData.company_name}
            onChange={handleChange("company_name")}
            disabled={!editable}
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 1 } }}
            unstyled
            withFieldset
          />

          <InputField
            id="email"
            label={t("labels.email")}
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            disabled={!editable}
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 7 } }}
            unstyled
            withFieldset
          />
        </div>

        {/* Phone & Website */}
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="phone"
            label={t("labels.phone")}
            value={formData.phone}
            type="phone"
            onChange={(v) => handleArrayChange("phone", v)}
            disabled={!editable}
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 10 } }}
            unstyled
            withFieldset
          />

          <InputField
            id="website"
            label={t("labels.ourWebsite")}
            value={formData.website}
            onChange={handleChange("website")}
            disabled={!editable}
            unstyled
            withFieldset
          />
        </div>

        {/* Images */}
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageField
            id="logo"
            label={t("labels.logo")}
            onChange={(v) => handleArrayChange("logo", v)}
            image_path={logoPreviewUrl}
            disabled={!editable}
            withFieldset
          />

          <ImageField
            id="trade_license"
            label={t("labels.tradeLicense")}
            onChange={(v) => handleArrayChange("trade_license", v)}
            image_path={licensePreviewUrl}
            disabled={!editable}
            withFieldset
          />
        </div>
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            id="country_code"
            label={t("form.country")}
            value={formData.country_code}
            unstyled={true}
            withFieldset={true}
            labelName="name"
            onChange={handleCountryChange}
            url={locationApi("/api/location/countries")}
            disabled={!editable}
          />

          <SelectField
            id="region"
            key={regionCountryParam || "region-select"}
            label={t("form.region")}
            value={formData.region}
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
            disabled={!editable}
          />
        </div>
        {/* Tax & Registration */}
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="vat_tax_id"
            label={t("labels.taxId")}
            value={formData.vat_tax_id}
            onChange={handleChange("vat_tax_id")}
            disabled={!editable}
            unstyled
            withFieldset
          />

          <InputField
            id="registration_no"
            label={t("labels.registration")}
            value={formData.registration_no}
            onChange={handleChange("registration_no")}
            disabled={!editable}
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 10 } }}
            unstyled
            withFieldset
          />
        </div>
      </div>

      {/* Actions */}
      {editable ? (
        <div className="flex flex-col xs:flex-row gap-3 xs:gap-5">
          <button
            onClick={handleSave}
            disabled={loadingPost}
            className="bg-blueSite text-textWhiteColor px-4 xs:px-5 py-2.5 xs:py-3 text-[14px] xs:text-[16px] rounded-[8px] xs:rounded-[10px] hover:opacity-90"
          >
            {loadingPost
              ? t("profile.saving")
              : t("profile.saveInformation")}
          </button>

          <Button
            unstyled
            className="text-textColor underline text-[14px] xs:text-[16px]"
            onClick={handleCancel}
          >
            {t("profile.cancel")}
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setEditable(true)}
          className="bg-blueSite text-textWhiteColor px-4 xs:px-5 py-2.5 xs:py-3 text-[14px] xs:text-[16px] rounded-[8px] xs:rounded-[10px] hover:opacity-90 w-fit"
        >
          {t("profile.edit")}
        </Button>
      )}
    </div>
  );
};

export default CompanyContent;
