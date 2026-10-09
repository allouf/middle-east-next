"use client";

import useGetData from "@/lib/api/useGetData";
import {
  categories,
  PRODUCTS_ENDPOINT,
  STORE_ENDPOINT,
} from "@/shared/constants/urls";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { HiMiniPencil } from "react-icons/hi2";
import Button from "../../../../components/ui/Button";
import InputField from "../../../../components/ui/InputField";
import MultiImageUpload from "../../../../components/ui/MultiImageUpload";
import SelectField from "../../../../components/ui/SelectFiled";
import StepIndicator from "../../../../components/ui/StepIndicator";
import useFormData from "../../../../lib/Hooks/useFormData";
import usePostData from "../../../../lib/api/usePostData";
import useApp from "antd/es/app/useApp";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface Option {
  name: string;
  type: string;
  values: string[];
}

interface OptionDraft extends Option {
  editIndex?: number | null;
}

interface Variant {
  option_values: string[];
  price: string;
  stock: string;
  low_stock_threshold: string;
  image: File | string | null | undefined;
}

interface FormState {
  name: string;
  category_id: string;
  sub_category_id: string;
  gallery: (File | string)[];
  specifications: string;
  description: string;
  additional_features: string[];
  price: string;
  options: Option[];
  variants: Variant[];
  has_discount: boolean;
  discount_value: string;
  discount_type: string;
  store_id: string | number | null;
  status: "active" | "draft" | null;
}

const initialFormState: FormState = {
  name: "",
  category_id: "",
  sub_category_id: "",
  gallery: [],
  specifications: "",
  description: "",
  additional_features: [],
  price: "",
  options: [],
  variants: [],
  has_discount: false,
  discount_value: "",
  discount_type: "",
  store_id: null,
  status: "active",
};

// 🔹 Generate all variant combinations (Cartesian product)
function generateCombinations(options: Option[] = []): string[][] {
  if (!Array.isArray(options) || options.length === 0) return [];
  const values = options.map((opt) => opt.values);
  const result: string[][] = [];

  const combine = (prefix: string[], index: number) => {
    if (index === values.length) {
      result.push(prefix);
      return;
    }
    for (const val of values[index]) {
      combine([...prefix, val], index + 1);
    }
  };

  combine([], 0);
  return result;
}

// 🔹 Common colors for color-type options
const COMMON_COLORS = [
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Purple", hex: "#800080" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Gray", hex: "#808080" },
];

