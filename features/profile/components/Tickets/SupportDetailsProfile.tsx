"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

import Modal from "@/components/ui/Modal";
import useGetData from "@/lib/api/useGetData";
import { Support_Tikctes } from "@/shared/constants/urls";
import { ApiResponse } from "@/features/auth/server";
import { useTranslation } from "@/lib/i18n/useTranslation";
import ReplyHistoryModal from "./ReplyHistoryModal";
import { backUrl } from "@/shared/constants/data";

type Attachment = string | { url?: string; path?: string };

type TicketMessage = {
  id: number;
  sender_id: number;
  message: string;
  attachments: Attachment[];
  created_at: string;
};

type TicketDetails = {
  id: number;
  store_id: number | null;
  user_id: number | null;
  order_id: number | null;

  issue_type?: {
    id: number;
    name: string;
    description?: string | null;
    priority?: string | null;
  } | null;

  priority?: string | null;
  subject?: string | null;
  status?: string | null;

  sla?: {
    sla_response_hours?: number | null;
    due_at?: string | null;
    first_response_at?: string | null;
    is_breached?: boolean;
    sla_delay?: string | null;
  } | null;

  created_at?: string | null;
  updated_at?: string | null;

  messages?: TicketMessage[];

  // NOTE: your code uses ticket.store.*, so we keep it here.
  store?: {
    id: number;
    name?: string | null;
    email?: string | null;
    photo?: string | null;
  } | null;

  user?: {
    id: number;
    name?: string | null;
    email?: string | null;
    photo?: string | null;
  } | null;
};

type Props = {
  ticketId: number | string | null;
  showDetails: boolean;
  setShowDetails: (v: boolean) => void;

  onOpenReplyHistory?: () => void;
  onChangeStatus?: () => void;
};

const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
const getFileName = (url: string) => decodeURIComponent(url.split("/").pop() || "file");

const getFileIcon = (url: string) => {
  if (/\.pdf$/i.test(url)) return "📄";
  if (/\.(doc|docx)$/i.test(url)) return "📝";
  if (/\.(xls|xlsx|csv)$/i.test(url)) return "📊";
  if (/\.(zip|rar|7z)$/i.test(url)) return "🗜️";
  return "📎";
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Mail size={16} style={{ color: "var(--SiteColor)" }} />
        <h3 className="text-[15px] sm:text-[16px] font-semibold text-subTitleColor">{title}</h3>
      </div>
      <div className="px-1">{children}</div>
    </div>
  );
}

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

const normalizeAttachment = (a: Attachment): string | null => {
  if (!a) return null;
  if (typeof a === "string") return a;
  return a.url || a.path || null;
};

const formatPriorityLabel = (p?: string | null) => {
  const v = (p || "").toLowerCase();
  if (!v) return "—";
  return v.charAt(0).toUpperCase() + v.slice(1);
};

const priorityTextClass = (p?: string | null) => {
  const v = (p || "").toLowerCase();
  if (v === "high") return "text-red-600";
  if (v === "medium") return "text-amber-600";
  if (v === "low") return "text-green-600";
  return "text-gray-700";
};

