"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Wallet,
  CalendarDays,
  RefreshCwIcon,
  Play,
  Send,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Popconfirm } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import {
  providerMilestoneOrderService,
  type ProviderMilestoneOrder,
} from "./service";
import DeliverPhaseModal from "./DeliverPhaseModal";
import NegotiationDefineForm from "./NegotiationDefineForm";

const ORDER_STATUS_LABEL: Record<string, { text: string; classes: string }> = {
  NEGOTIATION:     { text: "Negotiation",      classes: "bg-[#00664F0A] text-[#00664F] border border-[#00664F33]" },
  PENDING_PAYMENT: { text: "Pending payment", classes: "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]" },
  IN_PROGRESS:     { text: "In Progress",     classes: "bg-orange-50 text-orange-500 border border-orange-100" },
  DELIVERED:       { text: "Delivered",        classes: "bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]" },
  COMPLETED:       { text: "Completed",        classes: "bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]" },
  CANCELLED:       { text: "Cancelled",        classes: "bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]" },
};

const PHASE_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  IN_REVISION: "In Revision",
};

const PAYMENT_LABEL: Record<string, { text: string; classes: string }> = {
  paid:      { text: "Paid",      classes: "bg-blue-50 text-blue-600" },
  in_escrow: { text: "In Escrow", classes: "bg-purple-50 text-purple-600" },
  pending:   { text: "Pending",   classes: "bg-amber-50 text-amber-700" },
  unpaid:    { text: "Unpaid",    classes: "bg-gray-100 text-gray-600" },
  failed:    { text: "Failed",    classes: "bg-red-50 text-red-600" },
};

