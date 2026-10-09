
import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { Product } from "@/features/product/types/type";

interface ProductsResponse<T = unknown> {
    products: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const defaultMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
};

export async function fetchProducts(query: string, locale = "en"): Promise<ProductsResponse<Product>> {
    const url = `${baseURL}${USER_ENDPOINTS.Get_Products}${query ? `?${query}` : ""}`;
    console.log(url)
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(url, {
            headers,
            cache: "no-store",
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            console.error("Failed to fetch products", res.status);
            return { products: [], meta: defaultMeta };
        }

        const json = await res.json();
        const products =
            json?.data?.data ??
            json?.data?.products ??
            json?.data ??
            [];

        const meta = json?.data?.meta ?? json?.meta ?? defaultMeta;

        return { products, meta };
    } catch (error) {
        console.error("Failed to fetch products", error);
        return { products: [], meta: defaultMeta };
    }
}
