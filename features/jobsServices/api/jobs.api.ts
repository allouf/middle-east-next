import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { Job, JobsMeta, JobsResponse, CompaniesResponse } from "../types/jobs.types";
import { CompanyProfile } from "../types/company.types";
import api from "@/lib/api";

const defaultMeta: JobsMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
};

export async function fetchJobs(
  query: string,
  locale = "en"
): Promise<{ jobs: Job[] | CompanyProfile[]; meta: JobsMeta }> {

  // Extract scope from query to determine which endpoint to use
  const urlParams = new URLSearchParams(query);
  const scope = urlParams.get('scope');

  let endpoint: string;
  // endpoint = `${baseURL}${JOBS_ENDPOINTS.all_jobs}${query ? `?${query}` : ""}`;
  endpoint = `${JOBS_ENDPOINTS.all_jobs}${query ? `?${query}` : ""}`;

  try {
    const res = await api.get<any>(endpoint)

    if (!res.data || res.status !== 200) {
      console.error(`Failed to fetch ${scope === 'companies' ? 'companies' : 'jobs'}`, res.status);
      return { jobs: [], meta: defaultMeta };
    }

    if (scope === 'companies') {
      const json: CompaniesResponse = res.data;
      const data = json?.data ?? {};
      const companies = data.companies ?? [];
      const meta = data.meta ?? defaultMeta;
      return { jobs: companies, meta };
    } else {
      const json: JobsResponse = res.data;
      const data = json?.data ?? {};
      const jobs = data.jobs ?? [];
      const meta = data.meta ?? defaultMeta;
      return { jobs, meta };
    }

  } catch (error) {
    console.error("Failed to fetch jobs", error);
    return { jobs: [], meta: defaultMeta };
  }
}
