'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import Modal from '@/components/ui/Modal';
import StepIndicator from '@/components/ui/StepIndicator';

import useGetData from '@/lib/api/useGetData';
import usePostData from '@/lib/api/usePostData';
import useFormData from '@/lib/Hooks/useFormData';
import { useTranslation } from '@/lib/i18n/useTranslation';

import { PACKAGES_ENDPOINT } from '@/shared/constants/urls';

import FirstStepPackage from './FirstStepPackage';
import SecoundStepPackage from './SecoundStepPackage';

import type {
  DiscountType,
  PackageDetailsResponse,
  PackageFormState,
  PackageItem,
  RelatedItem,
} from '../../types/PackageTypes';

type UpdatePackageModalProps = {
  open?: boolean;
  handleClose: () => void;
  refetch: () => void;
  package_id: number | string;
};

const INITIAL_FORM_STATE: PackageFormState = {
  title: '',
  description: '',
  discount_percent: null,
  fixed_discount: null,
  items: [],
};

const EMPTY_RELATED_ITEM: RelatedItem = { product_id: '', product_name: '', variants: [] };

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
      image: variant.image ?? "",
    }));
  });
}

// supports item.product.id OR item.product_id
function groupItemsToRelated(items: any[] | undefined, mainProductId?: number | null): RelatedItem[] {
  if (!items?.length) {
    return [
      {
        ...EMPTY_RELATED_ITEM,
        product_id: mainProductId ?? '',
      },
    ];
  }

  const grouped = new Map<number, RelatedItem>();

  items.forEach((it) => {
    const productId: number | null =
      typeof it?.product?.id === 'number'
        ? it.product.id
        : typeof it?.product_id === 'number'
          ? it.product_id
          : null;

    if (!productId) return;

    if (!grouped.has(productId)) {
      grouped.set(productId, {
        product_id: productId,
        product_name: it?.product?.name ?? it?.product_name ?? '',
        variants: [],
      });
    }

    if (it?.variant_id) {
      grouped.get(productId)!.variants.push({
        variant_id: it.variant_id,
        quantity: it.quantity ?? 1,
        image: it.variant.image
      });
    }
  });

  const result = Array.from(grouped.values());
  if (!result.length) {
    return [
      {
        ...EMPTY_RELATED_ITEM,
        product_id: mainProductId ?? '',
      },
    ];
  }

  // ✅ ensure index 0 is the main product (same as Create)
  if (typeof mainProductId === 'number') {
    const idx = result.findIndex((r) => r.product_id === mainProductId);
    if (idx > 0) {
      const [main] = result.splice(idx, 1);
      result.unshift(main);
    } else if (idx === -1) {
      result.unshift({
        ...EMPTY_RELATED_ITEM,
        product_id: mainProductId,
      });
    }
  }

  return result;
}

