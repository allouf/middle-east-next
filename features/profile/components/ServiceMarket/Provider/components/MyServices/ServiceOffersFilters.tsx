"use client";

import React from "react";
import { Search, Plus, RotateCcw } from "lucide-react";
import { Select, Button as AntButton } from "antd";
import InputField from "@/components/ui/InputField";
import { useTranslation } from "@/lib/i18n/useTranslation";

type FiltersProps = {
    search: string;
    setSearch: (s: string) => void;
    status: string;
    setStatus: (s: string) => void;
    deliveryModel: string;
    setDeliveryModel: (s: string) => void;
    serviceType: string;
    setServiceType: (s: string) => void;
    categoryId: string;
    setCategoryId: (s: string) => void;
    dateFrom: string;
    setDateFrom: (s: string) => void;
    dateTo: string;
    setDateTo: (s: string) => void;
    sortBy: string;
    setSortBy: (s: string) => void;
    categories: { id: number; name: string }[];
    onReset: () => void;
    onAddService?: () => void;
};

export default function ServiceOffersFilters({
    search,
    setSearch,
    status,
    setStatus,
    deliveryModel,
    setDeliveryModel,
    serviceType,
    setServiceType,
    categoryId,
    setCategoryId,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortBy,
    setSortBy,
    categories,
    onReset,
    onAddService,
}: FiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full flex flex-col gap-4 mb-6">
            {/* Top Row: Dropdowns */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <Select
                        value={categoryId || "all"}
                        onChange={setCategoryId}
                        className="w-full sm:w-[120px] md:w-[150px] h-10 [&_.ant-select-selector]:!bg-[#F8F9FA] [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!rounded-md"
                        options={[
                            { label: t("serviceMarket.service.filter.category", { defaultValue: "Filter by Category" }), value: "all" },
                            ...categories.map(c => ({ label: c.name, value: String(c.id) }))
                        ]}
                    />

                    <Select
                        value={deliveryModel || "all"}
                        onChange={setDeliveryModel}
                        className="w-full sm:w-[120px] md:w-[150px] h-10 [&_.ant-select-selector]:!bg-[#F8F9FA] [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!rounded-md"
                        options={[
                            { label: t("serviceMarket.service.filter.delivery", { defaultValue: "Filter by delivery mode" }), value: "all" },
                            { label: t("serviceMarket.service.filter.options.remote", { defaultValue: "Remote" }), value: "remote" },
                            { label: t("serviceMarket.service.filter.options.onsite", { defaultValue: "On-site" }), value: "on_site" },
                        ]}
                    />

                    <Select
                        value={serviceType || "all"}
                        onChange={setServiceType}
                        className="w-full sm:w-[120px] md:w-[150px] h-10 [&_.ant-select-selector]:!bg-[#F8F9FA] [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!rounded-md"
                        options={[
                            { label: t("serviceMarket.service.filter.type", { defaultValue: "Filter by Service type" }), value: "all" },
                            { label: t("serviceMarket.service.filter.options.fixedPrice", { defaultValue: "Fixed Price" }), value: "fixed_price" },
                            { label: t("serviceMarket.service.filter.options.hourly", { defaultValue: "Hourly" }), value: "hourly" },
                        ]}
                    />


                    <div className="flex items-center gap-2 items-center justify-between sm:w-[250px] md:w-[280px] ">
                        <InputField
                            id="dateFrom"
                            type="date"
                            value={dateFrom}
                            onChange={(value) => setDateFrom(String(value || ""))}
                            placeholder={t("serviceMarket.service.filter.dateFrom", { defaultValue: "From" })}
                            className="w-full sm:w-[120px] md:w-[160px]"
                            unstyled
                            isPassDate
                        />
                        <span className="text-sm text-textColor">-</span>
                        <InputField
                            id="dateTo"
                            type="date"
                            value={dateTo}
                            onChange={(value) => setDateTo(String(value || ""))}
                            placeholder={t("serviceMarket.service.filter.dateTo", { defaultValue: "To" })}
                            className="w-full sm:w-[120px] md:w-[160px]"
                            unstyled
                            isPassDate
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-textColor">{t("serviceMarket.service.sort.by", { defaultValue: "Sort by:" })}</span>
                    <Select
                        value={sortBy || "draft"}
                        onChange={setSortBy}
                        className="w-[140px] h-10"
                        options={[
                            { label: t("serviceMarket.service.sort.options.draftServices", { defaultValue: "Draft Services" }), value: "draft" },
                            { label: t("serviceMarket.service.sort.options.newest", { defaultValue: "Newest" }), value: "newest" },
                            { label: t("serviceMarket.service.sort.options.oldest", { defaultValue: "Oldest" }), value: "oldest" },
                            { label: t("serviceMarket.service.sort.options.sortOrderAsc", { defaultValue: "Sort Order Asc" }), value: "sort_order_asc" },
                            { label: t("serviceMarket.service.sort.options.sortOrderDesc", { defaultValue: "Sort Order Desc" }), value: "sort_order_desc" },
                            { label: t("serviceMarket.service.sort.options.titleAZ", { defaultValue: "Title A-Z" }), value: "title_asc" },
                            { label: t("serviceMarket.service.sort.options.titleZA", { defaultValue: "Title Z-A" }), value: "title_desc" },
                        ]}
                    />
                    <AntButton
                        onClick={onReset}
                        className="h-10 w-10 rounded-md shadow-none flex items-center justify-center border border-[#00664F50] text-[#00664F] hover:bg-[#00664F]/10"
                        title={t("serviceMarket.service.filter.reset", { defaultValue: "Reset" })}
                        icon={<RotateCcw size={16} />}
                    />
                </div>
            </div>

            {/* Bottom Row: Search, Status, Add Button */}
            <div className="flex flex-wrap md:flex-nowrap items-center w-full gap-4 border border-[#E9E9E9] rounded-xl p-3 bg-white">
                <div className="relative flex-1 w-full min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#353635]/50" size={16} />
                    <input
                        type="text"
                        placeholder={t("serviceMarket.service.search.placeholder", { defaultValue: "Search for..." })}
                        className="w-full border border-[#00664F50] rounded-full pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-blueSite outline-none bg-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center bg-[#BBE2D6] rounded-md px-3 h-10">
                        <span className="text-sm font-medium text-[#00664F] whitespace-nowrap">{t("serviceMarket.service.filter.by", { defaultValue: "Filter By :" })}</span>
                    </div>

                    <Select
                        value={status || "all"}
                        onChange={setStatus}
                        className="w-[140px] h-10 font-bold [&_.ant-select-selector]:!border-none"
                        options={[
                            { label: t("serviceMarket.service.status.all", { defaultValue: "All Statuses" }), value: "all" },
                            { label: t("serviceMarket.service.status.options.active", { defaultValue: "Active" }), value: "active" },
                            { label: t("serviceMarket.service.status.options.paused", { defaultValue: "Paused" }), value: "paused" },
                            { label: t("serviceMarket.service.status.options.pending", { defaultValue: "Pending" }), value: "pending" },
                        ]}
                    />

                    <AntButton
                        type="primary"
                        onClick={onAddService}
                        className="bg-blueSite hover:bg-blueSite/90 h-10 px-6 rounded-md shadow-none flex items-center justify-center border-none"
                        icon={<Plus size={16} />}
                    >
                        {t("serviceMarket.service.add.button", { defaultValue: "Add Service" })}
                    </AntButton>
                </div>
            </div>
        </div>
    );
}
