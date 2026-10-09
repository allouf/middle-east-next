import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { PUBLIC_PROVIDER_PROFILE, SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ServiceProviderProfile, ServiceProviderProfileResponse } from "../types/type";

export async function fetchProfileData(id: number, query: string = "", locale = "en"): Promise<ServiceProviderProfile | null> {
    const url = `${baseURL}${PUBLIC_PROVIDER_PROFILE.about(id)}${query ? `?${query}` : ""}`;
    console.log(url)
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(url, {
            headers,
            cache: "no-store",
            next: { revalidate: 0 },
        });

        console.log("res", res)

        if (!res.ok) {
            console.error("Failed to fetch provider profile", res.status);
            return null;
        }

        const json: ServiceProviderProfileResponse = await res.json();
        console.log("provider profile", json);

        return json?.data ?? null;
    } catch (error) {
        console.error("Failed to fetch provider profile", error);
        return null;
    }
}
