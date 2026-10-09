"use client";


type FilterValue = "all" | "pending" | "in_progress" | "completed" | "cancelled";

interface Props {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrderHistoryFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={[
              "min-w-[102px] rounded-xl border px-5 py-2.5 text-sm font-medium transition",
              active
                ? "border-blueSite bg-blueSite text-white shadow-sm"
                : "border-grayBorder bg-white text-textColor hover:border-blueSite hover:text-blueSite",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}