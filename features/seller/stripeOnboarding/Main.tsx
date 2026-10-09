"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  sellerStripeOnboardingService,
  type OnboardingStatus,
} from "./service";

type View =
  | { phase: "loading" }
  | { phase: "ready"; status: OnboardingStatus }
  | { phase: "error"; message: string }
  | { phase: "starting" };

export default function StripeOnboardingMain() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>({ phase: "loading" });

  const loadStatus = async (refresh = false) => {
    setView({ phase: "loading" });
    try {
      const status = await sellerStripeOnboardingService.getStatus(refresh);
      setView({ phase: "ready", status });
    } catch (error: any) {
      setView({
        phase: "error",
        message:
          error?.response?.data?.message ||
          t("common.errorOccurred", { defaultValue: "Failed to load onboarding status." }),
      });
    }
  };

  useEffect(() => {
    loadStatus(false);
  }, []);

  const handleStart = async () => {
    setView({ phase: "starting" });
    try {
      const { onboarding_url } = await sellerStripeOnboardingService.start();
      // Hosted Stripe page lives on a different origin — full navigation.
      window.location.href = onboarding_url;
    } catch (error: any) {
      setView({
        phase: "error",
        message:
          error?.response?.data?.message ||
          t("seller.stripeOnboarding.startFailed", {
            defaultValue: "Couldn't start onboarding. Please try again.",
          }),
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-subTitleColor">
            {t("seller.stripeOnboarding.title", { defaultValue: "Payment onboarding" })}
          </h1>
          <p className="text-sm text-gray-600">
            {t("seller.stripeOnboarding.subtitle", {
              defaultValue:
                "Connect your Stripe account to receive payments from your customers. Stripe handles the verification and payouts — we never see your banking details.",
            })}
          </p>
        </header>

        {renderBody(view, t, handleStart, () => loadStatus(true))}
      </div>
    </div>
  );
}

function renderBody(
  view: View,
  t: ReturnType<typeof useTranslation>["t"],
  onStart: () => void,
  onRefresh: () => void,
) {
  if (view.phase === "loading") {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#00664F]" />
      </div>
    );
  }

  if (view.phase === "starting") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00664F]" />
        <p className="text-sm text-gray-600">
          {t("seller.stripeOnboarding.redirecting", { defaultValue: "Redirecting to Stripe..." })}
        </p>
      </div>
    );
  }

  if (view.phase === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-sm text-gray-700 text-center">{view.message}</p>
        <button
          type="button"
          onClick={onStart}
          className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90"
        >
          {t("common.tryAgain", { defaultValue: "Try again" })}
        </button>
      </div>
    );
  }

  const status = view.status;

  if (status.kind === "not_started") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          {t("seller.stripeOnboarding.notStarted", {
            defaultValue:
              "You haven't set up payments yet. You'll be redirected to Stripe to enter your business and bank details.",
          })}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90"
        >
          {t("seller.stripeOnboarding.start", { defaultValue: "Set up payments" })}
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (status.kind === "incomplete") {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-amber-800">
              {t("seller.stripeOnboarding.incompleteTitle", {
                defaultValue: "Onboarding not finished",
              })}
            </p>
            <p className="text-sm text-amber-700">
              {t("seller.stripeOnboarding.incompleteDesc", {
                defaultValue:
                  "Stripe still needs more information before you can accept payments. Continue where you left off.",
              })}
            </p>
          </div>
        </div>

        <StatusGrid account={status.account} t={t} />

        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90"
          >
            {t("seller.stripeOnboarding.continue", { defaultValue: "Continue onboarding" })}
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
          >
            {t("seller.stripeOnboarding.refresh", { defaultValue: "Refresh status" })}
          </button>
        </div>
      </div>
    );
  }

  // ready
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium text-emerald-800">
            {t("seller.stripeOnboarding.readyTitle", { defaultValue: "Ready to receive payments" })}
          </p>
          <p className="text-sm text-emerald-700">
            {t("seller.stripeOnboarding.readyDesc", {
              defaultValue: "Your Stripe account is verified and ready. Customers can now place orders.",
            })}
          </p>
        </div>
      </div>

      <StatusGrid account={status.account} t={t} />

      <button
        type="button"
        onClick={onRefresh}
        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
      >
        {t("seller.stripeOnboarding.refresh", { defaultValue: "Refresh status" })}
      </button>
    </div>
  );
}

function StatusGrid({
  account,
  t,
}: {
  account: import("./service").SellerStripeAccountSummary;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const rows: Array<[string, boolean]> = [
    [t("seller.stripeOnboarding.detailsSubmitted", { defaultValue: "Details submitted" }), account.details_submitted],
    [t("seller.stripeOnboarding.chargesEnabled", { defaultValue: "Charges enabled" }), account.charges_enabled],
    [t("seller.stripeOnboarding.payoutsEnabled", { defaultValue: "Payouts enabled" }), account.payouts_enabled],
  ];

  return (
    <dl className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-gray-50">
      {rows.map(([label, ok]) => (
        <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
          <dt className="text-gray-700">{label}</dt>
          <dd
            className={
              ok
                ? "inline-flex items-center gap-1 text-emerald-700 font-medium"
                : "inline-flex items-center gap-1 text-amber-700 font-medium"
            }
          >
            {ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {ok
              ? t("common.yes", { defaultValue: "Yes" })
              : t("common.no", { defaultValue: "Not yet" })}
          </dd>
        </div>
      ))}
    </dl>
  );
}
