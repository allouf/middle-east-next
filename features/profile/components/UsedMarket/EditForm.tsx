'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { message } from "antd";

import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import Button from "@/components/ui/Button";
import { locationApi } from "@/shared/utils/locationApi";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { AdvertisementsEndpoints } from "@/shared/constants/urls";
import useGetData from "@/lib/api/useGetData";
import usePostData from "@/lib/api/usePostData";
import { useLocale } from "antd/es/locale";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

const API_BASE_URL = "/api/proxy";

type AdvertisementProps = {
  onBack?: () => void;
  id: string | number;
  refetch?: () => void;
};

type CaseType = "price" | "negotiable" | "free" | null;

export interface EditAdFormData {
  title: string;
  category: string | number | null;
  case: CaseType;
  price: string;
  condition: string | null;
  country: string | number | null;
  region: string | null;
  sub_category: string | number | null;
  phone: string;
  contact_method: "chat" | "phone" | "both" | null;
  images: (File | string)[];
  description: string;
  country_code: string | null;
  show_phone: 0 | 1;
}

const deriveCountryCode = (country: any) =>
  country?.code ||
  country?.alpha_2_code ||
  country?.alpha2_code ||
  country?.country_code ||
  country?.shortName ||
  country?.short_name ||
  country?.id ||
  null;

