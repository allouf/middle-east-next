"use client";

import React, { useMemo } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { BsEyeFill } from "react-icons/bs";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import { ProjectDetails } from "../modals/ProjectViewModal";
import "./PortfolioProjectsTable.css";

type Meta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

type Props = {
  data: ProjectDetails[];
  loading?: boolean;
  error?: boolean;
  meta?: Meta;
  onPageChange?: (page: number) => void;
  onView?: (project: ProjectDetails) => void;
};

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

export default function PortfolioProjectsTable({
  data,
  loading = false,
  error = false,
  meta,
  onPageChange,
  onView,
}: Props) {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();

  const columns: ColumnsType<ProjectDetails> = useMemo(
    () => [
      {
        title: t("table.cover", { defaultValue: "Cover" }),
        dataIndex: "imageUrl",
        key: "imageUrl",
        width: 80,
        render: (imageUrl: string) => (
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
            {imageUrl ? (
              <img src={imageUrl} alt="project" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-xs">IMG</span>
            )}
          </div>
        ),
      },
      {
        title: t("table.title", { defaultValue: "Title" }),
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        render: (v: string) => (
          <span className="text-[#353635] font-medium">{v || "—"}</span>
        ),
      },
      {
        title: t("table.description", { defaultValue: "Description" }),
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        render: (v: string) => (
          <span className="text-gray-500 text-sm line-clamp-2">{v || "—"}</span>
        ),
      },
      {
        title: t("table.images", { defaultValue: "Images" }),
        dataIndex: "galleryUrls",
        key: "galleryUrls",
        width: 100,
        render: (urls: string[]) => (
          <span className="text-[#353635] font-medium">
            {urls?.length ?? 0}
          </span>
        ),
      },
      {
        title: t("table.link", { defaultValue: "Link" }),
        dataIndex: "link",
        key: "link",
        width: 80,
        render: (link: string) =>
          link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#00664F] hover:text-[#005240] transition-colors text-sm font-medium"
            >
              <ExternalLink size={14} />
              {t("table.visit", { defaultValue: "Visit" })}
            </a>
          ) : (
            <span className="text-gray-400">—</span>
          ),
      },
      {
        title: "",
        key: "actions",
        align: "right",
        width: 80,
        render: (_, record) => (
          <div className="flex items-center justify-end gap-1 w-full">
            <ActionBtn
              title={t("service.actions.view", { defaultValue: "View" })}
              onClick={() => onView?.(record)}
              color="text-[#00664F]"
              hoverBg="hover:bg-[#00664F]/20"
            >
              <BsEyeFill className="w-4 h-4" />
            </ActionBtn>
          </div>
        ),
      },
    ],
    [t, onView]
  );

  const total = meta?.total ?? 0;
  const pageSize = meta?.per_page ?? 15;
  const current = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;

  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const isPrevDisabled = current <= 1;
  const isNextDisabled = current >= lastPage;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#00664F33]">
        <Table<ProjectDetails>
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={false}
          locale={{
            emptyText: t("common.noData", { defaultValue: "No Data Found" }),
          }}
          className="portfolio-projects-table"
        />
      </div>

      {meta && onPageChange && total > 0 && (
        <div className="flex flex-wrap items-center justify-between py-4 mt-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-[#00664F] font-medium">
            <span>{from} - {to}</span>
            <span>{t("common.of", { defaultValue: "of" })}</span>
            <span>{total}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(current - 1)}
              disabled={isPrevDisabled}
              className="p-1.5 rounded-md bg-[#00664F] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#005240] transition-colors"
            >
              {isRTL ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onPageChange(current + 1)}
              disabled={isNextDisabled}
              className="p-1.5 rounded-md bg-[#00664F] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#005240] transition-colors"
            >
              {isRTL ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
