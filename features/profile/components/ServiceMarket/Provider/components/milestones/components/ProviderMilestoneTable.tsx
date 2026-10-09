"use client";

import React, { useMemo, useState } from "react";
import { Table, Switch, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Eye, Edit2, Trash2 } from "lucide-react";
import "./ProviderMilestoneTable.css";
import type { ProviderMilestoneListItem } from "../../../services/provider-milestones.service";

type Props = {
  data: ProviderMilestoneListItem[];
  loading?: boolean;
  /** Returns a Promise so the table can show a per-row spinner while it's in flight. */
  onToggleActivation?: (id: number, nextValue: boolean) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
};

const DELIVERY_MODEL_LABEL: Record<string, string> = {
  hybrid: "Hybrid",
  onsite: "Onsite",
  remote: "Remote",
};

export default function ProviderMilestoneTable({
  data,
  loading = false,
  onToggleActivation,
  onDelete,
  onView,
  onEdit,
}: Props) {
  const { t } = useTranslation();

  // Track which rows are mid-action so we don't double-fire and can show
  // the right spinner / disabled state.
  const [busyTogglingId, setBusyTogglingId] = useState<number | null>(null);
  const [busyDeletingId, setBusyDeletingId] = useState<number | null>(null);

  const handleToggle = async (id: number, next: boolean) => {
    if (!onToggleActivation) return;
    setBusyTogglingId(id);
    try {
      await onToggleActivation(id, next);
    } finally {
      setBusyTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!onDelete) return;
    setBusyDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setBusyDeletingId(null);
    }
  };

  const columns: ColumnsType<ProviderMilestoneListItem> = useMemo(
    () => [
      {
        title: t("providerMilestones.table.no", { defaultValue: "No" }),
        key: "no",
        render: (_: unknown, _record: ProviderMilestoneListItem, index: number) => (
          <span className="text-[#00664F] font-medium">{index + 1}</span>
        ),
      },
      {
        title: t("providerMilestones.table.name", { defaultValue: "Milestone Name" }),
        dataIndex: "title",
        key: "title",
        render: (text: string) => <span className="text-gray-700 font-medium">{text}</span>,
      },
      {
        title: t("providerMilestones.table.duration", { defaultValue: "Duration" }),
        dataIndex: "duration_days",
        key: "duration_days",
        render: (days: number) => <span className="text-gray-600">{days} days</span>,
      },
      {
        title: t("providerMilestones.table.deliveryModel", { defaultValue: "Delivery Model" }),
        dataIndex: "delivery_model",
        key: "delivery_model",
        render: (value: string | null) => (
          <span className="text-gray-600">{value ? DELIVERY_MODEL_LABEL[value] ?? value : "—"}</span>
        ),
      },
      {
        title: t("providerMilestones.table.requestModifications", { defaultValue: "Request Modifications" }),
        dataIndex: "request_modification_days",
        key: "request_modification_days",
        render: (days: number | null) => (
          <span className="text-gray-600">{days != null ? `${days} days` : "—"}</span>
        ),
      },
      {
        title: t("providerMilestones.table.totalBudget", { defaultValue: "Total Budget" }),
        dataIndex: "total_budget",
        key: "total_budget",
        render: (value: number) => (
          <span className="text-[#00664F] font-bold">${value.toFixed(2)}</span>
        ),
      },
      {
        title: t("providerMilestones.table.activation", { defaultValue: "Activation" }),
        dataIndex: "activation_status",
        key: "activation_status",
        render: (isActive: boolean, record) => (
          <Switch
            checked={isActive}
            loading={busyTogglingId === record.id}
            onChange={(next) => handleToggle(record.id, next)}
            className="[&.ant-switch-checked]:bg-[#00664F]"
          />
        ),
      },
      {
        title: "",
        key: "actions",
        render: (_: unknown, record) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onView?.(record.id)}
              className="text-[#00664F] hover:opacity-80"
              aria-label={t("common.view", { defaultValue: "View" })}
            >
              <Eye size={18} />
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(record.id)}
              className="text-[#00664F] hover:opacity-80"
              aria-label={t("common.edit", { defaultValue: "Edit" })}
            >
              <Edit2 size={18} />
            </button>
            <Popconfirm
              title={t("providerMilestones.deleteConfirmTitle", {
                defaultValue: "Delete this milestone template?",
              })}
              description={t("providerMilestones.deleteConfirmDesc", {
                defaultValue: "Buyers won't be able to order it. This can't be undone.",
              })}
              okText={t("common.delete", { defaultValue: "Delete" })}
              cancelText={t("common.cancel", { defaultValue: "Cancel" })}
              okButtonProps={{ danger: true, loading: busyDeletingId === record.id }}
              onConfirm={() => handleDelete(record.id)}
            >
              <button
                type="button"
                disabled={busyDeletingId === record.id}
                className="text-red-500 hover:opacity-80 disabled:opacity-40"
                aria-label={t("common.delete", { defaultValue: "Delete" })}
              >
                <Trash2 size={18} />
              </button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, busyTogglingId, busyDeletingId, onView, onEdit],
  );

  return (
    <div className="w-full bg-white rounded-[10px] overflow-hidden border border-gray-200">
      <Table<ProviderMilestoneListItem>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={false}
        className="provider-milestones-table"
      />
    </div>
  );
}
