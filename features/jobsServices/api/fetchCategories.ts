import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { Categorie, CatMeta, CatResponse } from "../types/jobs.types";

const defaultMeta: CatMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
};

export async function fetchJobs(
  query: string,
  locale = "en"
): Promise<{ categories: Categorie[]; meta: CatMeta }> {


  const url = `${baseURL}${JOBS_ENDPOINTS.getActiveCat}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);

    const res = await fetch(url, {
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return { categories: [], meta: defaultMeta };
    }

    const json: CatResponse = await res.json();
    const categories = json?.data?.categories ?? [];
    const meta = json?.data?.meta ?? defaultMeta;

    return { categories, meta };

  } catch (error) {
    return { categories: [], meta: defaultMeta };
  }
}
