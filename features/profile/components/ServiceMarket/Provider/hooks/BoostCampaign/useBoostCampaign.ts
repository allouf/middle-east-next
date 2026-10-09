"use client";

import { useCallback } from "react";
import { useBoostCampaignApi } from "./useBoostCampaignApi";
import { boostCampaignService } from "../../services/boostCampaign.service";
import { BoostCampaignFilters, BoostCampaignSubmission, BoostData } from "../../components/BoostCampaign/types/boostCampaign.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { App } from "antd";

interface UseBoostCampaignArgs {
  onSuccess?: () => void;
}

export const useBoostCampaign = (args: UseBoostCampaignArgs = {}) => {
  const { message: messageApi } = App.useApp();
  const apiHook = useBoostCampaignApi();

  const createCampaign = useCallback(async (
    data: BoostCampaignSubmission,
    options?: { showMessage?: boolean }
  ) => {
    try {
      const result = await apiHook.createBoostCampaign(data, {
        showMessage: options?.showMessage ?? true,
        onSuccess: () => {
          args?.onSuccess?.();
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to create boost campaign" };
    }
  }, [apiHook, args?.onSuccess]);

  const fetchCampaigns = useCallback(async (filters?: BoostCampaignFilters) => {
    try {
      const result = await apiHook.fetchBoostCampaigns(filters, {
        showMessage: false,
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to fetch boost campaigns" };
    }
  }, [apiHook]);

  return {
    ...apiHook,
    createCampaign,
    fetchCampaigns,
  };
};
