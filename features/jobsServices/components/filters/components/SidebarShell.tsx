"use client";

import React from "react";

export default function SidebarShell({
    isMobile,
    show,
    isRtl,
    children,
}: {
    isMobile: boolean;
    show: boolean;
    isRtl: boolean;
    children: React.ReactNode;
}) {
    return (
        <aside
            className={[
                isMobile ? "fixed top-36 pt-0" : "relative",
                "z-30 w-full md:w-[320px] bg-[#FAFAFA] pb-6 overflow-hidden flex flex-col ",
                "transition-all duration-300 ease-in-out",
                isMobile ? (show ? "opacity-100" : "opacity-0 pointer-events-none") : "opacity-100",
            ].join(" ")}
            style={{
                height: isMobile ? "100vh" : "auto",
                ...(isRtl ? { right: 0, left: "auto" } : { left: 0, right: "auto" }),
                transform: isMobile ? (show ? "translateX(0)" : isRtl ? "translateX(100%)" : "translateX(-100%)") : "translateX(0)",
            }}
        >
            {children}
        </aside>
    );
}
