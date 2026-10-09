"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export interface ServiceStatsData {
    active: number;
    paused: number;
    pending: number;
    rejected: number;
    draft: number;
    total: number;
}

interface StatsCardProps {
    title: string;
    count: number;
    trend: number;
    theme: "green" | "yellow" | "blue" | "red";
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    count,
    trend,
    theme,
}) => {
    const themeStyles = {
        green: {
            bg: "bg-[#56E8A71A]",
            iconBg: "bg-[#56E8A7]",
            text: "text-[#353635]",
            count: "text-[#56E8A7]",
        },
        yellow: {
            bg: "bg-[#FAF0AD1A]",
            iconBg: "bg-[#FAF0AD]",
            text: "text-[#353635]",
            count: "text-[#FAF00F]",
        },
        blue: {
            bg: "bg-[#1E87F01A]",
            iconBg: "bg-[#1E87F0]",
            text: "text-[#353635]",
            count: "text-[#32A5EF]",
        },
        red: {
            bg: "bg-[#E298A11A]",
            iconBg: "bg-[#EBBAC0]",
            text: "text-[#353635]",
            count: "text-[#CA1417]",
        },
    };

    const styles = themeStyles[theme];

    const formatCount = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + "k";
        }
        return num.toLocaleString();
    };

    return (
        <div
            className={`${styles.bg} rounded-lg px-4 py-2 flex items-center gap-5 min-h-[80px]`}
        >
            {/* Icon Circle */}
            <div
                className={`${styles.iconBg} w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0`}
            >
                <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                    {/* using the same box icon from UsedMarketStats */}
                    <svg
                        width="29"
                        height="29"
                        viewBox="0 0 29 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.181 1.90479L24.819 8.04664V20.3303L14.181 26.4722L3.54297 20.3303V8.04664L14.181 1.90479ZM10.6349 13.3693L10.635 21.6953L12.999 23.0602V14.7342L10.6349 13.3693ZM5.90697 10.6398V18.9655L8.27095 20.3304V12.0046L5.90697 10.6398ZM18.8346 7.32124L11.8768 11.3568L14.181 12.6871L21.1548 8.66082L18.8346 7.32124ZM14.181 4.6345L7.20717 8.66082L9.51548 9.99349L16.4733 5.95797L14.181 4.6345Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
                <h3 className={`text-[16px] font-medium leading-none ${styles.text}`}>
                    {title}
                </h3>

                <div className="flex items-baseline gap-3">
                    <span
                        className={`text-[24px] font-medium leading-none ${styles.count}`}
                    >
                        {formatCount(count)}
                    </span>

                    {/* <div
                        className={`flex items-center gap-1 text-[14px] ${trend >= 0 ? "text-[#14CA74]" : "text-[#CA1417]"}`}
                    >
                        <span>
                            {trend > 0 ? "+" : ""}
                            {trend}%
                        </span>
                        {trend >= 0 ? (
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                            <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

interface ServiceOffersStatsProps {
    stats?: ServiceStatsData;
}

const ServiceOffersStats: React.FC<ServiceOffersStatsProps> = ({ stats }) => {
    const { t } = useTranslation();

    const safeStats = stats || {
        active: 0,
        paused: 0,
        pending: 0,
        rejected: 0,
        draft: 0,
        total: 0
    };

    const pseudoTrend = 6.08; // Hardcoded positive trend for aesthetics based on design

    const statsData: StatsCardProps[] = [
        {
            title: t("serviceMarket.service.stats.active", { defaultValue: "Active Service" }),
            count: safeStats.active,
            trend: pseudoTrend,
            theme: "green",
        },
        {
            title: t("serviceMarket.service.stats.paused", { defaultValue: "Paused Service" }),
            count: safeStats.paused,
            trend: pseudoTrend,
            theme: "yellow",
        },
        {
            title: t("serviceMarket.service.stats.pending", { defaultValue: "Pending Service" }),
            count: safeStats.pending,
            trend: pseudoTrend,
            theme: "blue",
        },
        {
            title: t("serviceMarket.service.stats.rejected", { defaultValue: "Rejected Service" }),
            count: safeStats.rejected,
            trend: pseudoTrend,
            theme: "red",
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-medium text-[#353635] mb-4">
                {t("serviceMarket.service.stats.title", { defaultValue: "Statistics And Analysis :" })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>
        </div>
    );
};

export default ServiceOffersStats;
