"use client";

import React, { useMemo, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Lock, FileSignature, CreditCard, Loader2 } from "lucide-react";
import "./MilestoneTable.css";

export type MilestoneTablePhase = {
  id: number;
  service_name: string;
  category_name: string;
  deadline: string | null;
  budget: number | string;
  payment_status: string; // 'unpaid' | 'in_escrow' | 'paid' | 'pending' | 'failed' etc
  status: string;          // backend MilestoneOrderPhaseStatus
  is_cursor: boolean;
};

type CursorPayload = {
  phase_id: number;
  action: string; // 'pay' | 'start' | 'deliver' | 'review' | 'deliver_revision' | 'none'
  phase_name: string;
  status: string;
  payment_status: string;
} | null;

type Props = {
  phases: MilestoneTablePhase[];
  cursor: CursorPayload;
  onPay?: (phaseId: number) => void | Promise<void>;
  loading?: boolean;
};

const PAYMENT_LABEL: Record<string, { text: string; classes: string; icon: React.ReactNode }> = {
  paid:       { text: "Paid",       classes: "bg-blue-50 text-blue-600",     icon: <FileSignature className="w-3 h-3" /> },
  in_escrow:  { text: "In Escrow",  classes: "bg-purple-50 text-purple-600", icon: <Lock className="w-3 h-3" /> },
  pending:    { text: "Pending",    classes: "bg-amber-50 text-amber-700",   icon: <Lock className="w-3 h-3" /> },
  unpaid:     { text: "Unpaid",     classes: "bg-gray-100 text-gray-600",    icon: <Lock className="w-3 h-3" /> },
  failed:     { text: "Failed",     classes: "bg-red-50 text-red-600",       icon: <Lock className="w-3 h-3" /> },
};

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  IN_REVISION: "In Revision",
};

export default function MilestoneTable({ phases, cursor, onPay, loading = false }: Props) {
  const { t } = useTranslation();
  const [payingPhaseId, setPayingPhaseId] = useState<number | null>(null);

  const handlePayClick = async (phaseId: number) => {
    if (!onPay) return;
    setPayingPhaseId(phaseId);
    try {
      await onPay(phaseId);
    } finally {
      setPayingPhaseId(null);
    }
  };

  const columns: ColumnsType<MilestoneTablePhase> = useMemo(
    () => [
      {
        title: t("milestones.table.phase", { defaultValue: "Phase" }),
        dataIndex: "sort_order",
        key: "sort_order",
        render: (_: unknown, _record: MilestoneTablePhase, index: number) => (
          <span className="text-[#00664F] font-medium">#{index + 1}</span>
        ),
      },
      {
        title: t("milestones.table.service", { defaultValue: "Service" }),
        dataIndex: "service_name",
        key: "service_name",
        render: (text: string) => <span className="text-gray-700 font-medium">{text}</span>,
      },
      {
        title: t("milestones.table.category", { defaultValue: "Category" }),
        dataIndex: "category_name",
        key: "category_name",
        render: (text: string) => (
          <span className="inline-block px-3 py-1 bg-[#00664F1A] text-[#00664F] font-medium text-xs rounded-full">
            {text}
          </span>
        ),
      },
      {
        title: t("milestones.table.deadline", { defaultValue: "Deadline" }),
        dataIndex: "deadline",
        key: "deadline",
        render: (date: string | null) => (
          <span className="text-gray-500">
            {date ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date)) : "—"}
          </span>
        ),
      },
      {
        title: t("milestones.table.budget", { defaultValue: "Budget" }),
        dataIndex: "budget",
        key: "budget",
        render: (budget: number | string) => (
          <span className="text-[#00664F] font-bold">{Number(budget).toFixed(2)}$</span>
        ),
      },
      {
        title: t("milestones.table.payment", { defaultValue: "Payment" }),
        dataIndex: "payment_status",
        key: "payment_status",
        render: (value: string) => {
          const meta = PAYMENT_LABEL[value] ?? PAYMENT_LABEL.unpaid;
          return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${meta.classes}`}>
              {meta.icon}
              {meta.text}
            </span>
          );
        },
      },
      {
        title: t("milestones.table.status", { defaultValue: "Status" }),
        dataIndex: "status",
        key: "status",
        render: (value: string) => {
          let bgClass = "bg-gray-100 text-gray-600";
          if (value === "COMPLETED") bgClass = "bg-[#E6F4EA] text-[#00664F]";
          else if (value === "IN_PROGRESS") bgClass = "bg-orange-50 text-orange-500";
          else if (value === "DELIVERED") bgClass = "bg-blue-50 text-blue-600";
          else if (value === "PENDING_PAYMENT") bgClass = "bg-slate-100 text-slate-600";
          return (
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bgClass}`}>
              {ORDER_STATUS_LABEL[value] ?? value}
            </span>
          );
        },
      },
      {
        title: t("milestones.table.action", { defaultValue: "Action" }),
        key: "action",
        render: (_: unknown, record: MilestoneTablePhase) => {
          // Only render the action button when the BE says this phase is
          // the cursor AND its action is one we wire on the buyer side.
          // For v1 we surface the 'pay' action; other actions (deliver,
          // review, etc.) belong to the provider side or to dedicated
          // phase modals we haven't built yet.
          const isCursorPhase = cursor?.phase_id === record.id;
          if (!isCursorPhase || cursor?.action !== "pay") {
            return <span className="text-gray-300">—</span>;
          }

          const isPaying = payingPhaseId === record.id;
          return (
            <button
              type="button"
              disabled={isPaying}
              onClick={() => handlePayClick(record.id)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#00664F] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-60"
            >
              {isPaying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
              {isPaying
                ? t("milestones.payingButton", { defaultValue: "Opening..." })
                : t("milestones.payButton", { defaultValue: "Pay phase" })}
            </button>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, cursor?.phase_id, cursor?.action, payingPhaseId],
  );

  return (
    <div className="w-full bg-[#FCFCFC]">
      <Table<MilestoneTablePhase>
        columns={columns}
        dataSource={phases}
        loading={loading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={false}
        className="milestones-table min-h-[300px]"
      />
    </div>
  );
}
