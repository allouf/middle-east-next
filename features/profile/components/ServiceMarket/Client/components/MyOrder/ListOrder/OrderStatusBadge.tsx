import React from "react";
import { Clock3, Loader2, CheckCircle2, XCircle, ShieldCheck, Wallet } from "lucide-react";
import { OrderStatus, PaymentStatus } from "../../../types/order";

type Props =
  | {
      type: "order";
      value: OrderStatus;
    }
  | {
      type: "payment";
      value: PaymentStatus;
    }
  | {
      type: "custom";
      label: string;
      className?: string;
    };

export default function StatusBadge(props: Props) {
  if (props.type === "order") {
    const map = {
      pending: {
        label: "Pending",
        icon: <Clock3 className="h-3.5 w-3.5" />,
        className: "bg-slate-100 text-slate-500 border-slate-200",
      },
      in_progress: {
        label: "In Progress",
        icon: <Loader2 className="h-3.5 w-3.5" />,
        className: "bg-amber-50 text-amber-600 border-amber-200",
      },
      completed: {
        label: "Completed",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        className: "bg-emerald-50 text-emerald-600 border-emerald-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: <XCircle className="h-3.5 w-3.5" />,
        className: "bg-red-50 text-red-500 border-red-200",
      },
    };

    const item = map[props.value];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${item.className}`}
      >
        {item.icon}
        {item.label}
      </span>
    );
  }

  if (props.type === "payment") {
    const map = {
      escrow: {
        label: "In Escrow",
        icon: <ShieldCheck className="h-3.5 w-3.5" />,
        className: "bg-violet-50 text-violet-600 border-violet-200",
      },
      paid: {
        label: "Paid",
        icon: <Wallet className="h-3.5 w-3.5" />,
        className: "bg-blue-50 text-blue-600 border-blue-200",
      },
    };

    const item = map[props.value];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${item.className}`}
      >
        {item.icon}
        {item.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${props.className ?? ""}`}
    >
      {props.label}
    </span>
  );
}