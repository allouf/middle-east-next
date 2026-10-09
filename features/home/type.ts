export interface Category {
    id: number;
    name: string;
    icon: string;
    is_active: boolean;
    sort_order: number;
}

export interface ProductGalleryItem {
    id: number;
    file_path: string;
    file_type: "image" | "video" | string;
}

export interface Store {
    id: number;
    name: string;
}
export type DiscountType = "percentage" | "fixed";
export type ProductStatus = "active" | "draft" | "inactive";
export type AvailabilityStatus = "sold_out" | "available" | "unavailable";
export interface BaseProduct {
    id: number;
    store_id: number;
    store: Store;
    category: Category;
    badge: string;
    name: string;
    slug: string;
    price: number;
    price_before_discount: number;
    discount_value: number;
    discount_type: DiscountType;
    status: ProductStatus;
    number_of_buys: number;
    avg_rating: number;
    total_left_in_stock: number;
    availability_status: AvailabilityStatus;
    gallery: ProductGalleryItem[];
    image: string;
    is_favorited: boolean;
    favorited_at: string | null;
}

export interface MappedProdcut {
    id?: number;
    title?: string;
    name: string;
    image?: string;
    priceBeforeDiscount?: number;
    price_before_discount?: number; // make it optional
    price?: number;
    newPrice?: number;
    oldPrice?: number;
    rating?: number;
    badge?: string | null;
    originalProduct?: BaseProduct;
    is_favorited?: boolean;
    category?: string;
    stock?: number;
}



export interface HighlightCard {
    id: number;
    tag: string;
    title: string;
    description: string;
    image: string | null;
    bg: string;
    textColor: string;
    tagBg: string;
    btnBg: string;
    reverse: boolean;
}



// types/home-banner.ts

export interface HomeCarouselItem {
    id: number;
    title?: string;
    subtitle?: string;
    price?: number;
    image?: string | null;
    link?: string | null;
}

export interface FeaturedMiniItem {
    id: number;
    name?: string;
    discount?: number;
    image?: string | null;
}

export interface BannerItem {
    id: number;
    title?: string;
    image?: string | null;
    link?: string | null;
}

/* UI mapped types */

export interface HomeSlide {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string | null;
    bg: string;
    link: string | null;
}

export interface MiniSlide {
    id: number;
    title: string;
    tag: string;
    btn: string;
    image: string | null;
    bg: string;
    textColor: string;
}

export interface BottomSlide {
    id: number;
    title: string;
    tag: string;
    image: string | null;
    link: string | null;
}


export interface PreOrderType {
    title: string;
    price: number;
    product_name: string;
    product_description: string;
    image: string;
    link: string | null;
}

export interface SponsoredProduct {
    id: number;
    store_id: number;
    category: Category;
    name: string;
    slug: string;
    price: number;
    price_before_discount: number;
    discount_value: number;
    discount_type: DiscountType;
    status: ProductStatus;
    number_of_buys: number;
    avg_rating: number;
    total_left_in_stock: number;
    availability_status: AvailabilityStatus;
    gallery: ProductGalleryItem[];
    image: string;
    is_favorited: boolean;
    favorited_at: string | null;
    
    // Additional fields for UI compatibility
    title?: string;
    oldPrice?: number;
    newPrice?: number;
    rating?: number;
    reviews?: number;
    discount?: number;
    stock?: number;
    badge?: string;
    originalProduct?: any;
}

export interface SponsoredCategory {
    id: number;
    name: string;
    icon: string;
    is_active: boolean;
    sort_order: number;
}

// Mapped product type for UI compatibility
export interface MappedSponsoredProduct {
    id: number;
    store_id: number;
    category: Category;
    name: string;
    slug: string;
    price: number;
    price_before_discount: number;
    discount_value: number;
    discount_type: DiscountType;
    status: ProductStatus;
    number_of_buys: number;
    avg_rating: number;
    total_left_in_stock: number;
    availability_status: "in_stock" | "low_stock" | "unavailable"; // Mapped to match Product type
    gallery: ProductGalleryItem[];
    image: string;
    is_favorited: boolean;
    favorited_at: string | null;
    
    // Legacy fields for backward compatibility
    title?: string;
    oldPrice?: number;
    newPrice?: number;
    rating?: number;
    reviews?: number;
    discount?: number;
    stock?: number;
    badge?: string;
    originalProduct?: any;
}
