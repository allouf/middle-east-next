"use client";

import React, {useMemo } from "react";
import { Table, Tag, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BsEyeFill, BsPencilFill, BsTrashFill } from "react-icons/bs";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { UserAd, PaginationConfig } from "./types";
// @ts-ignore
import "./UsedMarketTable.css";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
type IdLike = string | number;


interface UsedMarketTableProps {
  data: UserAd[];
  loading: boolean;
  pagination: PaginationConfig;
  onPageChange: (page: number, pageSize: number) => void;
  onView: (id: IdLike) => void;
  onEdit: (id: IdLike) => void;
  onDelete: (id: IdLike) => void;
  refetch?: () => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const ActionBtn = ({
  title,
  onClick,
  color,
  hoverBg,
  children,
}: {
  title: string;
  onClick: () => void;
  color: string;
  hoverBg: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${hoverBg}`}
  >
    <span className={`w-4 h-4 inline-flex items-center justify-center ${color}`}>
      {children}
    </span>
  </button>
);

const UsedMarketTable: React.FC<UsedMarketTableProps> = ({
  data,
  loading,
  pagination,
  onPageChange,
  onView,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation();
  const {isRTL} = useLocaleDirection();

  const renderCondition = (condition: UserAd["condition"]) => {
    const isNew = condition === "new";
    return (
      <Tag color={isNew ? "blue" : "orange"}>
        {isNew ? t("usedMarket.filters.new") : t("usedMarket.filters.used")}
      </Tag>
    );
  };
  const renderState = (state?: UserAd["state"]) => {

    const config: Record<
      StatusType,
      { color: "success" | "error" | "warning" | "default"; label: string }
    > = {
      draft: {
        color: "default",
        label: t("usedMarket.table.draft", { defaultValue: "Draft" }),
      },
      active: {
        color: "success",
        label: t("usedMarket.table.active"),
      },
      paused: {
        color: "warning",
        label: t("usedMarket.table.paused", { defaultValue: "Paused" }),
      },
      sold: {
        color: "warning",
        label: t("usedMarket.table.sold"),
      },
      expired: {
        color: "error",
        label: t("usedMarket.table.expired", { defaultValue: "Expired" }),
      },
      archived: {
        color: "default",
        label: t("usedMarket.table.archived", { defaultValue: "Archived" }),
      },
      rejected: {
        color: "error",
        label: t("usedMarket.table.rejected", { defaultValue: "Rejected" }),
      },
    };

    const fallback = {
      color: "default" as const,
      label: t("usedMarket.table.unknown"),
    };

    const { color, label } = state && config[state] ? config[state] : fallback;

    return (
      <Tag color={color} className="m-0 w-full text-center">
        {label}
      </Tag>
    );
  };


  const formatExpiryDate = (expiryDate: string | null) => {
    if (!expiryDate) return t("usedMarket.table.noExpiry");

    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0)
      return <span className="text-red-500">{t("usedMarket.table.expired")}</span>;

    if (diffDays < 3)
      return (
        <span className="text-red-500 font-semibold">
          {t("usedMarket.table.afterDay", { days: diffDays })}
        </span>
      );

    if (diffDays <= 30)
      return (
        <span className="text-black">
          {t("usedMarket.table.afterDays", { days: diffDays })}
        </span>
      );

    return expiry.toLocaleDateString();
  };

  const columns: ColumnsType<UserAd> = useMemo(
    () => [
      {
        title: t("usedMarket.table.id"),
        dataIndex: "id",
        key: "id",
        render: (id: IdLike) => <span className="font-mono text-sm">{id}</span>,
      },
      {
        title: t("usedMarket.table.title"),
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        render: (title: string) => (
          <span className="text-blueSite hover:underline cursor-pointer font-medium">
            {title}
          </span>
        ),
      },
      {
        title: t("usedMarket.table.case"),
        dataIndex: "is_price_negotiable",
        key: "case",
        render: (is_price_negotiable: boolean) =>
          is_price_negotiable ? (
            <span className="text-[#0E6B5F] font-medium">
              {t("usedMarket.case.negotiable", { defaultValue: "Negotiable" })}
            </span>
          ) : t("usedMarket.case.fixed", { defaultValue: "Not Negotiable" }),
      },
      {
        title: t("usedMarket.table.price"),
        dataIndex: "price",
        key: "price",
        render: (price: number, record: UserAd) => (
          <span className="font-semibold text-blueSite">
            {record.currency}
            {Number(price ?? 0).toLocaleString()}
          </span>
        ),
      },
      {
        title: t("usedMarket.table.condition"),
        dataIndex: "condition",
        key: "condition",
        render: renderCondition,
      },
      {
        title: t("usedMarket.table.views"),
        dataIndex: "views_count",
        key: "views",
        render: (views: number) => (
          <span className="flex items-center gap-1">
            {Number(views ?? 0).toLocaleString()} {t("usedMarket.table.viewer")}
          </span>
        ),
      },
      {
        title: t("usedMarket.table.expiryDate"),
        dataIndex: "expires_at",
        key: "expiryDate",
        render: formatExpiryDate,
      },
      {
        title: t("usedMarket.table.date"),
        dataIndex: "published_at",
        key: "date",
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
      {
        title: t("usedMarket.table.state"),
        dataIndex: "status",
        key: "status",
        render: renderState,
      },
      {
        title: t("usedMarket.table.actions"),
        key: "actions",
        fixed: "right",
        render: (_: unknown, record: UserAd) => (
          <div className="flex items-center gap-1">
            <ActionBtn
              title={t("usedMarket.actions.view")}
              onClick={() => onView(record.id)}
              color="text-[#00664F]"
              hoverBg="hover:bg-[#00664F]/20"
            >
              <BsEyeFill className="w-4 h-4" />
            </ActionBtn>

            <ActionBtn
              title={t("usedMarket.actions.edit")}
              onClick={() => onEdit(record.id)}
              color="text-[#00664F]"
              hoverBg="hover:bg-[#00664F]/20"
            >
              <BsPencilFill className="w-4 h-4" />
            </ActionBtn>

            <ActionBtn
              title={t("usedMarket.actions.delete")}
              onClick={() => onDelete(record.id)}
              color="text-[#BF2033]"
              hoverBg="hover:bg-[#BF2033]/20"
            >
              <BsTrashFill className="w-4 h-4" />
            </ActionBtn>
          </div>
        ),
      },
    ],
    [t, onView, onEdit, onDelete]
  );

  const total = pagination.total ?? 0;
  const pageSize = pagination.pageSize ?? 10;
  const current = pagination.current ?? 1;

  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const isPrevDisabled = current <= 1;
  const isNextDisabled = current * pageSize >= total;

  return (
    <div>
      <div className="bg-white rounded-b-xl shadow-sm overflow-hidden border border-[#00664F33] border-t-0">
        <Table<UserAd>
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={false}
          locale={{ emptyText: t("usedMarket.table.noData") }}
          className="used-market-table"
        />
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <span>
            {from}-{to}
          </span>
          <span>{t("usedMarket.table.of")}</span>
          <span>{total}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-700">
              {t("usedMarket.table.rowsPerPage")}
            </span>

            <Select
              value={pageSize}
              onChange={(value) => onPageChange(1, value)}
              options={PAGE_SIZE_OPTIONS.map((v) => ({ value: v, label: String(v) }))}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(current - 1, pageSize)}
              disabled={isPrevDisabled}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
             { isRTL ?<ChevronRight className="w-4 h-4"/> :<ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onPageChange(current + 1, pageSize)}
              disabled={isNextDisabled}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
             { isRTL ?<ChevronLeft className="w-4 h-4"/> :<ChevronRight className="w-4 h-4" />}

            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UsedMarketTable;
