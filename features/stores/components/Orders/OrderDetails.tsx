"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Check, ClipboardList, Package, ShieldCheck, Truck } from "lucide-react";
import dayjs from "dayjs";

import useGetData from "@/lib/api/useGetData";
import { ORDERS_ENDPOINT } from "@/shared/constants/urls";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { OrderDetailsSkeleton } from "./SkeletonLine";
import { StepTimeline } from "./StepTimeline";

type OrderDetailsProps = {
  storeId?: string;
  orderId?: string;
  onBack?: () => void;
};

type OrderItem = {
  id: string | number;
  title: string;
  category?: string;
  image?: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Address = {
  name?: string;
  phone?: string;
  email?: string;
  addressLine?: string;
  city?: string;
  region?: string;
  country?: string;
};

type ActivityEntry = {
  id: string | number;
  title: string;
  timestamp?: string;
  statusKey?: string;
};

const formatCurrency = (value: unknown) => {
  const num = typeof value === "number" ? value : Number(value ?? 0);
  if (Number.isNaN(num)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatDateTime = (value?: string) => {
  if (!value) return "";
  const parsed = dayjs(value);
  if (!parsed.isValid()) return value;
  return parsed.format("DD MMM, YYYY [at] h:mm A");
};

const normalizeStatus = (value?: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "_");

const pickFirst = (source: any, keys: string[]) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }
  return undefined;
};

const buildAddress = (raw?: any): Address => {
  if (!raw) return {};
  return {
    name:
      raw?.name ||
      raw?.full_name ||
      raw?.contact_name ||
      `${raw?.first_name || ""} ${raw?.last_name || ""}`.trim() ||
      undefined,
    phone: raw?.phone || raw?.mobile || raw?.contact_number || raw?.phone_number,
    email: raw?.email,
    addressLine:
      raw?.address ||
      raw?.address_line ||
      raw?.address1 ||
      raw?.line1 ||
      raw?.street ||
      raw?.street_address,
    city: raw?.city,
    region: raw?.region || raw?.state || raw?.province,
    country: raw?.country,
  };
};

const normalizeItems = (order: any, t: any): OrderItem[] => {
  const rawItems =
    order?.items ||
    order?.order_items ||
    order?.products ||
    order?.product ||
    order?.data ||
    [];

  const list = Array.isArray(rawItems?.data)
    ? rawItems.data
    : Array.isArray(rawItems?.items)
      ? rawItems.items
      : Array.isArray(rawItems)
        ? rawItems
        : [];

  return list.map((item: any, index: number) => {
    const priceCandidate =
      item?.price ||
      item?.unit_price ||
      item?.unitPrice ||
      item?.variant?.price ||
      item?.product?.price ||
      0;
    const qty = item?.quantity || item?.qty || item?.count || 1;
    const subtotalCandidate =
      item?.subtotal ||
      item?.sub_total ||
      item?.total ||
      item?.total_price ||
      priceCandidate * qty;

    const optionValues: string[] = Array.isArray(item?.variant?.option_values)
      ? item.variant.option_values.map((o: any) => o?.value).filter(Boolean)
      : [];

    const baseTitle =
      item?.title ||
      item?.name ||
      item?.product_name ||
      item?.product?.name ||
      item?.variant?.product?.name ||
      t("store.product");

    const title =
      optionValues.length > 0 ? `${baseTitle} - ${optionValues.join(", ")}` : baseTitle;

    return {
      id: item?.id || item?.product_id || index + 1,
      title,
      category: item?.category || item?.product?.category?.name || item?.variant?.sku,
      image:
        item?.image ||
        item?.thumbnail ||
        item?.variant?.image ||
        item?.product?.image ||
        item?.product?.main_image ||
        item?.variant?.product?.image ||
        item?.variant?.product?.main_image,
      price: Number(priceCandidate) || 0,
      quantity: Number(qty) || 1,
      subtotal: Number(subtotalCandidate) || 0,
    };
  });
};

const normalizeActivity = (order: any, t: any): ActivityEntry[] => {
  const rawTimeline =
    order?.timeline ||
    order?.activity ||
    order?.activities ||
    order?.status_history ||
    order?.tracking ||
    order?.tracking_history ||
    order?.logs ||
    [];

  const list = Array.isArray(rawTimeline?.data)
    ? rawTimeline.data
    : Array.isArray(rawTimeline)
      ? rawTimeline
      : [];

  return list.map((entry: any, index: number) => {
    const statusKey = normalizeStatus(
      entry?.status || entry?.state || entry?.title || entry?.label
    );
    return {
      id: entry?.id || index + 1,
      title:
        entry?.message ||
        entry?.note ||
        entry?.title ||
        entry?.status ||
        t("tickets.success"),
      timestamp:
        entry?.created_at ||
        entry?.date ||
        entry?.timestamp ||
        entry?.time ||
        "",
      statusKey,
    };
  });
};

const pickDateForStep = (order: any, keys: string[]) => {
  const value = pickFirst(order, keys);
  return value ? formatDateTime(value) : undefined;
};

const buildSteps = (order: any, activity: ActivityEntry[], t: any) => {
  const statusOrder = ["placed", "seller_confirmed", "in_progress", "fulfilled", "completed"];
  const statusLabels: Record<string, string> = {
    placed: t("orders.statuses.placed"),
    seller_confirmed: t("orders.statuses.seller_confirmed"),
    in_progress: t("orders.statuses.in_progress"),
    fulfilled: t("orders.statuses.fulfilled"),
    completed: t("orders.statuses.completed"),
  };

  const activityStatuses = new Set(
    activity.map((item) => normalizeStatus(item.statusKey))
  );
  const currentStatus = normalizeStatus(
    order?.status || order?.state || order?.order_status
  );
  const currentIndex = statusOrder.findIndex((s) => currentStatus.includes(s));

  const stepDates: Record<string, string | undefined> = {
    placed: pickDateForStep(order, ["order_date", "created_at", "placed_at"]),
    seller_confirmed: pickDateForStep(order, ["seller_confirmed_at", "confirmed_at"]),
    in_progress: pickDateForStep(order, ["in_progress_at", "processing_at", "updated_at"]),
    fulfilled: pickDateForStep(order, ["fulfilled_at", "delivered_at", "delivery_date"]),
    completed: pickDateForStep(order, ["completed_at", "finished_at"]),
  };

  return statusOrder.map((key, index) => {
    const completed =
      activityStatuses.has(key) ||
      currentIndex >= index ||
      normalizeStatus(order?.status) === key;
    const active =
      (!completed && currentIndex < 0 && index === 0) || currentIndex === index;
    return {
      key,
      label: statusLabels[key],
      completed,
      active,
      date: stepDates[key],
    };
  });
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  storeId: propStoreId,
  orderId: propOrderId,
  onBack,
}) => {
  const { t } = useTranslation();
  const params = useParams<{ id: string; orderId: string; locale: string }>();
  const router = useRouter();

  const storeId = propStoreId || (params?.id as string);
  const orderId = propOrderId || (params?.orderId as string);
  const locale = (params as any)?.locale || "en";

  const {
    data: orderResponse,
    loading,
    error,
    refetch,
  } = useGetData({
    url: orderId
      ? storeId
        ? ORDERS_ENDPOINT.getByStore(storeId)
        : ORDERS_ENDPOINT.details(orderId)
      : "",
    enabled: Boolean(orderId),
    extraParams: storeId ? { order_id: orderId } : {},
  });

  const order = useMemo(() => {
    const payload = (orderResponse as any)?.data ?? orderResponse;
    if (!payload) return {};

    const matchesOrderId = (candidate: any) => {
      if (!candidate) return false;
      const targetId = String(orderId);
      const idsToCheck = [
        candidate?.id,
        candidate?.order_id,
        candidate?.orderId,
        candidate?.order_number,
        candidate?.orderNumber,
        candidate?.number,
      ]
        .filter((val) => val !== undefined && val !== null)
        .map((val) => String(val));

      return idsToCheck.some((val) => val === targetId);
    };

    const findOrder = (source: any) => {
      if (Array.isArray(source)) {
        return source.find(matchesOrderId);
      }
      return undefined;
    };

    const directOrder =
      payload?.order || payload?.order_details || payload?.store_order;

    return (
      directOrder ||
      findOrder(payload?.orders?.data) ||
      findOrder(payload?.orders) ||
      findOrder(payload?.data) ||
      findOrder(payload) ||
      payload ||
      {}
    );
  }, [orderId, orderResponse]);

  const items = useMemo(() => normalizeItems(order, t), [order, t]);
  const activity = useMemo(() => normalizeActivity(order, t), [order, t]);
  const steps = useMemo(() => buildSteps(order, activity, t), [order, activity, t]);

  const billingAddress = useMemo(
    () =>
      buildAddress(
        order?.billing_address ||
        order?.billingAddress ||
        order?.billing ||
        order?.address
      ),
    [order]
  );

  const shippingAddress = useMemo(
    () =>
      buildAddress(
        order?.shipping_address ||
        order?.shippingAddress ||
        order?.delivery_address ||
        order?.address
      ),
    [order]
  );

  const paymentMethod =
    order?.payment_method || order?.paymentMethod || order?.payment?.method || "";
  const shippingMethod =
    order?.shipping_method || order?.shippingMethod || order?.delivery_type || "";

  const subtotal =
    Number(
      pickFirst(order, ["sub_total", "subtotal", "items_total", "items_subtotal"])
    ) || items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  const shipping =
    Number(pickFirst(order, ["shipping", "shipping_total", "shipping_cost"])) ||
    0;
  const discount =
    Number(pickFirst(order, ["discount", "discount_total", "total_discount"])) ||
    0;
  const shippingCost =
    Number(pickFirst(order, ["shipping_costs", "delivery_fee", "fee"])) || 0;
  const total =
    Number(
      pickFirst(order, [
        "total",
        "total_price",
        "grand_total",
        "total_amount",
        "amount",
      ])
    ) || subtotal + shipping + shippingCost - discount;

  const expectedArrival =
    order?.expected_delivery_date ||
    order?.expected_arrival ||
    order?.delivery_date ||
    "";

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (storeId) {
      router.push(`/${locale}/stores/${storeId}/management?tab=orders`);
    } else {
      router.back();
    }
  };

  const orderNumber =
    order?.order_number || order?.id || orderId || t("common.unknownOrder");
  const productsCount = items.length || order?.products_count || order?.items_count;
  const orderPlacedDate =
    order?.order_date || order?.created_at || order?.placed_at || "";

  if (!orderId) {
    return (
      <div className="p-6">
        <Alert type="error" showIcon message={t("orders.details.error.missingId")} />
      </div>
    );
  }

  if (loading) return <OrderDetailsSkeleton />;

  if (error) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          showIcon
          message={t("orders.details.error.failedToLoad")}
          description={error}
          className="mb-4"
        />
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#DC2626] text-white rounded-md hover:bg-[#b91c1c] transition"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (!order || Object.keys(order || {}).length === 0) {
    return (
      <div className="p-6">
        <Alert type="info" showIcon message={t("orders.details.error.noData")} />
      </div>
    );
  }

  return (
    <div className="px-2 md:px-10 py-6 space-y-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[#4B5563] hover:text-[#111827] transition"
      >
        <ArrowLeftOutlined />
        <span className="font-medium text-md">{t("orders.details.back")}</span>
      </button>

      <div className="bg-[#E8F2ED] px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="space-y-1">
          <p className="text-lg text-[#4B5563]">#{orderNumber}</p>
          <p className="text-sm text-[#4B5563]">
            {t("orders.details.productHeading", { count: productsCount || 0 })} - {t("orders.details.placedOn")}{" "}
            {orderPlacedDate ? formatDateTime(orderPlacedDate) : "N/A"}
          </p>
          {storeId ? (
            <p className="text-sm text-[#4B5563]">
              {t("orders.details.store", { name: order?.store?.name || storeId })}
            </p>
          ) : null}
        </div>
        <div className="text-right mt-3 md:mt-0">
          <p className="text-2xl font-semibold text-blueSite">
            {formatCurrency(total)}
          </p>
          <p className="text-xs text-[#4B5563]">
            {paymentMethod ? t("orders.details.payment", { method: paymentMethod }) : null}
            {paymentMethod && shippingMethod ? " - " : ""}

            {shippingMethod
              ? t("orders.details.shipping", {
                method: t(`orders.details.shippingMethods.${shippingMethod}`)
              })
              : null}    
                    </p>
        </div>
      </div>
      <div>
        <div className="md:px-6 py-4 space-y-2">
          {expectedArrival ? (
            <p className="text-xs text-[#4B5563]">
              {t("orders.details.expectedArrival", {
                date: dayjs(expectedArrival).isValid()
                  ? dayjs(expectedArrival).format("DD MMM, YYYY")
                  : expectedArrival
              })}
            </p>
          ) : null}

          <StepTimeline steps={steps} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="text-[#1F8A5B]" size={20} />
          <p className="text-base font-semibold text-[#111827]">{t("orders.details.activityTitle")}</p>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-500">{t("orders.details.noActivity")}</p>
        ) : (
          <div className="space-y-4">
            {activity.map((entry) => (
              <div
                key={entry.id}
                className="flex gap-3 items-start border-b last:border-b-0 border-gray-100 pb-3"
              >
                <div className="mt-1">
                  <Check className="text-[#1F8A5B]" size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#0F172A]">{entry.title}</p>
                  {entry.timestamp ? (
                    <p className="text-xs text-gray-500">
                      {formatDateTime(entry.timestamp)}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#111827]">
            {t("orders.details.productHeading", { count: items.length })}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F9FAFB] text-xs uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-6 py-3 font-semibold">{t("orders.details.table.products")}</th>
                <th className="px-6 py-3 font-semibold">{t("orders.details.table.price")}</th>
                <th className="px-6 py-3 font-semibold">{t("orders.details.table.quantity")}</th>
                <th className="px-6 py-3 font-semibold text-right">{t("orders.details.table.subtotal")}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                    {t("orders.details.table.empty")}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <Package className="text-gray-400" size={20} />
                          )}
                        </div>
                        <div className="space-y-1">
                          {item.category ? (
                            <p className="text-[10px] uppercase tracking-wide text-[#1F8A5B] font-semibold">
                              {item.category}
                            </p>
                          ) : null}
                          <p className="text-sm text-[#111827] leading-tight">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#111827]">{formatCurrency(item.price)}</td>
                    <td className="px-6 py-4 text-[#111827]">x{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-[#111827]">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex flex-col text-start gap-1">
          <div className="flex justify-between text-sm text-[#4B5563]">
            <span className="min-w-[120px] text-start">{t("orders.details.summary.subtotal")}</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#4B5563]">
            <span className="min-w-[120px] text-start">{t("orders.details.summary.shipping")}</span>
            <span className="font-medium">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#4B5563]">
            <span className="min-w-[120px] text-start">{t("orders.details.summary.discount")}</span>
            <span className="font-medium">{formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#4B5563]">
            <span className="min-w-[120px] text-start">{t("orders.details.summary.shippingCosts")}</span>
            <span className="font-medium">
              {formatCurrency(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-blueSite font-semibold pt-2">
            <span className="min-w-[120px] text-start">{t("orders.details.summary.total")}</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#1F8A5B]" size={18} />
            <p className="text-sm font-semibold text-[#111827]">{t("orders.details.address.billing")}</p>
          </div>
          <AddressBlock address={billingAddress} t={t} />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Truck className="text-[#1F8A5B]" size={18} />
            <p className="text-sm font-semibold text-[#111827]">{t("orders.details.address.shipping")}</p>
          </div>
          <AddressBlock address={shippingAddress} t={t} />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-[#1F8A5B]" />
            <p className="text-sm font-semibold text-[#111827]">{t("orders.details.address.notes")}</p>
          </div>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            {order?.note || order?.notes || t("orders.details.address.noNotes")}
          </p>
        </div>
      </div>
    </div>
  );
};

const AddressBlock = ({ address, t }: { address: Address; t: any }) => {
  const hasAddress =
    address.name ||
    address.addressLine ||
    address.city ||
    address.region ||
    address.country;
  return hasAddress ? (
    <div className="space-y-1 text-sm text-[#4B5563]">
      {address.name && <p className="text-[#111827] font-semibold">{address.name}</p>}
      {address.addressLine && <p>{address.addressLine}</p>}
      {(address.city || address.region || address.country) && (
        <p>
          {[address.city, address.region, address.country].filter(Boolean).join(", ")}
        </p>
      )}
      {address.phone && <p>{t("orders.details.address.phone", { phone: address.phone })}</p>}
      {address.email && <p>{t("orders.details.address.email", { email: address.email })}</p>}
    </div>
  ) : (
    <p className="text-sm text-gray-500">{t("orders.details.address.empty")}</p>
  );
};

export default OrderDetails;


