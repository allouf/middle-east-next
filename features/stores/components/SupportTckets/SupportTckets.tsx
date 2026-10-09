"use client";

import React, { useCallback, useMemo, useState } from "react";
import { BsStack } from "react-icons/bs";
import { useParams } from "next/navigation";
import { useAlert } from "@/lib/context/AlertProvider";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Support_Tikctes } from "@/shared/constants/urls";
import HeaderTickets from "./HeaderTickets";
import TiketsFilters from "./TiketsFilters";
import TiketsTable from "./TiketsTable";

import useGetData from "@/lib/api/useGetData";
import usePostData from "@/lib/api/usePostData";
import { useTranslation } from "@/lib/i18n/useTranslation";

import type { Ticket, TicketStatusFilter } from "../../types/supportTikets";
import type { PaginationMeta } from "../../types";
import type { DatePreset, SortBy } from "@/types/type";

type SupportTicketsProps = {
  handleTabChange?: (tab: string | number) => void;
};

type ApiResponse = {
  data?: {
    tickets?: Ticket[];
    meta?: Partial<PaginationMeta>;
  };
};

type DateRange = { from: Date | null; to: Date | null };

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const getDateRange = (preset: DatePreset, dateFrom: string, dateTo: string): DateRange => {
  if (preset === "all") return { from: null, to: null };
  const now = new Date();

  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };

    case "last7": {
      const from = startOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
      return { from, to: endOfDay(now) };
    }

    case "last30": {
      const from = startOfDay(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
      return { from, to: endOfDay(now) };
    }

    case "custom": {
      const from = dateFrom ? startOfDay(new Date(dateFrom)) : null;
      const to = dateTo ? endOfDay(new Date(dateTo)) : null;
      return { from, to };
    }

    default:
      return { from: null, to: null };
  }
};

const isWithinRange = (date: Date | null, range: DateRange) => {
  if (!date) return true;
  const { from, to } = range;
  if (!from && !to) return true;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
};

const parseTicketDate = (v?: string | null) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const matchesSearch = (ticket: Ticket, query: string) => {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    String(ticket.id).toLowerCase().includes(q) ||
    String(ticket.subject ?? "").toLowerCase().includes(q) ||
    String(ticket.issue_type?.name ?? "").toLowerCase().includes(q) ||
    String(ticket.status ?? "").toLowerCase().includes(q) ||
    String(ticket.priority ?? "").toLowerCase().includes(q)
  );
};

const matchesStatus = (ticket: Ticket, filter: TicketStatusFilter) => {
  if (filter === "all") return true;
  return String(ticket.status ?? "").toUpperCase() === filter;
};

