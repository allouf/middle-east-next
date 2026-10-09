"use client";

import React, { useMemo, useState } from "react";
import { Card, Table, Tag, Tooltip, Typography, Button as AntButton, Space, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeFilled } from "@ant-design/icons";

import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Ticket } from "../../types/supportTikets";
import SupportDetails from "./SupportDetailsProfile";

type Props = {
    data: Ticket[];
    loading?: boolean;
    error?: boolean;

    meta?: {
        current_page: number;
        per_page: number;
        total: number;
    };
    onPageChange?: (page: number) => void;
};

const badgeBase = "px-2 py-1 text-xs font-medium rounded";

const statusTag = (t: any, status?: string) => {
    const s = String(status || "").toUpperCase();

    if (s === "OPEN") return <Tag color="blue">{t("tickets.status.open", { defaultValue: "OPEN" })}</Tag>;
    if (s === "ANSWERED") return <Tag color="cyan">{t("tickets.status.answered", { defaultValue: "ANSWERED" })}</Tag>;
    if (s === "RESOLVED") return <Tag color="green">{t("tickets.status.resolved", { defaultValue: "RESOLVED" })}</Tag>;
    if (s === "ESCALATED") return <Tag color="red">{t("tickets.status.escalated", { defaultValue: "ESCALATED" })}</Tag>;
    if (s === "UNDER_REVIEW") return <Tag color="gold">{t("tickets.status.under_review", { defaultValue: "UNDER REVIEW" })}</Tag>;

    return <Tag>{status || "—"}</Tag>;
};

const priorityTag = (t: any, priority?: string) => {
    const p = String(priority || "").toLowerCase();
    if (p === "high") return <Tag color="red">{t("tickets.priorityHigh", { defaultValue: "High" })}</Tag>;
    if (p === "medium") return <Tag color="gold">{t("tickets.priorityMedium", { defaultValue: "Medium" })}</Tag>;
    if (p === "low") return <Tag color="green">{t("tickets.priorityLow", { defaultValue: "Low" })}</Tag>;
    return <Tag>{priority || "—"}</Tag>;
};

const slaBadge = (ticket: Ticket) => {
    const breached = Boolean((ticket as any)?.is_sla_breached ?? (ticket as any)?.sla?.is_breached);
    return breached ? `${badgeBase} text-red-700 bg-red-100` : `${badgeBase} text-green-700 bg-green-100`;
};

