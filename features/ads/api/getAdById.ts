import { getAuthHeaders } from "@/features/auth/server";
import { Ad, AdDetailsApiResponse } from "../types/type";
import { ADS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { baseURL } from "@/shared/constants/data";


export async function fetchAdDetails(
  query: string,
  id: number,
  locale: string = "en"
): Promise<Ad | null> {
  const url = `${baseURL}${ADS_ENDPOINTS.ad_details(id)}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
    const res = await fetch(url, { headers });

    if (!res.ok) {
      console.error("Failed to fetch ad details", res.status, res.statusText);
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("Unexpected content type while fetching ad details", contentType);
      return null;
    }

    const json: AdDetailsApiResponse = await res.json();
    console.log("details headers ",headers)
    console.log("ad details", json);
    
    // Check if the API response is successful
    if (!json.status) {
      console.error("API returned error status", json.message);
      return null;
    }
    
    return json.data;
  } catch (err) {
    console.error("Error fetching ad details", err);
    return null;
  }
}
