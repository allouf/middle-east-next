'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Search, ChevronDown, X } from 'lucide-react';
import useGetData from '@/lib/api/useGetData';
import { PRODUCTS_ENDPOINT } from '@/shared/constants/urls';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { backUrl } from '@/shared/constants/data';

import type { GetVariantsResponse, SelectedVariant, VariantOption } from '../../types/PackageTypes';

type RelatedProductsSelectorProps = {
  id: string;
  relatedProductId: number | null;
  main_productId?: number | null;
  label: string;

  value?: SelectedVariant[];
  onChange: (next: SelectedVariant[]) => void;

  disabled?: boolean;
  className?: string;

  formErrors?: Record<string, string>;
  handleAddError: (key: string, value: string) => void;

  required?: boolean;
  validate?: boolean;
  isSubmited?: boolean;
};

const RelatedProductsSelector: React.FC<RelatedProductsSelectorProps> = ({
  id,
  relatedProductId,
  label,
  value = [],
  onChange,
  disabled = false,
  className = '',
  formErrors = {},
  handleAddError,
  required = false,
  validate = false,
  isSubmited = false,
}) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { data: apiData, loading } = useGetData<GetVariantsResponse>({
    url: PRODUCTS_ENDPOINT.productVariants(relatedProductId ?? 0),
    enabled: Boolean(relatedProductId),
    extraParams: { search: search || undefined },
  });

  const variants: VariantOption[] = useMemo(() => {
    if (apiData?.data && Array.isArray(apiData.data)) return apiData.data;
    return [];
  }, [apiData]);

  const isSelected = (variantId: number) => value.some((v) => v.variant_id === variantId);

  const getQty = (variantId: number) =>
    value.find((v) => v.variant_id === variantId)?.quantity ?? 1;

  const toggleVariant = (variant: VariantOption) => {
    if (disabled) return;

    const exists = value.find((v) => v.variant_id === variant.id);

    if (exists) {
      onChange(value.filter((v) => v.variant_id !== variant.id));
    } else {
      onChange([
        ...value,
        {
          variant_id: variant.id,
          variant_name: variant.name ?? '',
          sku: variant.sku,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (variantId: number, amount: number) => {
    if (disabled) return;

    onChange(
      value.map((v) =>
        v.variant_id === variantId
          ? { ...v, quantity: Math.max(1, (v.quantity ?? 1) + amount) }
          : v
      )
    );
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const selectedCount = value.length;

  // close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // validation
  // useEffect(() => {
  //   if (!validate || !required) return;

  //   if (!Array.isArray(value) || value.length === 0) {
  //     handleAddError(id, t('validation.oneProduct'));
  //   } else {
  //     handleAddError(id, '');
  //   }
  // }, [value, validate, required, handleAddError, id, t]);


  useEffect(() => {
    if (!validate || !required) return;

    // ✅ لا نضيف خطأ قبل التقديم
    if (!isSubmited) {
      handleAddError(id, "");
      return;
    }

    // ✅ بعد التقديم: إذا فاضي -> خطأ، إذا فيه قيمة -> امسح الخطأ
    if (!Array.isArray(value) || value.length === 0) {
      handleAddError(id, t("packages.validation.oneVariant"));
    } else {
      handleAddError(id, "");
    }
  }, [value, validate, required, isSubmited, id]);


  const errorMsg = formErrors?.[id];
  const buttonDisabled = disabled || !relatedProductId;
  const hasValue = Array.isArray(value) && value.length > 0;

  return (
    <div className={className} >
      {/* ✅ border + padding so legend sits well */}
      <fieldset className="relative border rounded-lg  h-[85px] bg-white">
        {/* ✅ REAL legend (simple inline text) */}
        <legend className="px-2 mx-2 text-blueSite font-semibold text-sm">
          {label}
          {selectedCount > 0 && (
            <span className="text-xs text-textColor font-normal ms-2">
              ({selectedCount} {t('packages.table.select') ?? 'selected'})
            </span>
          )}
        </legend>

        {/* ✅ Header row (clear button) */}


        {/* ✅ Relative wrapper + absolute dropdown (like main product) */}
        <div className='flex flex-row justify-between p-4 relative'>

          <div className=" w-full " ref={wrapRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}

              disabled={buttonDisabled}
              className={`w-full px-3 h-full flex items-center rounded-lg justify-between gap-2 text-sm
              ${buttonDisabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-bgGray'}
            `}
            >
              <span className="truncate">
                {selectedCount > 0
                  ? `${selectedCount} ${t('packages.table.select') ?? 'selected'}`
                  : t('create_package.select_variants')}
              </span>

              <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 border rounded-lg overflow-hidden bg-white shadow-lg">
                {/* Search */}
                <div className="flex items-center gap-2 bg-bgGray rounded-full py-2 px-4 m-3">
                  <input
                    type="text"
                    placeholder={t('packages.products.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent"
                    disabled={buttonDisabled}
                  />
                  <Search className="w-4 h-4 text-textColor" />
                </div>

                {!relatedProductId ? (
                  <p className="text-textColor text-sm px-4 pb-4">
                    {t('packages.products.selectProduct')}
                  </p>
                ) : loading ? (
                  <p className="text-textColor text-sm px-4 pb-4">
                    {t('packages.products.loadingVariants')}
                  </p>
                ) : variants.length === 0 ? (
                  <p className="text-textColor text-sm px-4 pb-4">
                    {t('packages.products.noVariants')}
                  </p>
                ) : (
                  <div className="max-h-[340px] overflow-auto px-3 pb-3">
                    <div className="space-y-2">
                      {variants.map((variant) => {
                        const checked = isSelected(variant.id);

                        return (
                          <div
                            key={variant.id}
                            className={`w-full flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border
                            ${checked ? 'border-blueSite bg-[#E6F0ED]' : 'border-gray-200 hover:bg-gray-50'}
                          `}
                          >
                            <button
                              type="button"
                              onClick={() => toggleVariant(variant)}
                              className="flex items-center gap-3 text-left flex-1"
                              disabled={disabled}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleVariant(variant)}
                                disabled={disabled}
                              />

                              <div className="relative w-10 h-10 shrink-0">
                                <Image
                                  src={
                                    variant.image
                                      ? `${backUrl}/${variant.image}`
                                      : 'https://placehold.co/40x40?text=V'
                                  }
                                  alt={variant.sku}
                                  fill
                                  sizes="40px"
                                  className="rounded-full object-cover"
                                />
                              </div>

                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-sm font-medium text-subTitleColor truncate">
                                  {variant.sku}
                                </span>

                                {!!(variant as any)?.option_values?.length && (
                                  <div className="flex flex-wrap gap-2">
                                    {(variant as any).option_values.map((op: any, i: number) => (
                                      <span
                                        key={i}
                                        className="bg-blueLight text-subTitleColor text-xs px-2 py-1 rounded-md"
                                      >
                                        {op.value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </button>

                            <div className="flex items-center justify-end sm:justify-start gap-2">
                              {checked ? (
                                <>
                                  <button
                                    type="button"
                                    className="w-8 h-8 border rounded flex items-center justify-center disabled:opacity-50"
                                    onClick={() => updateQuantity(variant.id, -1)}
                                    disabled={disabled}
                                  >
                                    <Minus size={14} />
                                  </button>

                                  <span className="text-sm w-6 text-center">
                                    {getQty(variant.id)}
                                  </span>

                                  <button
                                    type="button"
                                    className="w-8 h-8 border rounded flex items-center justify-center disabled:opacity-50"
                                    onClick={() => updateQuantity(variant.id, +1)}
                                    disabled={disabled}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-textColor">—</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end mb-3">
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                disabled={disabled}
                className="text-xs px-2 py-1  hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
              >
                <X size={14} />
                {t('common.clear') ?? 'Clear'}
              </button>
            )}
          </div>
        </div>
      </fieldset>

      {validate && required && isSubmited && !hasValue && (
        <p className="text-red-500 text-xs mt-1">
        { t("packages.validation.oneVariant") || t("errorRequired")}
        </p>
      )}
    </div>
  );
};

export default RelatedProductsSelector;
