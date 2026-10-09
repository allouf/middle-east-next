import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import type { CompanyProfile } from "../types/company.types";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";

type CompanyByIdResponse = {
  status: boolean;
  message: string;
  data: CompanyProfile;
};

export async function fetchCompanyById(
  id: string | number,
  locale = "en"
): Promise<CompanyProfile | null> {
  const url = `${baseURL}${JOBS_ENDPOINTS.companyProfile}/${id}`;

  try {
    const headers = await getAuthHeaders(locale);

    const res = await fetch(url, {
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return null;
    }

    const json: CompanyByIdResponse = await res.json();

    if (!json?.status || !json?.data) {
      return null;
    }

    return json.data;
  } catch (error) {
    return null;
  }
}
