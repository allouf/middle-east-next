"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

import useGetData from "@/lib/api/useGetData";
import { Support_Tikctes } from "@/shared/constants/urls";

import TiketsFilters from "./TiketsFilters";
import MyTicketsTable from "./MyTicketsTable";

import type { Ticket } from "../../types/supportTikets";
import type { DatePreset, PaginationMeta, SortBy } from "@/types/type";
import { TicketStatusFilter } from "@/features/stores/types/supportTikets";

type ApiResponse = {
    data?: {
        tickets?: Ticket[];
        meta?: Partial<PaginationMeta>;
    };
};

type DateRange = { from: Date | null; to: Date | null };

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

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

const MyTickets = () => {
    const { t } = useTranslation();

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
        url: Support_Tikctes.getMyTikets,
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

    // ✅ IMPORTANT: fix the response shape correctly
    const tickets: Ticket[] = Array.isArray(resData?.data?.tickets) ? resData!.data!.tickets! : [];

    const meta: PaginationMeta = {
        current_page: resData?.data?.meta?.current_page ?? page,
        last_page: resData?.data?.meta?.last_page ?? 1,
        per_page: resData?.data?.meta?.per_page ?? 10,
        total: resData?.data?.meta?.total ?? 0,
    };

    const resetFilters = useCallback(() => {
        setSearch("");
        setDatePreset("all");
        setDateFrom("");
        setDateTo("");
        setSort("latest");
        setStatusFilter("all");
    }, []);

    const handlePageChange = useCallback(
        (nextPage: number) => {
            const clamped = Math.max(1, Math.min(nextPage, meta.last_page));
            setPage(clamped);
            refetch?.({ page: clamped });
        },
        [meta.last_page, refetch]
    );

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

    return (
        <div className="p-6 md:p-7 md:pt-[4vh]">
            {/* Search */}
            <div className="w-full gap-3 mb-4">
                <div className="flex flex-row items-center gap-3 w-full md:w-1/2">
                    <p className="text-blueSite font-semibold text-sm md:text-xl">{t("tickets.all")}</p>

                    <div className="relative w-full md:w-2/3">
                        <Search className="absolute left-3 top-2.5 text-textColor" size={18} />
                        <input
                            type="text"
                            placeholder={t("tickets.searchPlaceholder")}
                            className="w-full border rounded-2xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blueSite outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
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

            {/* ✅ Table like TiketsTable */}
            <MyTicketsTable
                data={filteredTickets}
                loading={loading}
                error={Boolean(error)}
                meta={{
                    current_page: meta.current_page,
                    per_page: meta.per_page,
                    total: meta.total,
                }}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default MyTickets;
