"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ArrowUpDown, BoxIcon, Search, SlidersHorizontal } from "lucide-react";
import { Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

import LoaderPage from "@/components/shared/LoaderPage";
import Button from "@/components/ui/Button";
import useGetData from "@/lib/api/useGetData";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import OrderDetails from "@/features/profile/components/Orders/OrderDetails";
import OrderCard from "@/features/profile/components/Orders/OrderCard";
import { useTranslation } from "@/lib/i18n/useTranslation";

type NormalizedOrder = {
  id: string;
  statusKey: string;
  statusLabel: string;
  itemsCount: string;
  placedAtLabel: string;
  expectedLabel: string;
  totalPriceLabel: string;
  priceValue: number;
  placedAtValue: number;
};

const OrdersTab = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("latest");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleCancelOrder = (orderId: string) => {
    // TODO: Implement cancel order functionality
    console.log("Cancel order:", orderId);
  };

  const handleViewDetails = (orderId: string) => {
    // Update URL with order_id parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('order_id', orderId);
    router.push(`?${params.toString()}`);
    setSelectedOrderId(orderId);
  };

  // Check for order_id in URL on component mount and when search params change
  useEffect(() => {
    const orderIdFromUrl = searchParams.get('order_id');
    if (orderIdFromUrl && orderIdFromUrl !== selectedOrderId) {
      setSelectedOrderId(orderIdFromUrl);
    }
  }, [searchParams, selectedOrderId]);

  const STATUS_META: Record<
    string,
    { label: string; bg: string; text: string; border: string }
  > = {
    completed: {
      label: t("orders.statuses.completed"),
      bg: "bg-[#E6F5EC]",
      text: "text-[#0B7A5C]",
      border: "border-[#B6E4CB]",
    },
    paid: {
      label: t("orders.statuses.paid"),
      bg: "bg-[#E6F5EC]",
      text: "text-[#0B7A5C]",
      border: "border-[#B6E4CB]",
    },
    partially_fulfilled: {
      label: t("orders.statuses.partiallyFulfilled"),
      bg: "bg-[#FFF4E5]",
      text: "text-[#8C5D00]",
      border: "border-[#FFE2B8]",
    },
    cancelled: {
      label: t("orders.statuses.cancelled"),
      bg: "bg-[#FEEBEC]",
      text: "text-[#C62839]",
      border: "border-[#F5B7BE]",
    },
    pending_payment: {
      label: t("orders.statuses.pendingPayment"),
      bg: "bg-[#FFF4E5]",
      text: "text-[#8C5D00]",
      border: "border-[#FFE2B8]",
    },
    pending: {
      label: t("orders.statuses.pending"),
      bg: "bg-[#FFEFF2]",
      text: "text-[#C62839]",
      border: "border-[#F5B7BE]",
    },
    in_progress: {
      label: t("orders.statuses.inProgress"),
      bg: "bg-[#F3F6FF]",
      text: "text-[#1D4ED8]",
      border: "border-[#D1DBFF]",
    },
    default: {
      label: t("orders.statuses.processing"),
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    },
  };

  const FILTER_TABS = [
    { key: "all", label: t("orders.totalOrder") },
    { key: "completed", label: t("orders.completedOrder") },
    { key: "paid", label: t("orders.paidOrder") },
    { key: "partially_fulfilled", label: t("orders.partiallyFulfilledOrder") },
    { key: "cancelled", label: t("orders.cancelledOrder") },
  ];

  const SORT_OPTIONS = [
    { value: "latest", label: t("orders.sortByLatest") },
    { value: "oldest", label: t("orders.sortByOldest") },
    { value: "price_high", label: t("orders.priceHighToLow") },
    { value: "price_low", label: t("orders.priceLowToHigh") },
  ];

  const formatCurrency = (value: unknown): string => {
    if (typeof value === "number") {
      return new Intl.NumberFormat(i18n.language === "ar" ? "ar-SA" : "en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(value);
    }
    if (typeof value === "string") {
      const numeric = Number(value.replace(/[^\d.-]/g, ""));
      if (!Number.isNaN(numeric) && value.trim() !== "") {
        return formatCurrency(numeric);
      }
      return value;
    }
    return "$0.00";
  };

  const formatDateTime = (value?: unknown): string => {
    if (!value) return "-";
    const parsed = new Date(value as any);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return `${parsed.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      calendar: 'gregory'
    })} ${i18n.language === "ar" ? "في" : "at"} ${parsed.toLocaleTimeString(i18n.language === "ar" ? "ar-SA" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  };

  const formatDateOnly = (value?: unknown): string => {
    if (!value) return "-";
    const parsed = new Date(value as any);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      calendar: 'gregory'
    });
  };

  const normalizeStatus = (value?: string) =>
    (value || "pending").toLowerCase().replace(/\s+/g, "_");

  const OrdersSkeleton = () => {
    const pulse = "animate-pulse bg-gray-200 rounded";
    return (
      <div className="space-y-6 p-6 md:p-7 md:pt-[4vh]">
        <div className="space-y-2">
          <div className={`${pulse} h-6 w-40`} />
          <div className={`${pulse} h-4 w-64`} />
        </div>

        <div className="flex flex-wrap gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`${pulse} w-8 h-8 rounded-full`} />
              <div className={`${pulse} h-4 w-28`} />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className={`${pulse} h-12 w-full md:w-2/3 rounded-md`} />
          <div className={`${pulse} h-12 w-44 rounded-md`} />
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#F9FBFA] p-5 shadow-sm space-y-3 border border-[#E8EFEA]"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className={`${pulse} h-5 w-24`} />
                    <div className={`${pulse} h-7 w-28 rounded-md`} />
                  </div>
                  <div className={`${pulse} h-4 w-72`} />
                  <div className={`${pulse} h-4 w-60`} />
                </div>
                <div className="flex md:flex-col gap-4 items-start md:items-end">
                  <div className={`${pulse} h-10 w-32 rounded-md`} />
                  <div className={`${pulse} h-5 w-32`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const { data: ordersData, loading, error, refetch } = useGetData({
    url: USER_ENDPOINTS.Get_My_Orders,
  });

  const rawOrders = useMemo(() => {
    const payload = (ordersData as any)?.data ?? ordersData;
    if (Array.isArray(payload?.orders?.data)) return payload.orders.data;
    if (Array.isArray(payload?.orders)) return payload.orders;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  }, [ordersData]);

  const normalizedOrders: NormalizedOrder[] = useMemo(
    () =>
      rawOrders.map((order: any, index: number) => {
        const statusKey = normalizeStatus(
          order?.status || order?.state || order?.order_status
        );
        const priceRaw =
          order?.total_price ||
          order?.grand_total ||
          order?.total ||
          order?.total_amount ||
          order?.amount;
        const priceValue =
          typeof priceRaw === "number"
            ? priceRaw
            : Number(String(priceRaw || "").replace(/[^\d.-]/g, "")) || 0;
        const placedAtRaw =
          order?.order_date || order?.created_at || order?.createdAt || order?.date;
        const expectedRaw =
          order?.expected_arrival ||
          order?.expected_delivery ||
          order?.arrival_date ||
          order?.delivery_date;

        const statusInfo = STATUS_META[statusKey] || STATUS_META.default;
        const storeOrders = Array.isArray(order?.store_orders)
          ? order.store_orders
          : [];

        const itemsFromStores = storeOrders.reduce((sum: number, so: any) => {
          if (typeof so?.items_count === "number") return sum + so.items_count;
          if (Array.isArray(so?.items)) return sum + so.items.length;
          return sum;
        }, 0);

        return {
          id: String(order?.order_number || order?.id || index + 1),
          statusKey,
          statusLabel: statusInfo.label || statusKey.replace(/_/g, " "),
          itemsCount: String(
            order?.items_count ||
            order?.products_count ||
            itemsFromStores ||
            order?.items?.length ||
            order?.products?.length ||
            order?.quantity ||
            order?.order_items?.length ||
            0
          ),
          placedAtLabel: formatDateTime(placedAtRaw),
          expectedLabel: formatDateOnly(expectedRaw),
          totalPriceLabel: formatCurrency(priceRaw),
          priceValue,
          placedAtValue: placedAtRaw ? new Date(placedAtRaw).getTime() : 0,
        };
      }),
    [rawOrders]
  );

  const statusCounts = useMemo(() => {
    return normalizedOrders.reduce<Record<string, number>>(
      (acc, order) => {
        acc[order.statusKey] = (acc[order.statusKey] || 0) + 1;
        acc.all = (acc.all || 0) + 1;
        return acc;
      },
      { all: 0 }
    );
  }, [normalizedOrders]);

  const filteredOrders = useMemo(() => {
    let list = [...normalizedOrders];

    if (statusFilter !== "all") {
      list = list.filter((order) => order.statusKey === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.statusLabel.toLowerCase().includes(term)
      );
    }

    switch (sortOption) {
      case "oldest":
        list.sort((a, b) => a.placedAtValue - b.placedAtValue);
        break;
      case "price_high":
        list.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "price_low":
        list.sort((a, b) => a.priceValue - b.priceValue);
        break;
      default:
        list.sort((a, b) => b.placedAtValue - a.placedAtValue);
        break;
    }

    return list;
  }, [normalizedOrders, statusFilter, searchTerm, sortOption]);

  const handleBack = () => {
    // Remove order_id from URL when going back
    const params = new URLSearchParams(searchParams.toString());
    params.delete('order_id');
    router.push(`?${params.toString()}`);
    setSelectedOrderId(null);
  };

  if (selectedOrderId) {
    return (
      <OrderDetails
        orderId={selectedOrderId}
        onBack={handleBack}
      />
    );
  }

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="space-y-6 p-6 md:p-7 md:pt-[4vh]">
      <div className="space-y-2">
        <h2 className="text-[26px] font-bold text-[#323232] leading-tight">
          {t("orders.title")}
        </h2>
        <p className="text-[16px] text-[#747474] max-w-2xl">
          {t("orders.description")}
        </p>
      </div>

      <div className="flex flex-wrap gap-10 border-b border-[#DDE3DF]">
        {FILTER_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const count =
            tab.key === "all"
              ? statusCounts.all || 0
              : statusCounts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`relative flex items-center gap-3 pb-3 text-[15px] font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[4px] after:rounded-full ${isActive
                ? "text-[#0B7A5C] after:w-full after:bg-[#0B7A5C]"
                : "text-[#6B7280] after:w-0 after:bg-transparent hover:text-[#0B7A5C]"
                }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] ${isActive
                  ? "bg-[#0B7A5C]/20 text-blueSite"
                  : "bg-[#747474]/20 text-[#747474]"
                  }`}
              >
                <BoxIcon className="w-4 h-4" />
              </span>
              <span className="whitespace-nowrap">
                {tab.label} ({count || 0})
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blueSite" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("orders.searchPlaceholder")}
            className="w-full rounded-[10px] !border-none bg-[#FBFBFB] pl-16 pr-4 py-4 text-sm text-blueSite focus:outline-none focus:ring-2 focus:ring-[#0B7A5C]/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 rounded-[10px] bg-[#E6F0ED] px-6 py-3">
            <ArrowUpDown className="text-blueSite" size={18} />
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value)}
              options={SORT_OPTIONS}
              suffixIcon={<SlidersHorizontal size={16} className="text-blueSite" />}
              popupMatchSelectWidth={false}
              className="min-w-[190px] [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!px-0 [&_.ant-select-selector]:!h-auto [&_.ant-select-selection-item]:!text-[#1B2E35] [&_.ant-select-selection-item]:!font-semibold"
            />
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 flex items-center justify-between">
          <span>{t("orders.failedToLoad")}</span>
          <Button
            unstyled
            onClick={refetch}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t("orders.retry")}
          </Button>
        </div>
      ) : null}

      {loading ? (
        <LoaderPage />
      ) : filteredOrders.length ? (
        <div className="grid gap-4 sm:gap-6">
          {filteredOrders.map((order) => {
            const statusInfo =
              STATUS_META[order.statusKey] || STATUS_META.default;
            const isCancelable = ["pending", "in_progress", "placed"].includes(
              order.statusKey
            );

            return (
              <OrderCard
                key={order.id}
                id={order.id}
                statusKey={order.statusKey}
                statusLabel={order.statusLabel}
                statusBg={statusInfo.bg}
                statusText={statusInfo.text}
                statusBorder={statusInfo.border}
                itemsCount={order.itemsCount}
                placedAtLabel={order.placedAtLabel}
                expectedLabel={order.expectedLabel}
                totalPriceLabel={order.totalPriceLabel}
                isCancelable={isCancelable}
                onViewDetails={handleViewDetails}
                onCancelOrder={handleCancelOrder}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FBFA] p-6 text-center text-[#4F5B63]">
          {t("orders.noOrdersFound")}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
