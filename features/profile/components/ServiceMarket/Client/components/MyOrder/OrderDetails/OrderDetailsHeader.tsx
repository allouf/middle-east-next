"use client";

import { ArrowLeft, MessageCircleMore } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Props {
  orderNumber: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  purchasedAt: string;
  onBack?: () => void;
  onMessageCustomer?: () => void;
}

export default function OrderDetailsHeader({
  orderNumber,
  status,
  purchasedAt,
  onBack,
  onMessageCustomer,
}: Props) {
  return (
    <div className="mb-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-lg font-medium text-blueSite transition hover:opacity-80"
        >
          <ArrowLeft className="h-5 w-5" />
          GO BACK
        </button>

        <button
          type="button"
          onClick={onMessageCustomer}
          className="inline-flex items-center gap-2 rounded-xl bg-[#93C6B7] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <MessageCircleMore className="h-4 w-4" />
          Message Customer
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="h-10 w-1.5 rounded-full bg-blueSite" />
          <h1 className="text-3xl font-bold text-textColor md:text-[40px]">
            Order #{orderNumber}
          </h1>
        </div>

        <StatusBadge status={status} />
      </div>

      <p className="text-lg text-textGrayColor">
        Purchased on <span className="font-semibold text-textColor">{purchasedAt}</span>.
      </p>
    </div>
  );
}