const SupportTckets: React.FC<SupportTicketsProps> = () => {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { confirm, message } = useAlert();

  // UI filters (client-side)
  const [search, setSearch] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<SortBy>("latest");
  const [statusFilter, setStatusFilter] = useState<TicketStatusFilter>("all");

  // pagination (server-side)
  const [page, setPage] = useState(1);

  const { data: resData, loading, error, refetch } = useGetData<ApiResponse>({
    url: Support_Tikctes.getListTiketes(params?.id),
    paginate: true,
    page,
    extraParams: {
      search: search.trim(),
      status: statusFilter === "all" ? "" : statusFilter,
      date_preset: datePreset,
      date_from: datePreset === "custom" ? dateFrom : "",
      date_to: datePreset === "custom" ? dateTo : "",
      sort_by: sort === "latest" ? "" : sort,
    },
  });

  const {
    postData: resolveTicket,
    loading: resolving,
    contextHolder: resolveHolder,
  } = usePostData();

  const {
    postData: escalateTicket,
    loading: escalating,
    contextHolder: escalateHolder,
  } = usePostData();

  const tickets: Ticket[] = resData?.data?.tickets ?? [];

  const meta: PaginationMeta = {
    current_page: resData?.data?.meta?.current_page ?? 1,
    last_page: resData?.data?.meta?.last_page ?? 1,
    per_page: resData?.data?.meta?.per_page ?? 10,
    total: resData?.data?.meta?.total ?? 0,
  };

  const stats = useMemo(
    () => [
      { label: t("tickets.stats.all"), value: meta.total ?? 0, color: "#6852D6", icon: BsStack },
      { label: t("tickets.stats.new"), value: 0, color: "#56E8A7", icon: BsStack },
      { label: t("tickets.stats.sale"), value: 0, color: "#32A5EF", icon: BsStack },
      { label: t("tickets.stats.expired"), value: 0, color: "#D02F44", icon: BsStack },
    ],
    [meta.total, t]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setDatePreset("all");
    setDateFrom("");
    setDateTo("");
    setSort("latest");
    setStatusFilter("all");
    setPage(1);
  }, []);

  const filteredTickets = useMemo(() => {
    const range = getDateRange(datePreset, dateFrom, dateTo);

    let list = tickets.filter((tk) => {
      const d = parseTicketDate(tk.created_at);
      return matchesSearch(tk, search) && isWithinRange(d, range) && matchesStatus(tk, statusFilter);
    });

    list = list.sort((a, b) => {
      const da = parseTicketDate(a.created_at)?.getTime() ?? 0;
      const db = parseTicketDate(b.created_at)?.getTime() ?? 0;
      return sort === "latest" ? db - da : da - db;
    });

    return list;
  }, [tickets, search, datePreset, dateFrom, dateTo, sort, statusFilter]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const clamped = Math.max(1, Math.min(nextPage, meta.last_page));
      setPage(clamped);
      refetch?.({ page: clamped });
    },
    [meta.last_page, refetch]
  );

  const handleResolve = useCallback(
    async (ticketId: number | string) => {
      confirm.confirm(
        t("tickets.resolveConfirmTitle"),
        t("tickets.resolveConfirmText"),
        async () => {
          await resolveTicket(
            {},
            {
              endpoint: Support_Tikctes.resolveTikets(ticketId),
              onSuccess: () => {
                message.success(t("tickets.resolvedSuccess"));
                refetch?.();
              },
            }
          );
        }
      );
    },
    [resolveTicket, refetch, t, confirm, message]
  );

  const handleEscalate = useCallback(
    async (ticketId: number | string) => {
      confirm.confirm(
        t("tickets.escalateConfirmTitle"),
        t("tickets.escalateConfirmText"),
        async () => {
          await escalateTicket(
            {},
            {
              endpoint: Support_Tikctes.escalateTikets(ticketId),
              onSuccess: () => {
                message.success(t("tickets.escalatedSuccess"));
                refetch?.();
              },
            }
          );
        }
      );
    },
    [escalateTicket, refetch, t, confirm, message]
  );

  const isActing = resolving || escalating;

  return (
    <div className="p-4">
      {resolveHolder}
      {escalateHolder}

      <HeaderTickets stats={stats} />

      {/* Search (Antd like Packages) */}
      <div className="w-full mb-4">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <p className="text-blueSite font-semibold text-sm md:text-xl">{t("tickets.all")}</p>

          <Input
            size="large"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("tickets.searchPlaceholder")}
            prefix={<SearchOutlined className="text-textColor" />}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Filters */}
      <TiketsFilters
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={resetFilters}
        sortBy={sort}
        setSortBy={setSort}
      />

      {/* Table (Antd Card/Table like Packages) */}
      <div className="mt-4">
        <TiketsTable
          data={filteredTickets}
          loading={loading}
          meta={{
            current_page: meta.current_page,
            per_page: meta.per_page,
            total: meta.total,
          }}
          onPageChange={handlePageChange}
          onResolve={handleResolve}
          onEscalate={handleEscalate}
          acting={isActing}
        />
      </div>
    </div>
  );
};

export default SupportTckets;
