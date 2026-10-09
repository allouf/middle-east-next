
import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";

export async function fetchFeaturedSection(locale: string) {
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(
            `${baseURL}/home/unique-products`,
            {
                headers,
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch featured section", res.status);
            return [];
        }

        const json = await res.json();
        return json?.data ?? [];
    } catch (error) {
        console.error("Failed to fetch featured section", error);
        return [];
    }
}