export default function MyTicketsTable({ data, loading = false, error = false, meta, onPageChange }: Props) {
    const { t } = useTranslation();

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const openDetails = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowDetails(true);
    };

    const columns: ColumnsType<Ticket> = useMemo(
        () => [
             {
                title: t("table.headers.id", { defaultValue: "ID" }),
                dataIndex: "id",
                key: "id",
                width: 80,
                render: (v) => <span className="font-medium text-subTitleColor">{v}</span>,
            },
            {
                title: t("tickets.issueType", { defaultValue: "Type" }),
                key: "issue_type",
                render: (_, ticket) => <span className="text-subTitleColor">{ticket.issue_type?.name || "—"}</span>,
            },
            {
                title: t("tickets.priority", { defaultValue: "Priority" }),
                key: "priority",
                render: (_, ticket) => priorityTag(t, ticket.priority),
            },
            {
                title: t("tickets.subject", { defaultValue: "Subject" }),
                dataIndex: "subject",
                key: "subject",
                ellipsis: true,
                render: (v) => <span className="text-subTitleColor">{v || "—"}</span>,
            },
            {
                title: t("tickets.createdAt", { defaultValue: "Created" }),
                dataIndex: "created_at",
                key: "created_at",
                render: (v) => <span className="text-textColor">{v || "—"}</span>,
            },
            {
                title: t("tickets.status", { defaultValue: "Status" }),
                key: "status",
                render: (_, ticket) => statusTag(t, ticket.status),
            },
            {
                title: t("tickets.sla", { defaultValue: "SLA" }),
                key: "sla",
                render: (_, ticket) => {
                    const delay = (ticket as any)?.sla_delay ?? (ticket as any)?.sla?.sla_delay ?? "—";
                    return (
                        <div className="flex items-center gap-2">
                            <span className={slaBadge(ticket)}>
                                {Boolean((ticket as any)?.is_sla_breached ?? (ticket as any)?.sla?.is_breached)
                                    ? t("tickets.slaBreached", { defaultValue: "SLA Breached" })
                                    : t("tickets.slaOk", { defaultValue: "SLA OK" })}
                            </span>
                            <span className="text-xs text-textColor">{delay}</span>
                        </div>
                    );
                },
            },
            {
                title: t("table.actions", { defaultValue: "Actions" }),
                key: "actions",
                align: "right",
                width: 90,
                render: (_, ticket) => (
                    <Space size={8} className="justify-end w-full">
                        <Tooltip title={t("tickets.viewDetails", { defaultValue: "View details" })}>
                            <AntButton
                                type="text"
                                className="hover:bg-blueSite text-lg text-blueSite hover:text-white"
                                icon={<EyeFilled />}
                                onClick={() => openDetails(ticket)}
                            />
                        </Tooltip>
                    </Space>
                ),
            },
        ],
        [t]
    );

    const statusBadge = useMemo(() => {
        const s = String(selectedTicket?.status || "").toUpperCase();
        if (s === "OPEN") return `${badgeBase} text-blue-700 bg-blue-100`;
        if (s === "ANSWERED") return `${badgeBase} text-cyan-700 bg-cyan-100`;
        if (s === "RESOLVED") return `${badgeBase} text-green-700 bg-green-100`;
        if (s === "ESCALATED") return `${badgeBase} text-red-700 bg-red-100`;
        if (s === "UNDER_REVIEW") return `${badgeBase} text-yellow-800 bg-yellow-100`;
        return `${badgeBase} text-slate-700 bg-slate-100`;
    }, [selectedTicket]);

    const priorityBadge = useMemo(() => {
        const p = String(selectedTicket?.priority || "").toLowerCase();
        if (p === "high") return `${badgeBase} text-red-700 bg-red-100`;
        if (p === "medium") return `${badgeBase} text-yellow-700 bg-yellow-100`;
        if (p === "low") return `${badgeBase} text-green-700 bg-green-100`;
        return `${badgeBase} text-gray-700 bg-gray-100`;
    }, [selectedTicket]);

    const slaBadgeClass = useMemo(() => {
        const breached = Boolean((selectedTicket as any)?.is_sla_breached ?? (selectedTicket as any)?.sla?.is_breached);
        return breached ? `${badgeBase} text-red-700 bg-red-100` : `${badgeBase} text-green-700 bg-green-100`;
    }, [selectedTicket]);

    const rangeText = useMemo(() => {
        if (!meta) return "";
        const start = meta.total === 0 ? 0 : (meta.current_page - 1) * meta.per_page + 1;
        const end = Math.min(meta.current_page * meta.per_page, meta.total);
        return `${start} - ${end} ${t("common.of")} ${meta.total}`;
    }, [meta, t]);

    return (
        <>
            <Card className="shadow-md !border-blueSite !rounded-xl overflow-hidden [&_.ant-card-body]:p-0">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(row) => String(row.id)}
                    loading={loading}
                    locale={{
                        emptyText: error ? <div className="py-8">{t("common.error")}</div> : <Empty description={t("tickets.noTickets")} />,
                    }}
                    pagination={
                        meta && onPageChange
                            ? {
                                current: meta.current_page,
                                pageSize: meta.per_page,
                                total: meta.total,
                                showSizeChanger: false,
                                onChange: onPageChange,
                                // ✅ keep pagination buttons right by default, total left can be placed in title
                                showTotal: (total, range) => `${range[0]} - ${range[1]} ${t("common.of")} ${total}`,
                            }
                            : false
                    }
                    title={() => (
                        <div className="flex items-center justify-between px-3 py-1">
                            <Typography.Text strong className="text-blueSite text-lg">
                                {t("profileSideBar.myTickets", { defaultValue: "My Tickets" })}
                            </Typography.Text>

                            {meta ? (
                                <Typography.Text className="text-sm text-blueSite font-medium">
                                    {rangeText}
                                </Typography.Text>
                            ) : null}
                        </div>
                    )}
                    scroll={{ x: 900 }}
                />
            </Card>

            {/* Details modal (reuse yours) */}
            <SupportDetails
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                ticketId={Number((selectedTicket as any)?.id || 0)}
                statusBadge={statusBadge}
                priorityBadge={priorityBadge}
                slaBadge={slaBadgeClass}
            />
        </>
    );
}
