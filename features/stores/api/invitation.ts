import { baseURL } from "@/shared/constants/data";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import { InvitationResponse } from "@/features/stores/types/invite";

export type { InvitationResponse } from "@/features/stores/types/invite";

export const fetchInvitationPreview = async (token: string): Promise<InvitationResponse> => {
    const url = `${baseURL}${STORE_ENDPOINT.previewInvitations(token)}` ;
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch invitation preview: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching invitation preview:', error);
    throw error;
  }
};