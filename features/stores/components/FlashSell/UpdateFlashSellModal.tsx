'use client';

import React, { useState, useEffect, useMemo } from "react";
import Modal from "../../../../components/ui/Modal";
import StepIndicator from "../../../../components/ui/StepIndicator";
import useFormData from "@/lib/Hooks/useFormData";
import {
  PRODUCTS_ENDPOINT,
  FLASHSELL_ENDPOINT,
} from "@/shared/constants/urls";
import useGetData from "@/lib/api/useGetData";
;
import usePostData from "@/lib/api/usePostData";
import { isHexColor } from "@/lib/utils/helper";

import FlashSellCreateFirstStep from "./FlashSellCreateFirstStep";
import FlashSellCreateSecondStep from "./FlashSellCreateSecondStep";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useParams } from "next/navigation";

import { VariantDraft  ,
   
  FlashSellFormData,
  FlashSellProduct,

  SelectedProduct,
  VariantDraftItem,
  ProductVariant,
  CreateFlashSellModalProps,
  FlashSellDetails,
  FlashSellDetailsApiResponse,} from "../../types/flashSell";

interface UpdateFlashSellModalProps {
  open?: boolean;
  handleClose: () => void;
  flashSell_id?: string | number;
  refetch?: () => void;
  messageApi: any;
}

const initialFormState: FlashSellFormData = {
  name: "",
  description: "",
  start_date: "", // "YYYY-MM-DD HH:mm:ss"
  end_date: "",
  max_per_user: 1,
  discount_type: "",
  discount_value: 0,
  status: "active",
  products: [], // [{ product_id: number, variants: number[] }]
};

const DRAFT_KEY = "flashsell_variant_draft";
const FORM_KEY = "flashsell_form_draft";

