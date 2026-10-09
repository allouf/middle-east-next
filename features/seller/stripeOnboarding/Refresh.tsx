"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { sellerStripeOnboardingService } from "./service";

/**
 * Stripe redirects here when the seller's onboarding Account Link
 * has expired (~7 days) before they completed it. We immediately
 * re-mint a fresh link and bounce the seller back to Stripe.
 */
export default function StripeOnboardingRefresh() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { onboarding_url } = await sellerStripeOnboardingService.start();
        if (!cancelled) {
          window.location.href = onboarding_url;
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              t("seller.stripeOnboarding.refreshFailed", {
                defaultValue: "Couldn't generate a fresh onboarding link.",
              }),
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
        {error ? (
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
        ) : (
          <>
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-[#00664F]" />
            <h2 className="text-lg font-bold text-subTitleColor">
              {t("seller.stripeOnboarding.refreshing", {
                defaultValue: "Generating a fresh onboarding link...",
              })}
            </h2>
          </>
        )}
      </div>
    </div>
  );
}
