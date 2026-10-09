"use client"
import React, { useEffect, useState } from "react";
import InputField from "../../../../components/ui/InputField";
import Button from "../../../../components/ui/Button";
import SelectField from "../../../../components/ui/SelectFiled";
import MultiInputField from "../../../../components/ui/MultiInputField";
import MultiImageUpload from "../../../../components/ui/MultiImageUpload";
import useFormData from "../../../../lib/Hooks/useFormData";
import usePostData from "../../../../lib/api/usePostData";
import {
  STORE_ENDPOINT,
  categories,
  getCountry,
} from "@/shared/constants/urls";
import { ConfigProvider, Popover, Switch } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import MultiSelectField from "../../../../components/ui/MultiSelectField";
import TimePickerField from "../../../../components/ui/TimePickerField";
import CoverStore from "./CoverStore";
import LocationAutocomplete from "../../../../components/Map/LocationAutocomplete";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";
import { locationApi } from "@/shared/utils/locationApi";
import SocialLinksInput, { SocialLinkItem } from "@/components/ui/SocialLinksInput";

interface StoreFormData {
  name: string;
  description: string;
  logo: string;
  cover: string;
  country_id: string;
  website: string;
  category_ids: (string | number)[];
  opening_time: string;
  closing_time: string;
  gallery: string[];
  phones: string[];
  social_links: any[];
  emails: string[];
  address: string;
  latitude: string;
  longitude: string;
  is_returnable: number;
  shipping_policy?: string;
  return_policy?: string;
  country_code?: string;
  is_freezone: number;
}

interface AddStoreProps {
  refetch?: () => void;
  handleClose?: () => void;
}

const initialFormState: StoreFormData = {
  name: "",
  description: "",
  logo: "",
  cover: "",
  country_id: "",
  website: "",
  category_ids: [],
  opening_time: "",
  closing_time: "",
  gallery: [],
  phones: [],
  social_links: [],
  emails: [],
  address: "",
  latitude: "",
  longitude: "",
  is_returnable: 0,
  is_freezone: 0,
};

