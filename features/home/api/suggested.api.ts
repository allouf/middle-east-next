
import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

export async function fetchSuggestedProducts(locale: string) {
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(
            `${baseURL}${USER_ENDPOINTS.Suggested_Products_Home}`,
            {
                headers,
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch suggested products", res.status);
            return [];
        }

        const json = await res.json();
        // console.log("home suggested",json)
        return json?.data ?? [];
    } catch (error) {
        console.error("Failed to fetch suggested products", error);
        return [];
    }
}
