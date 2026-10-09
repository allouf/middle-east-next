"use client";

import React, { useMemo } from "react";
import { Table, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BsEyeFill, BsPencilFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import Pagination from "./Pagination";
import { RequestItem, RequestStatus } from "../../../types/Rfq";
import "./RequestTable.css";

type FilterValue = "All" | RequestStatus;

interface RequestTableProps {
  requests: RequestItem[];
  statusFilter: FilterValue;
  onStatusFilterChange: (value: FilterValue) => void;
  currentPage: number;
  totalPages: number;
  total: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onViewRequest?: (requestId: string) => void;
  onEditRequest?: (requestId: string) => void;
  loading?: boolean;
}

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

export default function RequestTable({
  requests,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewRequest,
  onEditRequest,
  loading,
}: RequestTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<RequestItem> = useMemo(
    () => [
      {
        title: t("serviceMarket.rfq.table.id"),
        dataIndex: "reference_number",
        key: "reference_number",
        width: 80,
        ellipsis: true,
        render: (ref: string) => (
          <span className="text-[#16A34A] font-semibold text-xs md:text-sm whitespace-nowrap">{ref}</span>
        ),
      },
      {
        title: t("serviceMarket.rfq.table.title"),
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        render: (title: string) => (
          <span className="text-[#475467] font-medium text-xs md:text-sm">{title}</span>
        ),
      },
      {
        title: t("serviceMarket.rfq.table.category"),
        dataIndex: "category",
        key: "category",
        width: 150,
        ellipsis: true,
        render: (category: { id: number; name: string }) => (
          <CategoryBadge category={category?.name} />
        ),
      },
      {
        title: t("serviceMarket.rfq.table.requested"),
        dataIndex: "created_at",
        key: "created_at",
        width: 120,
        ellipsis: true,
        render: (date: string) => (
          <span className="text-[#667085] text-xs md:text-sm whitespace-nowrap">{date?.split(" ")[0]}</span>
        ),
      },
      {
        title: t("serviceMarket.rfq.table.deadline"),
        dataIndex: "deadline_date",
        key: "deadline_date",
        width: 120,
        ellipsis: true,
        render: (date: string) => (
          <span className="text-[#667085] text-xs md:text-sm whitespace-nowrap">{date}</span>
        ),
      },
      {
        title: t("serviceMarket.rfq.table.quotes"),
        dataIndex: "quotes_count",
        key: "quotes_count",
        width: 80,
        align: "center" as const,
        render: (count: number) => (
          <span className="text-[#475467] font-semibold text-lg md:text-[28px]">
            {String(count ?? 0).padStart(2, "0")}
          </span>
        ),
      },
      {
        title: t("serviceMarket.rfq.table.status"),
        dataIndex: "status",
        key: "status",
        width: 80,
        render: (status: RequestStatus) => <StatusBadge status={status} />,
      },
      {
        title: (
          <div className="flex justify-end [&_.ant-select-selector]:!bg-[#CADED9] [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-0 [&_.ant-select-selection-item]:!text-center">
            <Select
              value={statusFilter}
              onChange={onStatusFilterChange}
              style={{ minWidth: 120 }}
              options={[
                { value: "All", label: t("serviceMarket.rfq.table.statusFilter") },
                { value: "Open", label: t("serviceMarket.rfq.status.open") },
                { value: "Awarded", label: t("serviceMarket.rfq.status.awarded") },
                { value: "Canceled", label: t("serviceMarket.rfq.status.canceled") },
                { value: "Expired", label: t("serviceMarket.rfq.status.expired") },
              ]}
            />
          </div>
        ),
        key: "actions",
        align: "right",
         width: 80,
        render: (_: any, record: RequestItem) => (
          <div className="flex items-center justify-end gap-1 w-full">
            <ActionBtn
              title={t("serviceMarket.rfq.actions.view")}
              onClick={() => onViewRequest?.(String(record.id))}
              color="text-[#00664F]"
              hoverBg="hover:bg-[#00664F]/20"
            >
              <BsEyeFill className="w-4 h-4" />
            </ActionBtn>

            {record.status === 'Open' && (
              <ActionBtn
                title={t("serviceMarket.rfq.actions.edit")}
                onClick={() => onEditRequest?.(String(record.id))}
                color="text-[#00664F]"
                hoverBg="hover:bg-[#00664F]/20"
              >
                <BsPencilFill className="w-4 h-4" />
              </ActionBtn>
            )}
          </div>
        ),
      },
    ],
    [t, statusFilter, onStatusFilterChange, onViewRequest, onEditRequest]
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#00664F33] min-w-[600px]">
        <Table<RequestItem>
          columns={columns}
          dataSource={requests}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={false}
          loading={loading}
          locale={{ emptyText: t('serviceMarket.rfq.table.noData') }}
          className="request-table"
        />
      </div>

      <div className="mt-4 w-full">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </div>
    </div>
  );
}
