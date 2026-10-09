"use client";
// Force HMR refresh

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
// import { Mail, Paperclip, ChevronDown, CheckCircle2, ArrowUpRight } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useGetData from "@/lib/api/useGetData";
import { ApiResponse } from "@/features/auth/server";
import { Support_Tikctes } from "@/shared/constants/urls";
import AnswerReportModal from "./AnswerReportModal";
import ReplyHistoryModal from "@/features/profile/components/Tickets/ReplyHistoryModal";

type Props = {
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  ticketId: number;
  onResolve: (id: number | string) => void;
  onEscalate: (id: number | string) => void;
  statusBadge: string;
  priorityBadge: string;
  slaBadge: string;
};

const formatDate = (v?: string | null) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getFirstLetter = (name?: string | null) => {
  const n = (name || "").trim();
  return n ? n[0].toUpperCase() : "?";
};

export default function SupportDetails({
  showDetails,
  setShowDetails,
  ticketId,
  statusBadge,
  priorityBadge,
  onResolve,
  onEscalate,
  slaBadge,
}: Props) {
  const { t } = useTranslation();
  const [openAnswer, setOpenAnswer] = useState(false);
  const [showReplyHistory, setShowReplyHistory] = useState(false);

  const { data: resData, loading, refetch } = useGetData<ApiResponse>({
    url: Support_Tikctes.showDetialsTiket(ticketId),
    enabled: Boolean(showDetails && ticketId),
  });

  const ticket: any = resData?.data;

  // ✅ user info
  const userName = ticket?.user?.name ?? "—";
  const userPhoto = ticket?.user?.photo ?? null;
  const userEmail = ticket?.user?.email || "—";

  // ✅ SLA comes from ticket.sla
  const sla = ticket?.sla ?? {};
  const slaResponseHours = sla?.sla_response_hours ?? "—";
  const slaDueAt = sla?.due_at ?? null;
  const slaBreached = Boolean(sla?.is_breached);
  const slaDelay = sla?.sla_delay ?? "—";

  const reasonMessages = (ticket?.messages || []).filter(
    (m) => (m?.message || "").trim().length > 0
  );

  // ✅ attachments from messages
  const messageAttachments = useMemo(() => {
    const msgs = Array.isArray(ticket?.messages) ? ticket.messages : [];
    const urls: string[] = [];

    for (const m of msgs) {
      const atts = Array.isArray(m?.attachments) ? m.attachments : [];
      for (const a of atts) {
        if (typeof a === "string") urls.push(a);
        else if (a?.url) urls.push(a.url);
        else if (a?.file_path) urls.push(a.file_path);
        else if (a?.path) urls.push(a.path);
      }
    }

    return Array.from(new Set(urls)).slice(0, 12);
  }, [ticket]);

  const complaintType = ticket?.issue_type?.name || "—";
  const priorityText = ticket?.priority || "—";
  const subject = ticket?.subject || "—";
  const descriptionText = ticket?.issue_type?.description || "—";

  const ticketStatus = ticket?.status ?? "—";
  const openReply = () => {
    setShowReplyHistory(true);
  };

  return (
    <Modal
      id="ticket-details"
      isOpen={showDetails}
      onClose={() => setShowDetails(false)}
      style={{ maxWidth: "860px" }}
      padding="px-4 sm:px-8 md:px-16"
      showLine={true}
    >
      <div className="bg-white max-h-[95vh] rounded-xl space-y-2 overflow-y-auto">
        {/* Top header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Avatar */}
            {userPhoto ? (
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-200 bg-white">
                <Image
                  src={userPhoto}
                  alt={userName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white"
                style={{ backgroundColor: "var(--SiteColor)" }}
              >
                {getFirstLetter(userName)}
              </div>
            )}

            <div className="leading-tight min-w-0">
              <p className="text-[14px] font-semibold text-subTitleColor truncate">
                {userName}
              </p>
              <p className="text-[12px] text-textGrayColor truncate">
                {t("tickets.userId", { defaultValue: "User ID" })}:{" "}
                {ticket?.user?.id ?? "—"}
              </p>
            </div>
          </div>

          {/* ✅ Change status button */}
          <ChangeStatusButton
            disabled={loading || !ticket?.id}
            currentStatus={String(ticketStatus)}
            onResolve={() => onResolve(ticket?.id ?? ticketId)}
            onEscalate={() => onEscalate(ticket?.id ?? ticketId)}
          />
        </div>

        <div className="py-2 space-y-3 ">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-1 pt-2">
            <div className="bg-white space-x-2 flex items-center">
              <div className="border-l-4 border-blueSite h-6" />
              <h2 className="text-[18px] md:text-[20px] font-semibold text-blueSiteHover">
                {t("tickets.ticket_information", {
                  defaultValue: "Ticket information",
                })}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[12px] text-textGrayColor">
                {t("tickets.ticketId", { defaultValue: "Ticket" })}: #
                {ticket?.id ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex-1 px-1">
            <InfoRow
              label={t("tickets.message")}
              value={String(subject)}
              valueClassName="text-blueSite font-semibold"
              alignRight
            />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 px-1">
            <InfoRow label={t("tickets.complaintType")} value={complaintType} />

            <InfoRow
              label={t("tickets.priority")}
              value={String(priorityText)}
              valueClassName="text-red-600 font-semibold"
              alignRight
            />

            <InfoRow
              label={t("tickets.slaResponseHours")}
              value={`${slaResponseHours} ${t("common.hours", {
                defaultValue: "hours",
              })}`}
            />

            <InfoRow
              label={t("tickets.slaDueAt")}
              value={formatDate(slaDueAt)}
              alignRight
            />

            <InfoRow
              label={t("tickets.createdAt")}
              value={formatDate(ticket?.created_at)}
            />

            <InfoRow
              label={t("tickets.slaBreached")}
              value={
                slaBreached
                  ? t("common.yes", { defaultValue: "YES" })
                  : t("common.no", { defaultValue: "NO" })
              }
              valueClassName={
                slaBreached
                  ? "text-red-600 font-semibold"
                  : "text-green-700 font-semibold"
              }
              alignRight
            />

            <InfoRow label={t("tickets.slaDelay")} value={String(slaDelay)} />
          </div>

          {/* Description */}
          <Section title={t("tickets.description", { defaultValue: "Description" })}>
            <p className="text-[14px] text-textColor leading-relaxed px-1 break-words whitespace-pre-wrap overflow-wrap-anywhere">
              {descriptionText}
            </p>
          </Section>

          {/* Files */}
          <Section title={t("tickets.files", { defaultValue: "Files" })}>
            {messageAttachments.length === 0 ? (
              <p className="text-[13px] text-textGrayColor px-1">
                {t("tickets.noFiles", { defaultValue: "No attachments" })}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 px-1">
                {messageAttachments.map((url, idx) => {
                  const name = decodeURIComponent(
                    url.split("/").pop() || `file-${idx + 1}`
                  );
                  return (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition"
                    >
                      {/* <Paperclip size={16} style={{ color: "var(--SiteColor)" }} /> */}
                      <span className="text-[13px] text-subTitleColor truncate">
                        {name}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Actions */}
          <div className="pt-2 flex flex-col items-center gap-3 px-1">
            {reasonMessages.length > 0 ? (
              ticket && (
                <button
                  type="button"
                  onClick={openReply}
                  className="w-full sm:w-[520px] text-white font-semibold py-3 sm:py-3.5 rounded-xl transition"
                  style={{ backgroundColor: "var(--SiteColor)" }}
                >
                  {t("tickets.viewReplyHistory", {
                    defaultValue: "View Reply History",
                  })}
                </button>
              )
            ) : (
              <button
                type="button"
                className="w-full sm:w-[520px] py-3 sm:py-3.5 rounded-xl text-white text-[14px] sm:text-[15px] font-semibold transition"
                style={{ backgroundColor: "var(--SiteColor)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--blueSiteHover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--SiteColor)")
                }
                onClick={() => setOpenAnswer(true)}
                disabled={loading}
              >
                {t("tickets.answer", { defaultValue: "Answer" })}
              </button>
            )}

            <button
              type="button"
              className="text-[14px] font-medium text-textColor underline underline-offset-4 hover:text-subTitleColor"
              onClick={() => setShowDetails(false)}
            >
              {t("buttons.cancel", { defaultValue: "Cancel" })}
            </button>
          </div>

          {/* Hidden badges (compat) */}
          <div className="sr-only">
            <span className={statusBadge}>{ticket?.status}</span>
            <span className={priorityBadge}>{ticket?.priority}</span>
            <span className={slaBadge}>{String(slaBreached)}</span>
          </div>
        </div>
      </div>

      {ticket && (
        <ReplyHistoryModal
          isOpen={showReplyHistory}
          onClose={() => setShowReplyHistory(false)}
          userName={userName}
          userEmail={userEmail}
          userPhoto={userPhoto}
          messages={reasonMessages}
          refetch={refetch}
          ticket={ticket}
        />
      )}

      <AnswerReportModal
        refetch={refetch}
        isOpen={openAnswer}
        onClose={() => setOpenAnswer(false)}
        ticket={ticket}
      />
    </Modal>
  );
}

/** ✅ Change status button with dropdown */
function ChangeStatusButton({
  disabled,
  currentStatus,
  onResolve,
  onEscalate,
}: {
  disabled?: boolean;
  currentStatus: string;
  onResolve: () => void;
  onEscalate: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const clickResolve = () => {
    setOpen(false);
    onResolve();
  };

  const clickEscalate = () => {
    setOpen(false);
    onEscalate();
  };

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`h-10 w-full sm:w-auto sm:min-w-[220px] px-3 sm:px-4 rounded-md border border-[#E6F0ED] bg-[#E6F0ED]
          flex items-center justify-between gap-3 text-[13px] sm:text-[14px] transition
          hover:bg-[#55f5c5] ${
            disabled ? "opacity-60 cursor-not-allowed hover:bg-gray-50" : ""
          }`}
      >
        <span className="text-gray-600">
          {t("tickets.changeStatus", { defaultValue: "Change status" })}
        </span>
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-subTitleColor font-medium truncate max-w-[110px] break-words overflow-wrap-anywhere">
            {currentStatus}
          </span>
          {/* <ChevronDown size={16} className="text-gray-500" /> */}
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute right-0 mt-2 w-full sm:w-[220px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden z-[50]">
          <button
            type="button"
            onClick={clickResolve}
            className="w-full px-4 py-3 text-left flex items-center gap-2 text-[14px] text-gray-700 hover:bg-gray-50"
          >
            {/* <CheckCircle2 size={16} style={{ color: "var(--SiteColor)" }} /> */}
            {t("tickets.resolve", { defaultValue: "Resolve" })}
          </button>

          <button
            type="button"
            onClick={clickEscalate}
            className="w-full px-4 py-3 text-left flex items-center gap-2 text-[14px] text-gray-700 hover:bg-gray-50"
          >
            {/* <ArrowUpRight size={16} className="text-red-600" /> */}
            {t("tickets.escalate", { defaultValue: "Escalate" })}
          </button>
        </div>
      )}
    </div>
  );
}

/** Helpers */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        {/* <Mail size={16} style={{ color: "var(--SiteColor)" }} /> */}
        <h3 className="text-[16px] font-semibold text-subTitleColor">{title}</h3>
      </div>
      <div className="pl-1">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  alignRight,
  valueClassName = "text-subTitleColor font-medium",
}: {
  label: string;
  value: string;
  alignRight?: boolean;
  valueClassName?: string;
}) {
  return (
    <div
      className={[
        "flex items-start gap-2",
        "text-[14px] sm:text-[16px]",
        alignRight ? "sm:justify-end sm:text-right" : "sm:justify-start",
      ].join(" ")}
    >
      <span className="text-textGrayColor whitespace-nowrap">{label} :</span>
      <span className={[valueClassName, "break-words overflow-wrap-anywhere"].join(" ")}>{value}</span>
    </div>
  );
}
