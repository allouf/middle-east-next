// types/package.ts

import { ListResponse } from "@/types/type";

/** -----------------------
 * Shared primitives
 * ---------------------- */
export type ID = number | string | undefined;

export type DiscountType = 'percentage' | 'flat';

/** -----------------------
 * Product / Gallery
 * ---------------------- */
// If you already have GalleryItem elsewhere, import it instead.
// export type GalleryItem = ...;import { ListResponse } from './../../../types/type';

export type GalleryItem = unknown;

export interface ProductOption {
    id: number;
    name: string;
    gallery?: GalleryItem[] | null;
    [key: string]: unknown;
}

/** -----------------------
 * Package domain models (UI usage)
 * ---------------------- */
export interface PackageProduct {
    name?: string | null;
    price?: number | string | null;
    image?: string | null;
}

export interface PackageItem {
    id?: ID;
    product_id?: number;
    variant_id?: number | null;
    image?: string | null;
    quantity?: number | null;
    item_total_price?: number | string | null;
    product?: PackageProduct | null;
    variant?: VariantOption[];
}

export interface PackageDetails {
    id?: ID;
    product_id?: ID;
    title?: string | null;
    description?: string | null;

    fixed_discount?: number | null;
    discount_percent?: number | null;

    created_at?: string | Date | null;
    price_after?: number | string | null;

    main_product?: PackageProduct | null;
    items?: PackageItem[] | null;
}

export interface Package {
    id: number;
    title: string;
    discount_type: "percent" | "fixed";
    fixed_discount?: number | null;
    discount_percent?: number | null;
    items?: PackageItem[] | null;
    created_at: Date;
    is_active: boolean;

}

/** -----------------------
 * Forms
 * ---------------------- */
export interface PackageFormState {
    title: string;
    description: string;
    discount_percent?: number | null;
    fixed_discount?: number | null;
    items?: Array<{
        product_id: number;
        variant_id: number | null;
        quantity: number;
    }>;
}

/** -----------------------
 * Related items / variants selection (Create/Update package UI)
 * ---------------------- */
export interface SelectedVariant {
    variant_id: number;
    quantity: number;
    variant_name?: string;
    sku?: string;
}

export interface RelatedItem {
    product_id: number | '' | null;
    product_name?: string;
    variants: SelectedVariant[];
}

/** For older payloads if you used {product_id, variant_id, quantity} directly */
export interface RelatedProductValue {
    product_id: number;
    variant_id?: number | null;
    quantity: number;
}

/** -----------------------
 * Variants API
 * ---------------------- */
export interface VariantOption {
    id: number;
    sku: string;
    name?: string;
    image?: string | null;
}

export interface GetVariantsResponse {
    data?: VariantOption[];
}

/** -----------------------
 * Packages API responses
 * ---------------------- */
export interface PackageDetailsResponse {
    data?: {
        package?: PackageDetails;
    };
}

export interface PackagesResponse extends ListResponse<Package> { }




export type DiscountFilter = "all" | "percentage" | "fixed";
export type StatusFilter = "all" | "active" | "inactive";
export type DatePreset = "all" | "today" | "last7" | "last30" | "custom";

// ✅ optional (so old usages won't break). if you don't pass them, "Sort by" won't show.
export type SortBy = "latest" | "oldest";




export type VariantSelection = {
    variant_id?: number | null;
    quantity?: number;
};



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
