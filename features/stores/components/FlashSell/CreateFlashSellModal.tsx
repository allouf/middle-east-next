'use client';

import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import StepIndicator from "@/components/ui/StepIndicator";

import { Search } from "lucide-react";
import useFormData from "@/lib/Hooks/useFormData";
import {
  PRODUCTS_ENDPOINT,
  FLASHSELL_ENDPOINT,
} from "@/shared/constants/urls";

;
import usePostData from "@/lib/api/usePostData";
import { isHexColor } from "@/lib/utils/helper";

import Pagination from "@/components/ui/Pagination";
import ProductSkeleton from "./ProductSkeleton";
import FlashSellCreateFirstStep from "./FlashSellCreateFirstStep";
import FlashSellCreateSecondStep from "./FlashSellCreateSecondStep";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  FlashSellFormData,
  VariantDraft,
  SelectedProduct,
  CreateFlashSellModalProps,
  ProductVariant,
  FlashSellProduct,
  FLASHSELL_STORAGE_KEYS
} from "../../types/flashSell";
import { message } from "antd";

const initialFormState: FlashSellFormData = {
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  max_per_user: null,
  discount_type: null,
  discount_value: null,
  status: "active",
  products: [],
};

const VARIANT_DRAFT_KEY = FLASHSELL_STORAGE_KEYS.VARIANT_DRAFT;
const FORM_DRAFT_KEY = FLASHSELL_STORAGE_KEYS.FORM_DRAFT;

