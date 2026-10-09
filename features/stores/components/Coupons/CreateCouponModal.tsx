'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import StepIndicator from "@/components/ui/StepIndicator";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import useFormData from "@/lib/Hooks/useFormData";
import {
  PRODUCTS_ENDPOINT,
  COUPONS_ENDPOINT,
  categories,
} from "@/shared/constants/urls";
import usePostData from "@/lib/api/usePostData";
import { useTranslation } from "@/lib/i18n/useTranslation";
import MultiSelectField from '@/components/ui/MultiSelectField';
import { Product, Coupon } from '@/features/stores/types/coupons';
import { FaArrowRightLong } from 'react-icons/fa6';
import MultiSelectFieldWithSearch from '@/components/ui/MultiSelectFieldWithSearch';

interface CreateCouponModalProps {
  open?: boolean;
  handleClose: () => void;
  refetch?: () => void;
  messageApi?: any;
}

interface CreateCouponFormData {
  code: string;
  discount_type: Coupon['discount_type'];
  discount_value: string;
  min_cart_amount: string;
  expires_at: string;
  max_usage_count: string;
  max_usage_per_user: string;
  scope: Coupon['scope'];
  categories: (string | number)[];
  products: (string | number)[]
}

interface ProductsResponse {
  data: {
    products: Product[];
  };
}

const initialFormState: CreateCouponFormData = {
  code: "",
  discount_type: "percentage",
  discount_value: "",
  min_cart_amount: "",
  expires_at: "",
  max_usage_count: "",
  max_usage_per_user: "",
  scope: "all",
  categories: [],
  products: []
};

