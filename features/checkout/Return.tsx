"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { INVOICE_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { useTranslation } from "@/lib/i18n/useTranslation";

type InvoiceLookupData = {
  invoice: {
    id: number;
    status: "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED" | "CANCELLED" | "REFUNDED";
    amount: string;
    currency: string;
    failure_reason: string | null;
  };
  kind: "service_order" | "service_order_phase" | "wallet_topup" | string;
  order_id: number | null;
  phase_id: number | null;
};

// Webhook delivery is usually <2s but can be up to a few seconds. We
// poll for 30s before falling back to a "we'll confirm shortly" message
// — at which point the user can just browse to Orders manually.
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30_000;

type ViewState =
  | { phase: "loading" }
  | { phase: "pending"; elapsedMs: number }
  | { phase: "success"; data: InvoiceLookupData }
  | { phase: "failed"; reason: string | null }
  | { phase: "timeout"; data: InvoiceLookupData }
  | { phase: "error"; message: string };

export default function CheckoutReturn() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState<ViewState>({ phase: "loading" });
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!sessionId) {
      setState({
        phase: "error",
        message: t("checkout.return.missingSession", {
          defaultValue: "Missing checkout session. Please open this page from a checkout redirect.",
        }),
      });
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      try {
        const response = await api.get(INVOICE_ENDPOINTS.bySession(sessionId));
        if (cancelled) return;

        const body = response.data;
        const data: InvoiceLookupData | undefined = body?.data;

        if (!data?.invoice) {
          setState({
            phase: "error",
            message: t("checkout.return.notFound", {
              defaultValue: "We couldn't find this checkout session.",
            }),
          });
          return;
        }

        const status = data.invoice.status;

        if (status === "COMPLETED") {
          setState({ phase: "success", data });
          scheduleRedirect(data);
          return;
        }

        if (status === "FAILED" || status === "EXPIRED" || status === "CANCELLED") {
          setState({ phase: "failed", reason: data.invoice.failure_reason });
          return;
        }

        // Still PENDING — keep polling until timeout
        const elapsed = Date.now() - startedAtRef.current;
        if (elapsed >= POLL_TIMEOUT_MS) {
          setState({ phase: "timeout", data });
          return;
        }

        setState({ phase: "pending", elapsedMs: elapsed });
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (error: any) {
        if (cancelled) return;
        const apiMessage = error?.response?.data?.message;
        setState({
          phase: "error",
          message: apiMessage || t("common.errorOccurred", { defaultValue: "An error occurred." }),
        });
      }
    };

    const scheduleRedirect = (data: InvoiceLookupData) => {
      // Slight delay so the success card is visible before navigating.
      setTimeout(() => {
        if (cancelled) return;
        router.replace(buildRedirectPath(data));
      }, 1500);
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
        {renderContent(state, t, router)}
      </div>
    </div>
  );
}

function renderContent(
  state: ViewState,
  t: ReturnType<typeof useTranslation>["t"],
  router: ReturnType<typeof useRouter>,
) {
  switch (state.phase) {
    case "loading":
    case "pending":
      return (
        <>
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-[#00664F]" />
          <h2 className="text-lg font-bold text-subTitleColor">
            {t("checkout.return.confirming", { defaultValue: "Confirming your payment..." })}
          </h2>
          <p className="text-sm text-gray-500">
            {state.phase === "pending" && state.elapsedMs > 8000
              ? t("checkout.return.takingLonger", {
                  defaultValue: "This is taking a little longer than usual. Hang tight — we'll confirm in a moment.",
                })
              : t("checkout.return.dontClose", {
                  defaultValue: "Please don't close this window.",
                })}
          </p>
        </>
      );

    case "success":
      return (
        <>
          <CheckCircle2 className="w-12 h-12 mx-auto text-[#00664F]" />
          <h2 className="text-lg font-bold text-subTitleColor">
            {t("checkout.return.success", { defaultValue: "Payment received!" })}
          </h2>
          <p className="text-sm text-gray-600">
            {t("checkout.return.redirecting", { defaultValue: "Redirecting you to your order..." })}
          </p>
        </>
      );

    case "timeout":
      return (
        <>
          <CheckCircle2 className="w-12 h-12 mx-auto text-[#00664F]" />
          <h2 className="text-lg font-bold text-subTitleColor">
            {t("checkout.return.received", { defaultValue: "Payment received" })}
          </h2>
          <p className="text-sm text-gray-600">
            {t("checkout.return.delayed", {
              defaultValue: "It's taking a bit longer than usual to confirm. Your order will show up shortly — feel free to head to your orders page.",
            })}
          </p>
          <button
            type="button"
            onClick={() => router.replace(buildRedirectPath(state.data))}
            className="mt-2 px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            {t("checkout.return.goToOrder", { defaultValue: "Go to my order" })}
          </button>
        </>
      );

    case "failed":
      return (
        <>
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="text-lg font-bold text-subTitleColor">
            {t("checkout.return.failed", { defaultValue: "Payment didn't go through" })}
          </h2>
          <p className="text-sm text-gray-600">
            {state.reason ||
              t("checkout.return.failedDesc", {
                defaultValue: "The payment was not completed. You can try again from your order.",
              })}
          </p>
          <button
            type="button"
            onClick={() => router.replace("/profile?tab=service_market&subTab=my_order_customer")}
            className="mt-2 px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            {t("checkout.return.goToOrders", { defaultValue: "Go to my orders" })}
          </button>
        </>
      );

    case "error":
      return (
        <>
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="text-lg font-bold text-subTitleColor">
            {t("common.errorOccurred", { defaultValue: "Something went wrong" })}
          </h2>
          <p className="text-sm text-gray-600">{state.message}</p>
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-2 px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            {t("common.goHome", { defaultValue: "Go to homepage" })}
          </button>
        </>
      );
  }
}

function buildRedirectPath(data: InvoiceLookupData): string {
  if (data.kind === "wallet_topup") {
    return "/wallet?topup=success";
  }

  if ((data.kind === "service_order" || data.kind === "service_order_phase") && data.order_id) {
    const base = `/profile?tab=service_market&subTab=my_order_customer&order=${data.order_id}`;
    return data.phase_id ? `${base}&phase=${data.phase_id}` : base;
  }

  return "/profile?tab=service_market&subTab=my_order_customer";
}
