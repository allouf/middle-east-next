"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Table,
  Tag,
  Typography,
  Button as AntButton,
  Grid,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

import useGetData from "@/lib/api/useGetData";
import { ORDERS_ENDPOINT } from "@/shared/constants/urls";
import { TbUserFilled } from "react-icons/tb";
import OrderDetails from "./OrderDetails";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { StatsCard } from "./StatsCard";

const { Title, Text } = Typography;

type KnownOrderStatus =
  | "completed"
  | "in_progress"
  | "cancelled"
  | "placed"
  | "seller_confirmed"
  | "fulfilled"
  | "pending";

type OrderStatusKey = KnownOrderStatus | string;

interface OrderRecord {
  key: string;
  id: string;
  client: {
    name: string;
    email: string;
  };
  orderDate: string;
  paymentMethod: string;
  shippingMethod: string;
  location: string;
  totalPrice: string;
  status: OrderStatusKey;
}

const statusMeta: Record<string, { label: string; color: string; bg: string }> =
{
  completed: { label: "completed", color: "#1F8A5B", bg: "#E7F6EF" },
  in_progress: { label: "in_progress", color: "#7C3AED", bg: "#F1E9FE" },
  cancelled: { label: "cancelled", color: "#D92D20", bg: "#FEEBEB" },
  placed: { label: "placed", color: "#F59E0B", bg: "#FFF4E5" },
  seller_confirmed: {
    label: "seller_confirmed",
    color: "#0F8C8C",
    bg: "#E1F3F3",
  },
  fulfilled: { label: "fulfilled", color: "#1D4ED8", bg: "#E6ECFF" },
  pending: { label: "pending", color: "#F59E0B", bg: "#FFF4E5" },
};

const statTrendDefaults: Record<
  string,
  { trend: string; tone: "up" | "down" }
> = {
  total: { trend: "-12.6%", tone: "down" },
  active: { trend: "28.4%", tone: "up" },
  new: { trend: "28.4%", tone: "up" },
  cancelled: { trend: "-12.6%", tone: "down" },
};

const palette = {
  primaryText: "text-blueSite",
  primaryBorder: "border-blueSite",
  primaryBg: "bg-blueSite",
  lightBg: "bg-[#F4F8F6]",
  headerBg: "bg-[#F8FBF9]",
};

const statusChipClass: Record<string, string> = {
  completed: "!bg-[#05C16833] !text-[#06B187] !border-[#05C16833]",
  in_progress: "!bg-[#8A3AC833] !text-[#8A3AC8] !border-[#8A3AC833]",
  cancelled: "!bg-[#D02F4433] !text-[#BF2033] !border-[#D02F4433]",
  placed: "!bg-[#00664F33] !text-[#00664F] !border-[#00664F33]",
  seller_confirmed: "!bg-[#592BBE4D] !text-[#592BBE] !border-[#592BBE4D]",
  fulfilled: "!bg-[#073D5F33] !text-[#073D5F] !border-[#073D5F33]",
  pending: "!bg-[#8A3AC833] !text-[#8A3AC8] !border-[#8A3AC833]",
};



const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value?: string;
  onChange: (value?: string) => void;
  options: { label: string; value: string }[];
}) => (
  <>
    <Select
      suffixIcon={<DownOutlined className="text-[#6B7280]" />}
      placeholder={label}
      allowClear
      className="w-full h-10 sm:h-[42px] !rounded-[0px] !border-none !bg-[#D9D9D933]"
      value={value}
      onChange={(val) => onChange(val || undefined)}
      options={options}
      bordered={false}
      size={window.innerWidth < 640 ? "middle" : "large"}
    />
  </>
);

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = dayjs(value);
  if (!parsed.isValid()) return value;
  return parsed.format("YYYY-MM-DD");
};

const formatCurrency = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (typeof value === "string") return value;
  return String(value);
};

const buildLocation = (order: any) => {
  const address =
    order?.shipping_address ||
    order?.address ||
    order?.user_address ||
    order?.shippingAddress;
  const parts = [
    address?.city,
    address?.region || address?.state,
    address?.country,
  ].filter(Boolean);
  if (parts.length) return parts.join(", ");
  if (address?.address || address?.line1)
    return address.address || address.line1;
  return order?.location || "-";
};

