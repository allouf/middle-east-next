"use client";

import { useState } from "react";
import { Loader2, X, CreditCard, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import { walletService } from "./service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
};

// BE defaults from config('services.stripe.topup_min'/'topup_max').
// Mirrored here so the input validates client-side too; mismatches just
// fall through to the BE which returns a 422 with the real message.
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1000;

export default function TopupModal({ isOpen, onClose, currency }: Props) {
  const { t } = useTranslation();
  const { message } = useAlert();
  const [amount, setAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const parsedAmount = Number(amount);
  const validAmount =
    amount.length > 0 &&
    Number.isFinite(parsedAmount) &&
    parsedAmount >= MIN_AMOUNT &&
    parsedAmount <= MAX_AMOUNT &&
    /^\d+(\.\d{1,2})?$/.test(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validAmount) {
      setError(
        t("wallet.topup.invalidAmount", {
          defaultValue: `Enter an amount between ${MIN_AMOUNT} and ${MAX_AMOUNT} (max 2 decimals).`,
        }),
      );
      return;
    }

    setSubmitting(true);
    try {
      const { checkout_url } = await walletService.initiateTopup(amount);
      message.success(
        t("wallet.topup.redirecting", { defaultValue: "Redirecting to checkout..." }),
      );
      window.location.href = checkout_url;
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      setError(apiMsg || t("common.errorOccurred", { defaultValue: "Something went wrong. Try again." }));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close", { defaultValue: "Close" })}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        >
          <X size={16} />
        </button>

        <header className="mb-5">
          <h2 className="text-xl font-bold text-subTitleColor">
            {t("wallet.topup.title", { defaultValue: "Add money to your wallet" })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t("wallet.topup.subtitle", {
              defaultValue: "You'll be redirected to Stripe to complete payment.",
            })}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("wallet.topup.amount", { defaultValue: "Amount" })}
              <span className="text-gray-400 font-normal ml-2">({currency})</span>
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50.00"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#00664F] focus:ring-1 focus:ring-[#00664F] outline-none transition text-lg"
              autoFocus
              disabled={submitting}
            />
            <p className="text-xs text-gray-400 mt-1">
              {t("wallet.topup.range", {
                defaultValue: `Min ${MIN_AMOUNT} ${currency} · Max ${MAX_AMOUNT} ${currency}`,
              })}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!validAmount || submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#00664F] text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              {submitting
                ? t("wallet.topup.processing", { defaultValue: "Opening..." })
                : t("wallet.topup.proceed", { defaultValue: "Continue to payment" })}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
