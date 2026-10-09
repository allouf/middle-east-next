"use client";

import React, { useMemo } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useRouter, useSearchParams } from "next/navigation";
import "./DisputeTable.css";

export type DisputeItem = {
  key: string;
  id: string;
  reason: string;
  provider: string;
  customer: string;
  opened_against: string;
  deadline: string;
  escrow: string;
  opened_by?: string;
  status: "Resolved" | "Revision" | "Under Review" | string;
};

const mockData: DisputeItem[] = [
  {
    key: "1",
    id: "#ORD-5432",
    reason: "Inconsistent Brand Representation",
    provider: "Apex Design Studio",
    customer: "John Doe",
    opened_against: "Provider",
    deadline: "Nov 07, 2026",
    escrow: "40.00$",
    opened_by: "client",
    status: "Resolved",
  },
  {
    key: "2",
    id: "#ORD-2345",
    reason: "Poor Mobile Optimization",
    provider: "PixelCraft Designs",
    customer: "Jane Smith",
    opened_against: "Me",
    deadline: "Nov 08, 2026",
    escrow: "70.00$",
    opened_by: "provider",
    status: "Revision",
  },
  {
    key: "3",
    id: "#ORD-1011",
    reason: "Website Functionality Issue",
    provider: "DevTech Solutions",
    customer: "Alice Johnson",
    opened_against: "Customer",
    deadline: "Nov 12, 2026",
    escrow: "90.00$",
    opened_by: "provider",
    status: "Under Review",
  },
];

type Props = {
  data?: DisputeItem[];
  loading?: boolean;
  pagination?: any;
};

export default function DisputeTable({ data = mockData, loading = false, pagination = false }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const columns: ColumnsType<DisputeItem> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        render: (text: string) => <span className="text-[#00664F] font-medium text-[13px]">{text}</span>,
      },
      {
        title: "Dispute Reason",
        dataIndex: "reason",
        key: "reason",
        render: (text: string) => <span className="text-gray-600 text-[13px] font-medium">{text}</span>,
      },
      {
        title: "Provider",
        dataIndex: "provider",
        key: "provider",
        render: (text: string) => <span className="text-gray-600 text-[13px]">{text}</span>,
      },
      {
        title: "Customer",
        dataIndex: "customer",
        key: "customer",
        render: (text: string) => <span className="text-gray-600 text-[13px]">{text}</span>,
      },
      {
        title: "Opened Against",
        dataIndex: "opened_against",
        key: "opened_against",
        render: (text: string) => (
          <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded capitalize ${
            text === 'Me' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'
          }`}>
            {text}
          </span>
        ),
      },
      {
        title: "Deadline",
        dataIndex: "deadline",
        key: "deadline",
        render: (text: string) => <span className="text-gray-500 text-[13px]">{text}</span>,
      },
      {
        title: "Escrow",
        dataIndex: "escrow",
        key: "escrow",
        render: (text: string) => <span className="text-[#00664F] font-bold text-[14px]">{text}</span>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text: string) => {
          let bgClass = "bg-gray-100 text-gray-600 border border-transparent";
          if (text === "Resolved" || text === "CLOSED") bgClass = "bg-[#E6F4EA] text-[#00664F]";
          if (text === "Revision" || text === "REVISION") bgClass = "bg-orange-50 text-orange-500";
          if (text === "Under Review" || text === "REVIEW") bgClass = "bg-gray-100 border border-gray-200 text-gray-500";
          if (text === "OPEN") bgClass = "bg-blue-50 text-blue-500";
          
          return (
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bgClass}`}>
              {text}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="w-full bg-[#FCFCFC] overflow-x-auto rounded-[8px]">
      <Table<DisputeItem>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="key"
        scroll={{ x: "max-content" }}
        pagination={pagination}
        className="disputes-table min-h-[400px]"
        onRow={(record) => {
          return {
            onClick: () => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('subTab', 'dispute_details');
              params.set('disputeId', record.key);
              router.push(`?${params.toString()}`);
            },
            className: "cursor-pointer hover:bg-gray-50 transition-colors",
          };
        }}
      />
    </div>
  );
}
