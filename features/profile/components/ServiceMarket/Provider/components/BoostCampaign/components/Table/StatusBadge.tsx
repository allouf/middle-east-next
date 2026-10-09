import { Tag } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface StatusBadgeProps {
  status: string;
}

interface StatusConfig {
  color: string;
  bgColor: string;
  borderColor?: string;
  translationKey: string;
  defaultValue: string;
}

const statusConfigs: Record<string, StatusConfig> = {
  ACTIVE: {
    color: "#10B981",
    bgColor: "#D1FAE5",
    translationKey: "serviceMarket.boostCampaign.status.active",
    defaultValue: "Active",
  },
  PENDING: {
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    translationKey: "serviceMarket.boostCampaign.status.pending",
    defaultValue: "Pending",
  },
  EXPIRED: {
    color: "#6B7280",
    bgColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    translationKey: "serviceMarket.boostCampaign.status.expired",
    defaultValue: "Expired",
  },
  PAUSED: {
    color: "#3B82F6",
    bgColor: "#DBEAFE",
    translationKey: "serviceMarket.boostCampaign.status.paused",
    defaultValue: "Paused",
  },
  TERMINATED: {
    color: "#EF4444",
    bgColor: "#FEE2E2",
    translationKey: "serviceMarket.boostCampaign.status.terminated",
    defaultValue: "Terminated",
  },
  UNDER_REVIEW: {
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    translationKey: "serviceMarket.boostCampaign.status.underReview",
    defaultValue: "Under Review",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  const config = statusConfigs[status] || {
    color: "#6B7280",
    bgColor: "#F3F4F6",
    translationKey: "",
    defaultValue: status || "-",
  };

  const translatedStatus = config.translationKey
    ? t(config.translationKey, { defaultValue: config.defaultValue })
    : config.defaultValue;

  return (
    <Tag
      className="m-0 rounded-full px-3 py-1 text-xs font-medium border"
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor || config.bgColor,
      }}
    >
      {translatedStatus}
    </Tag>
  );
}
