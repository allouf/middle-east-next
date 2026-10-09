
import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

export async function fetchBestSellers(locale: string) {
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(
            `${baseURL}${USER_ENDPOINTS.Best_Seller_Products}`,
            {
                headers,
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch best sellers", res.status);
            return [];
        }

        const json = await res.json();
        // console.log(json);
        return json?.data ?? [];
    } catch (error) {
        console.error("Failed to fetch best sellers", error);
        return [];
    }
}
