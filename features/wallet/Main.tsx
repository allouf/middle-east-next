"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, Plus, Wallet as WalletIcon, Clock, Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import { walletService, type Wallet } from "./service";
import TopupModal from "./TopupModal";
import TransactionList from "./TransactionList";

export default function WalletMain() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = useAlert();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTopupOpen, setTopupOpen] = useState(false);

  // /checkout/return routes wallet_topup invoices here with ?topup=success
  // (or ?topup=cancel). Show a toast once, then strip the query so refreshing
  // doesn't re-fire it.
  useEffect(() => {
    const topupStatus = searchParams.get("topup");
    if (topupStatus === "success") {
      message.success(
        t("wallet.topup.successToast", {
          defaultValue: "Top-up successful! Your wallet has been credited.",
        }),
      );
    } else if (topupStatus === "cancel") {
      message.info(
        t("wallet.topup.cancelledToast", {
          defaultValue: "Top-up cancelled. No charge was made.",
        }),
      );
    }
    if (topupStatus) {
      // Clean the URL — keep us on /wallet without the query.
      router.replace("/wallet");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("topup")]);

  const loadWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const w = await walletService.getWallet();
      setWallet(w);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t("common.errorOccurred", { defaultValue: "Failed to load your wallet." }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-[#00664F] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">
          {t("wallet.loading", { defaultValue: "Loading your wallet..." })}
        </p>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-700 font-medium">{error}</p>
        <button
          onClick={loadWallet}
          className="px-6 py-2 bg-[#00664F] text-white rounded-xl font-semibold hover:opacity-90"
        >
          {t("common.retry", { defaultValue: "Retry" })}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-subTitleColor">
          {t("wallet.title", { defaultValue: "My Wallet" })}
        </h1>
        <button
          type="button"
          onClick={() => setTopupOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00664F] text-white font-semibold rounded-xl hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          {t("wallet.addMoney", { defaultValue: "Add money" })}
        </button>
      </header>

      {/* Balance cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BalanceCard
          icon={<WalletIcon className="w-5 h-5" />}
          label={t("wallet.available", { defaultValue: "Available" })}
          amount={wallet.available_balance}
          currency={wallet.currency}
          tone="primary"
        />
        <BalanceCard
          icon={<Clock className="w-5 h-5" />}
          label={t("wallet.pending", { defaultValue: "Pending" })}
          amount={wallet.pending_balance}
          currency={wallet.currency}
          tone="muted"
        />
        <BalanceCard
          icon={<Lock className="w-5 h-5" />}
          label={t("wallet.locked", { defaultValue: "Locked" })}
          amount={wallet.locked_balance}
          currency={wallet.currency}
          tone="muted"
        />
      </section>

      <TransactionList currency={wallet.currency} />

      <TopupModal
        isOpen={isTopupOpen}
        onClose={() => setTopupOpen(false)}
        currency={wallet.currency}
      />
    </div>
  );
}

function BalanceCard({
  icon,
  label,
  amount,
  currency,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  amount: string;
  currency: string;
  tone: "primary" | "muted";
}) {
  const isPrimary = tone === "primary";
  return (
    <div
      className={
        "rounded-2xl p-5 shadow-sm border " +
        (isPrimary
          ? "bg-[#00664F] text-white border-[#00664F]"
          : "bg-white text-gray-900 border-gray-200")
      }
    >
      <div className="flex items-center gap-2 mb-2 opacity-90">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold">
        {Number(amount).toFixed(2)}{" "}
        <span className={"text-sm font-medium " + (isPrimary ? "opacity-80" : "text-gray-500")}>
          {currency}
        </span>
      </p>
    </div>
  );
}
