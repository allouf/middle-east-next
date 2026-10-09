"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Wallet, CalendarDays, Loader2, AlertCircle, RefreshCwIcon, Folder, Package } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useOrderDetails } from "../../hooks/useOrderDetails";
import MilestoneTable, { type MilestoneTablePhase } from "./components/MilestoneTable";
import { clientOrderService } from "../../services/client-order.service";
import { useAlert } from "@/lib/context/AlertProvider";

// Maps backend ServiceOfferOrderStatus values to a short label + colour. Lives
// here rather than in MilestoneTable because the page header uses the same chip.
const STATUS_LABEL: Record<string, { text: string; classes: string }> = {
  NEGOTIATION:     { text: "Negotiation",      classes: "bg-[#00664F0A] text-[#00664F] border border-[#00664F33]" },
  PENDING_PAYMENT: { text: "Pending payment", classes: "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]" },
  IN_PROGRESS:     { text: "In Progress",     classes: "bg-orange-50 text-orange-500 border border-orange-100" },
  DELIVERED:       { text: "Delivered",        classes: "bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]" },
  COMPLETED:       { text: "Completed",        classes: "bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]" },
  CANCELLED:       { text: "Cancelled",        classes: "bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]" },
  DISPUTED:        { text: "Disputed",         classes: "bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]" },
};

const MilestonesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = useAlert();

  // Inherited from the order-detail screen via subTab navigation — the
  // orderId stays on the URL so we can keep this page self-contained.
  const orderId = searchParams.get("orderId") ?? undefined;

  const {
    orderDetails: order,
    loading,
    error,
    refetch,
  } = useOrderDetails({ orderId, autoFetch: true });

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subTab", "my_order_customer");
    router.push(`?${params.toString()}`);
  };

  const handlePayPhase = async (phaseId: number) => {
    if (!orderId) return;
    const response = await clientOrderService.payPhase(orderId, phaseId, {
      onError: (err: any) => {
        const apiMsg = err?.response?.data?.message ?? err?.message;
        if (apiMsg && /stripe|onboarding|payment/i.test(apiMsg) && err?.response?.status === 422) {
          message.error(
            t("milestones.sellerOnboardingPending", {
              defaultValue: "This seller hasn't finished payment onboarding yet, so they can't accept orders.",
            }),
          );
        } else {
          message.error(apiMsg || t("common.errorOccurred", { defaultValue: "An error occurred." }));
        }
      },
    });

    if (!response?.status) return;

    const checkoutUrl: string | null | undefined = response.data?.checkout_url;
    if (checkoutUrl) {
      message.success(t("milestones.redirectingToCheckout", { defaultValue: "Redirecting to checkout..." }));
      window.location.href = checkoutUrl;
    } else {
      message.error(t("milestones.noCheckoutUrl", { defaultValue: "Couldn't start checkout. Please try again." }));
    }
  };

  // Coerce the API's phase shape into the table-friendly shape. Done here
  // rather than in the table so the table stays presentation-only.
  const phases: MilestoneTablePhase[] = useMemo(() => {
    const raw = (order as any)?.phases;
    if (!Array.isArray(raw)) return [];
    return raw.map((p: any) => ({
      id: p.id,
      service_name: p.service_name,
      category_name: p.category?.name ?? "—",
      deadline: p.deadline,
      budget: p.budget,
      payment_status: p.payment_status,
      status: p.status,
      is_cursor: !!p.is_cursor,
    }));
  }, [order]);

  const cursor = (order as any)?.cursor as
    | { phase_id: number; action: string; phase_name: string; status: string; payment_status: string }
    | null
    | undefined;

  const orderStatus = (order as any)?.status as string | undefined;
  const milestonePackage = (order as any)?.milestone_package;
  const summary = (order as any)?.summary;

  // ── Loading / error / empty states ─────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-blueSite animate-spin mb-4" />
        <p className="text-[#64748B] font-medium">
          {t("milestones.loading", { defaultValue: "Loading milestones..." })}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-[#DC2626] font-semibold text-lg">{error}</p>
        <button
          onClick={refetch}
          className="px-8 py-3 bg-blueSite text-white rounded-xl font-bold hover:bg-blueSiteHover transition-colors"
        >
          {t("common.retry", { defaultValue: "Retry" })}
        </button>
      </div>
    );
  }

  // Negotiation state: order exists but no phases yet — the provider hasn't
  // defined the milestones. Show a clear "waiting" UI so the buyer knows the
  // next action belongs to the provider, not them.
  if (order && orderStatus === "NEGOTIATION") {
    const referencedOffer = (order as any).reference_service_offer;
    const buyerNotes: string | null = (order as any).requirements?.notes ?? null;
    const purchasedOn: string | null = (order as any).purchased_on ?? null;

    return (
      <div className="w-full flex flex-col gap-6 font-sans mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8 max-w-3xl">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blueSite font-semibold text-[20px] hover:opacity-80 transition-opacity w-fit uppercase tracking-wide"
        >
          <ArrowLeft size={18} className="rtl:-scale-x-100" />
          {t("common.goBack", { defaultValue: "GO BACK" })}
        </button>

        <div className="bg-white border border-[#00664F33] rounded-2xl p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#00664F0A] flex items-center justify-center">
              <RefreshCwIcon className="w-6 h-6 text-[#00664F] animate-spin-slow" />
            </div>
            <div>
              <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-[#00664F] bg-[#00664F1A] px-2 py-0.5 rounded-full">
                {t("milestones.negotiation.badge", { defaultValue: "Negotiation" })}
              </span>
              <h1 className="text-xl font-bold text-subTitleColor mt-1">
                {t("milestones.negotiation.title", {
                  defaultValue: "Waiting for the provider to define your phases",
                })}
              </h1>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {t("milestones.negotiation.description", {
              defaultValue:
                "Your milestone-pay request was sent. The provider will define the phases (each with a budget and delivery time) — once they're ready, you'll see them here and can pay phase 1 to start the work.",
            })}
          </p>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
            {referencedOffer && (
              <div className="flex items-start gap-2">
                <Folder className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-gray-700">
                  {t("milestones.negotiation.referencedOffer", { defaultValue: "Referenced offer" })}:{" "}
                  <span className="font-semibold">
                    {referencedOffer.title ?? `#${referencedOffer.id}`}
                  </span>
                </p>
              </div>
            )}
            {purchasedOn && (
              <div className="flex items-start gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-gray-700">
                  {t("milestones.negotiation.requestedOn", { defaultValue: "Requested on" })}:{" "}
                  <span className="font-semibold">
                    {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(purchasedOn))}
                  </span>
                </p>
              </div>
            )}
            {buyerNotes && (
              <div className="flex items-start gap-2 pt-3 border-t border-gray-200">
                <Package className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div className="text-gray-700">
                  <p className="font-semibold mb-0.5">
                    {t("milestones.negotiation.yourNotes", { defaultValue: "Your notes to the provider" })}
                  </p>
                  <p className="text-gray-600 whitespace-pre-line">{buyerNotes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-gray-500">
              {t("milestones.negotiation.refreshHint", {
                defaultValue: "Refresh this page in a moment to check for updates.",
              })}
            </p>
            <button
              type="button"
              onClick={refetch}
              className="px-4 py-1.5 bg-[#00664F] text-white text-sm font-semibold rounded-lg hover:opacity-90"
            >
              {t("milestones.negotiation.refresh", { defaultValue: "Check now" })}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order || phases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <p className="text-[#64748B] font-medium">
          {t("milestones.notFound", { defaultValue: "No milestone order found." })}
        </p>
        <button
          onClick={handleBack}
          className="px-8 py-3 bg-blueSite text-white rounded-xl font-bold hover:bg-blueSiteHover transition-colors"
        >
          {t("common.goBack", { defaultValue: "Go Back" })}
        </button>
      </div>
    );
  }

  const finalDeadline = phases.reduce<string | null>((acc, p) => {
    if (!p.deadline) return acc;
    if (!acc) return p.deadline;
    return new Date(p.deadline) > new Date(acc) ? p.deadline : acc;
  }, null);

  const statusInfo = STATUS_LABEL[orderStatus ?? ""] ?? {
    text: orderStatus ?? "—",
    classes: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-blueSite font-semibold text-[20px] hover:opacity-80 transition-opacity w-fit uppercase tracking-wide"
      >
        <ArrowLeft size={18} className="rtl:-scale-x-100" />
        {t("common.goBack", { defaultValue: "GO BACK" })}
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-[#00664F33] overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-6 border-b border-transparent">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] 2xl:text-[32px] font-bold text-subTitleColor">
              {milestonePackage?.title ??
                (order as any)?.service?.title ??
                t("milestones.untitledOrder", { defaultValue: "Milestone Order" })}
            </h1>
            <div className={`flex items-center gap-1 w-fit px-3 py-1 rounded-full text-sm font-medium ${statusInfo.classes}`}>
              <RefreshCwIcon className="w-4 h-4" />
              {statusInfo.text}
            </div>
          </div>

          <div className="flex items-center bg-[#F3F4F4] rounded-xl p-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-blueSite flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-textGrayColor font-bold tracking-wider">
                  {t("milestones.totalAllocated", { defaultValue: "Total Allocated" })}
                </span>
                <span className="text-[22px] font-bold text-gray-900">
                  {summary
                    ? `${Number(summary.total).toFixed(2)} ${summary.currency ?? ""}`.trim()
                    : "—"}
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
                  {t("milestones.finalDeadline", { defaultValue: "Final Deadline" })}
                </span>
                <span className="text-[22px] font-bold text-gray-900">
                  {finalDeadline
                    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(finalDeadline))
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <MilestoneTable
            phases={phases}
            cursor={cursor ?? null}
            onPay={handlePayPhase}
          />
        </div>
      </div>
    </div>
  );
};

export default MilestonesPage;