const AddStore = ({ refetch, handleClose }: AddStoreProps) => {
  const {
    formData,
    handleChange,
    handleArrayChange,
    errors, setFormData,
    handleAddError,
    isValid,
    resetForm,
    updateLocation,
  } = useFormData<StoreFormData>(initialFormState);

  const { postData, loading } = usePostData(STORE_ENDPOINT.createStore);
  const [isSubmitedAdd, setIsSubmitedAdd] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  useEffect(() => {
    setFormData((prev) => ({ ...prev, social_links: socialLinks }));

  }, [setSocialLinks, socialLinks]);
  useEffect(() => {

    const loadCountries = async () => {
      try {
        const res = await fetch(locationApi("/api/location/countries"));
        const payload = await res.json();
        if (res.ok && payload?.status === "OK" && Array.isArray(payload.data)) {
          setCountries(payload.data);
        }
      } catch (error) {
        console.log(error)
        /* ignore */
      }
    };
    loadCountries();
  }, []);



  const handleSubmit = async () => {
    if (!isValid) {
      messageApi.error(t("store.error.required"));
      setIsSubmitedAdd(true);
      return;
    }
    setFormData((prev) => ({ ...prev, social_links: socialLinks }));
    await postData(formData, {
       showMessage:false,
      onSuccess: () => {
        setIsSubmitedAdd(false);
        messageApi.success(t("store.success"));

        resetForm();
        refetch?.();
      },
      onError: (err) => {
        console.log("add store Error", err)
      }
    });
  };



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
  const handleDeleteImgProfile = () => {
    const syntheticEvent = {
      target: { value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange("logo")(syntheticEvent);
    setFormData((prev) => ({ ...prev, logo: "" }));
  };

  const handleDeleteImgCover = () => {
    const syntheticEvent = {
      target: { value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange("cover")(syntheticEvent);
    setFormData((prev) => ({ ...prev, cover: "" }));
  };


  return (
    <div className="mx-auto  relative h-full mb-4">
      {/* Cover Photo Section */}
      {contextHolder}
      <CoverStore
        handleChange={handleChange}
        handleChangeLogo={handleChange("logo")}
        coverPreview={formData.cover}
        logoPreview={formData.logo}
        isEditing={true}
        handleDeleteImgProfile={handleDeleteImgProfile}
        handleDeleteImgCover={handleDeleteImgCover}
        showDelete={false}
      />


      <div className="px-6">
        {/* Store Name & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InputField
            id="name"
            label={t("store.label.name")}
            placeholder={t("store.placeholder.name")}
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            unstyled
            withFieldset
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 2 } }}
            required
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />

          <InputField
            id="description"
            label={t("store.label.bio")}
            placeholder={t("store.placeholder.bio")}
            type="text"
            value={formData.description}
            onChange={handleChange("description")}
            unstyled
            validate
            withFieldset
            handleAddError={handleAddError}
            formErrors={errors}
            required
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
        </div>

        {/*  Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <LocationAutocomplete
            id="location"
            onLocationChange={updateLocation}
            validate
            formErrors={errors}
            handleAddError={handleAddError}
            required
            onSubmit={true}
            isSubmited={isSubmitedAdd}
            withFieldset={true}
          />
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
            disableMessage="This Field is disable to  select country Select it from location field"
            disableNote="This Field is disable to  select country Select it from location field"
            disabled
          />
          {/* <SelectField
            id="country_id"
            label={t("store.label.country")}
            placeholder={t("store.placeholder.country")}
            value={formData.country_id}
            withFieldset
            labelName="nationality"
            unstyled
            required
            onChange={handleChange("country_id")}
            url={getCountry}
            validate
            formErrors={errors}
            isSubmited={isSubmited} 
           
          /> */}

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MultiInputField
            id="phones"
            label={t("store.label.phoneNumbers")}
            placeholder={t("store.placeholder.phoneNumbers")}
            type="phone"
            values={formData.phones}
            onChange={(val: string[]) => handleArrayChange("phones", val)}
            unstyled
            withFieldset
            validate
            formErrors={errors}
            handleAddError={handleAddError}
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
          <MultiInputField
            id="company_email"
            label={t("store.label.storeEmails")}
            placeholder={t("store.placeholder.storeEmails")}
            type="email"
            values={formData.emails}
            onChange={(val) => handleArrayChange("emails", val)}
            unstyled
            withFieldset
            validate
            formErrors={errors}
            handleAddError={handleAddError}
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
        </div>

        {/* Country + Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InputField
            id="address"
            label={t("store.label.address")}
            placeholder={t("store.placeholder.address")}
            type="text"
            value={formData.address}
            onChange={handleChange("address")}
            unstyled
            withFieldset
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 2 } }}
            required
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
          <InputField
            id="website"
            label={t("store.label.website")}
            placeholder={t("store.placeholder.website")}
            type="url"
            value={formData.website}
            onChange={handleChange("website")}
            unstyled
            withFieldset

          />
        </div>

        {/* Categories + Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MultiSelectField
            id="category_ids"
            name="category_ids"
            url={categories}
            label={t("store.label.categories")}
            placeholder={t("store.placeholder.categories")}
            values={formData.category_ids}
            onChange={(val) => handleArrayChange("category_ids", val)}
            withFieldset
            required
            unstyled
            validate
            formErrors={errors}
            onSubmit={true}
            isSubmited={isSubmitedAdd}
            handleAddError={handleAddError}
          />

          <div className="space-y-4">
            {/* <MultiInputField
              id={"social_links"}
              name={"social_links"}
              label={t("store.label.social_media_link")}
              placeholder={t("store.placeholder.social_media_link")}
              type="url"
              values={formData.social_links}
              onChange={(val) => handleArrayChange("social_links", val)}
              unstyled
              withFieldset
              validate
              formErrors={errors}

            /> */}


            <SocialLinksInput
              id="social_links"
              label={t("store.label.social_media_link")}
              values={formData.social_links}
              onChange={(val) => handleArrayChange("social_links", val)}

              validate
              formErrors={errors}
              handleAddError={handleAddError}
              isSubmited={isSubmitedAdd}
            />


          </div>
        </div>

        {/* Shipping + Return Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InputField
            id="shipping_policy"
            label={t("store.label.shipping_policy")}
            placeholder={t("store.placeholder.shipping_policy")}
            type="textarea"
            value={formData.shipping_policy}
            onChange={handleChange("shipping_policy")}
            unstyled
            withFieldset
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 2 } }}
            // required
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
          <InputField
            id="return_policy"
            label={t("store.label.return_policy")}
            placeholder={t("store.placeholder.return_policy")}
            type="textarea"
            value={formData.return_policy}
            onChange={handleChange("return_policy")}
            unstyled
            withFieldset
            validate
            handleAddError={handleAddError}
            formErrors={errors}
            conditions={{ text: { min: 2 } }}
            // required
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
        </div>

        {/* Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TimePickerField
            id="opening_time"
            label={t("store.label.opening_time")}
            placeholder={t("store.placeholder.opening_time")}
            value={formData.opening_time}
            onChange={(newTime) =>
              handleChange("opening_time")({
                target: { value: newTime },
              })
            }
            required
            error={errors.opening_time}
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
          <TimePickerField
            id="closing_time"
            label={t("store.label.closing_time")}
            placeholder={t("store.placeholder.closing_time")}
            value={formData.closing_time}
            onChange={(newTime) => handleChange("closing_time")(newTime)}
            required
            error={errors.closing_time}
            onSubmit={true}
            isSubmited={isSubmitedAdd}
          />
        </div>

        {/* Free Zone Toggle */}
        <div className="mb-8 p-4 border rounded-md bg-gray-50 flex items-center gap-4">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00664F',
              },
            }}
          >
            <Switch
              checked={formData.is_freezone === 1}
              onChange={(checked) =>
                handleChange("is_freezone")({ target: { value: checked ? 1 : 0 } } as any)
              }
            />
          </ConfigProvider>
          <div className="flex items-center gap-2">
            <span className="font-medium text-subTitleColor">Free Zone Store</span>
            <Popover
              content="If you choose your store free zone your store can sell product for all countries"
              title="Free Zone"
              trigger="hover"
            >
              <InfoCircleOutlined className="text-blueSite cursor-help" />
            </Popover>
          </div>
        </div>

        {/* Gallery
        <div className="mb-10">
          <MultiImageUpload
            value={formData.gallery || []}
            onImagesChange={(images) => handleArrayChange("gallery", images)}
            // withFieldset
            label={t("store.label.photos")}
          />
        </div> */}

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            className="bg-blueSiteHover text-textWhiteColor px-6 py-3 rounded-md"
            unstyled
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? t("common.saving") : t("store.buttons.add_store")}
          </Button>
          <Button
            className="text-subTitleColor underline px-6 py-3 rounded-md"
            unstyled
            onClick={() => {
              resetForm()
              handleClose?.()
            }}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default AddStore;
