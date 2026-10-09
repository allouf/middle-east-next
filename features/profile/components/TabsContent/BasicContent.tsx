"use client";
import React, { useEffect, useMemo, useState } from "react";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import ProfileSkeleton from "@/components/ui/Loaders/ProfileSkeleton";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";

import { updateUserProfile } from "@/shared/constants/urls";
import { locationApi } from "@/shared/utils/locationApi";
import { ProfileContentProps } from "../../types";
import useCompleteProfile from "@/lib/store/useCompleteProfile";
import UpdateRole from "./UpdateRole";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";
import Button from "@/components/ui/Button";

const defaultUserData = {
  name: "",
  email: "",
  phone: "",
  country_code: "",
  region: "",
};

const BasicContent: React.FC<ProfileContentProps> = ({

  userData

}) => {

  const [editable, setEditable] = useState(false)
  const isLoading = false;
  const { isCompleteProfile } = useCompleteProfile();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();


  const {
    formData,
    handleChange,
    handleArrayChange,
    setFormData,
    resetForm,
    isValid,
    errors,
    setErrors,
    handleAddError,
  } = useFormData(defaultUserData);

  const { postData: updateUserData, loading: loadingPost } =
    usePostData(updateUserProfile);
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
  /** Cancel Editing */
  const handleCancel = () => {
    if (!isLoading) {
      setFormData({
        name: userData?.data?.user.name || "",
        email: userData?.data?.user.email || "",
        phone: userData?.data?.user.phone || "",
        country_code: userData?.data?.user.country_code || "",
        region: userData?.data?.user.region || "",
      });
    }
    setEditable(false);
    setErrors({});
  };

  /** Auto fill form when data arrives */
  useEffect(() => {
    if (!isLoading) {
      setFormData({
        name: userData?.data?.user.name || "",
        email: userData?.data?.user.email || "",
        phone: userData?.data?.user.phone || "",
        country_code: userData?.data?.user.country_code || "",
        region: userData?.data?.user.region || "",
      });
    }
  }, [userData, isLoading]);

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


  /** Save general profile data */
  const handleSave = () => {
    if (!isValid) return;

    updateUserData(formData, {
      showMessage: false,
      onSuccess: () => {
        setEditable(false);
        messageApi.success(t("profile.edit_success"))
      },
    });
  };

  const handleEditClick = () => setEditable(true);

  if (isCompleteProfile) return <UpdateRole />

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="flex flex-col gap-6 ">
      <div>
        {contextHolder}
        <h1 className="flex flex-col text-[28px] 2xl:text-[30px] font-semibold text-subTitleColor">
          <span>{t("profile.title1")}</span>
          <span>{t("profile.title2")}</span>
        </h1>
      </div>
      {/* ---------- PROFILE INFO SECTION ---------- */}
      <div className="flex flex-col gap-6">
        {/* NAME + EMAIL */}
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            id="name"
            label={t("labels.name")}
            type="text"
            value={formData.name}
            unstyled={true}
            withFieldset={true}
            onChange={handleChange("name")}
            disabled={!editable}
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 1 } }}
          />

          <InputField
            id="email"
            label={t("labels.email")}
            type="email"
            value={formData.email}
            unstyled={true}
            withFieldset={true}
            onChange={handleChange("email")}
            disabled={!editable}
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 7 } }}
          />
        </div>

        {/* PHONE + COUNTRY */}
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            id="phone"
            label={t("labels.phone")}
            type="phone"
            value={formData.phone}
            unstyled={true}
            withFieldset={true}
            onChange={(v) => handleArrayChange("phone", v)}
            disabled={!editable}
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 10 } }}
          />

          <SelectField
            id="country_code"
            label={t("labels.country")}
            value={formData.country_code}
            unstyled={true}
            withFieldset={true}
            labelName="name"
            onChange={handleCountryChange}
            disabled={!editable}
            url={locationApi("/api/location/countries")}
          />
        </div>

        {/* REGION */}
        <SelectField
          id="region"
          key={regionCountryParam || "region-select"}
          label={t("labels.city")}
          value={formData.region}
          unstyled={true}
          withFieldset={true}
          onChange={handleRegionChange}
          disabled={!editable}
          url={
            regionCountryParam
              ? locationApi(`/api/location/regions?country=${encodeURIComponent(
                regionCountryParam
              )}`)
              : ""
          }
        />
      </div>

      <div className="flex gap-5 items-center">
        {editable ? (
          <>
            <Button
              unstyled
              className="bg-blueBtn text-textWhiteColor px-5 py-3 rounded-[10px] hover:bg-blueSiteHover"
              onClick={handleSave}
              disabled={loadingPost || !isValid}
            >
              {loadingPost ? t("profile.saving") : t("profile.save")}
            </Button>

            <Button
              unstyled
              className="bg-blueBtn text-textWhiteColor px-5 py-3 rounded-[10px] hover:bg-blueSiteHover"
              onClick={handleCancel}
            >
              {t("profile.cancel")}
            </Button>
          </>
        ) : (
          <Button
            unstyled
            className="bg-blueBtn text-textWhiteColor px-5 py-2 rounded-[10px] hover:bg-blueSiteHover"
            onClick={handleEditClick}
          >
            {t("profile.edit")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BasicContent;