const SupportDetails: React.FC<Props> = ({
  ticketId,
  showDetails,
  setShowDetails,
  onOpenReplyHistory,
}) => {
  const { t } = useTranslation();
  const [showReplyHistory, setShowReplyHistory] = useState(false);

  const url = useMemo(() => {
    if (!ticketId) return "";
    return Support_Tikctes.showUserDetialsTiket(ticketId);
  }, [ticketId]);

  const { data: resData, loading, refetch } = useGetData<ApiResponse<TicketDetails>>({
    url,
    enabled: Boolean(showDetails && ticketId),
  });

  const ticket = resData?.data ?? null;

  const userName = ticket?.store?.name || "—";
  const userEmail = ticket?.store?.email || "—";
  const userPhoto = ticket?.store?.photo || null;

  const issueName = ticket?.issue_type?.name || "—";
  const priority = ticket?.priority || ticket?.issue_type?.priority || null;

  const reasonMessages = (ticket?.messages || []).filter(
    (m) => (m?.message || "").trim().length > 0
  );

  const descriptionText =
    ticket?.issue_type?.description ||
    reasonMessages?.[reasonMessages.length - 1]?.message ||
    ticket?.subject ||
    "—";

  // ✅ ensure full URL for attachments (api might return relative path)
  const attachments = (ticket?.messages || [])
    .flatMap((m) => (m.attachments || []).map(normalizeAttachment))
    .filter(Boolean)
    .map((src) => {
      const s = String(src);
      if (/^https?:\/\//i.test(s)) return s;
      return `${backUrl}${s.startsWith("/") ? "" : "/"}${s}`;
    }) as string[];

  const openReply = () => {
    if (onOpenReplyHistory) onOpenReplyHistory();
    setShowReplyHistory(true);
  };

  return (
    <Modal
      id="ticket-details"
      isOpen={showDetails}
      onClose={() => setShowDetails(false)}
      className="p-0"
      padding="px-4 sm:px-8 md:px-16"
      style={{ maxWidth: "800px" }}
    >
      <div className="relative bg-white rounded-[22px] overflow-hidden max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-7">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                {loading ? (
                  <Skeleton className="w-full h-full" />
                ) : userPhoto ? (
                  <Image src={userPhoto} alt={String(userName)} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                    {(String(userName).trim()?.[0] || "U").toUpperCase()}
                  </div>
                )}
                <span className="absolute -right-0.5 top-1.5 w-4 h-4 rounded-full bg-violet-600 border-2 border-white" />
              </div>

              <div className="min-w-0">
                {loading ? (
                  <>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </>
                ) : (
                  <>
                    <div className="text-[18px] sm:text-[22px] md:text-[26px] leading-7 font-semibold text-gray-700 truncate">
                      {userName}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">{userEmail}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 sm:my-6 h-px bg-gray-100" />

          {/* Ticket information */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-7 sm:h-8 rounded-full" style={{ backgroundColor: "var(--SiteColor)" }} />
            <h3
              className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold"
              style={{ color: "var(--SiteColor)" }}
            >
              {t("tickets.ticket_information", { defaultValue: "Ticket information" })}
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <Skeleton className="h-5 w-72" />
              <Skeleton className="h-5 w-28" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-6">
              <div className="text-[14px] sm:text-[16px] md:text-[18px] text-gray-400">
                {t("tickets.complaintType", { defaultValue: "Complaint Type" })} :{" "}
                <span className="text-gray-800 font-medium">{issueName}</span>
              </div>

              <div className="text-[14px] sm:text-[16px] md:text-[18px] text-gray-400">
                {t("tickets.priority", { defaultValue: "Priority" })} :{" "}
                <span className={`font-semibold ${priorityTextClass(priority)}`}>
                  {formatPriorityLabel(priority)}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Description */}
            <Section title={t("tickets.description", { defaultValue: "Description" })}>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <p className="text-[13px] sm:text-[14px] text-textColor leading-6 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                  {descriptionText}
                </p>
              )}
            </Section>

            {/* Media and attachments */}
            {loading ? (
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-[110px] h-[70px] rounded-lg" />
                ))}
              </div>
            ) : attachments.length > 0 ? (
              <Section title={t("tickets.mediaAndAttachments", { defaultValue: "Media & Attachments" })}>
                {/* ✅ responsive: grid on desktop, horizontal scroll on mobile */}
                <div className="sm:hidden flex gap-3 overflow-x-auto pb-2">
                  {attachments.map((src, idx) => {
                    const fileName = getFileName(src);
                    const image = isImage(src);

                    return (
                      <a
                        key={`${src}-${idx}`}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        {image ? (
                          <div className="relative w-[110px] h-[70px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <Image src={src} alt={fileName} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-[160px] h-[70px] rounded-lg border border-gray-200 bg-white flex items-center gap-3 px-3 hover:bg-gray-50">
                            <span className="text-2xl">{getFileIcon(src)}</span>
                            <div className="text-xs text-gray-700 truncate">{fileName}</div>
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>

                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {attachments.map((src, idx) => {
                    const fileName = getFileName(src);
                    const image = isImage(src);

                    return (
                      <a
                        key={`${src}-${idx}`}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition overflow-hidden"
                      >
                        {image ? (
                          <div className="relative w-full h-[110px] bg-gray-100">
                            <Image src={src} alt={fileName} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="p-3 flex items-center gap-3">
                            <span className="text-2xl">{getFileIcon(src)}</span>
                            <div className="text-sm text-gray-700 truncate">{fileName}</div>
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </Section>
            ) : null}
          </div>

          {/* Buttons */}
          <div className="mt-7 flex flex-col items-center gap-4">
            {ticket && (
              <button
                type="button"
                onClick={openReply}
                className="w-full sm:w-[520px] text-white font-semibold py-3 sm:py-3.5 rounded-xl transition"
                style={{ backgroundColor: "var(--SiteColor)" }}
              >
                {t("tickets.viewReplyHistory", { defaultValue: "View Reply History" })}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDetails(false)}
              className="text-[14px] font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900"
            >
              {t("buttons.cancel", { defaultValue: "Cancel" })}
            </button>
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
    </Modal>
  );
};

export default SupportDetails;
