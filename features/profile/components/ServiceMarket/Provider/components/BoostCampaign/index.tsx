"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { BoostData, BoostCampaignFilters } from "./types/boostCampaign.types";
import BoostCampaignHeader from "./components/BoostCampaignHeader";
import BoostCampaignTable from "./components/Table";
import CreateBoostForm from "./components/CreateForm";
import { useBoostCampaign } from "../../hooks/BoostCampaign/useBoostCampaign";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";

export default function BoostCampaign() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") || "list";
  const [filters, setFilters] = useState<BoostCampaignFilters>({
    page: 1,
    per_page: 10,
  });

  const {
    loading,
    error,
    campaigns,
    meta,
    fetchCampaigns,
  } = useBoostCampaign();

  const totalCampaigns = meta?.total || 0;

  // Fetch campaigns when filters change
  useEffect(() => {
    fetchCampaigns(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCreateBoost = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "create");
    router.push(`?${params.toString()}`);
  };

  const handleBackToList = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    router.push(`?${params.toString()}`);
  };

  const handleRetry = () => {
    fetchCampaigns(filters);
  };

  const handlePaymentConfirmed = () => {
    fetchCampaigns(filters);
    handleBackToList();
  };

  if (error) {
    return <ErrorWithRetry onRetry={handleRetry} />;
  }

  if (view === "create") {
    return <CreateBoostForm onClose={handleBackToList} onPaymentConfirmed={handlePaymentConfirmed} />;
  }

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <BoostCampaignHeader onCreateBoost={handleCreateBoost} />
      <BoostCampaignTable data={campaigns} loading={loading} />
    </div>
  );
}