const UpdateProduct = ({
  refetch,
  handleTabChange,
}: {
  refetch: () => void;
  handleTabChange: (tab?: string | number) => void;
}) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("ID")!;
  const { message } = useApp();
  const [variants_draft, setVariants_draft] = useState<Variant[]>([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState<string[]>([]);
  const [subCategoryError, setSubCategoryError] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [newValueInput, setNewValueInput] = useState("");
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [optionDraft, setOptionDraft] = useState<OptionDraft>({
    name: "",
    values: [],
    type: "",
  });
  const isOptionIncomplete =
    !optionDraft.name?.trim() ||
    !optionDraft.type ||
    !optionDraft.values ||
    optionDraft.values.length === 0;

  const translate = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const imageLabel = translate("products.image", "Image");
  const uploadHint = translate(
    "products.uploadClearPhoto",
    "Upload a clear product photo"
  );
  const uploadBtnText = translate("common.upload", "Upload");
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: productData, loading: getLoading } = useGetData({
    url: PRODUCTS_ENDPOINT.details(id),
  });

  const { formData, handleChange, handleArrayChange, resetForm, setFormData } =
    useFormData<FormState>(initialFormState);
  const { postData, loading, contextHolder } = usePostData(
    PRODUCTS_ENDPOINT.updateProduct(id)
  );

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // 🧩 Normalize and hydrate product data from backend
  useEffect(() => {
    if (!productData?.data) return;

    const {
      name,
      category_id,
      sub_category_id,
      description,
      specifications,
      additional_features = [],
      price,
      price_before_discount,
      discount_value,
      discount_type,
      status,
      gallery = [],
      variants = [],
      options = [],
      store_id,
    } = productData.data;

    console.log("edite product Data", productData.data)

    // Normalize gallery - extract file_path URLs
    const normalizedGalleryUrls = gallery.map(
      (img: any) => img?.file_path || img
    );

    // Set gallery URLs for defaultImages prop
    setGalleryUrls(normalizedGalleryUrls);

    // Normalize options - extract type and values
    const normalizedOptions = options.map((opt: Option) => ({
      name: opt.name,
      type: opt.type || "string",
      values: Array.isArray(opt.values)
        ? opt.values.map((v: any) =>
          typeof v === "object" && v.value ? v.value : v
        )
        : [],
    }));

    // Normalize variants to match draft format
    const normalizedVariants = variants.map((v: Variant) => ({
      option_values: Array.isArray(v.option_values)
        ? v.option_values.map((val: any) =>
          typeof val === "object" && val.value ? val.value : val
        )
        : [],
      price: v.price !== undefined && v.price !== null ? String(v.price) : "",
      stock: v.stock !== undefined && v.stock !== null ? String(v.stock) : "",
      low_stock_threshold:
        v.low_stock_threshold !== undefined && v.low_stock_threshold !== null
          ? String(v.low_stock_threshold)
          : "",
      image: v.image || null,
    }));

    // Determine if discount exists
    const hasDiscount = discount_value > 0 && discount_type;

    setFormData({
      ...initialFormState,
      name: name || "",
      category_id: category_id || "",
      sub_category_id: sub_category_id || "",
      gallery: [], // Will be handled by defaultImages prop
      specifications: specifications || "",
      description: description || "",
      additional_features: Array.isArray(additional_features)
        ? additional_features
        : [],
      price: price || "",
      options: normalizedOptions,
      variants: normalizedVariants,
      has_discount: hasDiscount,
      discount_value: discount_value ? String(discount_value) : "",
      discount_type: discount_type || "",
      store_id: store_id || null,
      status: status || "active",
    });

    // Set variants draft - ONLY use variants from API, don't generate new ones
    // Just display what exists in the response
    setVariants_draft(normalizedVariants);
  }, [productData]);
  // Maintain previews for variant images
  useEffect(() => {
    setVariantImagePreviews((prev) =>
      variants_draft.map((v, idx) => {
        const prevUrl = prev[idx];

        if (v?.image instanceof File) {
          if (prevUrl && prevUrl.startsWith("blob:")) {
            URL.revokeObjectURL(prevUrl);
          }
          return URL.createObjectURL(v.image);
        }

        if (typeof v?.image === "string" && v.image) {
          if (prevUrl && prevUrl.startsWith("blob:")) {
            URL.revokeObjectURL(prevUrl);
          }
          return v.image;
        }

        if (prevUrl && prevUrl.startsWith("blob:")) {
          URL.revokeObjectURL(prevUrl);
        }
        return "/anonymous.png";
      })
    );
  }, [variants_draft]);

  // Cleanup blob URLs when previews change/unmount
  useEffect(() => {
    return () => {
      variantImagePreviews.forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [variantImagePreviews]);

  useEffect(() => {
    console.log("formData", formData)
  }, [formData])

  // 🔹 Helper function to get variant display name
  const getVariantDisplayName = (variant: Variant) => {
    if (!variant.option_values || variant.option_values.length === 0) {
      return "—";
    }
    // Reverse the order to show like "512/Orange" instead of "Orange/512"
    return [...variant.option_values].reverse().join(" / ");
  };

  // No auto-regeneration - variants are only generated when user clicks "Generate Variants" button

  // Sync variants_draft to formData.variants
  useEffect(() => {
    const mappedVariants = variants_draft.map((v: Variant) => ({
      option_values: v.option_values,
      price: v.price,
      stock: v.stock,
      low_stock_threshold: v.low_stock_threshold,
      image: v.image,
    }));
    handleArrayChange("variants", mappedVariants);
  }, [variants_draft]);

  // 🔹 Sync selected variants back to formData
  //   useEffect(() => {

  //   }, [variants_draft]);

  // 🔹 Submit handler - shows preview modal before submitting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure store_id is set
    const storeId = formData.store_id;
    if (!storeId) {
      message.error(t("updateProduct.validation.storeIdRequired"));
      return;
    }

    // Show preview modal before submitting
    setShowPreviewModal(true);
  };

  // 🔹 Actual product update submission
  const submitProduct = async () => {
    const storeId = formData.store_id;
    if (!storeId) {
      message.error(t("updateProduct.validation.storeIdRequired"));
      return;
    }

    // Build FormData with correct structure (similar to AddProduct)
    const formDataObj = new FormData();

    formDataObj.append("name", formData.name);
    formDataObj.append("store_id", `${storeId}`);

    const categoryId = formData.sub_category_id || formData.category_id;
    formDataObj.append("category_id", categoryId);

    formDataObj.append("description", formData.description);
    formDataObj.append("specifications", formData.specifications || "");
    formDataObj.append("status", formData.status || "active");

    // Discount fields (always include if they have values)
    if (formData.discount_value) {
      formDataObj.append("discount_value", formData.discount_value);
      formDataObj.append("has_discount", "true");
    }
    if (formData.discount_type) {
      formDataObj.append("discount_type", formData.discount_type);
    }

    // Gallery images (File objects)
    if (Array.isArray(formData.gallery) && formData.gallery.length > 0) {
      formData.gallery.forEach((file, index) => {
        if (file instanceof File) {
          formDataObj.append(`gallery[${index}]`, file);
        }
      });
    }

    // Additional features array
    if (
      Array.isArray(formData.additional_features) &&
      formData.additional_features.length > 0
    ) {
      formData.additional_features.forEach((feature) => {
        if (feature) {
          formDataObj.append("additional_features[]", feature);
        }
      });
    }

    // Options
    if (Array.isArray(formData.options) && formData.options.length > 0) {
      formData.options.forEach((option, optIndex) => {
        if (option.name) {
          formDataObj.append(`options[${optIndex}][name]`, option.name);
        }
        if (Array.isArray(option.values) && option.values.length > 0) {
          option.values.forEach((value, valIndex) => {
            if (value) {
              formDataObj.append(
                `options[${optIndex}][values][${valIndex}]`,
                value
              );
            }
          });
        }
      });
    }

    // Variants
    if (Array.isArray(formData.variants) && formData.variants.length > 0) {
      formData.variants.forEach((variant, varIndex) => {
        if (variant.price) {
          formDataObj.append(`variants[${varIndex}][price]`, variant.price);
        }
        if (variant.stock) {
          formDataObj.append(`variants[${varIndex}][stock]`, variant.stock);
        }
        if (variant.low_stock_threshold) {
          formDataObj.append(
            `variants[${varIndex}][low_stock_threshold]`,
            variant.low_stock_threshold
          );
        }
        if (variant.image instanceof File) {
          formDataObj.append(`variants[${varIndex}][image]`, variant.image);
        }
        if (
          Array.isArray(variant.option_values) &&
          variant.option_values.length > 0
        ) {
          variant.option_values.forEach((optValue, optValIndex) => {
            if (optValue) {
              formDataObj.append(
                `variants[${varIndex}][option_values][${optValIndex}]`,
                optValue
              );
            }
          });
        }
      });
    }

    await postData(formDataObj, {
      onSuccess: () => {
        message.success(t("updateProduct.messages.productUpdatedSuccessfully"));
        setVariants_draft([]);
        resetForm();
        setShowPreviewModal(false);
        handleTabChange("products_managment");
        refetch?.();
      },
      onError: (err:any) => {
        // handleClose();
        const resData = err?.response?.data;
        message.error(resData?.message || t("updateProduct.messages.productUpdateError",{defaultValue:"Failed to update product"}))
      },
      showMessage:false
    });
  };

  // Get combined gallery images for preview (File objects + URLs from API)
  // MultiImageUpload manages which images are shown, so we combine both sources
  const getCombinedGallery = () => {
    const fileImages = Array.isArray(formData.gallery)
      ? formData.gallery.filter((img) => img instanceof File)
      : [];
    // For preview, show all images: new File objects + existing URLs from API
    // The MultiImageUpload component handles the actual state
    return [...fileImages, ...galleryUrls];
  };

  return (
    <div className="shadow-xl rounded-3xl p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {t("updateProduct.title")}
      </h2>

      <form onSubmit={handleSubmit}>
        <StepIndicator
          step={step}
          setStep={setStep}
          totalSteps={totalSteps}
          loading={loading}
          stepLabels={[
            t("updateProduct.stepLabels.information"),
            t("updateProduct.stepLabels.variants"),
            t("updateProduct.stepLabels.discount")
          ]}
        >
          {/* STEP 1 — Product Information */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <InputField
                    id="name"
                    type="text"
                    label={t("updateProduct.step1.productName")}
                    value={formData.name}
                    onChange={handleChange("name")}
                    unstyled
                    withFieldset
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SelectField
                    id="category_id"
                    label={t("updateProduct.step1.categories")}
                    value={formData.category_id}
                    onChange={handleChange("category_id")}
                    url={`${categories}?per_page=100`}
                    unstyled
                    withFieldset
                    placeholder={t("updateProduct.step1.selectCategory")}
                  />
                </div>
                <div>
                  <SelectField
                    id="sub_category_id"
                    label={t("updateProduct.step1.subCategories")}
                    value={formData.sub_category_id}
                    onChange={handleChange("sub_category_id")}
                    url={
                      formData.category_id
                        ? `/categories/childrens/${formData.category_id}?per_page=100`
                        : undefined
                    }
                    unstyled
                    withFieldset
                    error={subCategoryError}
                    placeholder={t("updateProduct.step1.selectSubCategory")}
                    onMouseDown={() => {
                      if (!formData.category_id) {
                        setSubCategoryError(
                          t("updateProduct.step1.chooseMainCategoryFirst")
                        );
                        return false;
                      }
                      setSubCategoryError("");
                      return true;
                    }}
                    onClick={() => {
                      if (!formData.category_id) {
                        setSubCategoryError(
                          t("updateProduct.step1.chooseMainCategoryFirst")
                        );
                        return false;
                      }
                      return true;
                    }}
                  />
                </div>
              </div>

              <div>
                <MultiImageUpload
                  id="gallery"
                  value={formData.gallery || []}
                  onImagesChange={(images) =>
                    handleArrayChange("gallery", images)
                  }
                  withFieldset
                  label={t("updateProduct.step1.images")}
                  defaultImages={galleryUrls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <fieldset className="py-2 px-4 border border-gray-300 rounded-md">
                    <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
                      {t("updateProduct.step1.specifications")}
                    </legend>
                    <textarea
                      id="specifications"
                      value={formData.specifications}
                      onChange={(e) =>
                        handleChange("specifications")({
                          target: { value: e.target.value },
                        })
                      }
                      className="w-full h-40 p-2 border-0 focus:outline-none text-sm bg-transparent resize-none"
                      placeholder={t("updateProduct.step1.specificationsPlaceholder")}
                    />
                  </fieldset>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <fieldset className="py-2 px-4 border border-gray-300 rounded-md">
                    <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
                      {t("updateProduct.step1.description")}
                    </legend>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description")({
                          target: { value: e.target.value },
                        })
                      }
                      className="w-full h-40 p-2 border-0 focus:outline-none text-sm bg-transparent resize-none"
                      placeholder={t("updateProduct.step1.descriptionPlaceholder")}
                    />
                  </fieldset>
                </div>
              </div>

              <div className="w-full">
                <fieldset className="py-2 px-4 border border-gray-300 rounded-md">
                  <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
                    {t("updateProduct.step1.additionalFeatures")}
                  </legend>
                  <div className="flex flex-col gap-2">
                    {formData.additional_features &&
                      formData.additional_features.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          {formData.additional_features.map(
                            (feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 bg-blue-100 border border-blue-200 text-subTitleColor px-3 py-1.5 rounded-md text-sm"
                              >
                                <span>{feature}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated =
                                      formData.additional_features.filter(
                                        (_, i) => i !== index
                                      );
                                    handleArrayChange(
                                      "additional_features",
                                      updated
                                    );
                                  }}
                                  className="ml-1 bg-red-500 text-textWhiteColor rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors p-0 flex-shrink-0"
                                  aria-label={t("updateProduct.step1.removeFeatureAria")}
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && newFeatureInput.trim()) {
                            e.preventDefault();
                            handleArrayChange("additional_features", [
                              ...(formData.additional_features || []),
                              newFeatureInput.trim(),
                            ]);
                            setNewFeatureInput("");
                          }
                        }}
                        placeholder={t("updateProduct.step1.writeFeatureHere")}
                        className="w-full border-0 border-b border-gray-300 focus:outline-none focus:border-blueSite text-sm py-1 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFeatureInput.trim()) {
                            handleArrayChange("additional_features", [
                              ...(formData.additional_features || []),
                              newFeatureInput.trim(),
                            ]);
                            setNewFeatureInput("");
                          }
                        }}
                        className="self-start text-sm text-subTitleColor hover:text-blueSiteHover font-semibold mt-1"
                      >
                        {t("updateProduct.step1.addFeature")}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* STEP 2 — Product Variants */}
          {step === 2 && (
            <div className="space-y-8">
              {/* 🔹 OPTIONS SECTION */}
              {formData.options.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="py-3 px-4 bg-[#FCFCFC] rounded-lg flex justify-between items-start"
                    >
                      <div>
                        <p className="font-medium">{opt.name}</p>
                        <p className="text-textColor text-sm">
                          {t("updateProduct.step2.type")}: <span className="capitalize">{opt.type}</span>
                        </p>
                        <p className="text-textColor text-sm">
                          {t("updateProduct.step2.values")}: {opt.values.join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* ✏️ Edit Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setOptionDraft({
                              name: opt.name,
                              type: opt.type,
                              values: opt.values,
                              editIndex: idx,
                            });
                            setNewValueInput("");
                          }}
                          className="text-blueBtn hover:to-blueSiteHover bg-[#E6F0ED] p-1 rounded-sm"
                        >
                          <HiMiniPencil size={18} />
                        </button>

                        {/* 🗑️ Delete Option */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.options.filter(
                              (_, i) => i !== idx
                            );
                            handleArrayChange("options", updated);
                          }}
                          className="text-red-500 hover:text-red-700 bg-[#E6F0ED] p-1 rounded-sm"
                        >
                          <AiFillDelete size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add / Edit Option Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  id="option_name"
                  type="text"
                  label={t("updateProduct.step2.optionName")}
                  placeholder={t("updateProduct.step2.optionNamePlaceholder")}
                  value={optionDraft.name}
                  onChange={(e) => {
                    const val =
                      e && typeof e === "object" && "target" in e
                        ? (e as React.ChangeEvent<HTMLInputElement>).target
                          .value
                        : String(e);
                    setOptionDraft({ ...optionDraft, name: val });
                  }}
                  unstyled
                  withFieldset
                />

                <SelectField
                  id="option_type"
                  label={t("updateProduct.step2.optionType")}
                  placeholder={t("updateProduct.step2.selectOptionType")}
                  selectorOptions={[
                    { id: "string", name: t("labels.text") },
                    { id: "color", name: t("labels.color") },
                    { id: "number", name: t("labels.number") },
                  ]}
                  value={optionDraft.type || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setOptionDraft({ ...optionDraft, type: e.target.value })
                  }
                  unstyled
                  withFieldset
                />

                {/* Option Value Field with Chips */}
                <div className="w-full">
                  <fieldset className="py-2 px-4 border border-gray-300 rounded-md">
                    <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
                      {t("updateProduct.step2.optionValue")}
                    </legend>
                    <div className="flex flex-col gap-2">
                      {optionDraft.type === "color" && (
                        <div className="flex flex-wrap items-center gap-2">
                          {COMMON_COLORS.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => {
                                const exists = (optionDraft.values || []).some(
                                  (v) =>
                                    v.toLowerCase() === color.name.toLowerCase()
                                );
                                if (!exists) {
                                  setOptionDraft({
                                    ...optionDraft,
                                    values: [
                                      ...(optionDraft.values || []),
                                      color.name,
                                    ],
                                  });
                                }
                              }}
                              className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition-colors"
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span>{t(`colors.${color.name}`)}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {optionDraft.values && optionDraft.values.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          {optionDraft.values.map((value, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 bg-blue-100 border border-blue-200 text-subTitleColor px-3 py-1.5 rounded-md text-sm"
                            >
                              <span>{t(`colors.${value}`)}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = optionDraft.values.filter(
                                    (_, i) => i !== index
                                  );
                                  setOptionDraft({
                                    ...optionDraft,
                                    values: updated,
                                  });
                                }}
                                className="ml-1 bg-red-500 text-textWhiteColor rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors p-0 flex-shrink-0"
                                aria-label={t("updateProduct.step2.removeValueAria")}
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          value={newValueInput}
                          onChange={(e) => setNewValueInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && newValueInput.trim()) {
                              e.preventDefault();
                              setOptionDraft({
                                ...optionDraft,
                                values: [
                                  ...(optionDraft.values || []),
                                  newValueInput.trim(),
                                ],
                              });
                              setNewValueInput("");
                            }
                          }}
                          placeholder={t("updateProduct.step2.writeOptionValueHere")}
                          className="w-full border-0 border-b border-gray-300 focus:outline-none focus:border-blueSite text-sm py-1 bg-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newValueInput.trim()) {
                              setOptionDraft({
                                ...optionDraft,
                                values: [
                                  ...(optionDraft.values || []),
                                  newValueInput.trim(),
                                ],
                              });
                              setNewValueInput("");
                            }
                          }}
                          className="self-start text-sm text-subTitleColor hover:text-blueSiteHover font-semibold mt-1"
                        >
                          {t("updateProduct.step2.addOtherValue")}
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              {/* Add Other Options Button */}
              <div>
                <Button
                  type="button"
                  unstyled
                  className="w-fit bg-transparent text-subTitleColor hover:text-blueSiteHover font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isOptionIncomplete}
                  onClick={() => {
                    if (
                      !optionDraft.name ||
                      !optionDraft.type ||
                      optionDraft.values.length === 0
                    ) {
                      message.error(t("updateProduct.validation.fillAllOptionFields"));
                      return;
                    }

                    const newOption = {
                      name: optionDraft.name,
                      type: optionDraft.type,
                      values: optionDraft.values,
                    };

                    const updatedOptions = [...formData.options];

                    if (typeof optionDraft.editIndex === "number") {
                      updatedOptions[optionDraft.editIndex] = newOption;
                      message.success(t("updateProduct.messages.optionUpdatedSuccessfully"));
                    } else {
                      updatedOptions.push(newOption);
                      message.success(t("updateProduct.messages.optionAddedSuccessfully"));
                    }

                    handleArrayChange("options", updatedOptions);
                    setOptionDraft({
                      name: "",
                      type: "",
                      values: [],
                      editIndex: null,
                    });
                    setNewValueInput("");
                  }}
                >
                  {typeof optionDraft.editIndex === "number" ? (
                    <div className="flex gap-1 justify-center items-center text-blueIcons">
                      {t("updateProduct.step2.saveOption")}
                    </div>
                  ) : (
                    t("updateProduct.step2.addOtherOptionsProduct")
                  )}
                </Button>
              </div>

              {/* 🔹 VARIANTS SECTION */}
              <div className="bg-[#FCFCFC] p-4 rounded-xl shadow-sm border border-gray-200">
                <h3 className="sm:text-lg text-[12px] font-semibold mb-4 text-blueSite">
                  {t("updateProduct.step2.productVariants")}
                </h3>

                {variants_draft.length === 0 ? (
                  formData.options.length === 0 ? (
                    <p className="text-textColor text-sm">
                      {t("updateProduct.step2.addOptionsFirst")}
                    </p>
                  ) : (
                    <Button
                      type="button"
                      unstyled
                      className="w-fit bg-transparent text-subTitleColor hover:text-blueSite font-semibold mb-4"
                      onClick={() => {
                        const combos = generateCombinations(formData.options);
                        const variants = combos.map((combo) => ({
                          option_values: combo,
                          price: "",
                          stock: "",
                          low_stock_threshold: "",
                          image: null,
                        }));
                        setVariants_draft(variants);
                      }}
                    >
                      {t("updateProduct.step2.generateVariants")}
                    </Button>
                  )
                ) : (
                  <>
                    {/* Show Generate Variants button when options exist */}
                    {formData.options.length > 0 && (
                      <Button
                        type="button"
                        unstyled
                        className="w-fit bg-transparent text-subTitleColor hover:text-blueSite font-semibold mb-4"
                        onClick={() => {
                          const combos = generateCombinations(formData.options);

                          // Replace ALL variants with newly generated ones (don't preserve old ones)
                          const newVariants = combos.map((combo) => ({
                            option_values: combo,
                            price: "",
                            stock: "",
                            low_stock_threshold: "",
                            image: null,
                          }));

                          // Replace all variants with new generated ones
                          setVariants_draft(newVariants);
                        }}
                      >
                        {variants_draft.length > 0
                          ? t("updateProduct.step2.regenerateVariants")
                          : t("updateProduct.step2.generateVariants")}
                      </Button>
                    )}

                    {/* Show variants table - display variants from API */}
                    {variants_draft.length > 0 && (
                      <div className="overflow-y-auto rounded-lg border border-gray-200 shadow-sm max-h-[400px]">
                        <table className="min-w-full border-collapse text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-3 text-start">{t("updateProduct.step2.variant")}</th>
                              <th className="p-3 text-start">{t("updateProduct.step2.price")}</th>
                              <th className="p-3 text-start">{t("updateProduct.step2.stock")}</th>
                              <th className="p-3 text-start">{t("updateProduct.step2.lowStock")}</th>
                              <th className="p-3 text-start">{t("updateProduct.step2.image")}</th>
                              <th className="p-3 text-end">{t("updateProduct.step2.actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants_draft.map((v, idx) => (
                              <tr
                                key={idx}
                                className="border-t border-gray-200"
                              >
                                <td className="p-3 font-medium">
                                  {getVariantDisplayName(v)}
                                </td>
                                <td className="p-3">
                                  <InputField
                                    id={`price-${idx}`}
                                    type="number"
                                    placeholder={t("updateProduct.step2.price")}
                                    value={v.price}
                                    onChange={(e) => {
                                      const val =
                                        e &&
                                          typeof e === "object" &&
                                          "target" in e
                                          ? (
                                            e as React.ChangeEvent<HTMLInputElement>
                                          ).target.value
                                          : String(e);
                                      const updated = [...variants_draft];
                                      updated[idx].price = val;
                                      setVariants_draft(updated);
                                    }}
                                    unstyled
                                  />
                                </td>
                                <td className="p-3">
                                  <InputField
                                    id={`stock-${idx}`}
                                    type="number"
                                    placeholder={t("updateProduct.step2.stock")}
                                    value={v.stock}
                                    onChange={(e) => {
                                      const val =
                                        e &&
                                          typeof e === "object" &&
                                          "target" in e
                                          ? (
                                            e as React.ChangeEvent<HTMLInputElement>
                                          ).target.value
                                          : String(e);
                                      const updated = [...variants_draft];
                                      updated[idx].stock = val;
                                      setVariants_draft(updated);
                                    }}
                                    unstyled
                                  />
                                </td>
                                <td className="p-3">
                                  <InputField
                                    id={`threshold-${idx}`}
                                    type="number"
                                    placeholder={t("updateProduct.step2.lowStock")}
                                    value={v.low_stock_threshold}
                                    onChange={(e) => {
                                      const val =
                                        e &&
                                          typeof e === "object" &&
                                          "target" in e
                                          ? (
                                            e as React.ChangeEvent<HTMLInputElement>
                                          ).target.value
                                          : String(e);
                                      const updated = [...variants_draft];
                                      updated[idx].low_stock_threshold = val;
                                      setVariants_draft(updated);
                                    }}
                                    unstyled
                                  />
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                      <img
                                        src={variantImagePreviews[idx] || "/anonymous.png"}
                                        alt={`${getVariantDisplayName(v)} image`}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 text-xs text-subTitleColor">
                                      <span className="text-sm font-semibold text-subTitleColor">
                                        {imageLabel}
                                      </span>
                                      <span className="text-gray-500 leading-tight">
                                        {uploadHint}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => fileInputRefs.current[idx]?.click()}
                                          className="px-3 py-1 rounded-md bg-blueSite/10 text-blueSite text-xs font-medium hover:bg-blueSite/15 transition-colors"
                                        >
                                          {uploadBtnText}
                                        </button>
                                        <span className="text-[11px] text-gray-400">
                                          JPG/PNG, max 2MB
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <input
                                    id={`image-${idx}`}
                                    ref={(el) => (fileInputRefs.current[idx] = el)}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;

                                      setVariantImagePreviews((prev) => {
                                        const next = [...prev];
                                        const prevUrl = next[idx];
                                        if (prevUrl && prevUrl.startsWith("blob:")) {
                                          URL.revokeObjectURL(prevUrl);
                                        }
                                        next[idx] = URL.createObjectURL(file);
                                        return next;
                                      });

                                      const updated = [...variants_draft];
                                      updated[idx].image = file;
                                      setVariants_draft(updated);
                                    }}
                                  />
                                </td>
                                <td className="p-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = variants_draft.filter(
                                        (_, i) => i !== idx
                                      );
                                      setVariants_draft(updated);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaRegTrashCan size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Discount */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                id="discount_type"
                label={t("updateProduct.step3.discountType")}
                placeholder={t("updateProduct.step3.selectType")}
                selectorOptions={[
                  { id: "percentage", name: t("updateProduct.step3.percentage") },
                  { id: "fixed", name: t("updateProduct.step3.flatAmount") },
                ]}
                value={formData.discount_type || ""}
                onChange={handleChange("discount_type")}
                unstyled
                withFieldset
                required={false}
              />

              <div>
                <fieldset className="py-[10px] px-4 border border-gray-300 rounded-md bg-gray-50">
                  <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
                    {t("updateProduct.step3.discountValue")}
                  </legend>
                  <textarea
                    id="discount_value"
                    value={formData.discount_value}
                    onChange={(e) =>
                      handleChange("discount_value")({
                        target: { value: e.target.value },
                      })
                    }
                    className="w-full h-[24px] p-2 border-0 focus:outline-none text-sm bg-transparent resize-none overflow-hidden"
                    placeholder={t("updateProduct.step3.discountValuePlaceholder")}
                  />
                </fieldset>
              </div>
            </div>
          )}
        </StepIndicator>
      </form>

      {/* Product Preview Modal */}
      {showPreviewModal && (
        <ProductPreviewModal
          formData={formData}
          variants_draft={variants_draft}
          gallery={getCombinedGallery()}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          onClose={() => setShowPreviewModal(false)}
          onSubmit={submitProduct}
          loading={loading}
          storeId={formData.store_id}
        />
      )}
      {contextHolder}
    </div>
  );
};

