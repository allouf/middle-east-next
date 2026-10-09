'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectFiled';
import MultiInputField from '@/components/ui/MultiInputField';
import MultiImageUpload from '@/components/ui/MultiImageUpload';
import MultiSelectField from '@/components/ui/MultiSelectField';
import TimePickerField from '@/components/ui/TimePickerField';
import UpdateStoreSkeleton from './UpdateStoreSkeleton';
import LocationAutocomplete from '@/components/Map/LocationAutocomplete';

import useFormData from '@/lib/Hooks/useFormData';
import usePostData from '@/lib/api/usePostData';
import useGetData from '@/lib/api/useGetData';

import { STORE_ENDPOINT, categories } from '@/shared/constants/urls';
import CoverStore from './CoverStore';
import { FormState } from '@/features/stores/types/StoreType';
import { message } from 'antd';
import { locationApi } from '@/shared/utils/locationApi';
import SocialLinksInput from '@/components/ui/SocialLinksInput';
import useDeleteData from '@/lib/api/useDeleteData';
import { ConfigProvider, Popover, Switch } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

// ---------- Types ----------
export type IdParam = string | string[] | undefined;

type StoreCategory = { id: number | string };
type StoreCountry = { id: number | string };

type StoreDetails = {
  name?: string;
  description?: string;
  logo?: string;
  cover?: string;
  country?: string | null;
  country_code?: string | null;
  website?: string;
  categories?: StoreCategory[];
  opening_time?: string;
  closing_time?: string;
  gallery?: unknown[];
  phones?: string[];
  emails?: string[];
  social_links?: string[];
  address?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  is_returnable?: boolean | number;

  // these exist in your form usage, so type them too
  shipping_policy?: string;
  return_policy?: string;
  is_freezone?: number | boolean;
};

type StoreDetailsResponse = { data?: StoreDetails };



type Props = {
  refetch?: () => void;
};



type UsePostDataReturn = {
  postData: (
    body: unknown,
    opts?: { onSuccess?: () => void; onError?: (err: unknown) => void; showMessage?: boolean }
  ) => Promise<void>;
  loading: boolean;
};

type UseGetDataReturn = {
  data?: StoreDetailsResponse;
  loading: boolean;
};

const initialFormState: FormState = {
  name: '',
  description: '',
  country_code: '',
  country: '',
  region: '',
  postal_code: '',
  city: "",
  website: '',

  category_ids: [],

  opening_time: '',
  closing_time: '',

  gallery: [],
  phones: [],
  emails: [],
  social_links: [],

  address: '',
  latitude: '',
  longitude: '',

  shipping_policy: '',
  return_policy: '',

  is_returnable: 0,
  is_freezone: 0,
};

