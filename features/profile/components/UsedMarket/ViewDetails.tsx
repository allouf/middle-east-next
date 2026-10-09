'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { CarouselRef } from 'antd/es/carousel';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Tag,
    Eye,
    ShieldAlert,
    Package,
    Info,
    ArrowRight,
} from 'lucide-react';
import { Carousel, Tag as AntTag, Popover } from "antd";

import Button from '@/components/ui/Button';
import { AdvertisementsEndpoints } from '@/shared/constants/urls';
import useGetData from '@/lib/api/useGetData';
import ErrorWithRetry from '@/components/ui/ErrorWithRetry';
import { ViewDetailsSkeleton } from './ViewDetailsSkeleton';
import { formatMoney } from '@/lib/utils/format';
import { StatusType, UserAd } from './types';
import { getCountryNameByCode } from '@/shared/utils/locationApi';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';

const FALLBACK_IMG = '/dummy/Polaroid.png';

/** ===== Types match your BACK response ===== */
type CategoryObj = { id: number; name: string; slug?: string; icon?: string };
type SubCategoryObj = { id: number; name: string; slug?: string };
type CountryObj = { id: number; en_short_name?: string; alpha_2_code?: string; alpha_3_code?: string };
type RegionObj = { id: number; name?: string; title?: string };
type IdLike = string | number;
type AdvertisementDTO = {
    id: number;
    title: string;
    slug?: string;
    description?: string;
    price?: string | number;
    is_price_negotiable?: boolean;
    is_free?: boolean;
    condition?: 'new' | 'used';
    status?: StatusType;
    contact_method?: string;
    phone?: string;
    show_phone?: boolean;

    images?: string[];
    views_count?: number;

    user?: { id: number; name?: string; photo?: string; type?: string | null };

    category?: CategoryObj | string | null;
    subcategory?: SubCategoryObj | string | null;

    country_code?: CountryObj | string | null;
    region?: RegionObj | string | null;

    created_at?: string;
    updated_at?: string;

    // might exist for rejected ads in other endpoints
    reject_reason?: string | null;
    address?: string | null;
};

type AdvertisementProps = {
    onBack?: () => void;
    id: string | number;
    onEdit: (id: IdLike) => void;
    onDelete: (id: IdLike) => void;
    onChangeStatus: (id: IdLike, staus: StatusType) => void;
};

/** ===== Helpers ===== */
const toText = (v: any, fall = '-') => {
    if (v == null) return fall;
    if (typeof v === 'string' || typeof v === 'number') return String(v);

    if (typeof v === 'object') {
        if ('name' in v && v.name) return String(v.name);
        if ('en_short_name' in v && v.en_short_name) return String(v.en_short_name);
        if ('title' in v && v.title) return String(v.title);
        if ('slug' in v && v.slug) return String(v.slug);
        return fall;
    }

    return fall;
};



const toNumber = (v: unknown) => {
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
    return Number.isFinite(n) ? n : 0;
};

