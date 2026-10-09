'use client';

import React from 'react';
import type { ComponentType, SVGProps } from 'react';

type StatIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; color?: string }>;

export type TicketStat = {
  label: string;
  value: React.ReactNode; // number | string | JSX
  color: string; // e.g. "#3B82F6"
  icon: StatIcon; // e.g. lucide-react icon component
  trend?: string; // e.g. "28.4%"
};

type HeaderTicketsProps = {
  stats: TicketStat[];
};

const HeaderTickets: React.FC<HeaderTicketsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const trendText = stat.trend ?? '28.4%';

        return (
          <div
            key={`${stat.label}-${i}`}
            className="p-4 rounded-[7px] border bg-[#F5FAFF] shadow-sm flex items-center gap-3"
            style={{ backgroundColor: `${stat.color}10` }}
          >
            {/* Icon circle */}
            <div
              className="p-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <Icon size={22} color={stat.color} />
            </div>

            {/* Text and value */}
            <div className="flex flex-col">
              <p className="font-medium text-subTitleColor">{stat.label}</p>

              <div className="flex flex-row items-center gap-2 mt-1">
                <span className="text-lg font-semibold" style={{ color: stat.color }}>
                  {stat.value}
                </span>

                {/* Trend indicator */}
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  {trendText}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 4a.75.75 0 0 1 .75.75v8.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06L9.25 12.94V4.75A.75.75 0 0 1 10 4Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTickets;
