import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

export interface HomeBannerResponse {
    carousel: any[];
    featured: any[];
    banners: any[];
}

export async function fetchHomeBanner(
    locale: string
): Promise<HomeBannerResponse> {
    try {
        const headers = await getAuthHeaders(locale);
        const [carouselRes, featuredRes, bannersRes] = await Promise.all([
            fetch(`${baseURL}${USER_ENDPOINTS.Carousel}`, {
                headers,
                next: { revalidate: 60 },
            }),
            fetch(`${baseURL}${USER_ENDPOINTS.Featured_Products}`, {
                headers,
                next: { revalidate: 60 },
            }),
            fetch(`${baseURL}${USER_ENDPOINTS.Banners}`, {
                headers,
                next: { revalidate: 60 },
            }),
        ]);

        if (!carouselRes.ok || !featuredRes.ok || !bannersRes.ok) {
            console.error("Failed to fetch home banner data", {
                carousel: carouselRes.status,
                featured: featuredRes.status,
                banners: bannersRes.status,
            });
            return {
                carousel: [],
                featured: [],
                banners: [],
            };
        }

        const [carouselJson, featuredJson, bannersJson] = await Promise.all([
            carouselRes.json(),
            featuredRes.json(),
            bannersRes.json(),
        ]);

        return {
            carousel: carouselJson?.data ?? [],
            featured: featuredJson?.data ?? [],
            banners: bannersJson?.data ?? [],
        };
    } catch (error) {
        console.error("Failed to fetch home banner", error);
        return {
            carousel: [],
            featured: [],
            banners: [],
        };
    }
}
