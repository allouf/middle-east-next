import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type { Job } from "../types/jobs.types";

type JobByIdResponse =
    {
        data: {
            jobs: Job[],
        }
    }

export async function fetchJobByICompanyId(
    id: string | number,
    locale = "en"
): Promise<JobByIdResponse | null> {
    const url = `${baseURL}${JOBS_ENDPOINTS.companyProfile}/${id}/jobs`;

    try {
        const headers = await getAuthHeaders(locale);
        const res = await fetch(url, {
            headers,
            cache: "no-store",
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            // Only log unexpected errors, not 404s which are expected for non-existent jobs
            if (res.status !== 404) {
                console.error("Failed to fetch job", res.status);
            }
            return null;
        }

        const json: JobByIdResponse = await res.json();


        // support multiple possible shapes
        const response = json as JobByIdResponse;

        return response ?? null;
    } catch (e) {
        console.error("Failed to fetch job", e);
        return null;
    }
}
