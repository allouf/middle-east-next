import React from "react";

interface PaymentMethodCardProps {
  title: string;
  selected?: boolean;
  onClick?: () => void;
  logos?: {
    type?: "image" | "custom";
    src?: string;
    alt?: string;
    render?: React.ReactNode;
  }[];
}

export default function PaymentMethodCard({
  title,
  selected = false,
  onClick,
  logos = [],
}: PaymentMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[24px] w-full items-center gap-3 rounded-xl border-[2px] px-3 py-3 text-left transition sm:px-3 sm:py-3 ${
        selected
          ? "border-blueSite bg-[#EEF8F4]"
          : "border-[#ebe5e5] bg-bgWhite hover:border-blueSite/40"
      }`}
    >
      {/* Radio */}
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[2px] ${
          selected ? "border-blueSite" : "border-grayBorder"
        }`}
      >
        {selected && (
          <span className="h-2 w-2 rounded-full bg-blueSite" />
        )}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="text-[12px] font-bold text-textColor sm:text-[13px]">
          {title}
        </div>

        {/* Logos */}
        <div className="flex flex-wrap items-center gap-2">
          {logos.map((logo, i) => {
            if (logo.type === "custom") {
              return <div key={i}>{logo.render}</div>;
            }

            return (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-5 object-contain"
              />
            );
          })}
        </div>
      </div>
    </button>
  );
}