// 🔹 Product Preview Modal Component
interface ProductPreviewModalProps {
  formData: FormState;
  variants_draft: Variant[];
  gallery: (File | string)[];
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  storeId: string | number | null;
}

const ProductPreviewModal = ({
  formData,
  variants_draft,
  gallery,
  currentImageIndex,
  setCurrentImageIndex,
  onClose,
  onSubmit,
  loading,
  storeId,
}: ProductPreviewModalProps) => {
  const { t } = useTranslation();
  const selectedVariants = variants_draft;
  const galleryImages = Array.isArray(gallery) ? gallery : [];
  const totalImages = galleryImages.length;

  // Fetch store data
  const { data: storeData } = useGetData({
    url: storeId ? STORE_ENDPOINT.getStoreDetails(storeId) : undefined,
  });

  const storeName = storeData?.data?.name || "Company name";

  // Get option values for display
  const getOptionValues = () => {
    if (!formData.options || formData.options.length === 0) return [];
    return formData.options.map((opt) => ({
      name: opt.name,
      values: opt.values || [],
    }));
  };

  const nextImage = () => {
    if (totalImages > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const prevImage = () => {
    if (totalImages > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  // Get image URL - handle both File objects and URLs
  const getImageUrl = (image: File | string | null) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (typeof image === "string") {
      return image;
    }
    return "/defaulLogo.png";
  };

  const currentImage = galleryImages[currentImageIndex];
  const currentImageUrl = currentImage
    ? getImageUrl(currentImage)
    : "/defaulLogo.png";

  // Calculate price with discount
  const calculatePrice = () => {
    if (selectedVariants.length > 0) {
      const prices = selectedVariants.map((v) => parseFloat(v.price) || 0);
      const minPrice = Math.min(...prices);
      if (formData.has_discount && formData.discount_value) {
        if (formData.discount_type === "percentage") {
          return minPrice * (1 - parseFloat(formData.discount_value) / 100);
        } else {
          return Math.max(0, minPrice - parseFloat(formData.discount_value));
        }
      }
      return minPrice;
    }
    return 0;
  };

  const displayPrice = calculatePrice();

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Section - Images */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
            <div className="p-4 space-y-4 flex flex-col flex-1 overflow-y-auto">
              {/* Image Thumbnails - Above main image */}
              {totalImages > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => {
                    const isActive = idx === currentImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-24 h-16 flex-shrink-0 border transition-all bg-white shadow-sm ${isActive
                          ? "border-blueSite ring-2 ring-blue-100 shadow-md"
                          : "border-gray-200 hover:border-blueSite/60"
                          }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={t("updateProduct.preview.thumbnailAlt", { index: idx + 1 })}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex-1">
                {totalImages > 0 ? (
                  <div className="aspect-square">
                    <img
                      src={currentImageUrl}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center text-textColor">
                    {t("updateProduct.preview.noImagesAvailable")}
                  </div>
                )}
              </div>

              {/* Navigation and Counter */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-subTitleColor">
                  {String(currentImageIndex + 1).padStart(2, "0")}{" "}
                  <span className="text-[#338572]">
                    {t("updateProduct.preview.of")} {String(totalImages).padStart(2, "0")}
                  </span>
                </span>

                {totalImages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={prevImage}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-blueSite text-blueSite bg-white hover:bg-[#E6F0ED] transition"
                      aria-label="Previous image"
                    >
                      <FaArrowLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blueSite text-textWhiteColor hover:bg-[#338572] transition"
                      aria-label="Next image"
                    >
                      <FaArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-white flex flex-col gap-3">
              <button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-blueSite hover:bg-[#338572] text-textWhiteColor font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("updateProduct.preview.submitting") : t("updateProduct.preview.confirmUpdate")}
              </button>
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-subTitleColor font-semibold py-3 px-6 rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                {t("updateProduct.preview.cancel")}
              </button>
            </div>
          </div>
          {/* Right Section - Product Details */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6">
              {/* Top Row: Product Name and Price */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-subTitleColor">
                    {formData.name || "Product Name"}
                  </h1>
                </div>

                <div className="text-right">
                  <div className="text-sm text-subTitleColor mb-1">{t("updateProduct.preview.price")}</div>
                  <div>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "#004838" }}
                    >
                      ${displayPrice.toLocaleString()}
                    </span>
                    {formData.has_discount && formData.discount_value && (
                      <span className="ml-2 text-lg text-textColor line-through">
                        $
                        {selectedVariants.length > 0
                          ? Math.min(
                            ...selectedVariants.map(
                              (v) => parseFloat(v.price) || 0
                            )
                          ).toLocaleString()
                          : "0"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Second Row: Listed By and Quantity */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-subTitleColor">{t("updateProduct.preview.listedBy")}</span>
                  <span className="font-semibold text-subTitleColor">
                    {storeName}
                  </span>
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.2671 5.89015L13.2749 4.73739C13.0852 4.51851 12.932 4.10994 12.932 3.81811V2.57781C12.932 1.80445 12.2972 1.16971 11.5239 1.16971H10.2836C9.99903 1.16971 9.58316 1.01649 9.36429 0.8268L8.21154 -0.165439C7.70812 -0.595895 6.88369 -0.595895 6.37298 -0.165439L5.2275 0.834096C5.00862 1.01649 4.59275 1.16971 4.30822 1.16971H3.04603C2.27267 1.16971 1.63792 1.80445 1.63792 2.57781V3.82541C1.63792 4.10994 1.48471 4.51851 1.30231 4.73739L0.317371 5.89744C-0.10579 6.40086 -0.10579 7.218 0.317371 7.72141L1.30231 8.88146C1.48471 9.10033 1.63792 9.5089 1.63792 9.79344V11.041C1.63792 11.8144 2.27267 12.4491 3.04603 12.4491H4.30822C4.59275 12.4491 5.00862 12.6024 5.2275 12.792L6.38027 13.7843C6.88369 14.2147 7.70812 14.2147 8.21883 13.7843L9.37158 12.792C9.59046 12.6024 9.99903 12.4491 10.2909 12.4491H11.5312C12.3045 12.4491 12.9393 11.8144 12.9393 11.041V9.80074C12.9393 9.5162 13.0925 9.10033 13.2822 8.88146L14.2744 7.72871C14.6976 7.22529 14.6976 6.39356 14.2671 5.89015ZM10.3273 5.43051L6.80343 8.95441C6.70129 9.05656 6.56267 9.11492 6.41675 9.11492C6.27083 9.11492 6.13221 9.05656 6.03007 8.95441L4.26444 7.18881C4.05286 6.97723 4.05286 6.62703 4.26444 6.41545C4.47602 6.20387 4.82622 6.20387 5.0378 6.41545L6.41675 7.79437L9.55398 4.65714C9.76556 4.44555 10.1158 4.44555 10.3273 4.65714C10.5389 4.86872 10.5389 5.21892 10.3273 5.43051Z"
                      fill="#004838"
                    />
                  </svg>
                  <span className="text-sm" style={{ color: "#004838" }}>
                    {t("updateProduct.preview.verifiedSeller")}
                  </span>
                </div>

                {selectedVariants.length > 0 && (
                  <div className="text-right">
                    <span style={{ color: "#004838" }}>{t("updateProduct.preview.quantity")}</span>{" "}
                    <span className="text-green-600 font-semibold">
                      {selectedVariants.reduce(
                        (sum, v) => sum + (parseInt(v.stock) || 0),
                        0
                      )}{" "}
                      {t("updateProduct.preview.leftInStock")}
                    </span>
                  </div>
                )}
              </div>

              {/* Options Display */}
              {getOptionValues().map((option, idx) => (
                <div key={idx} className="mb-4 flex gap-2">
                  <div className="text-[#004838] mb-2">{option.name}:</div>
                  <div className="flex flex-wrap gap-2">
                    {option.name.toLowerCase() === "color"
                      ? option.values.map((val, valIdx) => (
                        <div
                          key={valIdx}
                          className="size-8 rounded-full border-2 border-gray-300"
                          style={{
                            backgroundColor:
                              val.toLowerCase() === "white"
                                ? "#fff"
                                : val.toLowerCase() === "black"
                                  ? "#000"
                                  : val.toLowerCase() === "red"
                                    ? "#ff0000"
                                    : val.toLowerCase() === "blue"
                                      ? "#0000ff"
                                      : val.toLowerCase() === "green"
                                        ? "#008000"
                                        : val.toLowerCase() === "yellow"
                                          ? "#ffff00"
                                          : val.toLowerCase() === "purple"
                                            ? "#800080"
                                            : val.toLowerCase() === "pink"
                                              ? "#ffc0cb"
                                              : val.toLowerCase() === "orange"
                                                ? "#ffa500"
                                                : val.toLowerCase() === "gray"
                                                  ? "#808080"
                                                  : "#ccc",
                          }}
                          title={val}
                        />
                      ))
                      : option.values.map((val, valIdx) => (
                        <button
                          key={valIdx}
                          className="flex justify-center items-center size-8 aspect-square bg-[#FAFAFA] rounded-full hover:shadow-lg hover:bg-white text-sm transition-all duration-300"
                        >
                          {val}
                        </button>
                      ))}
                  </div>
                </div>
              ))}

              {/* Description */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#004838] mb-2">
                  {t("updateProduct.preview.description")}
                </h3>
                <p className="text-subTitleColor text-sm leading-relaxed">
                  {formData.description || t("updateProduct.preview.noDescriptionProvided")}
                </p>
              </div>

              {/* Specifications */}
              {formData.specifications && formData.specifications.trim() && (
                <div className="mb-4">
                  <h3 className="font-semibold text-[#004838] mb-2">
                    {t("updateProduct.preview.specifications")}
                  </h3>
                  <p className="text-subTitleColor text-sm leading-relaxed whitespace-pre-line">
                    {formData.specifications}
                  </p>
                </div>
              )}

              {/* {t("updateProduct.step1.additionalFeatures")} */}
              {formData.additional_features &&
                formData.additional_features.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#004838] mb-2">
                      {t("updateProduct.step1.additionalFeatures")}:
                    </h3>
                    <ul className="list-disc list-inside text-subTitleColor text-sm space-y-1">
                      {formData.additional_features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Variants */}
              {selectedVariants.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-[#004838] mb-2">
                    {t("updateProduct.preview.variants")}
                  </h3>
                  <ul className="list-disc list-inside text-subTitleColor text-sm space-y-1">
                    {selectedVariants.map((variant, idx) => (
                      <li key={idx}>
                        {t("updateProduct.preview.variant")} {idx + 1}:{" "}
                        {Array.isArray(variant.option_values)
                          ? variant.option_values.join(" / ")
                          : ""}{" "}
                        - {t("updateProduct.preview.price")}: ${variant.price || "0"}, {t("updateProduct.preview.stock")}:{" "}
                        {variant.stock || "0"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;

