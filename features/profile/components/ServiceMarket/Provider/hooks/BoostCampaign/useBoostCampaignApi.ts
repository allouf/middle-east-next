"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import { boostCampaignService, BoostCampaignListResponse } from "../../services/boostCampaign.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import {
  BoostData,
  BoostCampaignFilters,
  BoostCampaignSubmission,
  BoostCampaignMeta,
} from "../../components/BoostCampaign/types/boostCampaign.types";
import { RequestOptions } from "../../types/provider.types";

export const useBoostCampaignApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<Record<string, string[]> | null>(null);
  const [campaigns, setCampaigns] = useState<BoostData[]>([]);
  const [meta, setMeta] = useState<BoostCampaignMeta | null>(null);

  const fetchBoostCampaigns = useCallback(
    async (params?: BoostCampaignFilters, options?: RequestOptions<BoostCampaignListResponse>) => {
      setLoading(true);
      setError(null);
      setValidationError(null);

      try {
        const response = await boostCampaignService.getBoostCampaigns(params, {
          ...options,
          onSuccess: (data) => {
            const payload = (data as any)?.data ?? data;
            const normalizedCampaigns = Array.isArray(payload?.boost_campaigns)
              ? payload.boost_campaigns
              : Array.isArray(payload?.campaigns)
                ? payload.campaigns
                : Array.isArray(payload?.data)
                  ? payload.data
                  : Array.isArray(payload)
                    ? payload
                    : [];

            setCampaigns(normalizedCampaigns);
            setMeta(payload?.meta || null);

            if (options?.showMessage) {
              messageApi.success(data.message || "Boost campaigns loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const axiosErr = error as any;
            
            // Extract validation errors if present
            if (axiosErr?.response?.data?.errors) {
              setValidationError(axiosErr.response.data.errors);
            }
            
            const errorMessage = getApiErrorMessage(error, "Failed to fetch boost campaigns");
            setError(errorMessage);

            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  const createBoostCampaign = useCallback(
    async (
      data: BoostCampaignSubmission,
      options?: RequestOptions<BoostData>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await boostCampaignService.createBoostCampaign(data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Boost campaign created successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const axiosErr = error as any;
            
            // Extract validation errors if present
            if (axiosErr?.response?.data?.errors) {
              setValidationError(axiosErr.response.data.errors);
            }
            
            const errorMessage = getApiErrorMessage(error, "Failed to create boost campaign");
            setError(errorMessage);

            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  return {
    loading,
    error,
    validationError,
    campaigns,
    meta,
    fetchBoostCampaigns,
    createBoostCampaign,
    setError,
    setValidationError,
  };
};
