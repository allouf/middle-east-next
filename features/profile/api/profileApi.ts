import api from "@/lib/api";
import { profileUrl, updateUserProfile } from "@/shared/constants/urls";
import { ProfileApiResponse } from "../types";
import {
  UpdateCompanyProfileRequest,
  UpdateConsumerProfileRequest,
} from "@/shared/types/user/profiles";

export const fetchProfile = async (): Promise<ProfileApiResponse> => {
  const response = await api.get(profileUrl);
  return response.data;
};

export const updateProfile = async (
  payload: UpdateConsumerProfileRequest | UpdateCompanyProfileRequest
): Promise<ProfileApiResponse> => {
  const response = await api.post(updateUserProfile, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
