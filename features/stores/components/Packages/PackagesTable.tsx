"use client";

import React, { useMemo } from "react";
import { Card, Table, Tag, Switch, Tooltip, Typography, Button as AntButton, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    EyeFilled,
    EditFilled,
    DeleteFilled,
} from "@ant-design/icons";

import type { Package } from "../../types/PackageTypes";

type Props = {
    t: any;
    data: Package[];
    loading: boolean;
    meta: { current_page: number; per_page: number; total: number };
    from: number;
    to: number;
    togglingId: number | null;

    onPageChange: (page: number) => void;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number, next: boolean) => void;
};

const getDiscountType = (pack: any) => (pack.fixed_discount ? "fixed" : "percent");

export default function PackagesTable({
    t,
    data,
    loading,
    meta,
    from,
    to,
    togglingId,
    onPageChange,
    onView,
    onEdit,
    onDelete,
    onToggleStatus,
}: Props) {

    const columns: ColumnsType<Package> = useMemo(
        () => [
            {
                title: t("table.headers.id"),
                dataIndex: "id",
                key: "id",
                minWidth: 40,
            },
            {
                title: t("table.headers.title"),
                dataIndex: "title",
                key: "title",
                ellipsis: true,
                width: 200,
                minWidth: 150,
                render: (value, record) => (
                    <span className="font-medium text-subTitleColor text-sm sm:text-base">{value ?? `#${record.id}`}</span>
                ),
            },
            {
                title: t("table.headers.discount_type"),
                key: "discount_type",
                width: 150,
                minWidth: 120,
                render: (_, pack: any) => {
                    const type = getDiscountType(pack);
                    return (
                        <Tag className="text-xs sm:text-sm">
                            {type === "fixed" ? t("packages.fixed_value_table") : t("packages.discount_value_table")}
                        </Tag>
                    );
                },
            },
            {
                title: t("table.headers.discount_value"),
                key: "discount_value",
                minWidth: 60,
                render: (_, pack: any) => (
                    <span className="font-semibold text-[#00664F] text-sm sm:text-base">
                        {pack.fixed_discount ? pack.fixed_discount : pack.discount_percent}
                    </span>
                ),
            },
            {
                title: t("table.headers.number_products"),
                dataIndex: "products_count" as any,
                key: "products_count",
                minWidth: 60,
                render: (v) => <span className="text-sm sm:text-base">{v ?? 0}</span>,
            },

            {
                title: t("table.headers.date_added"),
                dataIndex: "created_at" as any,
                key: "created_at",
                minWidth: 100,
                render: (v) => (v ? new Date(v).toLocaleDateString() : "-"),
            },
            {
                title: t("table.headers.status"),
                key: "status",
                align: "center",
                width: 100,
                minWidth: 80,
                render: (_, pack: any) => (
                    <Switch
                        size="small"
                        checked={Boolean(pack.is_active)}
                        loading={togglingId === pack.id}
                        onChange={(checked) => onToggleStatus(pack.id, checked)}
                        style={{
                            backgroundColor: Boolean(pack.is_active) ? "var(--SiteColor)" : undefined,
                        }}
                    />

                ),
            },
            {
                title: t("table.headers.actions"),
                key: "actions",
                align: "end",
                minWidth: 100,
                fixed: 'right',
                render: (_, pack: any) => (
                    <Space size="small" className="justify-end w-full">
                        <Tooltip >
                            <AntButton
                                type="text"
                                size="small"
                                className="hover:bg-blueSite text-sm sm:text-base text-blueSite hover:text-white p-1 sm:p-2"
                                icon={<EyeFilled />}
                                onClick={() => onView(pack.id)}
                            />
                        </Tooltip>

                        <Tooltip >
                            <AntButton
                                type="text"
                                size="small"
                                className="hover:bg-blueSite text-sm sm:text-base text-blueSite hover:text-white p-1 sm:p-2"
                                icon={<EditFilled />}
                                onClick={() => onEdit(pack.id)}
                            />
                        </Tooltip>

                        <Tooltip >
                            <AntButton
                                type="text"
                                size="small"
                                className="hover:bg-blueSite text-sm sm:text-base text-red-600 p-1 sm:p-2"
                                icon={<DeleteFilled />}
                                onClick={() => onDelete(pack.id)}
                            />
                        </Tooltip>
                    </Space>
                ),

            },
        ],
        [t, togglingId, onView, onEdit, onDelete, onToggleStatus]
    );

    return (
        <Card className="shadow-md border-2 !border-blueSite !rounded-xl overflow-visible [&_.ant-card-body]:p-0">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                size="small"
                pagination={{
                    current: meta.current_page,
                    pageSize: meta.per_page,
                    total: meta.total,
                    onChange: onPageChange,
                    showSizeChanger: false,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} ${t("common.of")} ${total}`,
                    responsive: true,
                    simple: window.innerWidth < 640,
                }}
                title={() => (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 py-2 sm:py-0 gap-2 sm:gap-0">
                        <Typography.Text strong className="text-blueSite text-base sm:text-lg">
                            {t("packages.all_packages")}
                        </Typography.Text>
                        <Typography.Text className="text-xs sm:text-sm text-blueSite font-medium">
                            {from} - {to} {t("common.of")} {meta.total}
                        </Typography.Text>
                    </div>
                )}
                scroll={{ 
                    x: 'max-content',
                    y: window.innerWidth < 640 ? 400 : undefined
                }}
                className="responsive-table"
            />
        </Card>
    );
}
