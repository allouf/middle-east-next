'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import Modal from '@/components/ui/Modal';
import StepIndicator from '@/components/ui/StepIndicator';

import usePostData from '@/lib/api/usePostData';
import useFormData from '@/lib/Hooks/useFormData';
import { useTranslation } from '@/lib/i18n/useTranslation';

import { PACKAGES_ENDPOINT } from '@/shared/constants/urls';

import FirstStepPackage from './FirstStepPackage';
import SecoundStepPackage from './SecoundStepPackage';

import type {
  DiscountType,
  PackageFormState,
  PackageItem,
  RelatedItem,
} from '../../types/PackageTypes';
import { message } from 'antd';

type CreatePackageModalProps = {
  open?: boolean;
  handleClose: () => void;
  refetch: () => void;
};

const INITIAL_FORM_STATE: PackageFormState = {
  title: '',
  description: '',
  discount_percent: null,
  fixed_discount: null,
  items: [],
};

const DRAFT_KEY = 'packageDraft';

const EMPTY_RELATED_ITEM: RelatedItem = {
  product_id: '',
  product_name: '',
  variants: [],
};

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function buildPackageItems(relatedItems: RelatedItem[]): PackageItem[] {
  return relatedItems.flatMap((product) => {
    const productId = typeof product.product_id === 'number' ? product.product_id : null;
    if (!productId) return [];

    const variants = Array.isArray(product.variants) ? product.variants : [];
    if (variants.length === 0) {
      return [{ product_id: productId, variant_id: null, quantity: 1 }];
    }

    return variants.map((variant) => ({
      product_id: productId,
      variant_id: variant.variant_id ?? null,
      quantity: variant.quantity ?? 1,
    }));
  });
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({
  open = false,
  handleClose,
  refetch,
}) => {
  const { t } = useTranslation();
  const params = useParams<{ id?: string }>();

  const {
    formData,
    handleChange,
    handleArrayChange,
    resetForm,
    errors,
    handleAddError,
    isValid,
  } = useFormData<PackageFormState>(INITIAL_FORM_STATE);

  const storeId = params?.id;
  const totalSteps = 2;
  const [messageApi, contextHolder] = message.useMessage();

  const [step, setStep] = useState<number>(1);
  const [packageProductId, setPackageProductId] = useState<number | null>(null);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  // ✅ always keep index 0 as main item
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([EMPTY_RELATED_ITEM]);

  const createUrl = useMemo(
    () => PACKAGES_ENDPOINT.create(packageProductId ?? 0),
    [packageProductId]
  );
  const { postData, loading: posting } = usePostData(createUrl);
  const validateMainProduct = useCallback(() => {
    const ok = !!packageProductId;

    if (!ok) {
      handleAddError('related_product_0', t('common.required'));
    } else {
      handleAddError('related_product_0', '');
    }

    return ok;
  }, [packageProductId, handleAddError, t]);

  /* ---------------------------
   * Effects
   * --------------------------*/

  // ✅ Reset dependent fields when main product changes (بدون setRelatedItems([]))
  useEffect(() => {
    // reset items in form
    handleArrayChange('items', []);

    // reset related items with proper main slot
    setRelatedItems([
      {
        ...EMPTY_RELATED_ITEM,
        product_id: packageProductId ?? '',
      },
    ]);

    handleAddError('related_product_0', '');
    handleAddError('variants_0', '');
  }, [packageProductId]);

  // Keep discount fields mutually exclusive
  useEffect(() => {
    if (discountType === 'percentage') {
      handleArrayChange('fixed_discount', null);
      handleAddError('fixed_discount', '');
      return;
    }

    handleArrayChange('discount_percent', null);
    handleAddError('discount_percent', '');
  }, [discountType]);

  // Sync relatedItems -> formData.items
  useEffect(() => {
    handleArrayChange('items', buildPackageItems(relatedItems));
  }, [relatedItems]);

  // Save draft
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  // ✅ Load draft ONCE (حل اللوب)
  const didLoadDraftRef = useRef(false);
  useEffect(() => {
    if (didLoadDraftRef.current) return;
    didLoadDraftRef.current = true;

    if (typeof window === 'undefined') return;

    const draft = safeParseJSON<Partial<PackageFormState>>(
      window.localStorage.getItem(DRAFT_KEY)
    );
    if (!draft) return;

    (Object.entries(draft) as Array<[keyof PackageFormState, unknown]>).forEach(
      ([key, value]) => {
        handleChange(key, value as any);
      }
    );
  }, []);

  /* ---------------------------
   *  validation  varent 
   * --------------------------*/
  const validateVariants = useCallback(() => {
    let ok = true;

    relatedItems.forEach((item, index) => {
      const hasProduct = !!item.product_id;
      const hasVariants =
        Array.isArray(item.variants) && item.variants.length > 0;

      // only validate rows that have a product selected
      if (hasProduct && !hasVariants) {
        handleAddError(`variants_${index}`, t("common.required")); // or your key
        ok = false;
      } else {
        handleAddError(`variants_${index}`, "");
      }
    });

    return ok;
  }, [relatedItems, handleAddError, t]);

  const validateRelatedProducts = useCallback(() => {
    // Check if there's at least one related product (index 1+)
    const hasRelatedProducts = relatedItems.length > 1 && relatedItems.slice(1).some(item => !!item.product_id);

    if (!hasRelatedProducts) {
      handleAddError('related_products', t('packages.related_products_required'));
      return false;
    } else {
      handleAddError('related_products', '');
      return true;
    }
  }, [relatedItems, handleAddError, t]);

  /* ---------------------------
   * Handlers
   * --------------------------*/

  const resetAll = useCallback(() => {
    resetForm();
    setIsSubmited(false);
    setStep(1);
    setPackageProductId(null);
    setRelatedItems([EMPTY_RELATED_ITEM]);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, [resetForm]);
  const hasAtLeastOneRelatedProduct = useMemo(() => {
    return relatedItems.slice(1).some((item) => Boolean(item.product_id));
  }, [relatedItems]);

  const handleSubmitPackage = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // ✅ لازم Related Product قبل أي شيء
      if (!hasAtLeastOneRelatedProduct) {
        handleAddError("related_products", t("packages.related_products_required"));
        messageApi.error(t("packages.related_products_required"));
        setIsSubmited(true);
        return;
      } else {
        handleAddError("related_products", "");
      }

      const mainOk = validateMainProduct();
      const variantsOk = validateVariants();

      if (!isValid || !mainOk || !variantsOk) {
        messageApi.error(t("store.error.required"));
        setIsSubmited(true);
        return;
      }

      await postData(
        { ...formData },
        {
          onSuccess: () => {
            messageApi.success(t("packages.create_success"));
            refetch();
            resetAll();
            handleClose();
          },
          onError: (err: any) => {
            const resData = err?.response?.data;
            messageApi.error(resData?.message || t("packages.create_error"));
          },
          showMessage: false,
        }
      );
    },
    [
      formData,
      handleClose,
      isValid,
      postData,
      refetch,
      resetAll,
      validateMainProduct,
      validateVariants,
      hasAtLeastOneRelatedProduct,
      handleAddError,
      t,
      messageApi,
    ]
  );

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      // className="text-center"
      style={{ maxWidth: '90%' }}
      padding="py-0"
      showLine={false}
      classNameContent="max-h-[85vh] md:!h-[65vh] px-0 md:px-12 mt-12 md:mt-2"
    >
      {/* {contextHolder} */}
      <div className=" overflow-x-hidden overflow-y-auto px-4 dropDown">
        <h2 className="text-xl font-semibold mb-4">{t('create_package.title')}</h2>
        <form onSubmit={handleSubmitPackage} className="min-h-full">
          <StepIndicator
            step={step}
            setStep={(nextStep: number) => {
              const variantsOk = validateVariants();

              if (step === 2 && !hasAtLeastOneRelatedProduct) {
                handleAddError("related_products", t("packages.related_products_required"));
                messageApi.error(t("packages.related_products_required"));
                setIsSubmited(true);
                return;
              }

              if (!isValid || !variantsOk) {
                setIsSubmited(true);
                return;
              }

              setStep(nextStep);
            }}

            totalSteps={totalSteps}
            onCancel={handleClose}
            loading={posting}
            margin="mb-4"
            className='!justify-between '
            classNameContent="min-h-[30vh]"
          >
            {step === 1 && (
              <FirstStepPackage
                formData={formData}
                handleChange={handleChange}
                handleAddError={handleAddError}
                errors={errors}
                isSubmited={isSubmited}
                discountType={discountType}
                setDiscountType={setDiscountType}
              />
            )}

            {step === 2 && (
              <SecoundStepPackage
                relatedItems={relatedItems}
                setRelatedItems={setRelatedItems}
                packageProductId={packageProductId}
                setPackageProductId={setPackageProductId}
                storeId={storeId}
                handleAddError={handleAddError}
                errors={errors}
                isSubmited={isSubmited}
                formData={formData}
              />
            )}
          </StepIndicator>
        </form>
      </div>
    </Modal>
  );
};

export default CreatePackageModal;