const UpdatePackageModal: React.FC<UpdatePackageModalProps> = ({
  open = false,
  handleClose,
  refetch,
  package_id,
}) => {
  const { t } = useTranslation();
  const params = useParams<{ id?: string }>();
  const storeId = params?.id;

  const totalSteps = 2;

  const [step, setStep] = useState<number>(1);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const [packageProductId, setPackageProductId] = useState<number | null>(null);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([EMPTY_RELATED_ITEM]);

  const {
    formData,
    handleChange,
    handleArrayChange,
    setFormData,
    resetForm,
    errors,
    handleAddError,
    isValid,
  } = useFormData<PackageFormState>(INITIAL_FORM_STATE);

  const {
    data: packageRes,
    loading: loadingDetails,
    error: detailsError,
    refetch: refetchDetails,
  } = useGetData<PackageDetailsResponse>({
    url: PACKAGES_ENDPOINT.getDetails(package_id),
    enabled: !!package_id && open,
  });

  const updateUrl = useMemo(() => PACKAGES_ENDPOINT.update(package_id), [package_id]);
  const { postData, loading: posting } = usePostData(updateUrl);

  // ✅ hydrate once per open (prevents overwriting user edits)
  const didHydrateRef = useRef(false);

  useEffect(() => {
    if (!open) {
      didHydrateRef.current = false;
      setStep(1);
      setIsSubmited(false);
      return;
    }

    if (didHydrateRef.current) return;

    const pkg = packageRes?.data?.package;
    if (!pkg) return;

    didHydrateRef.current = true;

    setPackageProductId(pkg.product_id);

    setDiscountType(pkg.discount_percent !== null ? 'percentage' : 'flat');

    setFormData({
      title: pkg.title ?? '',
      description: pkg.description ?? '',
      discount_percent: pkg.discount_percent,
      fixed_discount: pkg.fixed_discount,
      items: [],
    });

    setRelatedItems(groupItemsToRelated(pkg.items as any, pkg.product_id));
  }, [open, packageRes, setFormData]);

  /** ---------------------------
   * ✅ Same behavior as Create:
   * when main product changes, reset dependent fields and keep index 0 as main
   * --------------------------*/
  const skipResetOnHydrateRef = useRef(false);
  useEffect(() => {
    if (!open) return;
    if (!packageProductId) return;

    // during hydration we don't want to blow away API-loaded related items
    if (didHydrateRef.current && !skipResetOnHydrateRef.current) {
      // first run after hydrate: allow, but don't reset
      skipResetOnHydrateRef.current = true;
      return;
    }

    // reset items in form
    handleArrayChange('items', []);

    // reset related items with proper main slot (like Create)
    setRelatedItems([
      {
        ...EMPTY_RELATED_ITEM,
        product_id: packageProductId,
      },
    ]);

    handleAddError('related_product_0', '');
    handleAddError('variants_0', '');
  }, [open, packageProductId]);

  /** ---------------------------
   * Keep discount fields mutually exclusive (same as Create)
   * --------------------------*/
  useEffect(() => {
    if (!open) return;

    if (discountType === 'percentage') {
      handleArrayChange('fixed_discount', null);
      handleAddError('fixed_discount', '');
      return;
    }

    handleArrayChange('discount_percent', null);
    handleAddError('discount_percent', '');
  }, [open, discountType]);

  /** ---------------------------
   * Sync relatedItems -> formData.items (same as Create)
   * --------------------------*/
  useEffect(() => {
    if (!open) return;
    handleArrayChange('items', buildPackageItems(relatedItems));
  }, [open, relatedItems]);

  /** ---------------------------
   * Reset all
   * --------------------------*/
  const resetAll = useCallback(() => {
    resetForm();
    setStep(1);
    setIsSubmited(false);
    setPackageProductId(null);
    setDiscountType('percentage');
    setRelatedItems([EMPTY_RELATED_ITEM]);
    didHydrateRef.current = false;
    skipResetOnHydrateRef.current = false;
  }, [resetForm]);


  useEffect(() => {
    if (!open) return;

    didHydrateRef.current = false;
    skipResetOnHydrateRef.current = false;
    setStep(1);
    setIsSubmited(false);
    refetchDetails?.();
  }, [open, package_id]);

  /** ---------------------------
   * Submit
   * --------------------------*/
  const handleSubmitUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isValid) {
        setIsSubmited(true);
        return;
      }

      await postData(
        { ...formData },
        {
          onSuccess: () => {
            refetch();
            resetAll();
            handleClose();
          }
        }
      );
    },
    [formData, isValid, postData, refetch, resetAll, handleClose]
  );

  /** ---------------------------
   * Step navigation like Create
   * --------------------------*/
  const handleStepChange = useCallback(
    (nextStep: number) => {
      if (!isValid) {
        setIsSubmited(true);
        return;
      }
      setStep(nextStep);
    },
    [isValid]
  );

  return (
    <Modal
      key={package_id}
      isOpen={open}
      onClose={handleClose}
      style={{ maxWidth: '85%' }}
      padding="p-1"
      showLine={false}
       classNameContent="max-h-[85vh] md:!h-[65vh] px-0 md:px-12 mt-12 md:mt-2"
    >
      <div className=" overflow-x-hidden overflow-y-auto px-4 dropDown">
        <h2 className="text-xl font-semibold mb-4">{t('update_package.title')}</h2>

        {loadingDetails ? (
          <div className="py-6 text-textColor text-center">{t('loading')  ?? 'Loading...'}</div>
        ) : detailsError ? (
          <div className="py-6">
            <button type="button" onClick={refetchDetails} className="text-blueSite underline">
              {t('retry') ?? 'Retry'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitUpdate} className="max-h-screen">
            <StepIndicator
              step={step}
              setStep={handleStepChange}
              totalSteps={totalSteps}
              onCancel={() => {
                resetAll();
                handleClose();
              }}
              loading={posting}
              margin="mb-4"
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
                  formData={formData}
                  handleAddError={handleAddError}
                  errors={errors}
                  isSubmited={isSubmited}
                />
              )}
            </StepIndicator>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default UpdatePackageModal;
