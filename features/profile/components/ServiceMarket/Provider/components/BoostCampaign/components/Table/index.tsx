import { useTranslation } from "@/lib/i18n/useTranslation";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BoostData } from "../../types/boostCampaign.types";
import StatusBadge from "./StatusBadge";

interface BoostCampaignTableProps {
  data: BoostData[];
  loading?: boolean;
}

export default function BoostCampaignTable({ data, loading }: BoostCampaignTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<BoostData> = [
    {
      title: t("serviceMarket.boostCampaign.tableHeaders.phase", { defaultValue: "Phase" }),
      dataIndex: "phase",
      key: "phase",
      className: "font-semibold text-blueSite",
    },
    {
      title: t("serviceMarket.boostCampaign.tableHeaders.service", { defaultValue: "Service" }),
      key: "service",
      className: "text-gray-700",
      render: (_, record) => record.service_offer?.title || record.service || "-",
    },
    {
      title: t("serviceMarket.boostCampaign.tableHeaders.plan", { defaultValue: "Plan" }),
      key: "plan",
      className: "text-gray-700",
      render: (_, record) => {
        if (record.plan) {
          return typeof record.plan === 'object' ? record.plan.name : record.plan;
        }
        return "-";
      },
    },
    {
      title: t("serviceMarket.boostCampaign.tableHeaders.duration", { defaultValue: "Duration" }),
      key: "duration",
      className: "text-gray-700",
      render: (_, record) => {
        if (record.start_at && record.end_at) {
          const start = new Date(record.start_at);
          const end = new Date(record.end_at);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          return `${days} Days`;
        }
        return record.duration || "-";
      },
    },
    {
      title: t("serviceMarket.boostCampaign.tableHeaders.timeline", { defaultValue: "Timeline" }),
      key: "timeline",
      className: "text-gray-500 text-sm",
      render: (_, record) => {
        if (record.start_at && record.end_at) {
          const start = new Date(record.start_at).toLocaleDateString();
          const end = new Date(record.end_at).toLocaleDateString();
          return `${start} - ${end}`;
        }
        return record.timeline || "-";
      },
    },
    {
      title: t("serviceMarket.boostCampaign.tableHeaders.payment", { defaultValue: "Payment" }),
      key: "payment",
      className: "font-bold text-blueSite",
      render: (_, record) => {
        if (record.amount && record.currency) {
          return `${record.currency} ${record.amount}`;
        }
        return record.payment || "-";
      },
    },
    {
      title: t("serviceMarket.boostCampaign.tableHeaders.status", { defaultValue: "Status" }),
      key: "status",
      dataIndex: "status",
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <style jsx global>{`
        .boost-table .ant-table-thead > tr > th {
          background-color: var(--SiteColor, #00664f) !important;
          color: white !important;
          font-weight: 500;
          padding: 16px 24px;
          border-bottom: none;
          border-inline-end: 0 !important;
          border-right: 0 !important;
        }
        .boost-table .ant-table-thead > tr > th::before {
          display: none !important;
          width: 0 !important;
          background-color: transparent !important;
        }
        .boost-table .ant-table-tbody > tr > td {
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        .boost-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none;
        }
        .boost-table .ant-table-wrapper {
          background: transparent;
        }
      `}</style>
      <Table
        className="boost-table"
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        scroll={{ x: 800 }}
        loading={loading}
      />
    </div>
  );
}
