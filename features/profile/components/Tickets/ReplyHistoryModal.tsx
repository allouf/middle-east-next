"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { toPublicUrl } from "@/lib/utils/helper";
import AnswerReportModal from "@/features/stores/components/SupportTckets/AnswerReportModal";
import { Eye, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Attachment = string | { url?: string; path?: string };

type TicketMessage = {
    id: number;
    sender_id: number;
    message: string;
    attachments: Attachment[];
    is_mine: boolean; // ✅ add this
    created_at: string;
};


type TicketDetails = {
    id: number;
    store_id: number | null;
    user_id: number | null;
    order_id?: number | null;
    subject?: string | null;
    status?: string | null;
    messages?: TicketMessage[];
    user?: {
        id: number;
        name?: string | null;
        email?: string | null;
        photo?: string | null;
    } | null;
    store?: {
        id: number;
        name?: string | null;
        logo?: string | null;
    } | null;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;

    userName: string;
    userEmail: string;
    userPhoto?: string | null;
    messages: TicketMessage[];

    title?: string;
    ticket?: TicketDetails;
    refetch?: () => void;
};

const normalizeAttachment = (a: Attachment): string | null => {
    if (!a) return null;
    const raw = typeof a === "string" ? a : a.url || a.path || null;
    return toPublicUrl(raw);
};

const initials = (name?: string) =>
    (String(name || "U").trim()?.[0] || "U").toUpperCase();

export default function ReplyHistoryModal({
    isOpen,
    onClose,
    userName,
    userEmail,
    userPhoto,
    messages,
    title = "Reply history",
    ticket,
    refetch
}: Props) {
    const { t } = useTranslation();

    const [openAnswer, setOpenAnswer] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);

    const openPreview = (src: string) => {
        setPreviewSrc(src);
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPreviewSrc(null);
    };

    const sortedMessages = useMemo(() => {
        return [...(messages || [])];
    }, [messages]);

    return (
        <>
            <Modal
                id="reply-history"
                isOpen={isOpen}
                onClose={onClose}
                className="p-0"
                padding="px-10"
                style={{ maxWidth: "760px" }}
            >
                <div className="relative bg-white rounded-xl overflow-hidden max-h-[80vh] flex flex-col">
                    {/* Header (sticky) */}
                    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                    {userPhoto ? (
                                        <Image
                                            src={userPhoto}
                                            alt={String(userName)}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-500">
                                            {initials(userName)}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <div className="text-[18px] font-semibold text-gray-800 truncate">
                                        {userName}
                                    </div>
                                    <div className="text-[13px] text-gray-500 truncate">
                                        {userEmail}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg text-white font-semibold text-[14px] shadow-sm hover:shadow transition"
                                style={{ backgroundColor: "var(--SiteColor)" }}
                                onClick={() => setOpenAnswer(true)}
                            >
                                {t("tickets.reply")}
                            </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="text-[14px] font-semibold text-gray-700 truncate">
                                {title}
                            </div>

                            {/* optional subject/status from api */}
                            {ticket?.subject ? (
                                <span className="text-[12px] text-gray-500 truncate">
                                    #{ticket.id} • {ticket.subject}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* Conversation body */}
                    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
                        <div className="space-y-3">
                            {sortedMessages.map((m) => {
                                // ✅ now based on API field
                                const isMine = !!(m as any).is_mine;

                                const firstAttachment = normalizeAttachment(m.attachments?.[0]);
                                const isImage = (url: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(url);

                                return (
                                    <div
                                        key={m.id}
                                        className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`w-[95%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm border
          ${isMine ? "rounded-br-md" : "rounded-bl-md"}`}
                                            style={{
                                                backgroundColor: isMine ? "#E6F0ED" : "#FAFAFA", // ✅ lightGreen for mine
                                                borderColor: isMine ? "#BFECCB" : "#FAFAFA",
                                            }}
                                        >
                                            <div className="text-[14px] text-[#3F4343] leading-6 whitespace-pre-wrap">
                                                {m.message}
                                            </div>

                                            {m.attachments?.length ? (
                                                <div className="mt-3 grid grid-cols-3 gap-2">
                                                    {m.attachments.map((a, idx) => {
                                                        const url = normalizeAttachment(a);
                                                        if (!url) return null;

                                                        // ✅ image preview
                                                        if (isImage(url)) {
                                                            return (
                                                                <div
                                                                    key={`${m.id}-att-${idx}`}
                                                                    className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
                                                                    onClick={() => openPreview(url)}
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onKeyDown={(e) => e.key === "Enter" && openPreview(url)}
                                                                >
                                                                    <Image
                                                                        src={url}
                                                                        alt={`attachment-${idx + 1}`}
                                                                        fill
                                                                        sizes="(max-width: 640px) 45vw, 220px"
                                                                        className="object-contain"
                                                                    />

                                                                    {/* ✅ Hover overlay */}
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition" />

                                                                    {/* ✅ Eye icon */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            openPreview(url);
                                                                        }}
                                                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                                        aria-label="Preview image"
                                                                    >
                                                                        <span className="inline-flex items-center justify-center size-10 rounded-full bg-lightGreen shadow">
                                                                            <Eye className="size-5 text-white" />
                                                                        </span>
                                                                    </button>
                                                                </div>

                                                            );
                                                        }

                                                        // ✅ non-image file (link)
                                                        return (
                                                            <a
                                                                key={`${m.id}-att-${idx}`}
                                                                href={url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] font-semibold text-gray-700 hover:text-blueSite hover:border-gray-300 transition"
                                                            >
                                                                Attachment {idx + 1}
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            ) : null}

                                            <div className="mt-2 text-[11px] text-gray-500">
                                                {m.created_at}
                                            </div>
                                        </div>

                                        {/* optional avatar for mine
                                        {isMine && (
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200 shrink-0">
                                                <div className="w-full h-full flex items-center justify-center text-[12px] font-semibold text-gray-500">
                                                    S
                                                </div>
                                            </div>
                                        )} */}
                                    </div>
                                );
                            })}


                            {sortedMessages.length === 0 ? (
                                <div className="text-center text-gray-500 text-sm py-10">
                                    No messages yet
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                id="image-preview"
                isOpen={previewOpen}
                onClose={closePreview}
                className="p-0"
                style={{ maxWidth: "1200px" }}
            >
                <div className="relative bg-black rounded-xl overflow-hidden">

                    <div className="relative w-full h-[70vh] bg-black">
                        {previewSrc ? (
                            <Image
                                src={previewSrc}
                                alt="preview"
                                fill
                                sizes="(max-width: 768px) 95vw, 900px"
                                className="object-contain"
                            />
                        ) : null}
                    </div>
                </div>
            </Modal>


            <AnswerReportModal
                isOpen={openAnswer}
                onClose={() => setOpenAnswer(false)}
                ticket={ticket}
                refetch={refetch}

            />
        </>
    );
}
