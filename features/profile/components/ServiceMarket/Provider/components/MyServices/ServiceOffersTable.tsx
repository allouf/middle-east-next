"use client";

import React, { useMemo } from "react";
import { Table, Tag, Select, Button as AntButton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BsEyeFill, BsPencilFill, BsTrashFill } from "react-icons/bs";
import { useTranslation } from "@/lib/i18n/useTranslation";
import "./ServiceOffersTable.css";

export type ServiceOffer = {
    id: number;
    title: string;
    description: string;
    type: string;
    delivery_model: string;
    plans: any[];
    is_active: boolean;
    status: string;
    service_category: { id: number; name: string };
    created_at: string;
    cover?: string | null;
};

type Props = {
    data: ServiceOffer[];
    loading?: boolean;
    error?: boolean;

    meta?: {
        current_page: number;
        per_page: number;
        total: number;
    };
    onPageChange?: (page: number, pageSize: number) => void;
    onView?: (offer: ServiceOffer) => void;
    onEdit?: (offer: ServiceOffer) => void;
    onDelete?: (id: number) => void;
};

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

export default function ServiceOffersTable({ data, loading = false, error = false, meta, onPageChange, onView, onEdit, onDelete }: Props) {
    const { t } = useTranslation();

    const renderState = (status?: string) => {
        const s = String(status || "").toLowerCase();

        const config: Record<string, { color: string; bg: string; label: string }> = {
            active: { color: "text-[#14CA74]", bg: "bg-[#14CA741A]", label: t("serviceMarket.service.status.labels.active", { defaultValue: "Active" }) },
            paused: { color: "text-[#FAF00F]", bg: "bg-[#FAF0AD1A]", label: t("serviceMarket.service.status.labels.paused", { defaultValue: "Paused" }) },
            pending: { color: "text-[#32A5EF]", bg: "bg-[#1E87F01A]", label: t("serviceMarket.service.status.labels.pending", { defaultValue: "Pending" }) },
            rejected: { color: "text-[#CA1417]", bg: "bg-[#E298A11A]", label: t("serviceMarket.service.status.labels.rejected", { defaultValue: "Rejected" }) },
            draft: { color: "text-[#353635]", bg: "bg-[#F5F5F5]", label: t("serviceMarket.service.status.labels.draft", { defaultValue: "Draft" }) },
        };

        const { color, bg, label } = config[s] || { color: "text-gray-500", bg: "bg-gray-100", label: t("serviceMarket.service.status.labels.unknown", { defaultValue: "Unknown" }) };

        return (
            <div className={`px-3 py-1 rounded w-fit ${bg} ${color} text-xs font-semibold text-center mx-auto`}>
                {label}
            </div>
        );
    };

    const columns: ColumnsType<ServiceOffer> = useMemo(
        () => [
            {
                title: t("serviceMarket.table.id", { defaultValue: "ID" }),
                dataIndex: "id",
                key: "id",
                width: 60,
                render: (v) => <span className="text-textColor">{v}</span>,
            },
            {
                title: t("serviceMarket.table.cover", { defaultValue: "Cover" }),
                dataIndex: "cover",
                key: "cover",
                width: 80,
                render: (cover) => (
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
                        {cover ? (
                            <img src={cover.url} alt="cover" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-xs">IMG</span>
                        )}
                    </div>
                )
            },
            {
                title: t("serviceMarket.table.title", { defaultValue: "Title" }),
                dataIndex: "title",
                key: "title",
                ellipsis: true,
                render: (v) => <span className="text-[#353635] font-medium">{v}</span>,
            },
            {
                title: t("serviceMarket.table.category", { defaultValue: "Category" }),
                key: "category",
                render: (_, record) => <span className="text-[#353635]">{record.service_category?.name || "—"}</span>,
            },
            {
                title: t("serviceMarket.table.deliveryMode", { defaultValue: "Delivery Mode" }),
                key: "delivery_model",
                render: (_, record) => <span className="text-[#353635] capitalize">{record.delivery_model?.replace("_", " ") || "—"}</span>,
            },
            {
                title: t("serviceMarket.table.serviceType", { defaultValue: "Service Type" }),
                key: "service_type",
                render: (_, record) => <span className="text-[#353635] capitalize">{record.type?.replace("_", " ") || "—"}</span>,
            },
            {
                title: t("serviceMarket.table.dateAdded", { defaultValue: "Date added" }),
                dataIndex: "created_at",
                key: "created_at",
                render: (v) => <span className="text-[#353635]">{v ? new Date(v).toLocaleDateString() : "—"}</span>,
            },
            {
                title: t("serviceMarket.table.status"),
                key: "status",
                align: "center",
                render: (_, record) => renderState(record.status),
            },
            {
                title: t("serviceMarket.table.actions", { defaultValue: "Actions" }),
                key: "actions",
                align: "right",
                width: 140,
                render: (_, record) => (
                    <div className="flex items-center justify-end gap-1 w-full">
                        <ActionBtn
                            title={t("serviceMarket.service.actions.view", { defaultValue: "View" })}
                            onClick={() => onView?.(record)}
                            color="text-[#00664F]"
                            hoverBg="hover:bg-[#00664F]/20"
                        >
                            <BsEyeFill className="w-4 h-4" />
                        </ActionBtn>

                        <ActionBtn
                            title={t("serviceMarket.service.actions.edit", { defaultValue: "Edit" })}
                            onClick={() => onEdit?.(record)}
                            color="text-[#00664F]"
                            hoverBg="hover:bg-[#00664F]/20"
                        >
                            <BsPencilFill className="w-4 h-4" />
                        </ActionBtn>

                        <ActionBtn
                            title={t("serviceMarket.service.actions.delete", { defaultValue: "Delete" })}
                            onClick={() => onDelete?.(record.id)}
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

    const total = meta?.total ?? 0;
    const pageSize = meta?.per_page ?? 10;
    const current = meta?.current_page ?? 1;

    const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const to = Math.min(current * pageSize, total);

    const isPrevDisabled = current <= 1;
    const isNextDisabled = current * pageSize >= total;

    return (
        <div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#00664F33]">
                <Table<ServiceOffer>
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    pagination={false}
                    locale={{ emptyText: !loading ? t("common.noData", { defaultValue: "No Data Found" }) : null }}
                    className="service-offers-table"
                />
            </div>

            {meta && onPageChange && (
                <div className="flex flex-wrap items-center justify-between py-4 mt-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-[#00664F] font-medium">
                        <span>
                            {from} - {to}
                        </span>
                        <span>{t("common.of", { defaultValue: "of" })}</span>
                        <span>{total}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[#00664F] font-medium">
                                {t("serviceMarket.table.rowsPerPage", { defaultValue: "Rows per page:" })}
                            </span>

                            <Select
                                value={pageSize}
                                onChange={(value) => onPageChange(1, value)}
                                options={PAGE_SIZE_OPTIONS.map((v) => ({ value: v, label: String(v) }))}
                                className="w-16 [&_.ant-select-selector]:!bg-[#00664F] [&_.ant-select-selection-item]:!text-white [&_.ant-select-selector]:!rounded-md [&_.ant-select-arrow]:!text-white"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onPageChange(current - 1, pageSize)}
                                disabled={isPrevDisabled}
                                className="p-1.5 rounded-md bg-[#00664F] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#005240] transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => onPageChange(current + 1, pageSize)}
                                disabled={isNextDisabled}
                                className="p-1.5 rounded-md bg-[#00664F] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#005240] transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
