import { useTranslation } from "@/lib/i18n/useTranslation";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";

interface BoostCampaignHeaderProps {
  onCreateBoost?: () => void;
}

export default function BoostCampaignHeader({ onCreateBoost }: BoostCampaignHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 bg-blueSite rounded-full"></div>
        <h1 className="text-xl md:text-[28px] font-bold text-[#1A1A1A]">
          {t("serviceMarket.boostCampaign.title", { defaultValue: "My Boosts" })}
        </h1>
      </div>
      <Button
        onClick={onCreateBoost}
        unstyled
        className="!h-11 !px-5 bg-blueSite rounded-xl text-white !text-sm !font-semibold flex items-center gap-2 transition-colors hover:bg-blueSiteHover shadow-sm"
      >
        <Plus className="h-4 w-4" />
        {t("serviceMarket.boostCampaign.createBtn", { defaultValue: "Create New Boost" })}
      </Button>
    </div>
  );
}