const EditForm: React.FC<AdvertisementProps> = ({ onBack, id, refetch }) => {
  const { t } = useTranslation();
  const {isRTL} = useLocaleDirection();
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EditAdFormData>({
    title: "",
    category: null,
    case: null,
    price: "",
    condition: null,
    country: null,
    region: null,
    sub_category: null,
    phone: "",
    contact_method: null,
    images: [],
    description: "",
    country_code: null,
    show_phone: 0,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: resData, loading: loadingGet } = useGetData({
    url: id ? AdvertisementsEndpoints.getById(id) : "",
  });
  const { postData, loading: loadingPost } = usePostData(
    id ? AdvertisementsEndpoints.update(id) : ""
  );

  const isFreeCase = useMemo(() => formData.case === "free", [formData.case]);
  const isChatContact = useMemo(
    () => formData.contact_method === "chat",
    [formData.contact_method]
  );

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const url = `${API_BASE_URL}${USER_ENDPOINTS.Get_Advertisement_Categories}?active_only=1`;
        const res = await fetch(url);
        const payload = await res.json();
        if (res.ok && payload?.status && payload?.data?.data) {
          setCategories(payload.data.data);
        }
      } catch {
        /* ignore */
      }
    };
    loadCategories();
  }, []);

  // Fetch countries
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
    return countries.find((c) => String(c.id) === String(formData.country));
  }, [countries, formData.country]);

  const regionCountryParam = useMemo(() => {
    return countryObject?.name || "";
  }, [countryObject]);

  // Fetch regions when country changes
  useEffect(() => {
    const loadRegions = async () => {
      if (!regionCountryParam) {
        setRegions([]);
        return;
      }
      try {
        const res = await fetch(
          locationApi(
            `/api/location/regions?country=${encodeURIComponent(
              regionCountryParam
            )}`
          )
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

  // Fetch subcategories when category changes
  useEffect(() => {
    const loadSubCategories = async () => {
      if (!formData.category) {
        setSubCategories([]);
        return;
      }
      try {
        const url = `${API_BASE_URL}${USER_ENDPOINTS.Get_Advertisement_Subcategories}?active_only=1&category_id=${formData.category}`;
        const res = await fetch(url);
        const payload = await res.json();
        if (res.ok && payload?.status && payload?.data?.data) {
          setSubCategories(payload.data.data);
        } else {
          setSubCategories([]);
        }
      } catch {
        setSubCategories([]);
      }
    };
    loadSubCategories();
  }, [formData.category]);

  // Prefill from API
  useEffect(() => {
    const ad = (resData as any)?.data ?? (resData as any);
    if (!ad || loadingGet) return;

    const apiImages = Array.isArray(ad.images) ? ad.images : [];
    setImagePreviews(apiImages as string[]);

    setFormData((prev) => ({
      ...prev,
      title: ad.title ?? prev.title,
      description: ad.description ?? prev.description,
      price: ad.price != null ? String(ad.price) : prev.price,
      case: ad.is_free
        ? "free"
        : ad.is_price_negotiable
          ? "negotiable"
          : "price",
      condition: ad.condition ?? prev.condition,
      contact_method: ad.contact_method ?? prev.contact_method,
      phone: ad.phone ?? "",
      show_phone:
        ad.show_phone === true || ad.show_phone === 1 || ad.show_phone === "1"
          ? 1
          : 0,
      country: ad.country?.id?.toString() ?? ad.country_id ?? prev.country,
      country_code:
        deriveCountryCode(ad.country) ??
        ad.country_code ??
        deriveCountryCode(countryObject),
      region:
        (typeof ad.region === "object"
          ? (ad.region as any)?.name
          : ad.region) ??
        ad.region_id ??
        prev.region,
      category:
        ad.category?.id?.toString() ??
        ad.advertisement_category_id ??
        prev.category,
      sub_category:
        ad.subcategory?.id?.toString() ??
        ad.advertisement_subcategory_id ??
        prev.sub_category,
      images: apiImages.length ? apiImages : prev.images,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resData, loadingGet]);

  // Backfill country from country_code when API lacks country object/id
  useEffect(() => {
    const ad = (resData as any)?.data ?? (resData as any);
    if (!ad || loadingGet || !ad.country_code || formData.country) return;

    const matchedCountry = countries.find(
      (c) =>
        String(c.code) === String(ad.country_code) ||
        String(c.alpha_2_code) === String(ad.country_code) ||
        String(c.alpha2_code) === String(ad.country_code) ||
        String(c.country_code) === String(ad.country_code) ||
        String(c.shortName) === String(ad.country_code) ||
        String(c.short_name) === String(ad.country_code)
    );

    if (matchedCountry) {
      setFormData((prev) => ({
        ...prev,
        country: matchedCountry.id?.toString() ?? prev.country,
        country_code: deriveCountryCode(matchedCountry),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, resData, loadingGet, formData.country]);

  // Backfill region selection once regions list is available
  useEffect(() => {
    if (!formData.region || regions.length === 0) return;

    const matchedRegion = regions.find(
      (r) =>
        String(r.id) === String(formData.region) ||
        String(r.name) === String(formData.region)
    );

    if (matchedRegion && String(formData.region) !== String(matchedRegion.id)) {
      setFormData((prev) => ({ ...prev, region: matchedRegion.id?.toString() }));
    }
  }, [regions, formData.region]);

  const handleInputChange = (e: any) => {
    if (typeof e === "object" && e.target) {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSelectChange =
    (field: keyof EditAdFormData) => (e: any) => {
      const value = e?.target?.value ?? e;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleCaseChange = (e: any) => {
    const value = e?.target?.value ?? e;
    setFormData((prev) => ({
      ...prev,
      case: value,
      price: value === "free" ? "0" : prev.price,
    }));
    if (value === "free") {
      setFormErrors((prev) => {
        const { price, ...rest } = prev;
        return rest;
      });
    }
  };

  const handlePriceChange = (e: any) => {
    const value = e?.target?.value ?? e;
    // Only allow numbers and dots
    const sanitized = value.replace(/[^0-9.]/g, '');
    setFormData((prev) => ({ ...prev, price: sanitized }));
  };

  const handleContactMethodChange = (e: any) => {
    const value = e?.target?.value ?? e;
    setFormData((prev) => ({
      ...prev,
      contact_method: value,
      phone: value === "chat" ? "" : prev.phone,
      show_phone: value === "chat" ? 0 : prev.show_phone,
    }));
    if (value === "chat") {
      setFormErrors((prev) => {
        const { phone, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleCountryChange = (e: any) => {
    const value = e?.target?.value ?? e;
    const selectedCountry = countries.find((c) => String(c.id) === String(value));
    setFormData((prev) => ({
      ...prev,
      country: value,
      country_code: deriveCountryCode(selectedCountry),
      region: null,
    }));
  };

  const handleRegionChange = (e: any) => {
    const value = e?.target?.value ?? e;
    const selectedRegion = regions.find((r) => String(r.id) === String(value));
    if (selectedRegion) {
      setFormData((prev) => ({ ...prev, region: selectedRegion.name }));
    } else {
      setFormData((prev) => ({ ...prev, region: value }));
    }
  };

  const handleAddError = (id: string, error: string) => {
    setFormErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    const allFiles = Array.from(files);

    // Filter valid files
    const validFiles = allFiles.filter((file) => allowedTypes.includes(file.type));
    const invalidFiles = allFiles.filter((file) => !allowedTypes.includes(file.type));

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      const allowedTypeNames = allowedTypes.map(type => type.replace('image/', '').toUpperCase()).join(', ');
      const errorMessage = t('imageUpload.invalidFileType').replace('{{types}}', allowedTypeNames);
      messageApi.error(errorMessage);
    }

    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const preview = imagePreviews[index];
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // validation + submit
  const handleSubmit = async () => {
    setIsSubmitted(true);

    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = t("errors.required");
    if (!formData.category) errors.category = t("errors.required");
    if (!formData.case) errors.case = t("errors.required");
    if (!formData.condition) errors.condition = t("errors.required");
    if (!formData.country) errors.country = t("errors.required");
    if (!formData.region) errors.region = t("errors.required");
    if (!formData.sub_category) errors.sub_category = t("errors.required");
    if (!formData.contact_method) errors.contact_method = t("errors.required");
    if (!isChatContact && !formData.phone)
      errors.phone = t("errors.required");
    if (formData.images.length === 0) errors.images = t("errors.required");
    if (!isFreeCase && !formData.price) errors.price = t("errors.required");

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {};

      payload.title = formData.title;
      payload.description = formData.description;
      payload.price = isFreeCase ? 0 : Number(formData.price) || 0;
      payload.is_price_negotiable = formData.case === "negotiable" ? 1 : 0;
      payload.is_free = formData.case === "free" ? 1 : 0;
      payload.advertisement_category_id = formData.category;
      payload.advertisement_subcategory_id = formData.sub_category;
      payload.condition = formData.condition;
      payload.contact_method = formData.contact_method;
      payload.phone = formData.phone;
      payload.show_phone = formData.show_phone;
      payload.country_code = formData.country_code || deriveCountryCode(countryObject);
      payload.region = formData.region;

      const newImages =
        typeof File !== "undefined"
          ? formData.images.filter((img) => img instanceof File)
          : [];
      if (newImages.length > 0) {
        payload.images = newImages;
      }

      await postData(payload, {
        showMessage: false,
        onSuccess: () => {
          messageApi.success(t("store.update"));
          setIsSubmitted(false);
          refetch?.();
          onBack?.();
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const caseOptions = [
    { id: "price", name: t("usedMarket.addAd.price") || "Price" },
    { id: "negotiable", name: t("usedMarket.filters.negotiable") },
    { id: "free", name: t("usedMarket.filters.free") },
  ];

  const conditionOptions = [
    { id: "new", name: t("usedMarket.filters.new") },
    { id: "used", name: t("usedMarket.filters.used") },
  ];

  const contactMethodOptions = [
    { id: "chat", name: t("usedMarket.addAd.chat") },
    { id: "phone", name: t("usedMarket.addAd.phoneMethod") },
    { id: "both", name: t("usedMarket.addAd.both") },
  ];

  return (
    <div className="p-6">
      {contextHolder}

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-[#00664F] mb-6 hover:opacity-80 transition-opacity font-medium"
      >
        {isRTL? <ArrowRight className="w-4 h-4" />:<ArrowLeft className="w-4 h-4" />}
        {t("usedMarket.rejectedAds.goBack")}
      </button>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Title */}
        <div className="mb-6">
          <InputField
            id="title"
            label={t("usedMarket.addAd.title")}
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t("usedMarket.addAd.titlePlaceholder")}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
          />
        </div>

        {/* Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            id="category"
            label={t("usedMarket.addAd.category")}
            value={formData.category}
            onChange={handleSelectChange("category")}
            placeholder={t("usedMarket.addAd.categoryPlaceholder")}
            selectorOptions={categories}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
          />
          <SelectField
            id="sub_category"
            label={t("usedMarket.addAd.subCategory")}
            value={formData.sub_category}
            onChange={handleSelectChange("sub_category")}
            placeholder={t("usedMarket.addAd.subCategoryPlaceholder")}
            selectorOptions={subCategories}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
            labelName="name"
            disabled={!formData.category}
          />
        </div>

        {/* Case & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            id="case"
            label={t("usedMarket.addAd.case")}
            value={formData.case}
            onChange={handleCaseChange}
            placeholder={t("usedMarket.addAd.casePlaceholder")}
            selectorOptions={caseOptions}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
          />
          {!isFreeCase && (
            <InputField
              id="price"
              label={t("usedMarket.addAd.price")}
              value={formData.price}
              onChange={handlePriceChange}
              placeholder={t("usedMarket.addAd.pricePlaceholder")}
              withFieldset
              unstyled
              error={formErrors.price}
              required
              isSubmited={isSubmitted}
              formErrors={formErrors}
              handleAddError={handleAddError}
            />
          )}
        </div>

        {/* Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            id="condition"
            label={t("usedMarket.addAd.condition")}
            value={formData.condition}
            onChange={handleSelectChange("condition")}
            placeholder={t("usedMarket.addAd.conditionPlaceholder")}
            selectorOptions={conditionOptions}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
          />
        </div>

        {/* Country & Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            id="country"
            label={t("usedMarket.addAd.country")}
            value={formData.country}
            onChange={handleCountryChange}
            placeholder={t("usedMarket.addAd.countryPlaceholder")}
            selectorOptions={countries}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
            labelName="name"
          />
          <SelectField
            id="region"
            label={t("usedMarket.addAd.region")}
            value={formData.region}
            onChange={handleRegionChange}
            placeholder={t("usedMarket.addAd.regionPlaceholder")}
            selectorOptions={regions}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
            labelName="name"
          />
        </div>

        {/* Phone & show phone */}
        <div
          className={`grid grid-cols-1 ${!isChatContact ? "md:grid-cols-2" : ""
            } gap-6`}
        >
          <SelectField
            id="contact_method"
            label={t("usedMarket.addAd.contactMethod")}
            value={formData.contact_method}
            onChange={handleContactMethodChange}
            placeholder={t("usedMarket.addAd.contactMethodPlaceholder")}
            selectorOptions={contactMethodOptions}
            withFieldset
            unstyled
            required
            isSubmited={isSubmitted}
            formErrors={formErrors}
            handleAddError={handleAddError}
          />
          {!isChatContact && (
            <div className="space-y-2">
              <InputField
                id="phone"
                label={t("usedMarket.addAd.phone")}
                value={formData.phone}
                onChange={handleSelectChange("phone")}
                placeholder={t("usedMarket.addAd.phonePlaceholder")}
                type="phone"
                withFieldset
                unstyled
                required
                isSubmited={isSubmitted}
                formErrors={formErrors}
                handleAddError={handleAddError}
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  id="show_phone"
                  className="w-4 h-4 accent-blueSite hover:accent-blueSite text-blueSite hover:text-blueSite focus:ring-blueSite hover:ring-blueSite"
                  checked={formData.show_phone === 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      show_phone: e.target.checked ? 1 : 0,
                    }))
                  }
                />
                <span>{t("usedMarket.addAd.showPhone") || "Show phone in ad"}</span>
              </label>
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <fieldset
            className={`px-4 py-4 border flex flex-col items-center rounded-lg transition-colors ${isSubmitted && formErrors.images ? "border-red-400" : "border-grayBorder"
              }`}
          >
            <legend className="px-2 text-blueSite font-semibold text-sm">
              {t("usedMarket.addAd.images")}
            </legend>
            {/* Upload */}
            <div className="flex items-center gap-4 min-w-[150px]">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <div className="flex flex-col items-center gap-2">
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 border border-blueSite text-blueSite font-bold rounded-md text-sm cursor-pointer bg-[#F8F8F8] transition-colors"
                >
                  {t("usedMarket.addAd.addFile")}
                </label>
                <span className="text-xs text-gray-500">
                  {t("usedMarket.addAd.dragDropImages")} <span className="text-base">({t("usedMarket.addAd.uploadAtLeastOne")})</span>
                </span>
              </div>
            </div>
            <div
              className="flex justify-between gap-4 items-center w-full"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Previews */}
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 border-2 border-dashed border-[#00664F] rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>


            </div>
          </fieldset>
          {isSubmitted && formErrors.images && (
            <p className="text-red-500 text-xs mt-1">{formErrors.images}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-2">
          <fieldset className="px-4 py-4 border rounded-lg border-grayBorder">
            <legend className="px-2 text-blueSite font-semibold text-sm">
              {t("usedMarket.addAd.description")}
            </legend>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value.slice(0, 250),
                }))
              }
              placeholder={t("usedMarket.addAd.descriptionPlaceholder")}
              className="w-full min-h-[80px] resize-none border-0 focus:outline-none focus:ring-0 text-sm"
              maxLength={250}
            />
            <div className="text-right text-xs text-gray-400">
              {formData.description?.length ?? 0} / 250
            </div>
          </fieldset>
          {isSubmitted && !formData.description && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.images}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || loadingPost}
            className="bg-blueSite hover:bg-blueSite/90 text-white !px-[40px] !py-[10px] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting || loadingPost ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {t("common.loading") ?? "Loading..."}
              </>
            ) : (
              t("common.save") ?? "Save"
            )}
          </Button>
          <button
            type="button"
            onClick={onBack}
            className="text-gray-700 underline font-medium hover:text-gray-900 transition-colors"
          >
            {t("usedMarket.addAd.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
