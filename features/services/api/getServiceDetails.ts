import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ServiceDetails, ServiceDetailsResponse } from "../types/type";

export async function fetchServiceDetails(id: number, query: string = "", locale = "en"): Promise<ServiceDetails | null> {
    const url = `${baseURL}${SERVICES_PUBLIC_ENDPOINTS.getDetails(id)}${query ? `?${query}` : ""}`;
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
            console.error("Failed to fetch service details", res.status);
            return null;
        }

        const json: ServiceDetailsResponse = await res.json();
        console.log("service details", json);

        return json?.data ?? null;
    } catch (error) {
        console.error("Failed to fetch service details", error);
        return null;
    }
}
