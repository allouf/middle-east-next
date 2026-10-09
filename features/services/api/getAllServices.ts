import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ServiceListItem, ServiceMeta, ServicesResponse } from "../types/type";

const defaultMeta: ServiceMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
};

export async function fetchServices(query: string, locale = "en"): Promise<{ services: ServiceListItem[]; meta: ServiceMeta }> {
    const url = `${baseURL}${SERVICES_PUBLIC_ENDPOINTS.getAll}${query ? `?${query}` : ""}`;
    console.log(url)
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(url, {
            headers,
            cache: "no-store",
            next: { revalidate: 0 },
        });

        console.log("res",res)

        if (!res.ok) {
            console.error("Failed to fetch services", res.status);
            return { services: [], meta: defaultMeta };
        }

        const json: ServicesResponse = await res.json();
        console.log("services", json);

        // Handle the actual API response structure
        const services = json?.data?.services ?? [];
        const meta = json?.data?.meta ?? defaultMeta;

        return { services, meta };
    } catch (error) {
        console.error("Failed to fetch services", error);
        return { services: [], meta: defaultMeta };
    }
}
