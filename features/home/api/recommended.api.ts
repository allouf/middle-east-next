import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

/**
 * Fetch recommended products (public - no auth required)
 */
export async function fetchRecommendedProducts(locale: string) {
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(
            `${baseURL}${USER_ENDPOINTS.Sponsored_Products}`,
            {
                headers,
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch recommended products", res.status);
            return [];
        }

        const json = await res.json();
        return json?.data ?? [];
    } catch (error) {
        console.error("Failed to fetch recommended products", error);
        return [];
    }
}

/**
 * Fetch personalized recommendations (requires auth)
 * Returns personalized products based on user's history
 */
export async function fetchPersonalizedRecommendations(locale: string) {
    try {
        const headers = await getAuthHeaders(locale);

        const res = await fetch(
            `${baseURL}/home/personalized`,
            {
                headers: {
                    ...headers,
                },
                next: { revalidate: 0 }, // No cache for personalized content
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch personalized recommendations", res.status);
            return [];
        }

        const json = await res.json();
        return json?.data ?? [];
    } catch (error) {
        console.error("Failed to fetch personalized recommendations", error);
        return [];
    }
}