const UpdateFlashSellModal: React.FC<UpdateFlashSellModalProps> = ({
  open = false,
  handleClose,
  flashSell_id,
  refetch,
  messageApi
}) => {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const id = params.id || "";

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [variantDraft, setVariantDraft] = useState<VariantDraft>({});
  const [selectedProducts,setSelectedProducts] = useState<SelectedProduct[]>([])
  const [firstStepSubmit,setFirstStepSubmit] = useState(false)
  const [secondStepSubmited,setSecondStepSubmited] = useState(false)
  const { formData, handleChange, handleArrayChange, resetForm,isValid, setFormData ,handleAddError,errors} =
    useFormData(initialFormState);
  
  // Check if first step is valid (all errors empty except 'products')
  const firstStepIsValid = Object.keys(errors).every(key => 
    key === 'products' || !errors[key]
  );

  const {
    data: flashSellDetails,
    loading,
    error,
    refetch: refetchFlashDetails,
  } = useGetData<FlashSellDetailsApiResponse>({
    url: flashSell_id ? FLASHSELL_ENDPOINT.getDetails(flashSell_id) : '',
    enabled: !!flashSell_id
  });
  const { postData, loading: posting ,contextHolder : PostContext} = usePostData(
    flashSell_id ? FLASHSELL_ENDPOINT.update(flashSell_id) : ''
  );


  useEffect(()=>{
    console.log("flashSell Details",flashSellDetails)
  },[flashSellDetails])

  
    // 🔹 products list

// 🔹 product details (variants)

const flashSell = flashSellDetails?.data as FlashSellDetails | undefined;

  useEffect(() => {
    console.log("flashSell updateee ", flashSellDetails);
    if (flashSell && flashSell.id) {

      const draftProducts = flashSell?.products?.map((pro: any) => ({
        id: pro.id,
        name: pro.name
      })) || []
      setSelectedProducts(draftProducts)
      setFormData({
        name: flashSell.name || "",
        description: flashSell.description || "",
        start_date: flashSell.start_date
          ? flashSell.start_date.replace(" ", "T") // convert to datetime-local format
          : "",
        end_date: flashSell.end_date
          ? flashSell.end_date.replace(" ", "T")
          : "",
        max_per_user: flashSell.max_per_user || 1,
        discount_type: flashSell.discount_type || "",
        discount_value: flashSell.discount_value || 0,
        status: flashSell.status || "active",
        products:
          flashSell.products?.map((p: any) => ({
            product_id: p.id,
            variants: p.variants?.map((v: any) => v.id) || [],
          })) || [],
      });

// optional: prefill variantDraft to show selected variants in Step 3
      const draft: VariantDraft = {};

      flashSell.products?.forEach((p: any) => {
        draft[p.id.toString()] = {};

        p.variants?.forEach((v: any) => {
          const optionValues = v.option_values || [];

          // Build label like your original: "Red / XL / Cotton"
          const label =
            optionValues.map((o) => o.value).join(" / ") || `Variant #${v.id}`;

          // pull hex color using the SAME helper as your main component
          const colorValue =
            optionValues.find((o) => isHexColor(o.value))?.value || null;

          draft[p.id.toString()][v.id.toString()] = {
            label,
            option_values: optionValues,
            price: v.price,
            sku: v.sku,
            stock: v.stock,
            image: v.image,
            color: colorValue, // ← added exactly like your structure
          };
        });
      });

      setVariantDraft(draft);
    }
  }, [flashSell, setFormData, flashSellDetails]);

useEffect(() => {
    if (Object.keys(variantDraft).length > 0) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(variantDraft));
    }
  }, [variantDraft]);

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      localStorage.setItem(FORM_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    if (!open) return;
  
    const savedVariantDraft = localStorage.getItem(DRAFT_KEY);
    const savedFormDraft = localStorage.getItem(FORM_KEY);
  
    if (savedVariantDraft) {
      try {
        setVariantDraft(JSON.parse(savedVariantDraft));
      } catch (e) {
        console.error("Invalid variant draft", e);
      }
    }
  
    if (savedFormDraft) {
      try {
        setFormData(JSON.parse(savedFormDraft));
      } catch (e) {
        console.error("Invalid form draft", e);
      }
    }
  }, [open]);
  const clearDrafts = () => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(FORM_KEY);
  };

  // reset draft when modal fully closes
  useEffect(() => {
    if (!open) {
      setVariantDraft({});
      setStep(1);
      clearDrafts();
    }
  }, [open]);

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
        // refetch?.();
        resetForm();
        setVariantDraft({});
        messageApi.success(t("flashSell.update.success"));
        handleClose();
      },
       onError: (err:any) => {
          // handleClose();
          const resData = err?.response?.data;
          messageApi.error(resData?.message || t("flashSell.update.error"))
        },
      showMessage:false
    });
  };


  // ✅ helper: update both formData.products and variantDraft consistently
  const toggleVariantSelection = (productId: string, variant: any, name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectedProducts(prev=>[...prev,{id:productId,name}])
    // 1) update formData.products
    handleArrayChange(
      "products",
      (() => {
        const prev = formData.products || [] as FlashSellProduct[];
        const existing = prev.find((p: FlashSellProduct) => p.product_id === productId);

        if (checked) {
          if (existing) {
            return prev.map((p: FlashSellProduct): FlashSellProduct =>
              p.product_id === productId
                ? { ...p, variants: [...new Set([...p.variants, variant.id])] }
                : p
            );
          } else {
            return [...prev, { product_id: productId, variants: [variant.id] }] as FlashSellProduct[];
          }
        } else {
          if (!existing) return prev;
          const updated = existing.variants.filter((v: string) => v !== variant.id);
          if (updated.length === 0) {
            return prev.filter((p: FlashSellProduct) => p.product_id !== productId);
          }
          return prev.map((p: FlashSellProduct): FlashSellProduct =>
            p.product_id === productId ? { ...p, variants: updated } : p
          );
        }
      })()
    );

    // 2) update variantDraft
    setVariantDraft((prev) => {
      const optionValues = variant?.option_values || [] as any;

      const label =
        optionValues.map((v) => v.value).join(" / ") ||
        `Variant #${variant.id}`;

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

  const handleStepChange = (st: number)=>{
    if(!firstStepIsValid && st > 1){
      setFirstStepSubmit(true)
      return
    }
    if(!isValid && st > 2){
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
    className=" text-center h-[95vh]"
    style={{ maxWidth: "90%" }} 
    showLine={false} 
    padding="py-0 px-4"
  >
    <div className="text-left overflow-x-hidden  ">
      <h2 className="text-xl font-semibold mb-1">
        {t("flashSell.create.title")}
      </h2>
      {PostContext}
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
              <FlashSellCreateFirstStep formData={formData} handleAddError={handleAddError} handleChange={handleChange} errors={errors} isSubmited={firstStepSubmit}/>
          
          )}

          {/* STEP 2 */}
          {step === 2 && (
             <FlashSellCreateSecondStep step={step} formData={formData} handleAddError={handleAddError} errors={errors}  toggleVariantSelection={toggleVariantSelection} isSubmited={secondStepSubmited} params={params}/>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 max-h-[350px] overflow-auto dropDown px-3">
              {formData.products.length === 0 ? (
                <p className="text-textColor text-sm">
                  {t("flashSell.review.empty")}
                </p>
              ) : (
                formData.products.map((prod) => {
                  const productName =selectedProducts.find((p)=>p.id===prod.product_id)?.name || `Product #${prod.product_id}`;

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

export default UpdateFlashSellModal;