export default function ProviderMilestoneOrderPage() {
  const { t } = useTranslation();
  const { message } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const orderIdParam = searchParams.get("orderId");
  const orderId = orderIdParam ? parseInt(orderIdParam, 10) : NaN;

  const [order, setOrder] = useState<ProviderMilestoneOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyPhaseId, setBusyPhaseId] = useState<number | null>(null);
  const [deliverModalPhaseId, setDeliverModalPhaseId] = useState<number | null>(null);

  const handleBack = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", "service_market");
    nextParams.set("subTab", "my_order_provider");
    nextParams.delete("orderId");
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const loadOrder = useCallback(async () => {
    if (Number.isNaN(orderId)) {
      setError(t("providerMilestoneOrder.missingId", { defaultValue: "No order selected." }));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await providerMilestoneOrderService.getOrder(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t("providerMilestoneOrder.loadFailed", { defaultValue: "Couldn't load this order." }),
      );
    } finally {
      setLoading(false);
    }
  }, [orderId, t]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleStartPhase = async (phaseId: number) => {
    setBusyPhaseId(phaseId);
    try {
      const updated = await providerMilestoneOrderService.startPhase(orderId, phaseId);
      setOrder(updated);
      message.success(
        t("providerMilestoneOrder.startSuccess", { defaultValue: "Phase started." }),
      );
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          t("providerMilestoneOrder.startFailed", { defaultValue: "Couldn't start the phase." }),
      );
    } finally {
      setBusyPhaseId(null);
    }
  };

  const handleDeliverPhase = async (
    phaseId: number,
    deliveryMessage: string,
    attachments: File[],
  ) => {
    setBusyPhaseId(phaseId);
    try {
      const updated = await providerMilestoneOrderService.deliverPhase(
        orderId,
        phaseId,
        deliveryMessage,
        attachments,
      );
      setOrder(updated);
      message.success(
        t("providerMilestoneOrder.deliverSuccess", { defaultValue: "Delivery sent." }),
      );
      setDeliverModalPhaseId(null);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          t("providerMilestoneOrder.deliverFailed", { defaultValue: "Couldn't deliver." }),
      );
    } finally {
      setBusyPhaseId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-12 h-12 animate-spin text-[#00664F]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-700">{error}</p>
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-semibold"
        >
          {t("common.goBack", { defaultValue: "Back to orders" })}
        </button>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS_LABEL[order.status] ?? {
    text: order.status,
    classes: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const deliverModalPhase =
    deliverModalPhaseId !== null
      ? order.phases.find((p) => p.id === deliverModalPhaseId)
      : null;

  return (
    <div className="w-full flex flex-col gap-6 font-sans mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-blueSite font-semibold text-[16px] hover:opacity-80 transition-opacity w-fit uppercase tracking-wide"
      >
        <ArrowLeft size={18} className="rtl:-scale-x-100" />
        {t("common.goBack", { defaultValue: "GO BACK" })}
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-[#00664F33] overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-6 border-b border-transparent">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] 2xl:text-[28px] font-bold text-subTitleColor">
              {order.milestone_package?.title ?? "Milestone Order"} <span className="text-gray-400">#{order.order_number}</span>
            </h1>
            <div className={`flex items-center gap-1 w-fit px-3 py-1 rounded-full text-sm font-medium ${statusInfo.classes}`}>
              <RefreshCwIcon className="w-4 h-4" />
              {statusInfo.text}
            </div>
            {order.customer && (
              <p className="text-sm text-gray-500 mt-1">
                {t("providerMilestoneOrder.buyer", { defaultValue: "Buyer" })}:{" "}
                <span className="font-semibold text-gray-700">{order.customer.name}</span>
                {order.customer.region && <span className="text-gray-400"> · {order.customer.region}</span>}
              </p>
            )}
          </div>

          <div className="flex items-center bg-[#F3F4F4] rounded-xl p-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-blueSite flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-textGrayColor font-bold tracking-wider">
                  {t("providerMilestoneOrder.totalBudget", { defaultValue: "Total" })}
                </span>
                <span className="text-[20px] font-bold text-gray-900">
                  ${order.summary.total.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-blueSite flex items-center justify-center">
                <CalendarDays size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-textGrayColor font-bold tracking-wider">
                  {t("providerMilestoneOrder.purchasedOn", { defaultValue: "Purchased" })}
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(order.purchased_on))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Negotiation path: order has no phases yet — provider defines
            the milestone inline. The form atomically creates a Milestone
            template + phases on submit, then the regular phase-cards view
            takes over (status flips to PendingPayment). */}
        {order.status === "NEGOTIATION" ? (
          <NegotiationDefineForm order={order} onSuccess={setOrder} />
        ) : (
        <div className="p-6 space-y-4 bg-[#FCFCFC]">
          <h2 className="text-base font-bold text-subTitleColor">
            {t("providerMilestoneOrder.phases", { defaultValue: "Phases" })}
          </h2>
          {order.phases.length === 0 ? (
            <p className="text-sm text-gray-500">
              {t("providerMilestoneOrder.noPhases", { defaultValue: "No phases on this order." })}
            </p>
          ) : (
            <ol className="space-y-3">
              {order.phases.map((phase, idx) => {
                const isCursor = phase.id === order.cursor?.phase_id;
                const action = isCursor ? order.cursor?.action : "none";
                const paymentMeta = PAYMENT_LABEL[phase.payment_status] ?? PAYMENT_LABEL.unpaid;
                return (
                  <li
                    key={phase.id}
                    className={`rounded-2xl border p-5 transition ${
                      isCursor
                        ? "border-[#00664F] bg-white shadow-sm"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-[#00664F] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{phase.service_name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {phase.category && (
                              <span className="text-xs text-gray-500">{phase.category.name}</span>
                            )}
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{phase.duration_days} days</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs font-bold text-[#00664F]">${phase.budget.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${paymentMeta.classes}`}>
                          <Lock className="w-3 h-3" />
                          {paymentMeta.text}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {PHASE_STATUS_LABEL[phase.status] ?? phase.status}
                        </span>
                      </div>
                    </div>

                    {isCursor && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 flex-wrap">
                        {action === "start" ? (
                          <Popconfirm
                            title={t("providerMilestoneOrder.startConfirm", {
                              defaultValue: "Start this phase?",
                            })}
                            description={t("providerMilestoneOrder.startConfirmDesc", {
                              defaultValue: "The delivery deadline begins now.",
                            })}
                            okText={t("providerMilestoneOrder.startNow", { defaultValue: "Start" })}
                            cancelText={t("common.cancel", { defaultValue: "Cancel" })}
                            okButtonProps={{ loading: busyPhaseId === phase.id }}
                            onConfirm={() => handleStartPhase(phase.id)}
                          >
                            <button
                              type="button"
                              disabled={busyPhaseId === phase.id}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00664F] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-60"
                            >
                              {busyPhaseId === phase.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                              {t("providerMilestoneOrder.start", { defaultValue: "Start phase" })}
                            </button>
                          </Popconfirm>
                        ) : action === "deliver" ? (
                          <button
                            type="button"
                            onClick={() => setDeliverModalPhaseId(phase.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00664F] text-white text-sm font-semibold rounded-lg hover:opacity-90"
                          >
                            <Send className="w-4 h-4" />
                            {t("providerMilestoneOrder.deliver", { defaultValue: "Deliver phase" })}
                          </button>
                        ) : action === "deliver_revision" ? (
                          <button
                            type="button"
                            onClick={() => setDeliverModalPhaseId(phase.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:opacity-90"
                          >
                            <Send className="w-4 h-4" />
                            {t("providerMilestoneOrder.deliverRevision", { defaultValue: "Deliver revision" })}
                          </button>
                        ) : action === "pay" ? (
                          <p className="text-xs text-gray-500 italic">
                            {t("providerMilestoneOrder.waitingForPayment", {
                              defaultValue: "Waiting for the buyer to pay this phase.",
                            })}
                          </p>
                        ) : action === "review" ? (
                          <p className="text-xs text-gray-500 italic flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            {t("providerMilestoneOrder.awaitingReview", {
                              defaultValue: "Delivered. Waiting for buyer review.",
                            })}
                          </p>
                        ) : null}
                      </div>
                    )}

                    {phase.deliveries && phase.deliveries.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                          {t("providerMilestoneOrder.deliveries", { defaultValue: "Deliveries" })}
                        </p>
                        <ul className="space-y-1.5">
                          {phase.deliveries.map((d) => (
                            <li key={d.id} className="text-xs text-gray-600">
                              v{d.version} · {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(d.submitted_at))}
                              {d.attachments.length > 0 && (
                                <span className="text-gray-400"> · {d.attachments.length} file{d.attachments.length === 1 ? "" : "s"}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        )}
      </div>

      {deliverModalPhase && (
        <DeliverPhaseModal
          isOpen={deliverModalPhaseId !== null}
          onClose={() => setDeliverModalPhaseId(null)}
          phaseName={deliverModalPhase.service_name}
          submitting={busyPhaseId === deliverModalPhase.id}
          onSubmit={(msg, atts) => handleDeliverPhase(deliverModalPhase.id, msg, atts)}
        />
      )}
    </div>
  );
}
