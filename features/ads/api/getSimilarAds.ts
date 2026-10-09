
import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { ADS_ENDPOINTS, USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { Ad, AdsResponse } from "../types/type";

const defaultMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
};

export async function fetchSimilarAds(id:number ,query: string, locale = "en"): Promise<{ ads: Ad[]; meta: AdMeta }> {
    const url = `${baseURL}${ADS_ENDPOINTS.ad_similar(id)}${query ? `?${query}` : ""}`;
    console.log(url)
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(url, {
            headers,
            cache: "no-store",
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            console.error("Failed to fetch ads", res.status);
            return { ads: [], meta: defaultMeta };
        }

        const json: AdsResponse = await res.json();
        console.log("ads", json);

        // Handle the actual API response structure
        const ads = json?.data ?? [];
        
        return  ads;
    } catch (error) {
        console.error("Failed to fetch ads", error);
        return { ads: [], meta: defaultMeta };
    }
}
