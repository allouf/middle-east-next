'use client';

import React, { useEffect } from 'react';
import RelatedProductSection from './RelatedProductSection';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';

import type { PackageFormState, RelatedItem } from '../../types/PackageTypes';
import MainAndRelatedPicker from './MainProductPicker';

type FormErrors = Record<string, unknown>;
type VariantSelection = { variant_id?: number | null; quantity?: number };

export interface SecoundStepPackageProps {
  storeId?: string | number | null;

  packageProductId: number | null;
  setPackageProductId: React.Dispatch<React.SetStateAction<number | null>>;

  relatedItems: RelatedItem[];
  setRelatedItems: React.Dispatch<React.SetStateAction<RelatedItem[]>>;

  handleAddError: (id: string, value?: string) => void;
  errors?: FormErrors;
  isSubmited?: boolean;
  formData: PackageFormState;
}

const EMPTY_ITEM: RelatedItem = { product_id: '', product_name: '', variants: [] };

const SecoundStepPackage: React.FC<SecoundStepPackageProps> = ({
  relatedItems,
  formData,
  packageProductId,
  setPackageProductId,
  storeId,
  handleAddError,
  errors = {},
  isSubmited = false,
  setRelatedItems,
}) => {
  const { t } = useTranslation();

  const hasMainProduct = !!packageProductId;
  const hasRelatedProducts = relatedItems.length > 1 && relatedItems.slice(1).some(item => !!item.product_id);
  const shouldShowMessage: boolean = Boolean(hasMainProduct && !hasRelatedProducts);
  const addRelatedProduct = () => {
    setRelatedItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  };

  // Initialize with one main and one related product if empty
  useEffect(() => {
    // console.log("relatedItems.length", relatedItems.length);
    // console.log("packageProductId", packageProductId);

    if (relatedItems.length === 1 && packageProductId) {
      console.log("relatedItems.length if", relatedItems.length);
      setTimeout(() => {
        addRelatedProduct();
      }, 0);
    }
  }, [packageProductId, relatedItems.length]);


  const handleVariantsChange = (variants: VariantSelection[], index: number) => {
    setRelatedItems((prev) => {
      const updated = [...prev];
      const current = updated[index] ?? { ...EMPTY_ITEM };
      updated[index] = { ...current, variants };
      return updated;
    });
  };

  return (
    <div className="space-y-6 m-2 !h-full">
      {/* MAIN (index 0) */}
      <MainAndRelatedPicker
        storeId={storeId}
        formData={formData}
        mainProductId={packageProductId}
        setItems={setRelatedItems}
        setMainProductId={setPackageProductId}
        mainItem={relatedItems[0] ?? { ...EMPTY_ITEM }}
        onMainVariantsChange={(variants) => handleVariantsChange(variants, 0)}
        errors={errors}
        handleAddError={handleAddError}
        isSubmited={isSubmited}
      />
      {/** test */}
      {shouldShowMessage ? (
        <div className="bg-[#338572]/10 border-l-4 border-lightGreen p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-lightGreen" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="ml-3">
              <p className="text-sm font-medium text-lightGreen">
                {
                  t("packages.select_related_products_message")
                }
              </p>
              <p className="mt-1 text-sm text-lightGreen opacity-80">
                {
                  t("packages.related_products_help")
                }
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {errors?.related_products && isSubmited && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {String(errors.related_products) || ''}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 ">
        {relatedItems.slice(1).map((item, idx) => {
          const realIndex = idx + 1;

          return (
            <RelatedProductSection
              index={realIndex}
              key={realIndex}
              itemsLength={relatedItems.length - 1}
              item={item}
              setItems={setRelatedItems}
              main_productId={packageProductId}
              errors={errors}
              handleAddError={handleAddError}
              isSubmited={isSubmited}
              onVariantsChange={(variants) => handleVariantsChange(variants as any, realIndex)}
            />
          );
        })}
      </div>

      <Button
        type="button"
        scale={1.03}
        unstyled
        className="text-[18px] 2xl:text-[22px] text-subTitleColor bg-none font-semibold"
        onClick={addRelatedProduct}
        disabled={!packageProductId}
      >
        {t('create_package.add_product')}
      </Button>
    </div>
  );
};

export default SecoundStepPackage;