const ViewDetails: React.FC<AdvertisementProps> = ({ id, onBack, onEdit, onDelete, onChangeStatus }) => {
    const { t } = useTranslation();
    const {isRTL} = useLocaleDirection();

    const { data: resData, loading, error, refetch } = useGetData({
        url: id ? AdvertisementsEndpoints.getById(id) : '',
    });

    const ad = resData?.data as AdvertisementDTO | undefined;

    // console.log("ad details",ad)

    const [brokenSet, setBrokenSet] = useState<Record<string, true>>({});
    const [activeIdx, setActiveIdx] = useState(0);
    const [expanded, setExpanded] = useState(false);

    const carouselRef = useRef<CarouselRef | null>(null);

    const renderState = (state?: UserAd["state"]) => {
        const statusMapping: Record<NonNullable<StatusType>, { color: 'error' | 'success' | 'warning' | 'default'; label: string }> = {
            all: { color: 'default', label: t('usedMarket.table.allStatuses', { defaultValue: 'All' }) },
            draft: { color: 'default', label: t('usedMarket.table.draft', { defaultValue: 'Draft' }) },
            active: { color: 'success', label: t('usedMarket.table.active', { defaultValue: 'Active' }) },
            paused: { color: 'warning', label: t('usedMarket.table.paused', { defaultValue: 'Paused' }) },
            sold: { color: 'warning', label: t('usedMarket.table.sold', { defaultValue: 'Sold' }) },
            expired: { color: 'error', label: t('usedMarket.table.expired', { defaultValue: 'Expired' }) },
            archived: { color: 'default', label: t('usedMarket.table.archived', { defaultValue: 'Archived' }) },
            rejected: { color: 'error', label: t('usedMarket.table.rejected', { defaultValue: 'Rejected' }) },
        };

        const fallback = {
            color: "default" as const,
            label: t("usedMarket.table.unknown"),
        };

        const { color, label } = state && statusMapping[state] ? statusMapping[state] : fallback;

        return (
            <AntTag color={color} className="m-0 w-full text-center">
                {label}
            </AntTag>
        );
    };

    const onRenew = async (id: IdLike): Promise<void> => {
        await onChangeStatus(id, "active");
        await refetch?.();
    };

    const onResume = async (id: IdLike): Promise<void> => {
        await onChangeStatus(id, "active");
        await refetch?.();
    };

    const onPaused = async (id: IdLike): Promise<void> => {
        await onChangeStatus(id, "paused");
        await refetch?.();
    };

    const onSold = async (id: IdLike): Promise<void> => {
        await onChangeStatus(id, "sold");
        await refetch?.();
    };

    const imgs = useMemo(() => {
        if (!Array.isArray(ad?.images)) return [FALLBACK_IMG];

        const list = ad.images
            .filter(Boolean)
            .map((src) => (brokenSet[src] ? FALLBACK_IMG : src));

        return list.length ? list : [FALLBACK_IMG];
    }, [ad?.images, brokenSet]);

    // clamp + move carousel when imgs changes
    useEffect(() => {
        setActiveIdx((prev) => {
            const next = prev >= imgs.length ? 0 : prev;
            queueMicrotask(() => carouselRef.current?.goTo(next, false));
            return next;
        });
    }, [imgs.length]);

    const [countryName, setCountryName] = useState<string>('-');

    useEffect(() => {
        const load = async () => {
            const rawCode = ad?.country_code;
            if (!rawCode) {
                setCountryName('-');
                return;
            }

            const code = typeof rawCode === 'object'
                ? (rawCode.alpha_2_code || rawCode.id)
                : rawCode;

            if (code) {
                const name = await getCountryNameByCode(code as string | number);
                setCountryName(name);
            } else {
                setCountryName('-');
            }
        };

        load();
    }, [ad?.country_code]);

    const next = () => carouselRef.current?.next();
    const prev = () => carouselRef.current?.prev();
    const hasMultipleImages = imgs.length > 1;

    if (loading) return <ViewDetailsSkeleton />;
    if (error) return <ErrorWithRetry onRetry={refetch} />;
    if (!ad) return <ViewDetailsSkeleton />;
    const status = ad.status;
    const isArchived = status === "archived";

    const canEdit = status !== "sold" && status !== "rejected";

    const canRenew =
        status === "expired" ||
        status === "archived" ||
        (status !== "paused" && status !== "sold" && status !== "active");

    const canResume = status === "paused";
    const canPaused = status === "active";
    const canSold = status === "active" || status === "paused";


    const showNegotiable = !!ad.is_price_negotiable;

    return (
        <div className="p-6">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[#00664F] mb-4 hover:opacity-80 transition-opacity font-medium"
            >
                {isRTL? <ArrowRight className="w-4 h-4" />:<ArrowLeft className="w-4 h-4" />}
                {t('usedMarket.rejectedAds.goBack', { defaultValue: 'GO BACK' })}
            </button>

            <div className="flex flex-col md:flex-row gap-4">
                {/* LEFT */}
                <div className="w-full md:w-[52%]">
                    {/* Thumbnails */}
                    <div className="mb-3 rounded-lg p-2">
                        <div className="flex gap-2 overflow-x-auto">
                            {imgs.map((src, i) => (
                                <button
                                    key={src + i}
                                    type="button"
                                    onClick={() => carouselRef.current?.goTo(i)}
                                    className={[
                                        'relative h-16 w-16 flex-none overflow-hidden rounded-md border bg-white transition',
                                        i === activeIdx
                                            ? 'border-blueSite ring-1 ring-blueSite'
                                            : 'border-gray-200 hover:border-gray-300',
                                    ].join(' ')}
                                    aria-label={`Go to image ${i + 1}`}
                                >
                                    <Image
                                        src={src}
                                        alt={`thumb-${i}`}
                                        fill
                                        className="object-cover"
                                        onError={() => setBrokenSet((p) => ({ ...p, [src]: true }))}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main (Antd Carousel) */}
                    <div className="relative overflow-hidden rounded-xl">
                        <Carousel
                            ref={carouselRef}
                            dots={false}
                            adaptiveHeight={false}
                            beforeChange={(_, nextIdx) => setActiveIdx(nextIdx)}
                            className="!w-full"
                        >
                            {imgs.map((src, i) => (
                                <div key={src + i} className="relative">
                                    <div className="relative h-[260px] sm:h-[360px] lg:h-[420px] w-full">
                                        <Image
                                            src={src}
                                            alt={`image-${i}`}
                                            fill
                                            className="object-contain"
                                            onError={() => setBrokenSet((p) => ({ ...p, [src]: true }))}
                                            priority={i === 0}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Carousel>

                        {/* Bottom overlay controls */}
                        {hasMultipleImages && (
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <div className="pointer-events-auto text-[12px] font-semibold text-blueSite">
                                        {String(activeIdx + 1).padStart(2, "0")} {t('common.of', { defaultValue: 'of' })}{" "}
                                        {String(imgs.length).padStart(2, "0")}
                                    </div>

                                    <div className="pointer-events-auto flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={prev}
                                            className="grid h-8 w-8 place-items-center rounded-full border border-blueSite bg-white/90 text-blueSite hover:bg-white"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={next}
                                            className="grid h-8 w-8 place-items-center rounded-full border border-blueSite bg-white/90 text-blueSite hover:bg-white"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex mt-4 inline-flex flex-col items-center justify-center space-y-3 w-full ">
                        {/* ✅ Renew with Popover */}
                        {canRenew && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {isArchived
                                            ? t("usedMarket.actions.renewAfter24h", {
                                                defaultValue: "You can renew this ad after 24 hours",
                                            })
                                            : t("usedMarket.actions.renewInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className={`
                                                w-[90%] h-12 rounded-lg
                                                transition font-medium
                                                flex items-center justify-center gap-2
                                                ${isArchived
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-blueSite text-white hover:bg-blueSiteHover"
                                            }
                                             `}
                                        onClick={() => {
                                            if (!isArchived) onRenew?.(id);
                                        }}
                                        disabled={isArchived || !onRenew}
                                    >
                                        {isArchived
                                            ? t("usedMarket.actions.renewAfter24h", {
                                                defaultValue: "Renew available after 24h",
                                            })
                                            : t("usedMarket.actions.renew", {
                                                defaultValue: "Renew Ad",
                                            })}

                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}


                        {/* ✅ Pause with Popover */}
                        {canPaused && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {t("usedMarket.actions.pauseInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className="
                                            w-[90%] h-12
                                            rounded-lg
                                            bg-blueSite
                                            text-white
                                            hover:bg-blueSiteHover
                                            transition
                                            font-medium
                                            flex items-center justify-center gap-2
                                            "
                                        onClick={() => onPaused?.(id)}
                                        disabled={!onPaused}
                                    >
                                        {t("usedMarket.actions.paused", { defaultValue: "Pause Ad" })}
                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}


                        {/* ✅ Resume with Popover */}
                        {canResume && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {t("usedMarket.actions.resumeInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className="
                                            w-[90%] h-12
                                            rounded-lg
                                            bg-blueSite
                                            text-white
                                            hover:bg-blueSiteHover
                                            transition
                                            font-medium
                                            flex items-center justify-center gap-2
                                            "
                                        onClick={() => onResume?.(id)}
                                        disabled={!onResume}
                                    >
                                        {t("usedMarket.actions.resume", { defaultValue: "Resume Ad" })}
                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}

                        {canSold && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {t("usedMarket.actions.soldInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className="
                                            w-[90%] h-12
                                            rounded-lg
                                            bg-blueSite
                                            text-white
                                            hover:bg-blueSiteHover
                                            transition
                                            font-medium
                                            flex items-center justify-center gap-2
                                            "
                                        onClick={() => onSold?.(id)}
                                        disabled={!onSold}
                                    >
                                        {t("usedMarket.actions.sold", { defaultValue: "Mark as Sold" })}
                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}



                        {/* ✅ Edit (hidden for reject) */}
                        {canEdit && (
                            <Button
                                type="button"
                                unstyled
                                className="w-[90%] h-12 rounded-lg bg-blueSite text-white hover:bg-blueSiteHover transition font-medium"
                                onClick={() => onEdit(id)}
                            >
                                {t("usedMarket.actions.edit", { defaultValue: "Edit Ad" })}
                            </Button>
                        )}

                        {/* ✅ Delete (always) */}
                        <Button
                            type="button"
                            unstyled
                            className="w-[90%] h-12 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition font-medium"
                            onClick={() => onDelete(id)}
                        >
                            {t("usedMarket.actions.delete", { defaultValue: "Delete Ad" })}
                        </Button>
                    </div>
                </div>
                {/* RIGHT */}
                <div className="w-full md:w-[48%]">
                    <div className="bg-white px-5 py-4">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-6">
                            <div className="w-full inline-flex justify-between">
                                <h2 className="text-[16px] md:text-[18px] font-semibold text-gray-900 leading-snug line-clamp-2">
                                    {ad.title}
                                </h2>

                                <span className="items-center rounded-md">
                                    {renderState(ad.status)}
                                </span>

                            </div>

                            <div className="shrink-0 text-right">
                                <div className="text-[11px] text-gray-500">
                                    {t('usedMarket.price', { defaultValue: 'Price' })}
                                </div>

                                <div className="mt-1 text-[16px] md:text-[18px] font-bold text-blueSite">
                                    {ad.is_free
                                        ? t('usedMarket.filters.free', { defaultValue: 'Free' })
                                        : formatMoney(toNumber(ad.price))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <div className="text-[14px] font-semibold text-blueSite">
                                {t('usedMarket.description', { defaultValue: 'Description:' })}
                            </div>

                            <p className="mt-2 text-[13px] leading-5 text-gray-500">
                                {expanded ? ad.description : String(ad.description ?? '').slice(0, 180)}
                                {!expanded && (ad.description?.length ?? 0) > 180 ? '...' : ''}

                                {(ad.description?.length ?? 0) > 180 && (
                                    <button
                                        type="button"
                                        onClick={() => setExpanded((p) => !p)}
                                        className="ml-2 text-[14px] font-semibold text-blueSite hover:underline"
                                    >
                                        {expanded
                                            ? t('common.readLess', { defaultValue: 'Read less' })
                                            : t('common.readMore', { defaultValue: 'Read More...' })}
                                    </button>
                                )}
                            </p>
                        </div>

                        {/* Meta row */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] font-medium text-blueSite">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <span className="text-gray-700">
                                    {toText(ad.category)}
                                    {ad.subcategory ? ` • ${toText(ad.subcategory)}` : ''}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span className="text-gray-700">
                                    {ad.views_count ?? 0}{" "}
                                    {ad.views_count === 1
                                        ? t('common.viewer', { defaultValue: 'Viewer' })
                                        : t('common.viewers', { defaultValue: 'Viewers' })}
                                </span>
                            </div>

                            {/* ✅ Show ONLY when negotiable */}
                            {showNegotiable ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-3.5 h-3.5 rotate-45 border-2 border-blueSite inline-flex items-center justify-center">
                                        <div className="w-2 h-2 bg-blueSite" />
                                    </div>

                                    <span className="text-gray-700">
                                        {t('usedMarket.case.negotiable', { defaultValue: 'Negotiable' })}
                                    </span>
                                </div>
                            ) : null}

                            <div className="flex items-center gap-2">

                                <Package className="h-4 w-4" />
                                <span className="text-gray-700">
                                    {ad.condition === 'used'
                                        ? t('usedMarket.filters.used', { defaultValue: 'Used' })
                                        : t('usedMarket.filters.new', { defaultValue: 'New' })}
                                </span>
                            </div>
                        </div>

                        <div className="my-4 border-t border-gray-200" />

                        {/* Location */}
                        <div className="flex items-center gap-2 text-[12px] font-semibold text-blueSite">
                            <MapPin className="h-4 w-4" />
                            <span>
                                {toText(countryName)}
                                {ad.region ? ` , ${toText(ad.region)}` : ''}
                            </span>
                        </div>

                        {/* Address (your response has country/region null — keep safe) */}
                        <p className="mt-2 text-[12px] leading-5 text-gray-500">{toText(ad.address, '')}</p>

                        {/* Rejection reason (only if exists) */}
                        {ad.reject_reason ? (
                            <>
                                <div className="my-4 border-t border-gray-200" />
                                <div className="text-[12px] font-semibold text-red-600">
                                    {t('usedMarket.rejectedAds.reason', { defaultValue: 'Reason for rejection:' })}
                                </div>
                                <p className="mt-2 text-[12px] leading-5 text-gray-500">{ad.reject_reason}</p>
                            </>
                        ) : null}
                    </div>

                    {/* Actions for small screens */}
                    <div className="md:hidden mt-4 inline-flex flex-col items-center justify-center space-y-3 w-full ">
                        {/* ✅ Renew with Popover */}
                        {canRenew && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {isArchived
                                            ? t("usedMarket.actions.renewAfter24h", {
                                                defaultValue: "You can renew this ad after 24 hours",
                                            })
                                            : t("usedMarket.actions.renewInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className={`
                                                w-[90%] h-12 rounded-lg
                                                transition font-medium
                                                flex items-center justify-center gap-2
                                                ${isArchived
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-blueSite text-white hover:bg-blueSiteHover"
                                            }
                                             `}
                                        onClick={() => {
                                            if (!isArchived) onRenew?.(id);
                                        }}
                                        disabled={isArchived || !onRenew}
                                    >
                                        {isArchived
                                            ? t("usedMarket.actions.renewAfter24h", {
                                                defaultValue: "Renew available after 24h",
                                            })
                                            : t("usedMarket.actions.renew", {
                                                defaultValue: "Renew Ad",
                                            })}

                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}


                        {/* ✅ Pause with Popover */}
                        {canPaused && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {t("usedMarket.actions.pauseInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className="
                                            w-[90%] h-12
                                            rounded-lg
                                            bg-blueSite
                                            text-white
                                            hover:bg-blueSiteHover
                                            transition
                                            font-medium
                                            flex items-center justify-center gap-2
                                            "
                                        onClick={() => onPaused?.(id)}
                                        disabled={!onPaused}
                                    >
                                        {t("usedMarket.actions.paused", { defaultValue: "Pause Ad" })}
                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}


                        {/* ✅ Resume with Popover */}
                        {canResume && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {t("usedMarket.actions.resumeInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className="
                                            w-[90%] h-12
                                            rounded-lg
                                            bg-blueSite
                                            text-white
                                            hover:bg-blueSiteHover
                                            transition
                                            font-medium
                                            flex items-center justify-center gap-2
                                            "
                                        onClick={() => onResume?.(id)}
                                        disabled={!onResume}
                                    >
                                        {t("usedMarket.actions.resume", { defaultValue: "Resume Ad" })}
                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}

                        {canSold && (
                            <Popover
                                content={
                                    <div className="max-w-[220px] text-sm leading-5">
                                        {t("usedMarket.actions.soldInfo")}
                                    </div>
                                }
                                placement="top"
                                trigger="hover"
                            >
                                <div className="w-full flex justify-center">
                                    <Button
                                        type="button"
                                        unstyled
                                        className="
                                            w-[90%] h-12
                                            rounded-lg
                                            bg-blueSite
                                            text-white
                                            hover:bg-blueSiteHover
                                            transition
                                            font-medium
                                            flex items-center justify-center gap-2
                                            "
                                        onClick={() => onSold?.(id)}
                                        disabled={!onSold}
                                    >
                                        {t("usedMarket.actions.sold", { defaultValue: "Mark as Sold" })}
                                        <Info className="w-4 h-4 opacity-80" />
                                    </Button>
                                </div>
                            </Popover>
                        )}



                        {/* ✅ Edit (hidden for reject) */}
                        {canEdit && (
                            <Button
                                type="button"
                                unstyled
                                className="w-[90%] h-12 rounded-lg bg-blueSite text-white hover:bg-blueSiteHover transition font-medium"
                                onClick={() => onEdit(id)}
                            >
                                {t("usedMarket.actions.edit", { defaultValue: "Edit Ad" })}
                            </Button>
                        )}

                        {/* ✅ Delete (always) */}
                        <Button
                            type="button"
                            unstyled
                            className="w-[90%] h-12 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition font-medium"
                            onClick={() => onDelete(id)}
                        >
                            {t("usedMarket.actions.delete", { defaultValue: "Delete Ad" })}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetails;
