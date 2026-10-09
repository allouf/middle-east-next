"use client";

import React, { useMemo, useState } from "react";
import { Avatar } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export type TeamMemberCard = {
    id: string | number;
    name: string;
    role?: string | null; // ui/ux Designer
    photo?: string | null;
};

type Props = {
    totalMembers: number; // 32
    members: TeamMemberCard[];

    /** cards per row (like screenshot = 4) */
    perPage?: number;

    onPrev?: () => void; // optional external pagination
    onNext?: () => void;
};

export default function CompanyTeamSlider({
    totalMembers,
    members,
    perPage = 4,
    onPrev,
    onNext,
}: Props) {
    const { t, locale } = useTranslation();
    const isRTL = locale === 'ar';
    const [page, setPage] = useState(0);

    const maxPage = Math.max(0, Math.ceil(members.length / perPage) - 1);
    const canPrev = page > 0;
    const canNext = page < maxPage;

    const current = useMemo(() => {
        const start = page * perPage;
        return members.slice(start, start + perPage);
    }, [members, page, perPage]);

    const prev = () => {
        if (onPrev) return onPrev();
        if (!canPrev) return;
        setPage((p) => Math.max(0, p - 1));
    };

    const next = () => {
        if (onNext) return onNext();
        if (!canNext) return;
        setPage((p) => Math.min(maxPage, p + 1));
    };

    return (
        <section className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base font-semibold text-zinc-800">
                    {t("jobs.team.title")} ({totalMembers} {totalMembers === 1 ? t("jobs.team.member") : t("jobs.team.members")}) :
                </div>
                {members.length > perPage && (
                    <div className="flex items-center gap-2 text-blueSite">
                        <NavButton
                            icon={<ArrowLeft />}
                            disabled={!canPrev}
                            onClick={onPrev}
                            isRTL={isRTL}
                        />
                        <NavButton
                            icon={<ArrowRight />}
                            disabled={!canNext}
                            onClick={onNext}
                            isRTL={isRTL}
                        />
                    </div>
                )}
            </div>
            {/* Cards */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {current.map((m) => (
                    <div
                        key={m.id}
                        className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4"
                    >
                        {/* top-right watermark */}
                        {/* watermark image */}
                        <div className="pointer-events-none absolute right-0 top-0 opacity-10">
                            <Image
                                src="/BagMemeber.png"
                                alt="watermark"
                                width={50}
                                height={50}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Avatar
                                size={48}
                                src={m.photo || undefined}
                                className="shrink-0 ring-2 ring-zinc-100"
                            >
                                {!m.photo ? (m.name?.[0] || "?").toUpperCase() : null}
                            </Avatar>

                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-zinc-900 truncate">
                                    {m.name}
                                </div>
                                <div className="mt-0.5 text-xs text-zinc-500 truncate">
                                    {m.role || ""}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}


function NavButton({
    icon,
    disabled,
    onClick,
    isRTL = false,
}: {
    icon: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    isRTL?: boolean;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="h-8 w-8 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
        >
            {icon}
        </button>
    );
}