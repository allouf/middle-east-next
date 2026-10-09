"use client";

import React from "react";
import { Avatar } from "antd";
import Image from "next/image";

type Props = {
  coverUrl?: string | null;
  avatarUrl?: string | null;
  companyName?: string;
};

export default function CompanyCoverHeader({
  coverUrl,
  avatarUrl,
  companyName = "Company",
}: Props) {
  return (
    <div className="relative w-full">
      <div className="relative h-[140px] sm:h-[160px] w-full overflow-hidden rounded-2xl bg-blueSiteHover">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${companyName} cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-zinc-800 to-zinc-800" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_90%,rgba(16,185,129,0.25)_0%,rgba(0,0,0,0)_60%)]" />
            <span className="absolute left-[52%] top-[25%] h-5 w-5 rotate-45 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)] animate-pulse [clip-path:polygon(50%_0%,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0%_50%,40%_40%)]" />
            <span className="absolute left-[45%] top-[55%] h-2 w-2 rotate-45 bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse [clip-path:polygon(50%_0%,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0%_50%,40%_40%)]" />
            <span className="absolute right-[75%] bottom-[18%] h-4 w-4 rotate-45 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse [clip-path:polygon(50%_0%,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0%_50%,40%_40%)]" />
            <span className="absolute right-[64%] bottom-[26%] h-2 w-2 rotate-45 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse [clip-path:polygon(50%_0%,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0%_50%,40%_40%)]" />
            <span className="absolute right-[15%] bottom-[49%] h-3 w-3 rotate-45 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse [clip-path:polygon(50%_0%,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0%_50%,40%_40%)]" />
            <span className="absolute right-[12%] bottom-[78%] h-5 w-5 rotate-45 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse [clip-path:polygon(50%_0%,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0%_50%,40%_40%)]" />
          </>
        )}
      </div>

      <div className="absolute -bottom-2 left-6">
        <div className="rounded-full bg-white p-[3px] shadow-md">
          <Avatar
            size={64}
            src={avatarUrl || undefined}
            className="border-0"
          >
            {!avatarUrl ? companyName?.[0]?.toUpperCase() : null}
          </Avatar>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}
