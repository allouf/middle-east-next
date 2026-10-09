"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ArrowLeft, X, Upload, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import Button from "@/components/ui/Button";
import Image from "next/image";
import useProfile from "@/features/profile/hooks/useProfile";
import { locationApi } from "@/shared/utils/locationApi";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { App } from "antd";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import { useParams } from "next/navigation";

const API_BASE_URL = "/api/proxy";

interface AddAdFormProps {
    onBack: () => void;
    onSubmit: (data: AdFormData) => Promise<void>;
    onSuccess: () => void;
    onRateLimitExceeded: () => void;
}

export interface AdFormData {
    title: string;
    category: string | number | null;
    case: "price" | "negotiable" | "free" | null;
    price: string;
    condition: string | null;
    country: string | null;
    region: string | null;
    sub_category: string | number | null;
    phone: string;
    contact_method: "chat" | "phone" | "both" | null;
    images: File[];
    description: string;
    country_code: string | null;
    show_phone: 0 | 1;
}

const AddAdForm: React.FC<AddAdFormProps> = ({
    onBack,
    onSubmit,
    onSuccess,
    onRateLimitExceeded,
}) => {
    const { message: messageApi } = App.useApp();
    const {locale} = useParams()

    const { t } = useTranslation();
    const {isRTL} = useLocaleDirection();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: profileData } = useProfile();
    const deriveCountryCode = (country: any) =>
        country?.code ||
        country?.alpha_2_code ||
        country?.alpha2_code ||
        country?.country_code ||
        country?.shortName ||
        country?.short_name ||
        country?.id ||
        null;

    const [formData, setFormData] = useState<AdFormData>({
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
    const isFreeCase = useMemo(() => formData.case === "free", [formData.case]);
    const isChatContact = useMemo(() => formData.contact_method === "chat", [formData.contact_method]);

    // Fetch categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const url = `${API_BASE_URL}${USER_ENDPOINTS.Get_Advertisement_Categories}?active_only=1`;
                const res = await fetch(url, {
                    headers: {
                        "Accept-Language": String(locale || "en"),
                    },
                });
                const payload = await res.json();
                if (res.ok && payload?.status && payload?.data?.data) {
                    setCategories(payload.data.data);
                }
            } catch {
                /* ignore */
            }
        };
        loadCategories();
    }, [locale]);

    // Fetch countries
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const res = await fetch(locationApi("/api/location/countries"), {
                    headers: {
                        "Accept-Language": String(locale || "en"),
                    },
                });
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

    // Pre-fill from profile
    useEffect(() => {
        if (profileData?.data?.user) {
            const user = profileData.data.user;
            const userCountryCode = deriveCountryCode(user.country);
            setFormData(prev => ({
                ...prev,
                country: user.country?.id?.toString() || null,
                country_code: userCountryCode,
                region: (typeof user.region === 'object' ? (user.region as any)?.name : user.region) || null,
                phone: Array.isArray(user.phone) ? user.phone[0] : (user.phone || "")
            }));
        }
    }, [profileData]);

    const countryObject = useMemo(() => {
        return countries.find(
            (c) => String(c.id) === String(formData.country)
        );
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
                    locationApi(`/api/location/regions?country=${encodeURIComponent(regionCountryParam)}`),
                    {
                        headers: {
                            "Accept-Language": String(locale || "en"),
                        },
                    }
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
                const res = await fetch(url, {
                    headers: {
                        "Accept-Language": String(locale || "en"),
                    },
                });
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
    }, [formData.category, locale]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target || { name: e, value: e };
        if (typeof e === "object" && e.target) {
            setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const handleSelectChange = (field: keyof AdFormData) => (e: any) => {
        const value = e?.target?.value ?? e;
        setFormData((prev) => ({ ...prev, [field]: value }));
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
        };
    };

    const handlePriceChange = (e: any) => {
        const value = e?.target?.value ?? e;
        // Only allow numbers and dots
        const sanitized = value.replace(/[^0-9.]/g, '');
        setFormData((prev) => ({ ...prev, price: sanitized }));
    };

    const handleCountryChange = (e: any) => {
        const value = e?.target?.value ?? e;
        const selectedCountry = countries.find(c => String(c.id) === String(value));
        setFormData((prev) => ({
            ...prev,
            country: value,
            country_code: deriveCountryCode(selectedCountry),
            region: null
        }));
    };

    const handleRegionChange = (e: any) => {
        const value = e?.target?.value ?? e;
        // Check if value is ID or Name. SelectField returns ID.
        // We want to store Name if API expects Name.
        // Find region object
        const selectedRegion = regions.find(r => String(r.id) === String(value));
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
            // You can add here if you have access to it
            messageApi.error(errorMessage);
        }

        if (validFiles.length === 0) return;

        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...validFiles],
        }));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
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

    const handleSubmit = async () => {
        setIsSubmitted(true);

        // Basic validation
        const errors: Record<string, string> = {};
        if (!formData.title) errors.title = t("errors.required");
        if (!formData.category) errors.category = t("errors.required");
        if (!formData.case) errors.case = t("errors.required");
        if (!formData.condition) errors.condition = t("errors.required");
        if (!formData.country) errors.country = t("errors.required");
        if (!formData.region) errors.region = t("errors.required");
        if (!formData.sub_category) errors.sub_category = t("errors.required");
        if (!formData.contact_method) errors.contact_method = t("errors.required");
        if (!isChatContact && !formData.phone) errors.phone = t("errors.required");
        if (formData.images.length === 0) errors.images = t("errors.required");
        if (!isFreeCase && !formData.price) errors.price = t("errors.required");
        if (!formData.description) errors.description = t("errors.required");

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedCountry = countries.find(c => String(c.id) === String(formData.country));
            const payload = {
                ...formData,
                country_code: formData.country_code || deriveCountryCode(selectedCountry),
            };
            await onSubmit(payload);
            onSuccess();
        } catch (error: any) {
            if (error?.status === 429) {
                onRateLimitExceeded();
            }
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
            {/* Go Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-[#00664F] font-medium mb-4 hover:underline"
            >
               {isRTL? <ArrowRight className="w-4 h-4" />:<ArrowLeft className="w-4 h-4" />}
                {t("usedMarket.addAd.goBack")}
            </button>

            {/* Page Title */}
            <h1 className="text-2xl text-[#323232] mb-6 flex items-center gap-2 font-medium">
                <span className="w-1 mt-1 h-6 bg-blueSite rounded-full me-1"></span>
                {t("usedMarket.addAd.pageTitle")}
            </h1>

            {/* Form */}
            <div className="bg-white rounded-lg p-6">
                {/* Row 1: Title & Category */}
                <div className=" mb-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    />
                </div>

                {/* Row 2: Case & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                {/* Row 3: Condition & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                {/* Row 4: Region */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                {/* Row 5: Phone & Show Phone */}
                <div className={`grid grid-cols-1 ${!isChatContact ? "md:grid-cols-2" : ""} gap-6 mb-6`}>
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

                {/* Images Section */}
                <div className="mb-6">
                    <fieldset
                        className={`px-4 py-6 border flex flex-col items-center  rounded-lg transition-colors ${isSubmitted && formErrors.images
                            ? "border-red-400"
                            : "border-grayBorder"
                            }`}
                    >
                        <legend className="px-2 text-blueSite font-semibold text-sm">
                            {t("usedMarket.addAd.images")}
                        </legend>
                        {/* Upload Area */}
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
                            className="flex justify-between gap-4 items-center w-full mt-3"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {/* Image Previews */}
                            <div className="flex flex-wrap gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div
                                        key={index}
                                        className="relative w-24 h-24 border border-[#00664F] rounded-lg overflow-hidden group"
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
                    {isSubmitted && !formData.description && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.images}</p>
                    )}
                </div>

                {/* Description */}
                <div className="mb-8">
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
                            {formData.description.length} / 250
                        </div>
                    </fieldset>
                    {isSubmitted && !formData.description && (
                        <p className="text-red-500 text-xs mt-1">
                            Description is required
                        </p>
                    )}

                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blueSite hover:bg-blueSite/90 text-white !px-[40px] !py-[10px] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {t("usedMarket.addAd.creating")}
                            </>
                        ) : (
                            t("usedMarket.addAd.createAd")
                        )}
                    </Button>
                    <button
                        onClick={onBack}
                        className="text-gray-700 underline font-medium hover:text-gray-900 transition-colors"
                    >
                        {t("usedMarket.addAd.cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAdForm;
