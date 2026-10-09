'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

import Modal from '@/components/ui/Modal';
import useGetData from '@/lib/api/useGetData';

import ProductDetails from './ProductDetails';

import type { ProductDetailsData } from '@/features/product/types/type';
import type { ApiResponse } from '@/features/auth/server';
import { PRODUCTS_ENDPOINT } from '@/shared/constants/urls';

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    id: string | number | null;
};

const Loader = () => {
    return (
        <div className="p-6">
            {/* Spinner */}
            <div className="flex items-center justify-center mb-6">
                <div className="w-8 h-8 border-2 border-blueSite border-t-transparent rounded-full animate-spin" />
            </div>

            {/* Skeleton */}
            <div className="animate-pulse space-y-4">
                <div className="h-44 w-full bg-gray-100 rounded-lg" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded" />
            </div>
        </div>
    );
};

const CartProductDetails: React.FC<Props> = ({ open, setOpen, id }) => {
    const params = useParams();
    const localeValue = useMemo(() => String((params as any)?.locale || 'en'), [params]); // احتفظنا به لو تحتاجه لاحقاً

    const detailsUrl = useMemo(() => {
        if (!id) return '';
        return PRODUCTS_ENDPOINT.detailsUser(id);
    }, [id]);

    const { data, loading, refetch } = useGetData<ApiResponse<ProductDetailsData>>({
        url: detailsUrl,
        enabled: Boolean(open && id),
        paginate: false,
    });

    useEffect(() => {
        if (open && id) refetch?.();
    }, [open, id, refetch]);

    const handleClose = () => setOpen(false);

    const resData = data?.data ?? null;

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            className="text-center"
            style={{ maxWidth: '95%' ,overflow:"auto" }}
            padding="py-0"
            showLine={false}
           classNameContent="max-h-[85vh]  md:max-h-[95vh] md:!h-[95vh] px-0 md:px-12 mt-12 md:mt-2"
        >
            {loading ? <Loader /> : <ProductDetails resData={resData} setCloseModal={setOpen}/>}
        </Modal>
    );
};

export default CartProductDetails;
