'use client';

import React, { useMemo, useState } from 'react';
import useGetData from '@/lib/api/useGetData';
import { PRODUCTS_ENDPOINT } from '@/shared/constants/urls';
import { useTranslation } from '@/lib/i18n/useTranslation';

import RelatedProductsSelector from './RelatedProductsSelector';
import { ProductDropdown } from './ProductDropdown'; // 👈 الملف اللي فوق
import { PackageFormState } from '../../types/PackageTypes';

type VariantSelection = { variant_id?: number | null; quantity?: number };

type RelatedItem = {
    product_id: number | '' | null;
    product_name?: string;
    variants: VariantSelection[];
};

type Props = {
    storeId?: string | number | null;
    mainProductId: number | null;
    setMainProductId: React.Dispatch<React.SetStateAction<number | null>>;
    setItems: React.Dispatch<React.SetStateAction<RelatedItem[]>>;
    mainItem: RelatedItem;
    onMainVariantsChange: (variants: VariantSelection[]) => void;
    errors?: Record<string, unknown>;
    handleAddError?: (key: string, value?: string) => void;
    isSubmited?: boolean;
    formData: PackageFormState;
};

const MainAndRelatedPicker: React.FC<Props> = ({
    storeId,
    mainProductId,
    formData,
    setMainProductId,
    setItems,
    mainItem,
    onMainVariantsChange,
    errors = {},
    handleAddError = () => { },
    isSubmited = false,
}) => {
    const { t } = useTranslation();
    const [mainSearch, setMainSearch] = useState('');

    const { data: mainRes, loading: loadingMain } = useGetData({
        url: PRODUCTS_ENDPOINT.getByStore(String(storeId ?? '')),
        enabled: Boolean(storeId),
        paginate: true,
        page: 1,
        extraParams: { search: mainSearch || undefined },
    });

    const mainProducts = useMemo(() => {
        return (mainRes?.data?.products ?? mainRes?.data ?? []) as any[];
    }, [mainRes]);

    const selectMain = (id: number | null) => {
        setMainProductId(id);

        // reset main variants
        onMainVariantsChange([]);
        handleAddError('main_variants', '');

        setItems((prev) => {
            const updated = [...prev];
            updated[0] = { product_id: id ?? '', product_name: '', variants: [] };
            return updated;
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductDropdown
                label={t('create_package.main_product') ?? 'Main Product'}
                disabled={!storeId}
                valueId={mainProductId}
                products={mainProducts}
                loading={loadingMain}
                searchValue={mainSearch}
                onSearchChange={setMainSearch}
                onSelect={selectMain}
                placeholder={t('packages.products.searchPlaceholder') ?? 'Search...'}
                noneLabel={t('common.none') ?? 'None'}
                noResultsLabel={t('common.noProductsFound') ?? 'No products found'}
                isSubmited={isSubmited}
                required
                validate
                formErrors={errors as any}
            />

            <div className="bg-white">
                <RelatedProductsSelector
                    id="main_variants"
                    label={t('create_package.variants')}
                    value={mainItem.variants ?? []}
                    onChange={onMainVariantsChange}
                    relatedProductId={mainProductId}
                    main_productId={mainProductId}
                    unstyled
                    required
                    validate
                    formErrors={errors as any}
                    handleAddError={handleAddError as any}
                    isSubmited={isSubmited}
                />
            </div>
        </div>
    );
};

export default MainAndRelatedPicker;
