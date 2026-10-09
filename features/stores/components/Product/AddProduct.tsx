"use client";

import {
  categories,
  PRODUCTS_ENDPOINT,
} from "@/shared/constants/urls";
import useApp from "antd/es/app/useApp";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, type MutableRefObject } from "react";
import { BsStack } from "react-icons/bs";
import InputField from "../../../../components/ui/InputField";
import Modal from "../../../../components/ui/Modal";
import MultiImageUpload from "../../../../components/ui/MultiImageUpload";
import SelectField from "../../../../components/ui/SelectFiled";
import StepIndicator from "../../../../components/ui/StepIndicator";
import useFormData from "../../../../lib/Hooks/useFormData";
import usePostData from "../../../../lib/api/usePostData";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Import new sub-components
import ProductOptions from "./ProductOptions";
import ProductVariants from "./ProductVariants";
import ProductPreviewModal from "./ProductPreviewModal";

interface StepErrors {
  step1?: {
    name?: string;
    category_id?: string;
    sub_category_id?: string;
    description?: string;
    gallery?: string;
  };
  step2?: {
    options?: string;
    variants?: string;
    variantErrors?: Record<
      number,
      { price?: string; stock?: string; low_stock_threshold?: string }
    >;
  };
}

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

const AddProduct = ({
  refetch,
  handleTabChange,
}: {
  refetch?: () => void;
  handleTabChange: (tab: string) => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { message } = useApp();
  const [variants_draft, setVariants_draft] = useState<Variant[]>([]);
  // const [subCategoryError, setSubCategoryError] = useState(""); // Removed in favor of stepErrors
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDraftConfirmModal, setShowDraftConfirmModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bulkValues, setBulkValues] = useState({
    price: "",
    stock: "",
    low_stock_threshold: "",
  });

  const {
    formData,
    handleChange,
    handleArrayChange,
    resetForm,
    setFormData,
    handleAddError,
    errors,
  } = useFormData<FormState>(initialFormState);
  const { postData, loading, error, contextHolder } = usePostData(
    PRODUCTS_ENDPOINT.createProduct,
  );

  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // 🔹 Validation functions for each step
  const validateStep1 = () => {
    const errors: NonNullable<StepErrors["step1"]> = {};

    if (!formData.name || formData.name.trim() === "") {
      errors.name = t("addProduct.validation.productNameRequired");
    }

    if (!formData.category_id) {
      errors.category_id = t("addProduct.validation.categoryRequired");
    }

    // Check if category has subcategories - if sub_category_id is empty but category has children, require it
    // For now, we'll check if sub_category_id exists when category_id is set
    // If category has subcategories (sub_category_id field is available), it should be filled
    // Otherwise, category_id alone is sufficient

    if (!formData.description || formData.description.trim() === "") {
      errors.description = t("addProduct.validation.descriptionRequired");
    }

    if (!formData.gallery || formData.gallery.length === 0) {
      errors.gallery = t("addProduct.validation.imageRequired");
    }

    setStepErrors({ ...stepErrors, step1: errors });
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: NonNullable<StepErrors["step2"]> = {};
    const variantErrors: Record<
      number,
      { price?: string; stock?: string; low_stock_threshold?: string }
    > = {};
    let hasVariantErrors = false;

    if (!formData.options || formData.options.length === 0) {
      errors.options = t("addProduct.validation.optionRequired");
    }

    if (!variants_draft || variants_draft.length === 0) {
      errors.variants = t("addProduct.validation.variantRequired");
    } else {
      variants_draft.forEach((v, idx) => {
        const vErr: {
          price?: string;
          stock?: string;
          low_stock_threshold?: string;
        } = {};

        const hasPrice = v.price !== undefined && v.price !== null && v.price !== "";
        const hasStock = v.stock !== undefined && v.stock !== null && v.stock !== "";
        const hasLowStock =
          v.low_stock_threshold !== undefined &&
          v.low_stock_threshold !== null &&
          v.low_stock_threshold !== "";

        if (!hasPrice) {
          vErr.price = t("errors.required");
          hasVariantErrors = true;
        } else if (Number(v.price) <= 0) {
          vErr.price = t("addProduct.validation.priceMustBePositive");
          hasVariantErrors = true;
        }

        if (!hasStock) {
          vErr.stock = t("errors.required");
          hasVariantErrors = true;
        }

        if (hasLowStock) {
          const stockValue = Number(v.stock);
          const lowStockValue = Number(v.low_stock_threshold);
          if (
            Number.isNaN(stockValue) ||
            Number.isNaN(lowStockValue) ||
            lowStockValue >= stockValue
          ) {
            vErr.low_stock_threshold = t(
              "addProduct.validation.lowStockLessThanStock",
            );
            hasVariantErrors = true;
          }
        }

        if (Object.keys(vErr).length > 0) {
          variantErrors[idx] = vErr;
        }
      });

      if (hasVariantErrors) {
        errors.variants = t("addProduct.validation.variantIncomplete");
        errors.variantErrors = variantErrors;
      }
    }

    setStepErrors({ ...stepErrors, step2: errors });
    return Object.keys(errors).length === 0 && !hasVariantErrors;
  };

  // 🔹 Handle step navigation with validation
  const handleStepChange = (newStep: number) => {
    if (newStep > step) {
      // Moving forward - validate current step
      let isValid = true;

      if (step === 1) {
        isValid = validateStep1();
        if (!isValid) {
          message.error(t("addProduct.validation.fillRequiredFieldsStep1"));
          return;
        }
      } else if (step === 2) {
        isValid = validateStep2();
        if (!isValid) {
          message.error(t("addProduct.validation.completeRequiredFieldsStep2"));
          return;
        }
      }
    }

    // Clear errors when moving to next step
    if (newStep > step) {
      setStepErrors({});
    }

    setStep(newStep);
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // Refs and helper to auto-resize textareas (prevent overflow, enable word-wrap)
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const specsRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = (ref: MutableRefObject<HTMLTextAreaElement | null> | null) => {
    const ta = ref && ref.current;
    if (!ta) return;
    ta.style.height = "auto"; // reset to measure
    const max = 420; // max height in px
    const newHeight = Math.min(ta.scrollHeight, max);
    ta.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    resizeTextarea(descRef);
  }, [formData.description]);

  useEffect(() => {
    resizeTextarea(specsRef);
  }, [formData.specifications]);

  const [optionDraft, setOptionDraft] = useState<OptionDraft>({
    name: "",
    values: [],
    type: "",
  });
  const [newValueInput, setNewValueInput] = useState("");
  const [newFeatureInput, setNewFeatureInput] = useState("");

  useEffect(() => {
    console.log("option Draft", optionDraft);
  }, [optionDraft]);

  // 🔹 Always set store_id from URL param
  useEffect(() => {
    if (id) {
      const storeId = parseInt(id);
      if (formData.store_id !== storeId) {
        handleChange("store_id")({ target: { value: storeId } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Clear sub-category error when category is selected
  useEffect(() => {
    if (formData.category_id) {
      // Clear step 1 category & sub_category errors
      setStepErrors((prev) => {
        if (prev.step1) {
          const newStep1 = { ...prev.step1 };
          if (newStep1.category_id) delete newStep1.category_id;
          if (newStep1.sub_category_id) delete newStep1.sub_category_id;
          return {
            ...prev,
            step1: Object.keys(newStep1).length > 0 ? newStep1 : undefined,
          };
        }
        return prev;
      });
    }
  }, [formData.category_id]);

  // Clear step 1 errors when fields are filled
  useEffect(() => {
    if (step === 1) {
      setStepErrors((prev) => {
        if (!prev.step1) return prev;
        const newErrors = { ...prev.step1 };
        let hasChanges = false;

        if (formData.name && formData.name.trim() !== "" && newErrors.name) {
          delete newErrors.name;
          hasChanges = true;
        }
        if (
          formData.description &&
          formData.description.trim() !== "" &&
          newErrors.description
        ) {
          delete newErrors.description;
          hasChanges = true;
        }
        if (
          formData.gallery &&
          formData.gallery.length > 0 &&
          newErrors.gallery
        ) {
          delete newErrors.gallery;
          hasChanges = true;
        }

        if (hasChanges) {
          return {
            ...prev,
            step1: Object.keys(newErrors).length > 0 ? newErrors : undefined,
          };
        }
        return prev;
      });
    }
  }, [formData.name, formData.description, formData.gallery, step]);

  // Clear step 2 variant errors when they are filled
  useEffect(() => {
    if (step === 2 && stepErrors.step2?.variantErrors) {
      setStepErrors((prev) => {
        if (!prev.step2?.variantErrors) return prev;
        const newVariantErrors = { ...prev.step2.variantErrors };
        let hasChanges = false;

        variants_draft.forEach((v, idx) => {
          if (newVariantErrors[idx]) {
            const vErr = { ...newVariantErrors[idx] };
            let rowChanged = false;
            if (v.price && vErr.price) {
              delete vErr.price;
              rowChanged = true;
            }
            if (v.stock && vErr.stock) {
              delete vErr.stock;
              rowChanged = true;
            }
            if (vErr.low_stock_threshold) {
              const hasLowStockValue =
                v.low_stock_threshold !== undefined &&
                v.low_stock_threshold !== null &&
                v.low_stock_threshold !== "";
              const stockValue = Number(v.stock);
              const lowStockValue = Number(v.low_stock_threshold);

              if (
                !hasLowStockValue ||
                (!Number.isNaN(stockValue) &&
                  !Number.isNaN(lowStockValue) &&
                  lowStockValue < stockValue)
              ) {
                delete vErr.low_stock_threshold;
                rowChanged = true;
              }
            }

            if (rowChanged) {
              if (Object.keys(vErr).length === 0) {
                delete newVariantErrors[idx];
              } else {
                newVariantErrors[idx] = vErr;
              }
              hasChanges = true;
            }
          }
        });

        if (hasChanges) {
          const newStep2 = { ...prev.step2 };
          if (Object.keys(newVariantErrors).length > 0) {
            newStep2.variantErrors = newVariantErrors;
          } else {
            delete newStep2.variantErrors;
            // Also clear the general variants error if all individual errors are gone
            if (newStep2.variants) delete newStep2.variants;
          }

          return {
            ...prev,
            step2: Object.keys(newStep2).length > 0 ? newStep2 : undefined,
          };
        }
        return prev;
      });
    }
  }, [variants_draft, step]);

  // Handle sub-category click - prevent dropdown if category not selected
  const handleSubCategoryClick = (e: any) => {
    if (!formData.category_id) {
      e.preventDefault();
      e.stopPropagation();
      setStepErrors((prev) => ({
        ...prev,
        step1: {
          ...prev.step1,
          sub_category_id: t("addProduct.validation.chooseMainCategoryFirst"),
        },
      }));
      return false;
    }
    // Clear sub-category error if any
    if (stepErrors.step1?.sub_category_id) {
      setStepErrors((prev) => {
        if (!prev.step1) return prev;
        const newStep1 = { ...prev.step1 };
        delete newStep1.sub_category_id;
        return {
          ...prev,
          step1: Object.keys(newStep1).length > 0 ? newStep1 : undefined,
        };
      });
    }
    return true;
  };

  useEffect(() => {
    const mappedVariants = variants_draft.map((v) => ({
      option_values: v.option_values,
      price: v.price,
      stock: v.stock,
      low_stock_threshold: v.low_stock_threshold,
      image: v.image,
    }));

    handleArrayChange("variants", mappedVariants);
  }, [variants_draft]);

  // 🔹 Build FormData with correct structure
  const buildFormData = (statusOverride: "active" | "draft" | null = null) => {
    const formDataObj = new FormData();
    const storeId = id ? parseInt(id) : formData.store_id;

    // Simple fields
    formDataObj.append("name", formData.name);
    formDataObj.append("store_id", `${storeId}`);

    // Category: use sub_category_id if exists, else category_id
    const categoryId = formData.sub_category_id || formData.category_id;
    formDataObj.append("category_id", categoryId);

    formDataObj.append("description", formData.description);
    formDataObj.append("specifications", formData.specifications || "");
    // Use statusOverride if provided, otherwise use formData.status or default to "active"
    formDataObj.append("status", statusOverride || formData.status || "active");

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

    // Options (two-dimensional array)
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
                value,
              );
            }
          });
        }
      });
    }

    // Variants (complex nested structure)
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
            variant.low_stock_threshold,
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
                optValue,
              );
            }
          });
        }
      });
    }

    return formDataObj;
  };

  // 🔹 Submit handler - always shows preview modal before submitting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only show modal on the last step (step 3)
    if (step !== totalSteps) {
      return;
    }

    // Ensure store_id is always set from URL parameter
    const storeId = id ? parseInt(id) : formData.store_id;
    if (!storeId) {
      message.error(t("addProduct.messages.storeIdRequired"));
      return;
    }

    // Always show preview modal before submitting
    setShowPreviewModal(true);
  };

  // 🔹 Actual product submission
  const submitProduct = async () => {
    const storeId = id ? parseInt(id) : formData.store_id;
    if (!storeId) {
      message.error(t("addProduct.messages.storeIdRequired"));
      return;
    }

    // Build FormData
    const submitFormData = buildFormData();

    await postData(submitFormData, {
      onSuccess: () => {
        setFormData(initialFormState);
        console.log("succeed");
        setShowPreviewModal(false);
        // Navigate to products page
        const storeId = id ? parseInt(id) : formData.store_id;
        setTimeout(() => {
          router.push(
            storeId ? `/stores/${storeId}/management?tab=products_managment` : "/",
          );
          refetch?.();
        }, 1000);
      },
    });
  };

  // 🔹 Handle cancel - navigate back to store page
  const handleCancel = () => {
    const storeId = id ? parseInt(id) : formData.store_id;
    if (storeId) {
      handleTabChange("products_managment");
      // router.push(`/stores/${storeId}/management?tab=products_managment`);
    } else {
      router.push("/"); // Go back if no store ID
    }
  };

  // 🔹 Handle save as draft - show confirmation modal
  const handleSaveDraft = () => {
    setShowDraftConfirmModal(true);
  };

  // 🔹 Actually save the product as draft
  const confirmSaveDraft = async () => {
    const storeId = id ? parseInt(id) : formData.store_id;
    if (!storeId) {
      message.error(t("addProduct.messages.storeIdRequired"));
      setShowDraftConfirmModal(false);
      return;
    }

    // Build FormData with draft status
    const submitFormData = buildFormData("draft");

    await postData(submitFormData, {
      showMessage: false, // Disable default Swal messages, we'll use toast
      onSuccess: () => {
        setFormData(initialFormState);
        message.success(t("addProduct.messages.productSavedAsDraft"));
        setShowDraftConfirmModal(false);
        // Navigate to products page
        const storeId = id ? parseInt(id) : formData.store_id;
        console.log("shoul navigate");
        handleTabChange("products_managment");
        refetch?.();
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save draft";
        message.error(errorMessage);
        setShowDraftConfirmModal(false);
      },
    });
  };

  const handleBulkApply = () => {
    if (
      !variants_draft.length ||
      (!bulkValues.price &&
        !bulkValues.stock &&
        !bulkValues.low_stock_threshold)
    ) {
      return;
    }

    let invalidLowStock = false;

    const updatedVariants = variants_draft.map((v) => {
      const nextPrice =
        bulkValues.price !== undefined && bulkValues.price !== ""
          ? bulkValues.price
          : v.price;
      const nextStock =
        bulkValues.stock !== undefined && bulkValues.stock !== ""
          ? bulkValues.stock
          : v.stock;
      const nextLowStock =
        bulkValues.low_stock_threshold !== undefined &&
        bulkValues.low_stock_threshold !== ""
          ? bulkValues.low_stock_threshold
          : v.low_stock_threshold;

      if (
        nextLowStock !== undefined &&
        nextLowStock !== null &&
        nextLowStock !== ""
      ) {
        const stockValue = Number(nextStock);
        const lowStockValue = Number(nextLowStock);
        if (
          Number.isNaN(stockValue) ||
          Number.isNaN(lowStockValue) ||
          lowStockValue >= stockValue
        ) {
          invalidLowStock = true;
        }
      }

      return {
        ...v,
        price: nextPrice,
        stock: nextStock,
        low_stock_threshold: nextLowStock,
      };
    });

    if (invalidLowStock) {
      message.error(t("addProduct.validation.lowStockLessThanStock"));
      return;
    }

    setVariants_draft(updatedVariants);
    message.success(t("addProduct.step2.valuesApplied"));
    // Optional: Clear bulk inputs after apply
    // setBulkValues({ price: "", stock: "", low_stock_threshold: "" });
  };

  return (
    <div className="shadow-xl rounded-3xl p-6">
      <h2 className="sm:text-2xl text-[18px] font-semibold mb-6">
        {t("addProduct.title")}
      </h2>

      <form onSubmit={handleSubmit}>
        <StepIndicator
          step={step}
          setStep={handleStepChange}
          totalSteps={totalSteps}
          loading={loading}
          stepLabels={[
            t("addProduct.stepLabels.information"),
            t("addProduct.stepLabels.variants"),
            t("addProduct.stepLabels.discount"),
          ]}
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
        >
          {/* 🔸 STEP 1 — Product Information */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <InputField
                    id="name"
                    type="text"
                    label={t("addProduct.step1.productName")}
                    value={formData.name}
                    onChange={handleChange("name")}
                    unstyled
                    withFieldset
                    error={stepErrors.step1?.name}
                  />
                  {/* Error handled by InputField prop */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SelectField
                    id="category_id"
                    label={t("addProduct.step1.categories")}
                    value={formData.category_id}
                    onChange={handleChange("category_id")}
                    url={`${categories}?per_page=100`}
                    unstyled
                    withFieldset
                    placeholder={t("addProduct.step1.selectCategory")}
                    error={stepErrors.step1?.category_id}
                  />
                  {/* Error handled by SelectField prop */}
                </div>
                <div>
                  <SelectField
                    id="sub_category_id"
                    label={t("addProduct.step1.subCategories")}
                    value={formData.sub_category_id}
                    onChange={handleChange("sub_category_id")}
                    url={
                      formData.category_id
                        ? `/categories/childrens/${formData.category_id}?per_page=100`
                        : undefined
                    }
                    unstyled
                    withFieldset
                    error={stepErrors.step1?.sub_category_id}
                    placeholder={t("addProduct.step1.selectSubCategory")}
                    onMouseDown={handleSubCategoryClick}
                    onClick={handleSubCategoryClick}
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
                  label={t("addProduct.step1.images")}
                  acceptedTypes={['image/jpg', 'image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/avi', 'video/quicktime']}
                />
                {stepErrors.step1?.gallery && (
                  <p className="mt-1 text-sm text-red-500 font-semibold ml-4">
                    {stepErrors.step1.gallery}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specifications Field */}
                <div>
                  <fieldset className="py-[10px] px-4 border border-gray-300 rounded-md bg-gray-50">
                    <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
                      {t("addProduct.step1.specifications")}
                    </legend>
                      <textarea
                        id="specifications"
                        ref={specsRef}
                        value={formData.specifications}
                        onChange={(e) =>
                          handleChange("specifications")({
                            target: { value: e.target.value },
                          })
                        }
                        onInput={() => resizeTextarea(specsRef)}
                        className="w-full min-h-[72px] max-h-[420px] p-2 border-0 focus:outline-none text-sm bg-transparent resize-y overflow-auto whitespace-pre-wrap break-words"
                        placeholder={t(
                          "addProduct.step1.specificationsPlaceholder",
                        )}
                      />
                  </fieldset>
                </div>

                {/* Description Field */}
                <div>
                  <fieldset
                    className={`py-[10px] px-4 border rounded-md bg-gray-50 ${
                      stepErrors.step1?.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <legend
                      className={`px-2 font-semibold sm:text-sm text-[12px] ${
                        stepErrors.step1?.description
                          ? "text-red-500"
                          : "text-blueSite"
                      }`}
                    >
                      {t("addProduct.step1.description")}
                    </legend>
                    <textarea
                      id="description"
                      ref={descRef}
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description")({
                          target: { value: e.target.value },
                        })
                      }
                      onInput={() => resizeTextarea(descRef)}
                      className="w-full min-h-[72px] max-h-[420px] p-2 border-0 focus:outline-none text-sm bg-transparent resize-y overflow-auto whitespace-pre-wrap break-words"
                      placeholder={t("addProduct.step1.descriptionPlaceholder")}
                    />
                  </fieldset>
                  {stepErrors.step1?.description && (
                    <p className="mt-1 text-sm text-red-500 font-semibold ml-4">
                      {stepErrors.step1.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <fieldset className="py-2 px-4 border border-gray-300 rounded-md">
                  <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
                    {t("addProduct.step1.additionalFeatures")}
                  </legend>
                  <div className="flex flex-col gap-2">
                    {/* Display existing features as chips */}
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
                                        (_, i) => i !== index,
                                      );
                                    handleArrayChange(
                                      "additional_features",
                                      updated,
                                    );
                                  }}
                                  className="ml-1 bg-red-500 text-textWhiteColor rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors p-0 flex-shrink-0"
                                  aria-label="Remove feature"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                    {/* Input field and Add button */}
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
                        placeholder={t("addProduct.step1.writeFeatureHere")}
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
                        {t("addProduct.step1.addFeature")}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* 🔸 STEP 2 — Product Variants */}
          {step === 2 && (
            <div className="space-y-8">
              <ProductOptions
                formData={formData}
                optionDraft={optionDraft}
                setOptionDraft={setOptionDraft}
                newValueInput={newValueInput}
                setNewValueInput={setNewValueInput}
                handleArrayChange={handleArrayChange}
                setStepErrors={setStepErrors}
                stepErrors={stepErrors}
                COMMON_COLORS={COMMON_COLORS}
                t={t}
              />

              <ProductVariants
                formData={formData}
                variantsDraft={variants_draft}
                setVariantsDraft={setVariants_draft}
                bulkValues={bulkValues}
                setBulkValues={setBulkValues}
                handleBulkApply={handleBulkApply}
                generateCombinations={generateCombinations}
                stepErrors={stepErrors}
                variantErrors={stepErrors.step2?.variantErrors}
                t={t}
              />
            </div>
          )}

          {/* 🔸 STEP 3 — Discount */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-2">
              <p className="text-gray-500 text-sm mb-6 md:col-span-2">
                {t("addProduct.step3.notRequired")}
              </p>
              <SelectField
                id="discount_type"
                label={t("addProduct.step3.discountType")}
                placeholder={t("addProduct.step3.selectType")}
                selectorOptions={[
                  { id: "percentage", name: t("addProduct.step3.percentage") },
                  { id: "fixed", name: t("addProduct.step3.flatAmount") },
                ]}
                value={formData.discount_type || ""}
                onChange={handleChange("discount_type")}
                unstyled
                withFieldset
                required={false}
              />

              <div>
                {formData.discount_type == "percentage" ? (
                  <InputField
                    id="discount_value"
                    label={t("labels.discount_value")}
                    type="number"
                    placeholder={t("flashSell.fields.discountValue")}
                    className={"py-1"}
                    value={formData.discount_value}
                    onChange={handleChange("discount_value")}
                    unstyled
                    withFieldset
                    handleAddError={handleAddError}
                    formErrors={errors}
                    validate={true}
                    conditions={{ number: { min: 0, max: 100 } }}
                  />
                ) : (
                  <InputField
                    id="discount_value"
                    label={t("labels.discount_value")}
                    type="number"
                    className={"py-1"}
                    placeholder={t("flashSell.fields.discountValue")}
                    value={formData.discount_value}
                    onChange={handleChange("discount_value")}
                    unstyled
                    withFieldset
                    handleAddError={handleAddError}
                    formErrors={errors}
                    validate={true}
                  />
                )}
              </div>
            </div>
          )}
        </StepIndicator>
      </form>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        formData={formData}
        variants_draft={variants_draft}
        gallery={formData.gallery}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSubmit={submitProduct}
        loading={loading}
        storeId={id ? parseInt(id) : formData.store_id}
      />

      {/* Save as Draft Confirmation Modal */}
      <Modal
        isOpen={showDraftConfirmModal}
        onClose={() => setShowDraftConfirmModal(false)}
        className="p-0"
        style={{ maxWidth: "800px", width: "90%" }}
        showLine={false}
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div
              className="p-6 rounded-full"
              style={{ backgroundColor: `#00664F20` }}
            >
              <BsStack size={50} color={"#00664F"} />
            </div>
          </div>
          <div className="text-lg text-[#323232] mb-8">
            {t("addProduct.draftModal.title")}
          </div>
          <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
            <button
              onClick={() => setShowDraftConfirmModal(false)}
              className="py-3 rounded-[10px] bg-[#FBFBFB] text-[#323232] font-semibold hover:bg-[#FBFBFB] transition origin-center"
            >
              {t("addProduct.draftModal.cancel")}
            </button>
            <button
              onClick={confirmSaveDraft}
              disabled={loading}
              className="py-3 rounded-[10px] bg-[#00664F] text-textWhiteColor font-semibold hover:bg-[#00664F]/80 transition disabled:opacity-50 origin-center"
            >
              {loading
                ? t("addProduct.draftModal.saving")
                : t("addProduct.draftModal.confirm")}
            </button>
          </div>
        </div>
      </Modal>
      {contextHolder}
    </div>
  );
};

export default AddProduct;
