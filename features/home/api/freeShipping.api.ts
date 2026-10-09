
import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

export async function fetchFreeShippingProducts(locale: string) {
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(
            `${baseURL}${USER_ENDPOINTS.Free_Shipping_Products}`,
            {
                headers,
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch free shipping products", res.status);
            return [];
        }

        const json = await res.json();
        return json?.data ?? [];
    } catch (error) {
        console.error("Failed to fetch free shipping products", error);
        return [];
    }
}
