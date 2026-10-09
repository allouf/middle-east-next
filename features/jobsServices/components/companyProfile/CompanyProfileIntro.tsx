"use client";

import  { useMemo, useState } from "react";
import { Avatar } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";

type TeamMember = {
  id: string | number;
  name: string;
  photo?: string | null;
};

type Props = {
  companyName?: string;
  category?: string | null; // software development
  about?: string | null;
  team?: TeamMember[];
};

export default function CompanyProfileIntro({
  companyName,
  category = "",
  about = "",
  team = [],
}: Props) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const shortText = useMemo(() => {
    const t = (about || "").trim();
    if (!t) return "";
    return t.length > 180 ? `${t.slice(0, 180)}...` : t;
  }, [about]);

  const canExpand = (about || "").trim().length > 180;

  return (
    <div className="w-full ">
      {/* Top row */}
      <div className="flex items-start justify-between gap-6">
        {/* Left */}
        <div className="min-w-0">
          <div className="text-[22px] font-semibold text-zinc-900 leading-tight">
            {companyName}
          </div>
          <div className="mt-0.5 text-sm text-zinc-500">{category}</div>
        </div>

        {/* Right avatars */}
        <div className="shrink-0">
          <Avatar.Group
            maxCount={5}
            maxPopoverTrigger="click"
            size="default"
            className="[&_.ant-avatar]:ring-2 [&_.ant-avatar]:ring-white"
            maxStyle={{
              color: "#111827",
              backgroundColor: "#f3f4f6",
              border: "2px solid white",
            }}
          >
            {team.map((m) => (
              <Avatar key={m.id} src={m.photo || undefined}>
                {!m.photo ? (m.name?.[0] || "?").toUpperCase() : null}
              </Avatar>
            ))}
          </Avatar.Group>
        </div>
      </div>

      {/* About */}
      <div className="mt-5">
        <div className="text-sm font-semibold text-zinc-800">{t("jobs.about.title")}</div>

        <div className="mt-1 text-sm text-zinc-500 leading-6">
          {expanded ? (about || "") : shortText}

          {canExpand && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-zinc-700 hover:text-zinc-900 font-medium"
              >
                {expanded ? t("jobs.about.seeLess") : t("jobs.about.seeMore")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
