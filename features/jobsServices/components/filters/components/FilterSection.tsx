"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterSection({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="rounded-xl ">
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3"
            >
                <span className="text-xs sm:text-xs font-extrabold tracking-wide text-gray-700">{title}</span>
                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
            </button>

            {open ? <div className="px-3 sm:px-4 pb-3 sm:pb-4">{children}</div> : null}
        </section>
    );
}