const UpdateStore: React.FC<Props> = ({ refetch }) => {
  const { t } = useTranslation();
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmited, setIsSubmited] = useState(false);

  const idParam = (params as Record<string, IdParam>)?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const {
    formData,
    handleChange,
    handleArrayChange,
    errors,
    handleAddError,
    isValid,
    setFormData,
    updateLocation,
  } = useFormData(initialFormState);
  const {
    formData: formDataImage,
    setFormData: setFormDataImage,
    handleChange: handleImageChange,
  } = useFormData({ type: "", image: '' });

  const { postData, loading } = usePostData(
    id ? STORE_ENDPOINT.updateStore(id) : ''
  ) as unknown as UsePostDataReturn;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [countries, setCountries] = useState<any[]>([]);

  const { data: resData, loading: loadingGet } = useGetData({
    url: id ? STORE_ENDPOINT.getStoreDetails(id) : '',
  }) as unknown as UseGetDataReturn;

  const { postData: postImage, loading: loadingPost, contextHolder: updateImageContextHoder } = usePostData(
    `/stores/uploade-image/${id}`
  );
  const { deleteData: deleteimage, loading: loadingDelete, } = useDeleteData(
    STORE_ENDPOINT.deleteStoreLogo
  );
  useEffect(() => {
    const store = resData?.data;
    if (!store) return;

    setFormData({
      name: store.name ?? '',
      description: store.description ?? '',
      country_code: store.country_code ?? '',
      country: store.country ?? '',
      website: store.website ?? '',
      category_ids: Array.isArray(store.categories) ? store.categories.map((cat) => cat.id) : [],
      opening_time: store.opening_time ?? '',
      closing_time: store.closing_time ?? '',
      gallery: store.gallery ?? [],
      phones: store.phones ?? [],
      emails: store.emails ?? [],
      social_links: store.social_links ?? [],
      address: store.address ?? '',
      latitude: store.latitude != null ? String(store.latitude) : '',
      longitude: store.longitude != null ? String(store.longitude) : '',
      shipping_policy: store.shipping_policy ?? '',
      return_policy: store.return_policy ?? '',
      is_returnable: store.is_returnable ? 1 : 0,
      is_freezone: store.is_freezone ? 1 : 0,
    });
  }, [resData, setFormData]);


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

  const handleSubmit = async () => {
    // e.preventDefault();
    if (!isValid) {
      messageApi.error(t("store.error.required"));
      setIsSubmited(true);
      return;
    }
    await postData(formData, {
      showMessage: false,
      onSuccess: () => {
        messageApi.success(t("store.update"));
        setIsEditing(false);
        setIsSubmited(false)
        refetch?.();
      },
    });
  };


  const handleUpdateImage = async (type: 'logo' | 'cover', img: File) => {
    // Validate inputs
    if (!type || !img) {
      messageApi.error(t('common.error') || 'Invalid image data');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(img.type)) {
      messageApi.error('Only JPEG and PNG images are allowed');
      return;
    }

    try {
      const imageFormData = { type, image: img };
      await postImage(imageFormData, {
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      messageApi.error(errorMsg);
    }
  };

  const handleRemoveImage = async (type: 'logo' | 'cover'): Promise<void> => {
    // Validate inputs
    if (!id || !type) {
      messageApi.error('Invalid request parameters');
      return;
    }

    try {
      await deleteimage(`${id}?type=${type}`, {
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      messageApi.error(errorMsg);
    }
  }

  if (loadingGet) return <UpdateStoreSkeleton />;

  const latNum = Number(formData.latitude);
  const lngNum = Number(formData.longitude);
  const hasDefaultCenter = Number.isFinite(latNum) && Number.isFinite(lngNum);



  return (
    <div className="mx-auto h-full mb-4 relative">
      {/* Cover + Form */}
      {contextHolder}
      {updateImageContextHoder}
      <form className="space-y-8 opacity-100">
        <div className='mb-6'>

          <CoverStore
            handleChange={handleImageChange}
            handleChangeLogo={handleImageChange('logo')}
            isEditing={true}
            coverPreview={resData?.data?.cover}
            logoPreview={resData?.data?.logo}
            handleDeleteImgProfile={() => handleRemoveImage('logo')}
            handleDeleteImgCover={() => handleRemoveImage('cover')}
            onLogoUpload={(img) => handleUpdateImage('logo', img)}
            onCoverUpload={(img) => handleUpdateImage('cover', img)}
            loadingLogo={loadingPost}
            loadingCover={loadingPost}
          />
        </div>

        <div className='px-6 '>
          {/* Store Name & Bio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
            <InputField
              id="name"
              label={t('store.label.name')}
              placeholder={t('store.placeholder.name')}
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              unstyled
              withFieldset
              validate
              formErrors={errors}
              conditions={{ text: { min: 2 } }}
              required
              handleAddError={handleAddError}
              onSubmit={true}
              isSubmited={isSubmited}
              disabled={!isEditing}
            />

            <InputField
              id="description"
              label={t('store.label.bio')}
              placeholder={t('store.placeholder.bio')}
              type="text"
              value={formData.description}
              onChange={handleChange('description')}
              unstyled
              validate
              withFieldset
              formErrors={errors}
              required
              handleAddError={handleAddError}
              onSubmit={true}
              isSubmited={isSubmited}
              disabled={!isEditing}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <LocationAutocomplete
              id="location"
              onLocationChange={(loc) => updateLocation(loc as any)}
              defaultCenter={hasDefaultCenter ? { lat: latNum, lng: lngNum } : null}
              validate
              formErrors={errors}
              disabled={!isEditing}
              required
              withFieldset={true}
              isSubmited={isSubmited}
              onSubmit={true}
              handleAddError={handleAddError}
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
              disabled={!isEditing}
              onSubmit={true}
              isSubmited={isSubmited}
            />
          </div>

          {/* Phones + Emails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MultiInputField
              id="phones"
              label={t('store.label.phoneNumbers')}
              placeholder={t('store.placeholder.phoneNumbers')}
              type="phone"
              values={formData.phones}
              onChange={(val: string[]) => handleArrayChange('phones', val)}
              unstyled
              withFieldset
              validate
              handleAddError={handleAddError}
              formErrors={errors}
              onSubmit={true}
              isSubmited={isEditing}
              disabled={!isEditing}
              required={formData.phones === null}
            />

            <MultiInputField
              id="company_email"
              label={t('store.label.storeEmails')}
              placeholder={t('store.placeholder.storeEmails')}
              type="email"
              values={formData.emails}
              onChange={(val: string[]) => handleArrayChange('emails', val)}
              unstyled
              withFieldset
              validate
              handleAddError={handleAddError}
              formErrors={errors}
              onSubmit={true}
              isSubmited={isSubmited}
              disabled={!isEditing}
              required={formData.phones === null}
            />
          </div>

          {/* Address + Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <InputField
              id="address"
              label={t('store.label.address')}
              placeholder={t('store.placeholder.address')}
              type="text"
              value={formData.address}
              onChange={handleChange('address')}
              unstyled
              withFieldset
              validate
              formErrors={errors}
              conditions={{ text: { min: 2 } }}
              required
              handleAddError={handleAddError}
              disabled
              isSubmited={isSubmited}

            />
            <InputField
              id="website"
              label={t('store.label.website')}
              placeholder={t('store.placeholder.website')}
              type="url"
              value={formData.website}
              onChange={handleChange('website')}
              disabled={!isEditing}
              unstyled
              withFieldset
            />
          </div>

          {/* Categories + Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MultiSelectField
              id="category_ids"
              name="category_ids"
              url={categories}
              label={t('store.label.categories')}
              placeholder={t('store.placeholder.categories')}
              values={formData.category_ids}
              onChange={(val) => handleArrayChange("category_ids", val)}
              withFieldset
              unstyled
              validate
              formErrors={errors}
              disabled={!isEditing}
              required
              onSubmit={true}
              isSubmited={isSubmited}
              handleAddError={handleAddError}
            />

            <SocialLinksInput
              id="social_links"
              label={t('store.label.social_media_link')}
              values={formData.social_links}
              onChange={(val) => handleArrayChange("social_links", val)}
              required
              validate
              formErrors={errors}
              handleAddError={handleAddError}
              disabled={!isEditing}
              isSubmited={isSubmited}
            />
          </div>

          {/* Shipping + Return Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputField
              id="shipping_policy"
              label={t('store.label.shipping_policy')}
              placeholder={t('store.placeholder.shipping_policy')}
              type="textarea"
              value={formData.shipping_policy}
              onChange={handleChange('shipping_policy')}
              disabled={!isEditing}
              unstyled
              withFieldset
            />
            <InputField
              id="return_policy"
              label={t('store.label.return_policy')}
              placeholder={t('store.placeholder.return_policy')}
              type="textarea"
              value={formData.return_policy}
              onChange={handleChange('return_policy')}
              disabled={!isEditing}
              unstyled
              withFieldset
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <TimePickerField
              id="opening_time"
              label={t('store.label.opening_time')}
              placeholder={t('store.placeholder.opening_time')}
              value={formData.opening_time}
              onChange={(newTime: string) =>
                handleChange('opening_time')({ target: { value: newTime } })
              }
              required
              disabled={!isEditing}
              error={errors.opening_time}
              onSubmit={true}
              isSubmited={isSubmited}
            />

            <TimePickerField
              id="closing_time"
              label={t('store.label.closing_time')}
              placeholder={t('store.placeholder.closing_time')}
              value={formData.closing_time}
              onChange={(newTime: string) =>
                handleChange('closing_time')(newTime)
              }
              required
              disabled={!isEditing}
              error={errors.closing_time}
              onSubmit={true}
              isSubmited={isSubmited}
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
                disabled={!isEditing}
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

          {/* {isEditing && ( */}
          {/* <MultiImageUpload
          onImagesChange={(images: unknown[]) => handleArrayChange('gallery', images)}
          // withFieldset
          disabled={!isEditing}
          value={formData.gallery || []}
          label={t('store.label.photos')} */}
          {/* /> */}
          {/* )} */}


          {!isEditing ? (
            <div className="flex gap-4 mt-6">
              <Button
                type="button"
                className="bg-blueSiteHover text-textWhiteColor px-6 py-3 rounded-md"
                unstyled
                onClick={() => setIsEditing(true)}
              >
                {t('common.edit')}
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 mt-6">
              <Button
                // type="submit"
                className="bg-blueSiteHover text-textWhiteColor px-6 py-3 rounded-md"
                unstyled
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? t('common.saving') : t('common.save')}
              </Button>

              <Button
                type="button"
                className="text-subTitleColor bg-white border rounded-lg underline px-5 py-2 "
                unstyled
                onClick={() => setIsEditing(false)}
              >
                {t('common.cancel')}
              </Button>
            </div>
          )}
        </div>
      </form >
    </div >
  );
};

export default UpdateStore;
