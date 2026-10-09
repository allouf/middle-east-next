'use client';

import React, { useMemo, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

import useGetData from '@/lib/api/useGetData';
import { PRODUCTS_ENDPOINT } from '@/shared/constants/urls';
import { useTranslation } from '@/lib/i18n/useTranslation';

import RelatedProductsSelector from './RelatedProductsSelector';
import { ProductDropdown } from './ProductDropdown';
import type { RelatedItem, VariantSelection } from '../../types/PackageTypes';

type VariantsUpdater =
    | VariantSelection[]
    | ((prev: VariantSelection[]) => VariantSelection[]);

export type RelatedProductSectionProps = {
    index: number;
    itemsLength: number;
    item: RelatedItem;
    setItems: React.Dispatch<React.SetStateAction<RelatedItem[]>>;
    main_productId: number | null;
    errors: Record<string, unknown>;
    handleAddError: (key: string, value?: string) => void;
    isSubmited: boolean;
    onVariantsChange: (variants: VariantSelection[]) => void;
};

const RelatedProductSection: React.FC<RelatedProductSectionProps> = ({
    index,
    itemsLength,
    item,
    setItems,
    main_productId,
    errors,
    handleAddError,
    isSubmited,
    onVariantsChange,
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const selectedProductId =
        typeof item.product_id === 'number' ? Number(item.product_id) : null;

    const { data: resData, loading: loadingProducts } = useGetData({
        url: PRODUCTS_ENDPOINT.relatedProductsByMainProduct(main_productId ?? 0),
        enabled: Boolean(main_productId),
        paginate: true,
        page: 1,
        extraParams: { search: search || undefined },
    });

    const products = useMemo(() => {
        const list = (resData?.data?.products ?? resData?.data ?? []) as any[];
        return Array.isArray(list)
            ? list.filter((p) => Number(p.id) !== Number(main_productId))
            : [];
    }, [resData, main_productId]);

    const handleSelectProduct = (productId: number | null) => {
        setItems((prev) => {
            const updated = [...prev];
            updated[index] = { product_id: productId ?? '', product_name: '', variants: [] };
            return updated;
        });

        handleAddError(`related_product_${index}`, '');
        handleAddError(`variants_${index}`, '');

        onVariantsChange([]);
    };

    const handleRemoveProduct = () => {
        setItems((prev) => prev.filter((_, i) => i !== index));
        handleAddError(`variants_${index}`, '');
        handleAddError(`related_product_${index}`, '');
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 pb-2 gap-6">
                <ProductDropdown
                    label={t('create_package.related_products') ?? 'Related Product'}
                    disabled={!main_productId}
                    valueId={selectedProductId}
                    products={products}
                    loading={loadingProducts}
                    searchValue={search}
                    onSearchChange={setSearch}
                    onSelect={handleSelectProduct}
                    placeholder={t('packages.products.searchPlaceholder') ?? 'Search...'}
                    noneLabel={t('common.none') ?? 'None'}
                    noResultsLabel={t('packages.roducts.noProducts') ?? 'No products found'}
                    rightAction={
                        itemsLength > 1 ? (
                            <span
                                className="text-red-500 hover:text-red-600 text-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveProduct();
                                }}
                                role="button"
                            >
                                <FaTrash />
                            </span>
                        ) : null
                    }
                />

                <div className="bg-white">
                    <RelatedProductsSelector
                        id={`variants_${index}`}
                        label={t('create_package.variants')}
                        value={item.variants ?? []}
                        onChange={onVariantsChange}
                        relatedProductId={selectedProductId}
                        main_productId={main_productId}
                        required
                        validate
                        formErrors={errors as any}
                        handleAddError={handleAddError}
                        isSubmited={isSubmited}
                    />
                </div>
            </div>

            {/* {index >= 1 && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 100, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
            )} */}
        </div>
    );
};

export default RelatedProductSection;
