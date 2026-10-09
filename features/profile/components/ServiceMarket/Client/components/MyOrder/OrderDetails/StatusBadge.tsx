import { Clock3, LoaderCircle, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

const statusMap = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "border-slate-200 bg-slate-100 text-slate-500",
  },
  in_progress: {
    label: "In Progress",
    icon: LoaderCircle,
    className: "border-amber-200 bg-amber-50 text-amber-600",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-500",
  },
};

export default function StatusBadge({ status }: Props) {
  const item = statusMap[status];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${item.className}`}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </span>
  );
}