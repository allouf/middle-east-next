import React from "react";


interface PaymentMethodCardProps {
  title: string;
  selected?: boolean;
  onClick?: () => void;

  logos?: {
    type?: "image" | "custom";
    src?: string;
    alt?: string;

    // للحالات الخاصة مثل Mastercard (دوائر)
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
      className={`flex min-h-[30px] w-full items-center gap-4 rounded-xl border-[3px] px-5 py-4 text-left transition  sm:px-6 sm:py-2 lg:px-8 ${
        selected
          ? "border-blueSite bg-[#EEF8F4]"
          : "border-[#ebe5e5] bg-bgWhite hover:border-blueSite/40"
      }`}
    >
      {/* Radio */}
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[3px] ${
          selected ? "border-blueSite" : "border-grayBorder"
        }`}
      >
        {selected && (
          <span className="h-3 w-3 rounded-full bg-blueSite" />
        )}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <div className="text-[14px] font-bold text-textColor lg:text-[16px]">
          {title}
        </div>

        {/* Logos */}
        <div className="flex  flex-wrap items-center gap-4">
          {logos.map((logo, i) => {
            if (logo.type === "custom") {
              return <div key={i}>{logo.render}</div>;
            }

            return (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-6 object-contain "
              />
            );
          })}
        </div>
      </div>
    </button>
  );
}