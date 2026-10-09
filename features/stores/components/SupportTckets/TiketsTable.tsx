"use client";
// Force HMR refresh

import React, { useMemo, useState } from "react";
import { Card, Table, Tag, Tooltip, Typography, Button as AntButton, Space } from "antd";


import { useTranslation } from "@/lib/i18n/useTranslation";
import SupportDetails from "./SupportDetails";
import { ColumnsType } from "antd/es/table";
import { EyeFilled } from "@ant-design/icons";
import { Ticket } from "../../types/supportTikets";

type Props = {
    data: Ticket[];
    loading?: boolean;

    // pagination (optional)
    meta?: {
        current_page: number;
        per_page: number;
        total: number;
    };
    onPageChange?: (page: number) => void;

    // actions
    onResolve: (id: number | string) => void;
    onEscalate: (id: number | string) => void;
    acting?: boolean;
};

const siteIconBtnClass = "icon-btn"; // use same CSS you already added

const priorityTag = (t: any, priority?: string) => {
    const p = String(priority || "").toLowerCase();
    if (p === "high") return <Tag color="red">{t("tickets.priorityHigh", { defaultValue: "High" })}</Tag>;
    if (p === "medium") return <Tag color="gold">{t("tickets.priorityMedium", { defaultValue: "Medium" })}</Tag>;
    if (p === "low") return <Tag color="green">{t("tickets.priorityLow", { defaultValue: "Low" })}</Tag>;
    return <Tag>{priority || "—"}</Tag>;
};

const statusTag = (t: any, status?: string) => {
    const s = String(status || "").toUpperCase();

    switch (s) {
        case "OPEN":
            return <Tag color="blue">{t("tickets.status_open", { defaultValue: "OPEN" })}</Tag>;

        case "ANSWERED":
            return <Tag color="cyan">{t("tickets.status_answered", { defaultValue: "ANSWERED" })}</Tag>;

        case "RESOLVED":
            return <Tag color="green">{t("tickets.status_resolved", { defaultValue: "RESOLVED" })}</Tag>;

        case "ESCALATED":
            return <Tag color="red">{t("tickets.status_escalated", { defaultValue: "ESCALATED" })}</Tag>;

        case "UNDER_REVIEW":
            return <Tag color="gold">{t("tickets.status_under_review", { defaultValue: "UNDER_REVIEW" })}</Tag>;

        default:
            return <Tag>{status || "—"}</Tag>;
    }
};


const slaTag = (t: any, breached?: boolean) => {
    return breached ? (
        <Tag color="red">{t("tickets.slaBreached", { defaultValue: "SLA Breached" })}</Tag>
    ) : (
        <Tag color="green">{t("tickets.slaOk", { defaultValue: "SLA OK" })}</Tag>
    );
};

