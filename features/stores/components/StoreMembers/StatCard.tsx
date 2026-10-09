'use client';

import React from 'react';
import { FaArrowDown, FaArrowUp, FaUserPlus } from "react-icons/fa";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string | number;
  trend: 'up' | 'down';
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, iconColor }) => (
  <div
    className="p-4 rounded-[7px] border bg-[#F5FAFF] shadow-sm flex items-center gap-3"
    style={{ backgroundColor: `${iconColor}10` }}
  >
    {/* Icon circle */}
    <div
      className="p-3 rounded-full flex items-center justify-center"
      style={{ backgroundColor: `${iconColor}20` }}
    >
      <FaUserPlus size={22} color={iconColor} />
    </div>

    {/* Text and value */}
    <div className="flex flex-col flex-shrink-0">
      <p className="font-medium text-subTitleColor">{title}</p>
      <div className="flex flex-row items-center gap-2 mt-1">
        <span
          className="text-lg font-semibold"
          style={{ color: `${iconColor}` }}
        >
          {value}
        </span>

        {/* Trend indicator */}
        <span
          className="text-xs font-semibold text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{
            backgroundColor: `${iconColor}20`,
            color: `${iconColor}`,
          }}
        >
          {change}{" "}
          {trend === 'up' ? (
            <FaArrowUp className="w-3 h-3" />
          ) : (
            <FaArrowDown className="w-3 h-3" />
          )}
        </span>
      </div>
    </div>
  </div>
);

export default StatCard;
