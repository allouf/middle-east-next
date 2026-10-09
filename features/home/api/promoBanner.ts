
import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

export async function fetchPromoBanner(locale: string) {
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(
            `${baseURL}${USER_ENDPOINTS.Pre_Order}`,
            {
                headers,
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch promo banner", res.status);
            return [];
        }

        const json = await res.json();
        return json?.data ?? [];
    } catch (error) {
        console.error("Failed to fetch promo banner", error);
        return [];
    }
}