export default function TiketsTable({
    data,
    loading = false,
    meta,
    onPageChange,
    onResolve,
    onEscalate,
    acting = false,
}: Props) {
    const { t } = useTranslation();
    console.log("data", data);

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
                minWidth: 60,
                render: (v) => <span className="font-medium text-subTitleColor">{v}</span>,
            },
            {
                title: t("tickets.complaintType", { defaultValue: "Type" }),
                key: "issue_type",
                width: 150,
                minWidth: 120,
                render: (_, ticket: any) => (
                    <span className="text-subTitleColor">{(ticket.issue_type as any)?.name || "—"}</span>
                ),
            },
            {
                title: t("tickets.priority", { defaultValue: "Priority" }),
                key: "priority",
                width: 120,
                minWidth: 100,
                render: (_, ticket: any) => priorityTag(t, ticket.priority as any),
            },
            {
                title: t("tickets.title", { defaultValue: "Title" }),
                dataIndex: "subject",
                key: "subject",
                ellipsis: true,
                width: 200,
                minWidth: 150,
                render: (v) => <span className="text-subTitleColor">{v || "—"}</span>,
            },
            {
                title: t("tickets.sennder", { defaultValue: "The Sennder" }),
                dataIndex: "subject",
                key: "subject",
                ellipsis: true,
                width: 180,
                minWidth: 150,
                render: (_, ticket: any) => <span className="text-subTitleColor">{(ticket.sender as any)?.name || "—"}</span>,
            },
            {
                title: t("tickets.date", { defaultValue: "Date" }),
                dataIndex: "created_at",
                key: "created_at",
                width: 140,
                minWidth: 120,
                render: (v) => <span className="text-textColor">{v || "—"}</span>,
            },
            {
                title: t("tickets.status", { defaultValue: "Status" }),
                key: "status",
                width: 120,
                minWidth: 100,
                render: (_, ticket: any) => statusTag(t, ticket.status as any),
            },
            {
                title: t("tickets.sla", { defaultValue: "SLA" }),
                key: "sla",
                width: 150,
                minWidth: 120,
                render: (_, ticket) => (
                    <div className="flex flex-col items-start gap-2">
                        {slaTag(t, Boolean(ticket.is_sla_breached))}
                        <span className="text-xs text-textColor">{(ticket.sla_delay as any) ?? "—"}</span>
                    </div>
                ),
            },
            {
                title: t("tickets.actions", { defaultValue: "Actions" }),
                key: "actions",
                width: 120,
                minWidth: 100,
                fixed: 'right',
                render: (_, ticket) => (
                    <Space size={10} className="justify-start w-full">

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
        [t, acting, onResolve, onEscalate]
    );

    // Reuse the badge strings you used before (SupportDetails expects strings)
    const detailsBadges = useMemo(() => {
        const badgeBase = "px-2 py-1 text-xs font-medium rounded";
        const ticket = selectedTicket;

        const priorityBadge = (() => {
            const p = String(ticket?.priority || "").toLowerCase();
            if (p === "high") return `${badgeBase} text-red-700 bg-red-100`;
            if (p === "medium") return `${badgeBase} text-yellow-700 bg-yellow-100`;
            if (p === "low") return `${badgeBase} text-green-700 bg-green-100`;
            return `${badgeBase} text-gray-700 bg-gray-100`;
        })();

        const statusBadge = (() => {
            const s = String(ticket?.status || "").toUpperCase();
            if (s === "OPEN") return `${badgeBase} text-blue-700 bg-blue-100`;
            if (s === "CLOSED") return `${badgeBase} text-gray-700 bg-gray-100`;
            if (s === "PENDING") return `${badgeBase} text-yellow-800 bg-yellow-100`;
            return `${badgeBase} text-slate-700 bg-slate-100`;
        })();

        const slaBadge = (() => {
            const breached = Boolean(ticket?.is_sla_breached);
            return breached
                ? `${badgeBase} text-red-700 bg-red-100`
                : `${badgeBase} text-green-700 bg-green-100`;
        })();

        return { priorityBadge, statusBadge, slaBadge };
    }, [selectedTicket]);

    return (
        <>
            <Card className="shadow-md !border-blueSite !rounded-xl overflow-visible [&_.ant-card-body]:p-0">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(row) => String(row.id)}
                    loading={loading}
                    // locale={{
                    //     emptyText: error ? <div className="py-8">{t("common.error")}</div> : <Empty description={t("tickets.noTickets")} />,
                    // }}
                    pagination={
                        meta && onPageChange
                            ? {
                                current: meta.current_page,
                                pageSize: meta.per_page,
                                total: meta.total,
                                showSizeChanger: false,
                                onChange: onPageChange,
                                showTotal: (total, range) => `${range[0]} - ${range[1]} ${t("common.of")} ${total}`,
                                responsive: true,
                                simple: window.innerWidth < 640,
                            }
                            : false
                    }
                    title={() => (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 py-2 sm:py-0 gap-2 sm:gap-0">
                            <Typography.Text strong className="text-blueSite text-base sm:text-lg">
                                {t("tickets.allTickets", { defaultValue: "All Tickets" })}
                            </Typography.Text>

                            {meta ? (
                                <Typography.Text className="text-xs sm:text-sm text-blueSite font-medium">
                                    {t("common.total", { defaultValue: "Total" })}: {meta.total}
                                </Typography.Text>
                            ) : null}
                        </div>
                    )}
                    scroll={{ 
                        x: 'max-content',
                        y: window.innerWidth < 640 ? 400 : undefined
                    }}
                    className="responsive-table"
                />
            </Card>

            {/* Details modal */}
            <SupportDetails
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                ticketId={selectedTicket?.id as any}
                statusBadge={detailsBadges.statusBadge}
                priorityBadge={detailsBadges.priorityBadge}
                slaBadge={detailsBadges.slaBadge}
                onResolve={onResolve}
                onEscalate={onEscalate}
            />

        </>
    );
}
