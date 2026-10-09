import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ServiceProjectsResponse } from "../types/type";

export async function fetchServiceProjects(id: number, query: string = "", locale = "en"): Promise<ServiceProjectsResponse["data"] | null> {
    const url = `${baseURL}${SERVICES_PUBLIC_ENDPOINTS.getServiceProjects(id)}${query ? `?${query}` : ""}`;
    // console.log(url)
    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(url, {
            headers,
            cache: "no-store",
            next: { revalidate: 0 },
        });

        // console.log("res", res)

        if (!res.ok) {
            console.error("Failed to fetch service projects", res.status);
            return null;
        }

        const json: ServiceProjectsResponse = await res.json();
        // console.log("service projects", json);

        return json?.data ?? null;
    } catch (error) {
        console.error("Failed to fetch service projects", error);
        return null;
    }
}