const CreateFlashSellModal = ({ open = false, handleClose, refetch, messageApi }: CreateFlashSellModalProps) => {
  const params = useParams<{ id: string | undefined }>();
  const id = params?.id || "";
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // 🔹 draft storage for variant details to show in Step 3
  // shape: { [productId]: { [variantId]: { label, option_values, price, stock, sku, image } } }
  const [variantDraft, setVariantDraft] = useState<VariantDraft>({});
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [firstStepSubmit, setFirstStepSubmit] = useState(false);
  const [secondStepSubmited, setSecondStepSubmited] = useState(false);

  const { t } = useTranslation()

  const { formData, handleChange, handleArrayChange, resetForm, setFormData, isValid, errors, handleAddError } =
    useFormData(initialFormState);

  // Check if first step is valid (all errors empty except 'products')
  const firstStepIsValid = Object.keys(errors).every(key =>
    key === 'products' || !errors[key]
  );
  const { postData, loading: posting, contextHolder: PostContext } = usePostData(FLASHSELL_ENDPOINT.create);

  useEffect(() => {
    console.log("is Valid", isValid)

  }, [isValid])

  useEffect(() => {
    console.log("errors", errors)
  }, [errors])

  useEffect(() => {
    if (Object.keys(variantDraft).length > 0) {
      localStorage.setItem(
        VARIANT_DRAFT_KEY,
        JSON.stringify(variantDraft)
      );
    }
  }, [variantDraft]);
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      localStorage.setItem(
        FORM_DRAFT_KEY,
        JSON.stringify(formData)
      );
    }
  }, [formData]);


  useEffect(() => {
    console.log("step ", step)
  }, [step])

  useEffect(() => {
    if (!open) return;

    const savedVariantDraft = localStorage.getItem(VARIANT_DRAFT_KEY);
    const savedFormDraft = localStorage.getItem(FORM_DRAFT_KEY);

    if (savedVariantDraft) {
      try {
        setVariantDraft(JSON.parse(savedVariantDraft));
      } catch {
        console.error("Invalid variant draft");
      }
    }

    if (savedFormDraft) {
      try {
        setFormData(JSON.parse(savedFormDraft));
      } catch {
        console.error("Invalid form draft");
      }
    }
  }, [open, setFormData]);

  // reset draft when modal fully closes
  useEffect(() => {
    if (!open) {
      setVariantDraft({});
      setStep(1);
    }
  }, [open]);
  const clearDrafts = () => {
    localStorage.removeItem(VARIANT_DRAFT_KEY);
    localStorage.removeItem(FORM_DRAFT_KEY);
  };

  // ✅ submit
  const handleSubmitOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      store_id: parseInt(id),
    };
    await postData(payload, {
      onSuccess: () => {
        // toast.success("Offer created successfully!");
        clearDrafts()
        //refetch();
        resetForm();
        setVariantDraft({});
        messageApi.success(t("flashSell.create.success"))

        setTimeout(() => {
          refetch()
        }, 1000);
        handleClose();
      },
      onError: (err:any) => {
        // handleClose();
        const resData = err?.response?.data;
        messageApi.error(resData?.message || t("flashSell.create.error"))
      },
      showMessage:false
    });
  };

  // ✅ helper: update both formData.products and variantDraft consistently
  const toggleVariantSelection = (productId: string, variant: ProductVariant, name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {

    const checked = e.target.checked;

    setSelectedProducts((prev: SelectedProduct[]) => [...prev, { id: productId, name }]);

    // 1) update formData.products
    handleArrayChange(
      "products",
      (() => {
        const prev = formData.products || [];
        const existing = prev.find((p: FlashSellProduct) => p.product_id === productId);

        if (checked) {
          if (existing) {
            return prev.map((p: FlashSellProduct) =>
              p.product_id === productId
                ? { ...p, variants: [...new Set([...p.variants, variant.id])] }
                : p
            );
          } else {
            return [...prev, { product_id: productId, variants: [variant.id] }];
          }
        } else {
          if (!existing) return prev;
          const updated = existing.variants.filter((v) => v !== variant.id);
          if (updated.length === 0) {
            return prev.filter((p: FlashSellProduct) => p.product_id !== productId);
          }
          return prev.map((p: FlashSellProduct) =>
            p.product_id === productId ? { ...p, variants: updated } : p
          );
        }
      })()
    );

    // 2) update variantDraft
    setVariantDraft((prev: VariantDraft) => {
      const optionValues = variant?.option_values || [];

      const label =
        optionValues.map((v: any) => v.value).join(" / ") ||
        `${t("common.variant")} #${variant.id}`;

      // detect color
      const colorValue =
        optionValues.find((v) => isHexColor(v.value))?.value || null;

      const next = { ...prev };

      // ensure product bucket
      if (!next[productId]) next[productId] = {};

      if (checked) {
        next[productId] = {
          ...next[productId],
          [variant.id]: {
            label,
            option_values: optionValues,
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku,
            image: variant.image,
            color: colorValue, // <-- added
          },
        };
      } else {
        // remove variant
        if (next[productId]) {
          const { [variant.id]: _, ...rest } = next[productId];
          next[productId] = rest;

          // delete empty bucket
          if (Object.keys(next[productId]).length === 0) {
            const { [productId]: __, ...restAll } = next;
            return restAll;
          }
        }
      }

      return next;
    });
  };
  const handleStepChange = (st: number) => {
    if (!firstStepIsValid && st > 1) {
      setFirstStepSubmit(true)
      return
    }
    if (!isValid && st > 2) {
      setSecondStepSubmited(true)
      return
    }
    setSecondStepSubmited(false)
    setFirstStepSubmit(false)
    setStep(st);

  }

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      classNameContent=" max-h-[95vh]"
      style={{ maxWidth: "90%" }}
      showLine={false}
      padding="py-0 px-6"
    >
      <div className=" overflow-x-hidden  ">
        {PostContext}
        <h2 className="text-xl font-semibold mb-3">
          {t("flashSell.create.title")}
        </h2>

        <form onSubmit={handleSubmitOffer} className="max-h-screen">
          <StepIndicator
            step={step}
            setStep={handleStepChange}
            totalSteps={totalSteps}
            onCancel={handleClose}
            // stepLabels={[
            //   t("flashSell.steps.details"),
            //   t("flashSell.steps.products"),
            //   t("flashSell.steps.review"),
            // ]}
            loading={posting}
            margin="mb-4"

          >
            {/* STEP 1 */}
            {step === 1 && (
              <FlashSellCreateFirstStep formData={formData} handleAddError={handleAddError} handleChange={handleChange} errors={errors} isSubmited={firstStepSubmit} />
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <FlashSellCreateSecondStep step={step} formData={formData} handleAddError={handleAddError} errors={errors} toggleVariantSelection={toggleVariantSelection} isSubmited={secondStepSubmited} params={params} />

            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4 max-h-[350px] overflow-auto dropDown px-3">
                {formData.products.length === 0 ? (
                  <p className="text-textColor text-sm">
                    {t("flashSell.review.empty")}
                  </p>
                ) : (
                  formData.products.map((prod: FlashSellProduct) => {
                    const productName = selectedProducts.find((p) => p.id === prod.product_id)?.name || `${t("store.product")} #${prod.product_id}`;

                    return (
                      <div
                        key={prod.product_id}
                        className="bg-[#F8F8F8] rounded-lg p-4 shadow-sm"
                      >
                        <h4 className="font-semibold mb-2">{productName}</h4>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {prod.variants.map((variantId) => {
                            const draft =
                              variantDraft?.[prod.product_id]?.[variantId];
                            const label =
                              draft?.label || `Variant #${variantId}`;
                            const color = draft?.color; // ← the color we saved earlier (#xxxxxx)

                            // Detect if the label contains the color (hex code)
                            const isColor =
                              color && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color);

                            return (
                              <span
                                key={variantId}
                                className="bg-blueLight text-subTitleColor  px-10 py-2 rounded-md text-sm flex items-center gap-2"
                              >
                                {/* If color exists, show color square */}
                                {isColor && (
                                  <span
                                    className="inline-block w-4 h-4 rounded border"
                                    style={{ backgroundColor: color }}
                                  ></span>
                                )}

                                {label.split("/").length > 1 && isColor && <span>/</span>}

                                {/* Show the label, BUT remove the hex code from it */}
                                {isColor
                                  ? label
                                    .replace(color, "")
                                    .replace(" / ", "")
                                    .trim()
                                  : label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </StepIndicator>
        </form>
      </div>
    </Modal>
  );
};

export default CreateFlashSellModal;
