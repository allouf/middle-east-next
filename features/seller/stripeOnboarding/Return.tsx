"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  sellerStripeOnboardingService,
  type OnboardingStatus,
} from "./service";

/**
 * Landing page after Stripe redirects the seller back from hosted
 * onboarding. We force a fresh sync (?refresh=1) rather than reading
 * the cached snapshot — the account.updated webhook usually fires
 * within seconds, but a fresh GET removes the race.
 */
export default function StripeOnboardingReturn() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await sellerStripeOnboardingService.getStatus(true);
        if (!cancelled) setStatus(result);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              t("common.errorOccurred", { defaultValue: "Couldn't verify your onboarding status." }),
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
        {renderContent(status, error, t, router)}
      </div>
    </div>
  );
}

function renderContent(
  status: OnboardingStatus | null,
  error: string | null,
  t: ReturnType<typeof useTranslation>["t"],
  router: ReturnType<typeof useRouter>,
) {
  if (error) {
    return (
      <>
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-lg font-bold text-subTitleColor">
          {t("common.errorOccurred", { defaultValue: "Something went wrong" })}
        </h2>
        <p className="text-sm text-gray-600">{error}</p>
        <button
          type="button"
          onClick={() => router.replace("/seller/stripe-onboarding")}
          className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90"
        >
          {t("seller.stripeOnboarding.goToOnboarding", { defaultValue: "Back to onboarding" })}
        </button>
      </>
    );
  }

  if (status === null) {
    return (
      <>
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-[#00664F]" />
        <h2 className="text-lg font-bold text-subTitleColor">
          {t("seller.stripeOnboarding.verifying", { defaultValue: "Verifying your account..." })}
        </h2>
      </>
    );
  }

  if (status.kind === "ready") {
    return (
      <>
        <CheckCircle2 className="w-12 h-12 mx-auto text-[#00664F]" />
        <h2 className="text-lg font-bold text-subTitleColor">
          {t("seller.stripeOnboarding.readyTitle", { defaultValue: "You're all set!" })}
        </h2>
        <p className="text-sm text-gray-600">
          {t("seller.stripeOnboarding.readyDescReturn", {
            defaultValue: "Your Stripe account is verified. You can now accept orders.",
          })}
        </p>
        <button
          type="button"
          onClick={() => router.replace("/seller/stripe-onboarding")}
          className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90"
        >
          {t("seller.stripeOnboarding.continue", { defaultValue: "Continue" })}
        </button>
      </>
    );
  }

  if (status.kind === "incomplete") {
    return (
      <>
        <AlertCircle className="w-12 h-12 mx-auto text-amber-500" />
        <h2 className="text-lg font-bold text-subTitleColor">
          {t("seller.stripeOnboarding.incompleteTitle", { defaultValue: "Almost there" })}
        </h2>
        <p className="text-sm text-gray-600">
          {t("seller.stripeOnboarding.incompleteAfterReturn", {
            defaultValue:
              "Stripe still needs a bit more information from you before you can receive payments.",
          })}
        </p>
        <button
          type="button"
          onClick={() => router.replace("/seller/stripe-onboarding")}
          className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90"
        >
          {t("seller.stripeOnboarding.continueOnboarding", { defaultValue: "Continue onboarding" })}
        </button>
      </>
    );
  }

  // not_started — seller hit return URL without an account yet (weird path)
  return (
    <>
      <AlertCircle className="w-12 h-12 mx-auto text-amber-500" />
      <h2 className="text-lg font-bold text-subTitleColor">
        {t("seller.stripeOnboarding.notStartedReturn", {
          defaultValue: "We couldn't find your onboarding session",
        })}
      </h2>
      <button
        type="button"
        onClick={() => router.replace("/seller/stripe-onboarding")}
        className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-medium hover:opacity-90"
      >
        {t("seller.stripeOnboarding.start", { defaultValue: "Set up payments" })}
      </button>
    </>
  );
}
