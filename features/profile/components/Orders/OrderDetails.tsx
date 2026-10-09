"use client";
// Force HMR refresh

import React, { JSX, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Rate, Upload, Modal as AntModal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Box,
  Check,
  Circle,
  ClipboardList,
  Handshake,
  Package,
  Truck,
} from "lucide-react";
import dayjs from "dayjs";

import useGetData from "@/lib/api/useGetData";
import { ORDERS_ENDPOINT } from "@/shared/constants/urls";
import Image from "next/image";
import IconsMemberImage from "@/assets/images/iconsMemberImage.png";
import Modal from "@/components/ui/Modal";
import usePostData from "@/lib/api/usePostData";
import CreateTickets from "../Tickets/CreateTickets";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { OrderDetailsSkeleton } from "./OrderDetailsSkeleton";
import type { UploadFile } from "antd/es/upload/interface";

type OrderDetailsProps = {
  storeId?: string;
  orderId?: string;
  onBack?: () => void;
};

type OrderItem = {
  id: string | number;
  orderId: string | number;
  title: string;
  category?: string;
  image?: string;
  price: number;
  quantity: number;
  subtotal: number;
  storeName?: string;
  productId?: string | number;
  status?: string;
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
    phone:
      raw?.phone || raw?.mobile || raw?.contact_number || raw?.phone_number,
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

const normalizeItems = (order: any): OrderItem[] => {
  const rawItems =
    order?.items ||
    order?.order_items ||
    order?.products ||
    order?.product ||
    order?.data ||
    [];

  const fromStoreOrders = Array.isArray(order?.store_orders)
    ? order.store_orders.flatMap((so: any) => {
      const list = Array.isArray(so?.items) ? so.items : [];
      return list.map((item: any, index: number) => ({
        ...item,
        storeName: so?.store?.name,
        storeID: so?.store?.id,
        storeOrderStatus: so?.status, // Add store order status
        idx: index,
      }));
    })
    : [];

  const list = Array.isArray(rawItems?.data)
    ? rawItems.data
    : Array.isArray(rawItems?.items)
      ? rawItems.items
      : Array.isArray(rawItems)
        ? rawItems
        : [];

  const merged = list.length ? list : fromStoreOrders;

  return merged.map((item: any, index: number) => {

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
      "Product";

    const title =
      optionValues.length > 0
        ? `${baseTitle} - ${optionValues.join(", ")}`
        : baseTitle;

    return {
      id: item?.id || item?.product_id || item?.idx || index + 1,
      title,
      category:
        item?.category ||
        item?.product?.category?.name ||
        item?.variant?.sku ||
        item?.storeName,
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
      storeName: item?.storeName,
      orderId: item?.store_order_id,
      storeId: item?.storeID,
      status: item?.storeOrderStatus || order?.status, // Use store order status or fallback to main order status
      productId:
        item?.product_id || item?.product?.id || item?.variant?.product_id,
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
        t("orders.details.statusUpdated", { defaultValue: "Status updated" }),
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

export default function OrderDetails({
  storeId: propStoreId,
  orderId: propOrderId,
  onBack,
}: OrderDetailsProps) {
  const { t } = useTranslation();
  const params = useParams<{ id: string; orderId: string; locale: string }>();
  const router = useRouter();
  const [openTicketModal, setOpenTicketModal] = useState(false)
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | number | null>(null)
  const storeId = propStoreId || (params?.id as string);
  const orderId = propOrderId || (params?.orderId as string);
  const locale = (params as any)?.locale || "en";
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const openTicketModalForItem = (itemId: string | number) => {
    setSelectedOrderItemId(itemId);
    setOpenTicketModal(true);
  };

  const closeTicketModal = () => {
    setOpenTicketModal(false);
    setSelectedOrderItemId(null);
  };

  const buildSteps = (order: any, activity: ActivityEntry[]) => {
    const statusOrder = [
      "pending_payment",
      "placed",
      "seller_confirmed",
      "in_progress",
      "fulfilled",
      "completed",
    ];

    const statusLabels: Record<string, string> = {
      pending_payment: t("orders.details.statusLabels.pendingPayment"),
      placed: t("orders.details.statusLabels.placed"),
      seller_confirmed: t("orders.details.statusLabels.sellerConfirmed"),
      in_progress: t("orders.details.statusLabels.inProgress"),
      fulfilled: t("orders.details.statusLabels.fulfilled"),
      completed: t("orders.details.statusLabels.completed"),
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
      seller_confirmed: pickDateForStep(order, [
        "seller_confirmed_at",
        "confirmed_at",
      ]),
      in_progress: pickDateForStep(order, [
        "in_progress_at",
        "processing_at",
        "updated_at",
      ]),
      fulfilled: pickDateForStep(order, [
        "fulfilled_at",
        "delivered_at",
        "delivery_date",
      ]),
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
  const {
    data: orderResponse,
    loading,
    error,
    refetch,
  } = useGetData({
    url: orderId ? ORDERS_ENDPOINT.details(orderId) : "",
    enabled: Boolean(orderId),
  });
  const order = useMemo(() => {
    const payload = (orderResponse as any)?.data ?? orderResponse;
    return payload || {};
  }, [orderResponse]);

  const items = useMemo(() => normalizeItems(order), [order]);
  const activity = useMemo(() => normalizeActivity(order, t), [order, t]);
  const steps = useMemo(() => buildSteps(order, activity), [order, activity]);

  const billingAddress = useMemo(
    () =>
      buildAddress(
        order?.billing_address ||
        order?.billingAddress ||
        order?.billing ||
        order?.address ||
        (Array.isArray(order?.store_orders)
          ? order.store_orders[0]?.address
          : undefined)
      ),
    [order]
  );

  const shippingAddress = useMemo(
    () =>
      buildAddress(
        order?.shipping_address ||
        order?.shippingAddress ||
        order?.delivery_address ||
        order?.address ||
        (Array.isArray(order?.store_orders)
          ? order.store_orders[0]?.address
          : undefined)
      ),
    [order]
  );

  const firstStoreOrder = Array.isArray(order?.store_orders)
    ? order.store_orders[0]
    : null;

  const paymentMethod =
    order?.payment_method ||
    order?.paymentMethod ||
    order?.payment?.method ||
    firstStoreOrder?.payment_method ||
    "";
  const shippingMethod =
    order?.shipping_method ||
    order?.shippingMethod ||
    order?.delivery_type ||
    firstStoreOrder?.shipping_method ||
    "";

  const subtotalFromStores = Array.isArray(order?.store_orders)
    ? order.store_orders.reduce(
      (sum: number, so: any) => sum + (Number(so?.subtotal) || 0),
      0
    )
    : 0;

  const subtotal =
    Number(
      pickFirst(order, [
        "sub_total",
        "subtotal",
        "items_total",
        "items_subtotal",
      ])
    ) ||
    items.reduce((sum, item) => sum + (item.subtotal || 0), 0) ||
    subtotalFromStores;

  const shipping =
    Number(pickFirst(order, ["shipping", "shipping_total", "shipping_cost"])) ||
    0;
  const discount =
    Number(
      pickFirst(order, ["discount", "discount_total", "total_discount"])
    ) || 0;
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
    ) ||
    subtotalFromStores + shipping + shippingCost - discount ||
    subtotal + shipping + shippingCost - discount;

  const expectedArrival =
    order?.expected_delivery_date ||
    order?.expected_arrival ||
    order?.delivery_date ||
    order?.expected_arrival_date ||
    "";
  const expectedArrivalLabel =
    expectedArrival && dayjs(expectedArrival).isValid()
      ? dayjs(expectedArrival).format("DD MMM, YYYY")
      : expectedArrival || "";

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (storeId) {
      router.push(`/${locale}/stores/${storeId}/management?tab=orders`);
    } else {
      // For profile context, navigate back to orders tab without order_id
      const url = new URL(window.location.href);
      url.searchParams.delete('order_id');
      router.push(`${url.pathname}?${url.searchParams.toString()}`);
    }
  };
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || "Preview");
  };

  const isRTL = locale === "ar";

  const orderNumber =
    order?.order_number || order?.id || orderId || t("orders.details.unknownOrder", { defaultValue: "Unknown order" });
  const productsCount =
    items.length || order?.products_count || order?.items_count;
  const orderPlacedDate =
    order?.order_date || order?.created_at || order?.placed_at || "";
  const normalizedStatus = normalizeStatus(
    order?.status || order?.state || order?.order_status
  );
  const canCancel = [
    "pending_payment",
    "pending",
    "placed",
    "in_progress",
    "seller_confirmed",
  ].includes(normalizedStatus);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewFiles, setReviewFiles] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [selectedReviewProductId, setSelectedReviewProductId] = useState<
    string | number | null
  >(null);
  const {
    postData: submitReview,
    loading: reviewSubmitting,
    contextHolder: messageHolder,
    messageApi,
  } = usePostData("/reviews/create");

  const AddressBlock = ({ address }: { address: Address }) => {
    const hasAddress =
      address.name ||
      address.addressLine ||
      address.city ||
      address.region ||
      address.country;
    return hasAddress ? (
      <div className="space-y-1 text-sm text-[#4B5563]">
        {address.name && (
          <p className="text-[#111827] font-semibold">{address.name}</p>
        )}
        {address.addressLine && <p>{address.addressLine}</p>}
        {(address.city || address.region || address.country) && (
          <p>
            {[address.city, address.region, address.country]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
        {address.phone && <p>{t("orders.details.phoneNumber")}: {address.phone}</p>}
        {address.email && <p>{t("orders.details.email")}: {address.email}</p>}
      </div>
    ) : (
      <p className="text-sm text-gray-500">{t("orders.details.noAddressProvided")}</p>
    );
  };

  const openReviewModal = (productId?: string | number | null) => {
    if (!productId) {
      messageApi.error(t("orders.details.unableToIdentifyProduct"));
      return;
    }
    setSelectedReviewProductId(productId || null);
    setReviewDescription("");
    setReviewFiles([]);
    setReviewRating(0);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedReviewProductId) {
      messageApi.error(t("orders.details.missingProductId"));
      return;
    }
    if (!reviewRating) {
      messageApi.error(t("orders.details.pleaseSelectRating"));
      return;
    }

    const images = (reviewFiles || [])
      .map((file: any) => file?.originFileObj)
      .filter(Boolean);

    await submitReview(
      {
        product_id: selectedReviewProductId,
        rating: reviewRating,
        description: reviewDescription,
        images,
      },
      {
        showMessage: false,
        onSuccess: (res) => {
          if (res?.message) {
            messageApi.success(res.message);
          }
          setShowReviewModal(false);
        },
        onError: (err) => {
          const resMessage =
            err?.response?.data?.message ||
            err?.message ||
            t("orders.details.failedToSubmitReview");
          messageApi.error(resMessage);
        },
      }
    );
  };

  if (!orderId) {
    return (
      <div className="p-6">
        <Alert type="error" showIcon message={t("orders.details.orderIdMissing")} />
      </div>
    );
  }

  if (loading) return <OrderDetailsSkeleton />;

  if (error) {
    return (
      <div className="p-6 md:p-7 md:pt-[4vh]">
        <Alert
          type="error"
          showIcon
          message={t("orders.details.failedToLoad")}
          description={error}
          className="mb-4"
        />
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#DC2626] text-white rounded-md hover:bg-[#b91c1c] transition"
        >
          {t("orders.retry")}
        </button>
      </div>
    );
  }

  if (!order || Object.keys(order || {}).length === 0) {
    return (
      <div className="p-6 md:p-7 md:pt-[4vh]">
        <Alert type="info" showIcon message={t("orders.details.noOrderData")} />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {messageHolder}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#4B5563] hover:text-[#111827] transition px-2 py-1 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeftOutlined className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">{t("orders.details.title")}</span>
        </button>
      </div>


      <div className="bg-[#E8F2ED] px-4 sm:px-5 lg:px-6 py-3 sm:py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="space-y-1">
          <p className="text-base sm:text-lg lg:text-xl text-[#4B5563] font-medium">#{orderNumber}</p>
          <p className="text-sm sm:text-base text-[#4B5563]">
            {productsCount || 0} {t("orders.products")} - {t("orders.details.orderPlacedOn")}{" "}
            {orderPlacedDate ? formatDateTime(orderPlacedDate) : t("common.na", { defaultValue: "N/A" })}
          </p>
          {storeId ? (
            <p className="text-sm text-[#4B5563]">
              {t("orders.details.store")}: {order?.store?.name || storeId}
            </p>
          ) : null}
          {expectedArrivalLabel ? (
            <p className="text-sm text-[#4B5563]">
              {t("orders.details.orderExpectedArrival")} {expectedArrivalLabel}
            </p>
          ) : null}
        </div>


        <div className="text-left sm:text-right mt-3 lg:mt-0 w-full sm:w-auto">
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-blueSite">
            {formatCurrency(total)}
          </p>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {paymentMethod && shippingMethod ? t("orders.details.payment", {
              method: t(`orders.paymentMethods.${paymentMethod}`)
            })
              : null}
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
        <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 space-y-2">
          {expectedArrivalLabel ? (
            <p className="text-xs sm:text-sm text-[#4B5563]">
              {t("orders.details.orderExpectedArrivalLabel", { defaultValue: "Order expected arrival" })} {expectedArrivalLabel}
            </p>
          ) : null}

          <StepTimeline steps={steps} isRTL={isRTL} />

        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="text-[#1F8A5B] w-4 h-4 sm:w-5 sm:h-5" />
          <p className="text-sm sm:text-base font-semibold text-[#111827]">
            {t("orders.details.orderActivity")}
          </p>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t("orders.details.noActivityAvailable")}
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {activity.map((entry) => (
              <div
                key={entry.id}
                className="flex gap-2 sm:gap-3 items-start border-b last:border-b-0 border-gray-100 pb-2 sm:pb-3"
              >
                <div className="mt-1">
                  <Check className="text-[#1F8A5B] w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-xs sm:text-sm text-[#0F172A] leading-relaxed">{entry.title}</p>
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

      <div className="bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4">
          <p className="text-sm sm:text-base font-medium text-[#111827]">
            {t("orders.details.products")}{" "}
            <span className="!text-[#696E6E] text-xs sm:text-sm">
              ({items.length.toString().padStart(2, "0")})
            </span>
          </p>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("orders.details.noProductsFound")}
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={16}
                        height={16}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <Package className="text-gray-400" size={16} />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    {item.category ? (
                      <p className="text-xs uppercase tracking-wide text-[#1F8A5B] font-semibold">
                        {item.category}
                      </p>
                    ) : null}
                    <p className="text-sm text-[#111827] leading-tight">
                      {item.title}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#111827]">
                        {formatCurrency(item.price)} x{item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-blueSite">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`flex gap-2 pt-2 border-t border-gray-100 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  {item.status === 'completed' ? (
                    <>
                      <button
                        type="button"
                        className="px-3 py-2 rounded-md bg-[#D02F44] text-white text-xs font-medium transition"
                        title={t('orders.details.addReport')}
                        onClick={() => openTicketModalForItem(item.id)}
                      >
                        {t('orders.details.addReport')}
                      </button>
                      <button
                        className="px-3 py-2 rounded-md bg-blueSite text-white text-xs font-medium transition"
                        onClick={() => openReviewModal(item.productId || item.id)}
                      >
                        {t("orders.details.addReview")}
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 px-2 py-1 rounded">
                      {t('orders.actionNotCompleted')}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className={`min-w-full text-sm border-separate border-spacing-y-2 sm:border-spacing-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <thead className="bg-[#F1F2F2] text-xs uppercase tracking-wide text-[#525656]">
              <tr>
                <th className={`px-4 sm:px-6 py-2 font-medium border ${isRTL ? "border-s-0" : "border-e-0"} border-[#D4D5D5] ${isRTL ? "text-right" : "text-left"}`}>
                  {t("orders.details.products")}
                </th>
                <th className={`px-4 sm:px-6 py-2 font-medium border-y border-[#D4D5D5] text-center`}>
                  {t("orders.details.price")}
                </th>
                <th className={`px-4 sm:px-6 py-2 font-medium border-y border-[#D4D5D5] w-[100px] text-center`}>
                  {t("orders.details.quantity")}
                </th>
                <th className={`px-4 sm:px-6 py-2 font-medium ${isRTL ? "text-left" : "text-right"} border-y border-[#D4D5D5]`}>
                  {t("orders.details.subtotal")}
                </th>
                <th className="px-4 sm:px-6 py-2 font-medium text-end border border-s-0 border-[#D4D5D5]">
                  {t("orders.details.action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    className="px-4 sm:px-6 py-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    {t("orders.details.noProductsFound")}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className={`px-4 sm:px-6 py-4 border-t border-[#D4D5D5] ${isRTL ? "text-right" : "text-left"}`}>
                      <div className={`flex items-start gap-3`}>
                        <div className="w-14 h-14 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={16}
                              height={16}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <Package className="text-gray-400" size={16} />
                          )}
                        </div>
                        <div className="space-y-1">
                          {item.category ? (
                            <p className="text-xs uppercase tracking-wide text-[#1F8A5B] font-semibold">
                              {item.category}
                            </p>
                          ) : null}
                          <p className={`text-sm text-[#111827] leading-tight ${isRTL ? "text-right" : "text-left"}`}>
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 sm:px-6 py-4 text-[#111827] border-t border-[#D4D5D5] text-center`}>
                      {formatCurrency(item.price)}
                    </td>
                    <td className={`px-4 sm:px-6 py-4 text-[#111827] border-t border-[#D4D5D5] text-center`}>
                      x{item.quantity}
                    </td>
                    <td className={`px-4 sm:px-6 py-4 text-center text-[#111827] border-t border-[#D4D5D5]`}>
                      {formatCurrency(item.subtotal)}
                    </td>
                    <td className="px-4 sm:px-1 py-4 border-t border-[#D4D5D5]">
                      <div className="flex gap-2 justify-end">

                        {item.status === 'completed' ? (
                          <>
                            <button
                              type="button"
                              className="px-3 py-2 rounded-md bg-[#D02F44] text-white text-xs font-medium transition"
                              title={t('orders.details.addReport')}
                              onClick={() => openTicketModalForItem(item.id)}
                            >
                              {t('orders.details.addReport')}
                            </button>
                            <button
                              className="px-3 py-2 rounded-md bg-blueSite text-white text-xs font-medium transition"
                              onClick={() => openReviewModal(item.productId || item.id)}
                            >
                              {t("orders.details.addReview")}
                            </button>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500 px-2 py-1 rounded">
                            {t('orders.actionNotCompleted')}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 sm:p-5 lg:p-6 flex flex-col gap-2">
          <div className={`flex gap-3 justify-between w-full text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`text-[#A1A1A1] ${isRTL ? "text-left" : "text-left"}`}>{t("orders.details.subtotal")}</span>
            <span className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className={`flex gap-3 justify-between w-full text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`text-[#A1A1A1] ${isRTL ? "text-left" : "text-left"}`}>{t("orders.details.shipping", { method: shippingMethod?.toLowerCase() })}</span>
            <span className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
              {shippingMethod ? t(`orders.shippingMethods.${shippingMethod.toLowerCase()}`, { defaultValue: shippingMethod }) : "-"}
            </span>
          </div>
          <div className={`flex gap-3 justify-between w-full text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`text-[#A1A1A1] ${isRTL ? "text-left" : "text-left"}`}>{t("orders.details.discount")}</span>
            <span className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
              {formatCurrency(discount)}
            </span>
          </div>
          <div className={`flex gap-3 justify-between w-full text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`text-[#A1A1A1] ${isRTL ? "text-left" : "text-left"}`}>{t("orders.details.shippingCosts")}</span>
            <span className={`font-medium ${isRTL ? "text-left" : "text-right"}`}>
              {formatCurrency(shippingCost)}
            </span>
          </div>
          <div className={`flex gap-3 justify-between w-full text-base sm:text-lg text-blueSite pt-3 border-t border-[#D4D5D5] ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`text-[#323232] font-medium ${isRTL ? "text-left" : "text-left"}`}>{t("orders.details.total")}</span>
            <span className={`font-semibold ${isRTL ? "text-left" : "text-right"}`}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 relative">
          <div className="flex items-center gap-2">
            <p className="text-base sm:text-lg font-medium text-[#191C1F]">
              {t("orders.details.billingAddress")}
            </p>
          </div>
          <AddressBlock address={billingAddress} />
          <div className="hidden lg:block absolute top-4 bottom-4 end-0 border-e border-gray-200"></div>
        </div>
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 relative">
          <div className="flex items-center gap-2">
            <p className="text-base sm:text-lg font-medium text-[#191C1F]">
              {t("orders.details.shippingAddress")}
            </p>
          </div>
          <AddressBlock address={shippingAddress} />
          <div className="hidden lg:block absolute top-4 bottom-4 end-0 border-e border-gray-200"></div>
        </div>
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-base sm:text-lg font-medium text-[#191C1F]">{t("orders.details.orderNotes")}</p>
          </div>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            {order?.note ||
              order?.notes ||
              t("orders.details.noAdditionalNotes")}
          </p>
        </div>
      </div>

      {canCancel ? (
        <button
          className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 bg-[#C62839] text-white font-semibold rounded-md shadow-sm hover:bg-[#b02131] transition text-sm sm:text-base"
          onClick={() => setShowCancelModal(true)}
        >
          {t("orders.details.cancelOrder")}
        </button>
      ) : null}
      {showCancelModal &&
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          padding="py-0 px-4 sm:px-6"
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="flex justify-center">
              <Image
                src={IconsMemberImage}
                alt="cancel-order"
                width={160}
                height={85}
                className="w-32 h-16 sm:w-40 sm:h-20"
              />
            </div>
            <p className="text-base sm:text-lg font-semibold text-[#1B2E35] text-center px-4">
              {t("orders.details.areYouSureCancel")}
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <button
                className="py-3 rounded-md border border-[#D0D5DD] text-[#1B2E35] font-semibold hover:bg-[#F7F7F7] transition text-sm sm:text-base"
                onClick={() => setShowCancelModal(false)}
              >
                {t("orders.details.cancel")}
              </button>
              <button
                className="py-3 rounded-md bg-[#C62839] text-white font-semibold hover:bg-[#b02131] transition text-sm sm:text-base"
                onClick={() => setShowCancelModal(false)}
              >
                {t("orders.details.confirm")}
              </button>
            </div>
          </div>
        </Modal>
      }
      {showReviewModal &&
        <Modal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          padding="px-4 sm:px-6 lg:px-10"
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-[520px] mx-auto pb-2">
            <div className="flex justify-center">
              <Image
                src={IconsMemberImage}
                alt="add-review"
                width={100}
                height={53}
                className="w-20 h-12 sm:w-24 sm:h-14"
              />
            </div>
            <div className="text-center space-y-1 px-4">
              <p className="text-base sm:text-lg font-semibold text-blueSite">
                {t("orders.details.addYourRating")}
              </p>
              <p className="text-xs sm:text-sm text-[#6B7280]">{t("orders.details.youCanAddAttachments")}</p>
            </div>

            <Rate
              allowClear
              value={reviewRating}
              onChange={setReviewRating}
              style={{ color: "#0B7A5C", fontSize: 18 }}
              className="text-lg sm:text-xl"
            />

            <div className="w-full space-y-2 px-4">
              <label className="text-sm font-semibold text-blueSite">
                {t("orders.details.addAReview")}
              </label>
              <textarea
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
                placeholder={t("orders.details.reviewPlaceholder")}
                className="w-full rounded-md border border-[#C4D6CF] px-3 py-2 min-h-[60px] sm:min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#0B7A5C]/40 text-sm"
              />
            </div>

            <div className="w-full space-y-2 px-4">
              <label className="text-sm font-semibold text-blueSite">
                {t("orders.details.attachments")}
              </label>

              <Upload.Dragger
                name="files"
                multiple
                listType="picture"
                fileList={reviewFiles}
                onChange={({ fileList }) => setReviewFiles(fileList)}
                onPreview={handlePreview}
                beforeUpload={() => false}
                className="rounded-lg border-[#C4D6CF] bg-white"
              >
                <p className="ant-upload-drag-icon mb-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-[#C4D6CF] text-[#1B2E35] font-medium hover:bg-[#F7F7F7] transition text-sm"
                  >
                    {t("orders.details.addFile")}
                  </button>
                </p>
                <p className="text-sm text-[#6B7280] mb-0">{t("orders.details.orDragAndDrop")}</p>
              </Upload.Dragger>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm pt-2">
              <button
                className="py-2.5 sm:py-3 rounded-md bg-blueSite text-white font-semibold hover:bg-[#0a6b4f] transition disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                onClick={handleSubmitReview}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? t("orders.details.submitting") : t("orders.details.submitReview")}
              </button>
              <button
                className="py-2.5 sm:py-3 rounded-md border border-[#D0D5DD] text-[#6B7280] font-semibold hover:bg-[#F7F7F7] transition text-sm sm:text-base"
                onClick={() => setShowReviewModal(false)}
              >
                {t("orders.details.cancel")}
              </button>
            </div>
          </div>
        </Modal>

      }
        {(orderId && openTicketModal) &&
        <CreateTickets
          open={openTicketModal}
          handleClose={closeTicketModal}
          orderId={orderId || ''}
          order_item_ids={selectedOrderItemId ? Number(selectedOrderItemId) : ''}
        />
      }


      {previewOpen && <AntModal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="preview"
          style={{ width: "100%" }}
          src={previewImage}
        />
      </AntModal>}


    </div>
  );
};

const StepTimeline = ({
  steps,
  isRTL = false,
}: {
  steps: { key: string; label: string; completed: boolean; active: boolean }[];
  isRTL?: boolean;
}) => {
  const primary = "#0B7C5C";
  const muted = "#b7d4c6";

  const circleSize = 36;
  const radius = circleSize / 2;

  const activeIndex = steps.findIndex((s) => s.active);
  const highestCompleted = steps
    .map((s, idx) => (s.completed ? idx : -1))
    .reduce((a, b) => Math.max(a, b), -1);

  const progressIndex = Math.max(activeIndex >= 0 ? activeIndex : 0, highestCompleted, 0);
  const progressRatio = steps.length > 1 ? progressIndex / (steps.length - 1) : 0;
  const progressWidthCalc = `calc((100% - ${circleSize}px) * ${progressRatio})`;

  const stepIcons: Record<string, JSX.Element> = {
    pending_payment: <ClipboardList size={24} strokeWidth={1.5} />,
    placed: <ClipboardList size={24} strokeWidth={1.5} />,
    seller_confirmed: <Box size={24} strokeWidth={1.5} />,
    in_progress: <Truck size={24} strokeWidth={1.5} />,
    fulfilled: <Truck size={24} strokeWidth={1.5} />,
    completed: <Handshake size={24} strokeWidth={1.5} />,
  };

  return (
    <div
      className="space-y-3 sm:space-y-4 w-full max-w-[800px] lg:max-w-[1100px] mx-auto"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* خط التقدم + النقاط الصغيرة */}
      {/* خط التقدم + النقاط الصغيرة */}
      <div className="relative w-full" style={{ height: circleSize }}>
        {/* الخلفية: من مركز أول دائرة إلى مركز آخر دائرة */}
        <div
          className="absolute rounded-full bg-[rgba(11,124,92,0.25)]"
          style={{
            height: 4, // سمك الخط
            top: "50%",
            transform: "translateY(-50%)",
            left: radius,
            right: radius,
          }}
        />

        {/* التقدم: نفس الخلفية لكن يتغير عرضه */}
        <div
          className="absolute rounded-full bg-[rgba(11,124,92,0.9)] transition-all"
          style={{
            height: 4,
            top: "50%",
            transform: "translateY(-50%)",
            width: progressWidthCalc,
            ...(isRTL ? { right: radius } : { left: radius }),
          }}
        />

        {/* الدوائر (الخطوات) في المنتصف عموديًا */}
        <div
          className={`absolute inset-0 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {steps.map((step) => {
            const stateClass = step.completed
              ? "bg-blueSite border-blueSite text-white"
              : step.active
                ? "bg-blueSite border-blueSite text-white"
                : "bg-white border-[rgba(11,124,92,0.85)] text-[rgba(11,124,92,0.85)]";

            return (
              <div key={step.key} className="flex-1 flex justify-center">
                <div
                  className={`rounded-full border-[3px] flex items-center justify-center shadow-sm ${stateClass}`}
                  style={{ width: circleSize, height: circleSize }}
                >
                  {step.completed ? <Check size={16} /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* الأيقونات + النص تحتها */}
      <div
        className="grid gap-2 text-center"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        }}
      >
        {steps.map((step) => {
          const activeColor = step.completed || step.active ? primary : "#9CA3AF";
          const borderColor = step.completed || step.active ? primary : muted;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className="w-12 h-10 sm:w-14 sm:h-12 lg:w-16 lg:h-12 rounded-md flex items-center justify-center border"
                style={{ borderColor, color: activeColor }}
              >
                <div className="scale-75 sm:scale-90 lg:scale-100">
                  {stepIcons[step.key] || <Circle size={12} />}
                </div>
              </div>

              <span
                className="text-xs sm:text-sm font-medium mt-1"
                style={{
                  color: step.completed || step.active ? "#191C1F" : "#30333388",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


