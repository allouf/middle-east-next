"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import api from "@/lib/api";
import { INVOICE_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function CheckoutCancel() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Best-effort lookup so we can offer a "back to your order" link instead
  // of dumping the user on /. Failure is silent — cancel page still works
  // without it.
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await api.get(INVOICE_ENDPOINTS.bySession(sessionId));
        if (cancelled) return;
        const data = response.data?.data;
        if (data?.order_id) setOrderId(data.order_id);
      } catch {
        // ignore — we just won't deep-link
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const goToOrder = () => {
    router.replace(
      orderId
        ? `/profile?tab=service_market&subTab=my_order_customer&order=${orderId}`
        : "/profile?tab=service_market&subTab=my_order_customer",
    );
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
        <XCircle className="w-12 h-12 mx-auto text-gray-400" />
        <h2 className="text-lg font-bold text-subTitleColor">
          {t("checkout.cancel.title", { defaultValue: "Payment cancelled" })}
        </h2>
        <p className="text-sm text-gray-600">
          {t("checkout.cancel.description", {
            defaultValue: "You closed the checkout before completing payment. Your order is still pending — you can try paying again.",
          })}
        </p>
        <button
          type="button"
          onClick={goToOrder}
          className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90 transition"
        >
          {t("checkout.cancel.goToOrder", { defaultValue: "Back to my order" })}
        </button>
      </div>
    </div>
  );
}