const normalizeText = (value?: string) => {
  if (!value) return "-";
  return value.replace(/_/g, " ");
};

const OrdersOverview = () => {
  const params = useParams<{ id: string; locale?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const storeId = params?.id;
  const locale = (params as any)?.locale || "en";

  const [statusFilter, setStatusFilter] = useState<string>();
  const [shippingMethodFilter, setShippingMethodFilter] = useState<string>();
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>();
  const [singleDate, setSingleDate] = useState<Dayjs | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string>();

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    if (shippingMethodFilter) params.shipping_method = shippingMethodFilter;
    if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
    if (singleDate) params.date = singleDate.format("YYYY-MM-DD");
    return params;
  }, [statusFilter, shippingMethodFilter, paymentMethodFilter, singleDate]);

  const requestParams = useMemo(
    () => ({ ...queryParams, per_page: pageSize }),
    [queryParams, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [
    statusFilter,
    shippingMethodFilter,
    paymentMethodFilter,
    singleDate,
    pageSize,
  ]);

  const {
    data: ordersResponse,
    loading,
    error,
    refetch,
  } = useGetData({
    url: storeId ? ORDERS_ENDPOINT.getByStore(storeId) : "",
    paginate: true,
    page,
    extraParams: requestParams,
    enabled: Boolean(storeId),
  });

  const {
    data: ordersStatistics,
    loading: statisticsLoading,
    error: statisticsError,
    refetch: refetchStatistics,
  } = useGetData({
    url: storeId ? ORDERS_ENDPOINT.statisticsByStore(storeId) : "",
    enabled: Boolean(storeId),
  });

  const rawOrders = useMemo(() => {
    const payload = ordersResponse?.data ?? ordersResponse;
    if (Array.isArray(payload?.orders?.data)) return payload.orders.data;
    if (Array.isArray(payload?.orders)) return payload.orders;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  }, [ordersResponse]);

  const meta = useMemo(() => {
    const payload = ordersResponse?.data ?? ordersResponse;
    const metaCandidate =
      payload?.meta || payload?.orders?.meta || payload?.data?.meta;
    return {
      current_page: metaCandidate?.current_page || 1,
      per_page: metaCandidate?.per_page || 10,
      total: metaCandidate?.total ?? rawOrders.length,
    };
  }, [ordersResponse, rawOrders.length]);

  const statisticsCounts = useMemo(() => {
    const payload: any = ordersStatistics?.data ?? ordersStatistics;
    const source = payload?.statistics ?? payload?.data ?? payload;

    const pickNumber = (...keys: string[]) => {
      if (!source) return undefined;
      for (const key of keys) {
        const value = source?.[key];
        if (typeof value === "number") return value;
        if (typeof value === "string" && value.trim() !== "") {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) return parsed;
        }
      }
      return undefined;
    };

    return {
      total: pickNumber("total", "total_orders", "orders_total", "all"),
      active: pickNumber(
        "active",
        "active_orders",
        "in_progress",
        "processing"
      ),
      new: pickNumber("new", "new_orders", "recent", "placed"),
      cancelled: pickNumber(
        "cancelled",
        "canceled",
        "cancelled_orders",
        "canceled_orders"
      ),
    };
  }, [ordersStatistics]);

  const mappedOrders: OrderRecord[] = useMemo(
    () =>
      rawOrders.map((order: any, index: number) => {
        const orderId = order?.order_number || order?.id || index + 1;
        const clientName =
          order?.client?.name ||
          order?.user?.name ||
          order?.customer?.name ||
          order?.shipping_address?.name ||
          t("common.unknownClient");
        const clientEmail =
          order?.client?.email ||
          order?.user?.email ||
          order?.customer?.email ||
          order?.email ||
          "";
        const status = (order?.status || "placed") as OrderStatusKey;

        return {
          key: String(orderId),
          id: String(orderId),
          client: {
            name: clientName,
            email: clientEmail,
          },
          orderDate: formatDate(
            order?.order_date || order?.created_at || order?.date
          ),
          paymentMethod: normalizeText(
            order?.payment_method ||
            order?.payment_type ||
            order?.payment?.method ||
            order?.paymentMethod
          ),
          shippingMethod: normalizeText(
            order?.shipping_method ||
            order?.shipping?.method ||
            order?.delivery_type ||
            order?.shippingMethod
          ),
          location: buildLocation(order),
          totalPrice: formatCurrency(
            order?.total_price ||
            order?.grand_total ||
            order?.total ||
            order?.total_amount ||
            order?.subtotal ||
            order?.amount
          ),
          status,
        };
      }),
    [rawOrders]
  );

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return mappedOrders;
    const term = searchTerm.toLowerCase();
    return mappedOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.client.name.toLowerCase().includes(term) ||
        order.client.email.toLowerCase().includes(term)
    );
  }, [mappedOrders, searchTerm]);

  const statusCounts = useMemo(() => {
    if (!Array.isArray(rawOrders)) return {};
    return rawOrders.reduce<Record<string, number>>((acc, order) => {
      const key = String(order?.status || "").toLowerCase();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [rawOrders]);

  const stats = useMemo(
    () => [
      {
        key: "total",
        label: t("orders.overview.stats.total"),
        value: statisticsCounts.total ?? meta.total ?? 0,
        trend: statTrendDefaults.total.trend,
        trendTone: statTrendDefaults.total.tone,
        iconBgClass: "bg-[#7965DB]/20",
        cardBg: "bg-[#6852D688]/10",
        icon: <TbUserFilled className="text-[#6852D6]" />,
        textColor: "text-[#6852D6]",
      },
      {
        key: "active",
        label: t("orders.overview.stats.active"),
        value:
          statisticsCounts.active ??
          (statusCounts.placed || 0) +
          (statusCounts.in_progress || 0) +
          (statusCounts.seller_confirmed || 0) +
          (statusCounts.fulfilled || 0),
        trend: statTrendDefaults.active.trend,
        trendTone: statTrendDefaults.active.tone,
        iconBgClass: "bg-[#56E8A7]/20",
        cardBg: "bg-[#56E8A722]",
        icon: <TbUserFilled className="text-[#56E8A7]" />,
        textColor: "text-[#56E8A7]",
      },
      {
        key: "new",
        label: t("orders.overview.stats.new"),
        value: statisticsCounts.new ?? statusCounts.placed ?? 0,
        trend: statTrendDefaults.new.trend,
        trendTone: statTrendDefaults.new.tone,
        iconBgClass: "bg-[#00664F]/20",
        cardBg: "bg-[#E7F5FD99]",
        icon: <TbUserFilled className="text-[#00664F]" />,
        textColor: "text-[#00664F]",
      },
      {
        key: "cancelled",
        label: t("orders.overview.stats.cancelled"),
        value: statisticsCounts.cancelled ?? statusCounts.cancelled ?? 0,
        trend: statTrendDefaults.cancelled.trend,
        trendTone: statTrendDefaults.cancelled.tone,
        iconBgClass: "bg-[#BF2033]/20",
        cardBg: "bg-[#D02F440D]",
        icon: <TbUserFilled className="text-[#BF2033]" />,
        textColor: "text-[#BF2033]",
      },
    ],
    [meta.total, statisticsCounts, statusCounts]
  );

  const dataError = error || statisticsError;

  const handleRefresh = () => {
    refetch();
    refetchStatistics();
  };

  const handleViewOrder = useCallback(
    (orderId: string) => {
      if (!orderId) return;
      setSelectedOrderId(orderId);
    },
    []
  );

  const headerCellClass =
    "!text-blueSite font-semibold !bg-[transparent]";
  const bodyCellClass = "text-[#1F2937]";

  const columns = useMemo(
    () => [
      {
        title: t("table.headers.id"),
        dataIndex: "id",
        key: "id",
        width: 80,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (text: string, record: OrderRecord) => (
          <Text
            className="text-blueSite cursor-pointer text-xs sm:text-sm"
            onClick={() => handleViewOrder(record.id)}
          >
            {text}
          </Text>
        ),
      },

      {
        title: t("table.headers.clientName"),
        dataIndex: "client",
        key: "client",
        width: 200,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (client: OrderRecord["client"]) => (
          <div className="flex flex-col leading-tight min-w-0">
            <Text className="text-[12px] sm:text-[14px] text-[#0F172A] font-semibold truncate">
              {client.name}
            </Text>
            <Text className="text-[10px] sm:text-[12px] text-[#9CA3AF] truncate hidden xs:block">
              {client.email}
            </Text>
          </div>
        ),
      },
      {
        title: t("table.headers.orderDate"),
        dataIndex: "orderDate",
        key: "orderDate",
        width: 100,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (text: string) => (
          <Text className="text-xs sm:text-sm">{text || "-"}</Text>
        ),
      },
      {
        title: t("table.headers.paymentMethod"),
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        width: 120,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (text: string) => (
          <Text className="text-xs sm:text-sm">
            {text ? t(`orders.paymentMethods.${text}`) : "-"}
          </Text>
        ),
      },

      {
        title: t("table.headers.shippingMethod"),
        dataIndex: "shippingMethod",
        key: "shippingMethod",
        width: 120,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (text: string) => (
          <Text className="text-xs sm:text-sm">
            {text ? t(`orders.details.shippingMethods.${text}`) : "-"}
          </Text>
        ),
      },
      {
        title: t("table.headers.theLocation"),
        dataIndex: "location",
        key: "location",
        width: 100,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (text: string) => (
          <Text className="text-xs sm:text-sm truncate block max-w-[100px]">{text || "-"}</Text>
        ),
      },
      {
        title: t("table.headers.totalPrice"),
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 100,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (text: string) => (
          <Text className="text-xs sm:text-sm font-medium">{text || "-"}</Text>
        ),
      },

      {
        title: t("table.headers.status"),
        dataIndex: "status",
        key: "status",
        width: 120,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (status: OrderStatusKey) => {
          const normalized = String(status || "").toLowerCase();
          const meta = statusMeta[normalized];
          const tagClass =
            statusChipClass[normalized] ||
            "!bg-gray-100 !text-gray-700 !border-gray-200";
          return (
            <Tag
              className={`rounded-[4px] px-2 py-[1px] text-[10px] sm:text-[12px] sm:px-3 sm:py-[2px] font-medium ${tagClass}`}
            >
              <span className="hidden xs:inline">
                {meta?.label ? t(`orders.statuses.${meta.label}`) : status || "-"}
              </span>
              <span className="xs:hidden">
                {meta?.label ? t(`orders.statuses.${meta.label}`)?.slice(0, 8) + "..." : status?.slice(0, 8) + "..." || "-"}
              </span>
            </Tag>
          );
        },
      },
      {
        title: t("table.headers.actions"),
        key: "action",
        width: 80,
        align: "right" as const,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (_: unknown, record: OrderRecord) => (
          <AntButton
            type="primary"
            icon={<EyeOutlined className="text-white" />}
            onClick={() => handleViewOrder(record.id)}
            aria-label="View order details"
            className="bg-blueSite h-7 w-7 xs:h-8 xs:w-8 sm:h-auto sm:w-auto sm:px-3"
            size={window.innerWidth < 640 ? "small" : "middle"}
          >
            <span className="hidden sm:inline">{t("buttons.view")}</span>
          </AntButton>
        ),
      },
    ],
    [bodyCellClass, handleViewOrder, headerCellClass]
  );

  const totalRows = searchTerm ? filteredOrders.length : meta.total;
  const currentPageSize = pageSize || meta.per_page || 10;
  const startRow = totalRows ? (page - 1) * currentPageSize + 1 : 0;
  const endRow = totalRows
    ? Math.min(
      page * currentPageSize,
      searchTerm ? filteredOrders.length : meta.total
    )
    : 0;

  if (selectedOrderId) {
    return (
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
        <OrderDetails
          storeId={storeId}
          orderId={selectedOrderId}
          onBack={() => setSelectedOrderId(undefined)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h2 className={`!m-0 text-base sm:text-lg font-semibold text-blueSite`}>{t("orders.title")}</h2>
        <div className="w-full sm:w-auto sm:flex-shrink-0">
          <Input
            placeholder={t("orders.overview.searchPlaceholder")}
            prefix={<SearchOutlined className="text-blueSite me-2" />}
            className="w-full h-10 sm:h-[42px] rounded-full border-none !bg-[#FAFAFA] px-4 !shadow-none"
            size="large"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            allowClear
          />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <Title level={4} className="mb-2 text-[#111827] text-base sm:text-lg">
          {t("orders.overview.statisticsTitle")}
        </Title>
        <Row gutter={[12, 12]}>
          {stats.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.key}>
              <StatsCard {...item} />
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} lg={6}>
          <DatePicker
            allowClear
            className="w-full h-10 sm:h-[42px] !rounded-[0px] bg-[#D9D9D933] px-3"
            placeholder={t("orders.overview.filters.date")}
            value={singleDate}
            onChange={(value) => setSingleDate(value)}
            suffixIcon={<DownOutlined className="text-[#6B7280]" />}
            bordered={false}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <FilterSelect
            label={t("orders.overview.filters.shipping")}
            value={shippingMethodFilter}
            onChange={(value) => setShippingMethodFilter(value)}
            options={[
              { label: t("orders.shippingMethods.express"), value: "express" },
              { label: t("orders.shippingMethods.standard"), value: "standard" },
            ]}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <FilterSelect
            label={t("orders.overview.filters.payment")}
            value={paymentMethodFilter}
            onChange={(value) => setPaymentMethodFilter(value)}
            options={[
              { label: t("orders.paymentMethods.cod"), value: "cod" },
              { label: t("orders.paymentMethods.card"), value: "card" },
              { label: t("orders.paymentMethods.wallet"), value: "wallet" },
            ]}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <FilterSelect
            label={t("orders.overview.filters.status")}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={Object.entries(statusMeta).map(([value, meta]) => ({
              label: t(`orders.statuses.${meta.label}`),
              value,
            }))}
          />
        </Col>
      </Row>

      {dataError && (
        <Alert
          type="error"
          showIcon
          message={t("orders.details.error.failedToLoad")}
          description={dataError}
          className="bg-red-50"
        />
      )}

      <Card className="shadow-sm px-2 sm:px-3 lg:px-5 !border-[#323232] !rounded-[8px] sm:!rounded-[12px] lg:!rounded-[16px] overflow-hidden [&_.ant-card-body]:p-0">
        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          pagination={{
            position: ["bottomRight"],
            current: page,
            pageSize,
            total: totalRows,
            showSizeChanger: true,
            showTotal: (total, range) =>
              t("orders.overview.table.rangeInfo", { from: range[0], to: range[1], total }),
            onChange: (newPage) => setPage(newPage),
            onShowSizeChange: (_, size) => {
              setPageSize(size);
              setPage(1);
            },
            simple: window.innerWidth < 640,
          }}
          rowKey="key"
          bordered={false}
          title={() => (
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0 px-2">
              <Text strong className={"text-blueSite text-sm xs:text-base sm:text-lg"}>
                {t("orders.overview.table.allOrders")}
              </Text>
              <Text className={`text-xs xs:text-sm text-blueSite font-medium`}>
                {startRow} - {endRow} of {totalRows}
              </Text>
            </div>
          )}
          scroll={{ x: 400, y: window.innerWidth < 640 ? 300 : 400 }}
          size={window.innerWidth < 640 ? "small" : "middle"}
          className="[&_.ant-table-thead>tr>th]:text-xs xs:[&_.ant-table-thead>tr>th]:text-sm [&_.ant-table-tbody>tr>td]:text-xs xs:[&_.ant-table-tbody>tr>td]:text-sm"
        />
      </Card>
    </div>
  );
};

export default OrdersOverview;