const CreateCouponModal = ({ open = false, handleClose, refetch, messageApi }: CreateCouponModalProps) => {
  const params = useParams<{ id: string }>();
  const id = params.id || "";
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [search, setSearch] = useState("");

  const { formData, handleChange, handleArrayChange, resetForm, handleAddError, errors } =
    useFormData<CreateCouponFormData>(initialFormState);
  const { postData, loading: posting } = usePostData(COUPONS_ENDPOINT.create);
  const [step1Submitted, setStep1Submitted] = useState(false);
  const [step2Submitted, setStep2Submitted] = useState(false);
  const [step3Submitted, setStep3Submitted] = useState(false);


  useEffect(() => {
    console.log("Form Data", formData)
  }, [formData])

  // Fetch products from store



  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      resetForm();
      setStep(1);
      setSearch("");
    }
  }, [open, resetForm]);



  // Format date for API (YYYY-MM-DDTHH:mm:ss)
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    // datetime-local gives us "YYYY-MM-DDTHH:mm", we need "YYYY-MM-DDTHH:mm:ss"
    // Count colons to check if seconds are already present
    const colonCount = (dateString.match(/:/g) || []).length;
    if (dateString.includes("T") && colonCount === 1) {
      // Only one colon means HH:mm format, append ":59" for seconds
      return dateString + ":59";
    }
    return dateString;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      store_id: parseInt(id),
      code: formData.code,
      discount_type:
        formData.discount_type === "percentage" ? "percentage" : "fixed",
      discount_value: parseFloat(formData.discount_value),
      min_cart_amount: parseFloat(formData.min_cart_amount),
      expires_at: formatDateForAPI(formData.expires_at),
      max_usage_count: parseInt(formData.max_usage_count) || null,
      max_usage_per_user: parseInt(formData.max_usage_per_user) || null,
      scope: formData.scope,
      categories: formData.categories,
      products: formData.products
    };
    try {
      console.log("payload", payload)
      await postData(payload, {
        onSuccess: () => {
          resetForm();
          handleClose();
          // Refresh coupons list if refetch is provided
          messageApi.success(t("coupons.success"))
          setTimeout(() => {
            refetch?.()
          }, 1000);
          // Navigate back to coupons list - modal will close, stay on same page
          // No navigation needed as modal closes
        },
        onError: (err) => {
          console.log("err", err)
          messageApi.error(err?.response?.data?.message || t("coupons.failed"))
        },
        showMessage: false,
      });

    } catch (err) {
      console.log(err)
    }
  };

  // useEffect(() => {
  //   console.log("Errors", errors)
  // }, [errors])


  const handleStepChange = (st: number) => {
    // Allow backward navigation even with errors
    if (st < step) {
      setStep(st);
      return;
    }

    // Validate current step before moving forward
    let hasErrors = false;

    if (step === 1) {
      // Mark step 1 as submitted
      setStep1Submitted(true);

      // Step 1: Scope selection validation
      if (!formData.scope) {
        handleAddError('scope', t("errorRequired"));
        hasErrors = true;
      }
    } else if (step === 2) {
      // Mark step 2 as submitted
      setStep2Submitted(true);

      // Step 2: Categories or Products selection validation
      if (formData.scope === 'categories') {
        if (!formData.categories || formData.categories.length === 0) {
          handleAddError('categories', t("errorRequired"));
          hasErrors = true;
        }
      } else if (formData.scope === 'products') {
        if (!formData.products || formData.products.length === 0) {
          handleAddError('products', t("errorRequired"));
          hasErrors = true;
        }
      }
    } else if (step === 3) {
      // Mark step 3 as submitted
      setStep3Submitted(true);

      // Step 3: Coupon details validation
      const requiredFields = ['code', 'discount_type', 'discount_value', 'min_cart_amount', 'expires_at'];
      requiredFields.forEach(field => {
        if (!formData[field as keyof CreateCouponFormData]) {
          handleAddError(field, t("errorRequired"));
          hasErrors = true;
        }
      });

      // Additional validation for discount value
      if (formData.discount_type === 'percentage') {
        const discountValue = parseFloat(formData.discount_value);
        if (discountValue < 0 || discountValue > 100) {
          handleAddError('discount_value', t("coupons.errors.invalidPercentage"));
          hasErrors = true;
        }
      }
    }

    if (hasErrors) {
      return; // Prevent step change if there are errors
    }

    // Special case: if on step 1 and scope is "all", skip to step 3
    if (step === 1 && formData.scope === "all") {
      setStep(3);
    } else {
      setStep(st);
    }
  };


  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      style={{ maxWidth: window.innerWidth < 640 ? "95%" : "55%" }}
      showLine={false}
      padding="py-0"
      classNameContent="max-h-[85vh] px-4 md:px-12 mt-12 md:mt-2"
    >
      <div className="w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          {t("coupons.create.title")}
        </h2>

        <form onSubmit={handleSubmit}>
          <StepIndicator
            step={step}
            setStep={handleStepChange}
            totalSteps={totalSteps}
            onCancel={handleClose}
            stepLabels={[
              t("coupons.steps.scope"),
              t("coupons.steps.type"),
              t("coupons.steps.details"),
            ]}
            loading={posting}
            margin="mb-3 sm:mb-4"
          >
            {step === 1 && <>
              <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                {/* <h2 className="text-xl font-semibold text-gray-800 mb-6">{t("coupons.create.selectScope")}</h2> */}

                <div className="flex flex-col mx-auto gap-3 sm:gap-4">
                  {/* Categories Option */}
                  <button
                    type="button"
                    onClick={() => {
                      const scopeUpdater = handleChange('scope');
                      scopeUpdater('categories');
                      // handleStepChange(2);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${formData.scope === 'categories'
                      ? 'border-blueSite bg-blueSite text-white'
                      : 'border-gray-200 hover:border-blueSite bg-blueLight'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">

                      <h3 className="text-base sm:text-lg font-semibold">{t("coupons.create.categories")}</h3>

                      <div >
                        <FaArrowRightLong className={`${formData.scope === 'categories' ? "text-white" : "text-blueSite"} text-lg sm:text-xl`} />
                      </div>
                    </div>
                  </button>

                  {/* Products Option */}
                  <button
                    type="button"
                    onClick={() => {
                      const scopeUpdater = handleChange('scope');
                      scopeUpdater('products');
                      //handleStepChange(2);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${formData.scope === 'products'
                      ? 'border-blueSite bg-blueSite text-white'
                      : 'border-gray-200 hover:border-blueSite bg-blueLight'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-semibold">
                        {t("coupons.create.products.title") ||
                          t("coupons.create.products")}
                      </h3>
                      <div >
                        <FaArrowRightLong className={`${formData.scope === 'products' ? "text-white" : "text-blueSite"} text-lg sm:text-xl`} />
                      </div>
                    </div>
                  </button>

                  {/* All Option */}
                  <button
                    type="button"
                    onClick={() => {
                      const scopeUpdater = handleChange('scope');
                      scopeUpdater('all');
                      // handleStepChange(3);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${formData.scope === 'all'
                      ? 'border-blueSite bg-blueSite text-white'
                      : 'border-gray-200 hover:border-blueSite bg-blueLight'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">

                      <h3 className="text-base sm:text-lg font-semibold">{t("coupons.create.all")}</h3>

                      <div >
                        <FaArrowRightLong className={`${formData.scope === 'all' ? "text-white" : "text-blueSite"} text-lg sm:text-xl`} />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </>}

            {step === 2 && <div className="min-h-[200px] sm:min-h-[250px]">
              {formData.scope === "categories" ?
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6"
                >
                  <MultiSelectField
                    name="categories"
                    id="categories"
                    url={categories}
                    label={t("store.label.categories")}
                    placeholder={t("store.placeholder.categories")}
                    values={formData.categories || []}
                    onChange={(val) => handleArrayChange("categories", val)}
                    withFieldset
                    unstyled
                    validate
                    required
                    formErrors={errors}
                    handleAddError={handleAddError}
                    maxHeight={"max-h-[120px] sm:max-h-[130px]"}
                    isSubmited={step2Submitted}
                    onSubmit={true}
                  />

                </div> :

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6"
                >

                  <MultiSelectFieldWithSearch
                    id="products"
                    label={t("store.label.products")}
                    values={formData.products}
                    onChange={(val) => {
                      handleArrayChange("products", val)

                    }}
                    url={PRODUCTS_ENDPOINT.getByStore(id)}
                    enabled={id}
                    unstyled
                    required
                    validate={true}
                    formErrors={errors}
                    handleAddError={handleAddError}
                    isSubmited={step2Submitted}
                    onSubmit={true}
                  />

                </div>
              }

            </div>}


            {/* STEP 1 - Coupon Details */}
            {step === 3 && (
              <>

                <div className="space-y-4 ">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      id="code"
                      label={t("coupons.create.fields.code")}
                      placeholder={t("coupons.create.fields.codePlaceholder")}
                      value={formData.code}
                      onChange={handleChange("code")}
                      unstyled
                      withFieldset
                      required
                      handleAddError={handleAddError}
                      formErrors={errors}
                      validate={true}
                      isSubmited={step3Submitted}

                    />
                    <InputField
                      id="expires_at"
                      label={t("coupons.create.fields.expiresAt")}
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={handleChange("expires_at")}
                      unstyled
                      withFieldset
                      required
                      handleAddError={handleAddError}
                      formErrors={errors}
                      validate={true}
                      isSubmited={step3Submitted}
                    />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      id="discount_type"
                      label={t("labels.discount_type")}
                      placeholder="Select discount type"
                      selectorOptions={[
                        { id: "percentage", name: t("coupons.create.discountTypes.percentage") },
                        { id: "fixed", name: t("coupons.create.discountTypes.fixed") },
                      ]}
                      value={formData.discount_type}
                      onChange={handleChange("discount_type")}
                      unstyled
                      withFieldset
                      required
                      handleAddError={handleAddError}
                      formErrors={errors}
                      isSubmited={step3Submitted}
                      validate={true}


                    />
                    {formData.discount_type == "percentage" ?
                      <InputField
                        id="discount_value"
                        label={t("labels.discount_value")}
                        type="number"
                        placeholder={t("flashSell.fields.discountValue")}
                        value={formData.discount_value}
                        onChange={handleChange("discount_value")}
                        unstyled
                        withFieldset
                        required
                        handleAddError={handleAddError}
                        formErrors={errors}
                        validate={true}
                        isSubmited={step3Submitted}
                        conditions={{ number: { min: 0, max: 100 } }}
                      /> :
                      <InputField
                        id="discount_value"
                        label={t("labels.discount_value")}
                        type="number"
                        placeholder={t("flashSell.fields.discountValue")}
                        value={formData.discount_value}
                        onChange={handleChange("discount_value")}
                        unstyled
                        withFieldset
                        required
                        handleAddError={handleAddError}
                        formErrors={errors}
                        validate={true}
                        isSubmited={step3Submitted}
                      />}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      id="min_cart_amount"
                      label={t("coupons.create.fields.minCartAmount")}
                      type="number"
                      placeholder={t("coupons.create.fields.minCartAmount")}
                      value={formData.min_cart_amount}
                      onChange={handleChange("min_cart_amount")}
                      unstyled
                      withFieldset
                      required
                      handleAddError={handleAddError}
                      formErrors={errors}
                      validate={true}
                      isSubmited={step3Submitted}

                    />
                    <InputField
                      id="max_usage_per_user"
                      label={t("coupons.create.fields.maxUsagePerUser")}
                      type="number"
                      placeholder={t("coupons.create.fields.maxUsagePerUser")}
                      value={formData.max_usage_per_user}
                      onChange={handleChange("max_usage_per_user")}
                      unstyled
                      withFieldset
                      required
                      handleAddError={handleAddError}
                      formErrors={errors}
                      validate={true}
                      isSubmited={step3Submitted}

                    />

                  </div>
                  <div>
                    <InputField
                      id="max_usage_count"
                      label={t("coupons.create.fields.maxUsageCount")}
                      type="number"
                      placeholder={t("coupons.create.fields.maxUsageCount")}
                      value={formData.max_usage_count}
                      onChange={handleChange("max_usage_count")}
                      unstyled
                      withFieldset
                      required
                      handleAddError={handleAddError}
                      formErrors={errors}
                      validate={true}
                      isSubmited={step3Submitted}

                    />
                  </div>



                  {/* <Button 
                    type="submit"
                    unstyled 
                    disabled={posting}
                    className={`
                    bg-blueBtn
                    text-textWhiteColor
                    px-5 py-2 rounded-lg
                    transition hover:bg-blueSiteHover
                    text-[16px] 2xl:text-[16px] max-w-[300px]
                    disabled:bg-red!important
                    disabled:text-textWhiteColor!important
                  `}>
                      {posting?t("coupons.btn.adding") : t("coupons.btn.add")}
                  </Button> */}
                </div>
              </>
            )}

          </StepIndicator>

        </form>
      </div>
    </Modal>
  );
};

export default CreateCouponModal;
