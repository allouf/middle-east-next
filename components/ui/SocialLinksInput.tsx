'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';
import { Modal, Input } from 'antd';
import {
    Instagram,
    Facebook,
    Youtube,
    Globe,
    MessageCircle,
    Music2,
    Github,
    X,
    Search,
    ChevronDown,
    LinkedinIcon,
    Pencil,
    Plus,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

type SocialKey =
    | 'instagram'
    | 'facebook'
    | 'x'
    | 'tiktok'
    | 'youtube'
    | 'linkedin'
    | 'whatsapp'
    | 'github'
    | 'website';

export type SocialLinkItem = {
    platform: SocialKey;
    url: string;
};

type Props = {
    id: string;
    label: string;
    required?: boolean;
    className?: string;
    values?: SocialLinkItem[] | string[];
    onChange: (next: SocialLinkItem[]) => void;
    disabled?: boolean;
    validate?: boolean;
    isSubmited?: boolean;
    handleAddError?: (id: string, message?: string) => void;
    formErrors?: Record<string, string | undefined>;
};

type SocialOption = {
    key: SocialKey;
    label: string;
    icon: React.ReactNode;
};

const iconStyle: React.CSSProperties = { color: 'var(--SiteColor)' };

const SOCIAL_OPTIONS = (t: any): SocialOption[] => [
    { key: 'instagram', label: t('social_links.platforms.instagram'), icon: <Instagram size={18} color="#E4405F" /> },
    { key: 'facebook', label: t('social_links.platforms.facebook'), icon: <Facebook size={18} color="#1877F2" /> },
    { key: 'x', label: t('social_links.platforms.x'), icon: <X size={18} color="#000000" /> },
    { key: 'tiktok', label: t('social_links.platforms.tiktok'), icon: <Music2 size={18} color="#000000" /> },
    { key: 'youtube', label: t('social_links.platforms.youtube'), icon: <Youtube size={18} color="#FF0000" /> },
    { key: 'linkedin', label: t('social_links.platforms.linkedin'), icon: <LinkedinIcon size={18} color="#0A66C2" /> },
    { key: 'whatsapp', label: t('social_links.platforms.whatsapp'), icon: <MessageCircle size={18} color="#25D366" /> },
    { key: 'github', label: t('social_links.platforms.github'), icon: <Github size={18} color="#181717" /> },
    { key: 'website', label: t('social_links.platforms.website'), icon: <Globe size={18} color="#6B7280" /> },
];

function normalizeUrl(raw: string) {
    const v = raw.trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
}

function isValidUrl(raw: string) {
    try {
        const u = new URL(normalizeUrl(raw));
        return !!u.hostname;
    } catch {
        return false;
    }
}

function isDuplicate(values: SocialLinkItem[], platform: SocialKey, url: string) {
    const normalized = normalizeUrl(url).toLowerCase();
    return values.some(
        (x) => x.platform === platform && normalizeUrl(x.url).toLowerCase() === normalized
    );
}

/** ✅ Fieldset/legend */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <fieldset className="rounded-xl border border-gray-300 px-4 py-3">
            <legend className="px-2 text-[14px] font-semibold text-[var(--SiteColor)]">{label}</legend>
            {children}
        </fieldset>
    );
}


function toItems(raw: SocialLinkItem[] | string[] | undefined): SocialLinkItem[] {
    if (!Array.isArray(raw)) return [];
    if (raw.length === 0) return [];

    if (typeof raw[0] === 'string') {
        return (raw as string[]).map((u) => ({
            platform: 'website', // ✅ old items default to Globe/website
            url: String(u),
        }));
    }

    return raw as SocialLinkItem[];
}



function PlatformPickerModal({
    open,
    onClose,
    selected,
    onSelect,
    disabled,
    t,
}: {
    open: boolean;
    onClose: () => void;
    selected: SocialKey;
    onSelect: (k: SocialKey) => void;
    disabled?: boolean;
    t: any;
}) {
    const [q, setQ] = useState('');
    const options = useMemo(() => SOCIAL_OPTIONS(t), [t]);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return options;
        return options.filter((x) => x.label.toLowerCase().includes(s));
    }, [q, options]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={420}
            closeIcon={<X size={18} />}
            styles={{ content: { borderRadius: 16, padding: 14 } }}
        >
            <div className="space-y-3 mt-4">
                <div className="relative p-2">
                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={16} />
                    </span>

                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={t('social_links.search_placeholder')}
                        disabled={disabled}
                        className="!h-[42px] !rounded-xl !pl-[2rem]"
                    />
                </div>

                <div className="max-h-[360px] overflow-auto rounded-xl border border-gray-200 bg-white">
                    {filtered.map((opt) => {
                        const active = opt.key === selected;
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                disabled={disabled}
                                onClick={() => {
                                    onSelect(opt.key);
                                    onClose();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-start transition
                  ${active ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}
                  border-b border-gray-100 last:border-b-0
                  ${disabled ? 'opacity-60 cursor-not-allowed hover:bg-white' : ''}`}
                            >
                                <span className="shrink-0">{opt.icon}</span>
                                <span className="text-[14px] text-subTitleColor">{opt.label}</span>
                            </button>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                            {t('social_links.no_results')}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

const SocialLinksInput: React.FC<Props> = ({
    id,
    label,
    required = false,
    className = '',
    values,
    onChange,
    disabled = false,
    validate = false,
    handleAddError, isSubmited = false,
    formErrors = {},
}) => {
    // ✅ Always work with a safe array
    const safeValues = useMemo(() => toItems(values), [values]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const { t } = useTranslation();
    const options = useMemo(() => SOCIAL_OPTIONS(t), [t]);

    // ✅ Always emit a brand-new array (and new objects) so parent updates reliably
    const emitChange = useCallback(
        (next: SocialLinkItem[]) => {
            const cloned = next.map((x) => ({ ...x })); // new item refs
            onChange([...cloned]); // new array ref
        },
        [onChange]
    );

    const [open, setOpen] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);

    const [platform, setPlatform] = useState<SocialKey>('instagram');
    const [url, setUrl] = useState('');
    const [localError, setLocalError] = useState('');

    const hasValues = safeValues.length > 0;
    const showRequiredError =
        isSubmited && (validate && !hasValues && (formErrors[id] || (required && safeValues.length === 0)));

    const selectedMeta = useMemo(
        () => options.find((x) => x.key === platform),
        [platform, options]
    );

    const runValidation = useCallback(
        (nextUrl: string) => {
            if (!validate) return true;

            if (!nextUrl.trim()) {
                const msg = t('social_links.errors.required');
                setLocalError(msg);
                handleAddError?.(id, msg);
                return false;
            }

            if (!isValidUrl(nextUrl)) {
                const msg = t('social_links.errors.invalid');
                setLocalError(msg);
                handleAddError?.(id, msg);
                return false;
            }

            setLocalError('');
            handleAddError?.(id, '');
            return true;
        },
        [handleAddError, id, validate]
    );

    const handleAdd = useCallback(() => {
        if (disabled) return;

        const trimmed = url.trim();
        if (!trimmed) return;

        const ok = runValidation(trimmed);
        if (!ok) return;

        // prevent duplicates (ignore same index when editing)
        const duplicated = safeValues.some((x, i) => {
            if (editIndex !== null && i === editIndex) return false;
            return x.platform === platform && normalizeUrl(x.url).toLowerCase() === normalizeUrl(trimmed).toLowerCase();
        });

        if (duplicated) {
            const msg = t('social_links.errors.duplicate');
            setLocalError(msg);
            handleAddError?.(id, msg);
            return;
        }

        const normalized = normalizeUrl(trimmed);

        // ✅ editing existing item
        if (editIndex !== null) {
            const next = safeValues.map((x, i) =>
                i === editIndex ? { platform, url: normalized } : x
            );
            emitChange(next);

            setEditIndex(null);
            setUrl('');
            setLocalError('');
            handleAddError?.(id, '');
            return;
        }

        // ✅ adding new item
        const next: SocialLinkItem[] = [...safeValues, { platform, url: normalized }];
        emitChange(next);

        setUrl('');
        setLocalError('');
        handleAddError?.(id, '');
    }, [
        disabled,
        editIndex,
        emitChange,
        handleAddError,
        id,
        platform,
        runValidation,
        safeValues,
        url,
    ]);



    const startEdit = useCallback(
        (index: number) => {
            if (disabled) return;
            const item = safeValues[index];
            if (!item) return;

            setPlatform(item.platform ?? 'website');
            setUrl(item.url ?? '');
            setEditIndex(index);
            setOpen(true);
            setLocalError('');
            handleAddError?.(id, '');
        },
        [disabled, handleAddError, id, safeValues]
    );

    const openModal = useCallback(() => {
        if (disabled) return;
        setOpen(true);
        setLocalError('');
        handleAddError?.(id, '');
    }, [disabled, handleAddError, id]);

    const closeModal = useCallback(() => {
        setOpen(false);
        setPickerOpen(false);
        setLocalError('');
        setEditIndex(null);   // ✅ reset edit
        setUrl('');           // ✅ clear input
    }, []);


    const removeItem = useCallback(
        (index: number) => {
            if (disabled) return;
            const next = safeValues.filter((_, i) => i !== index);
            emitChange(next);
            if (next.length > 0) handleAddError?.(id, '');
            if (next.length === 0 && required && validate) handleAddError?.(id, 'Required');
        },
        [disabled, emitChange, handleAddError, id, required, safeValues, validate]
    );

    return (
        <div className={`w-full ${className}`}>
            <fieldset
                disabled={disabled}
                className={`
    w-full rounded-md border border-blueSiteHover bg-white transition
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300'}
  `}
            >
                <legend className="mx-2 px-3 text-[14px] font-semibold text-[var(--SiteColor)]">
                    {label}
                </legend>

                <button
                    type="button"
                    onClick={openModal}
                    disabled={disabled}
                    className="w-full text-start px-4 py-3 focus:outline-none"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[14px] text-blueSite font-medium flex items-center gap-2">
                            {safeValues.length ? (
                                <>
                                    <Pencil size={16} className="opacity-70" />
                                    {t('social_links.links_count', { count: safeValues.length })}
                                </>
                            ) : (
                                <>
                                    <Plus size={16} className="opacity-70" />
                                    {t('social_links.add')}
                                </>
                            )}
                        </span>
                    </div>
                </button>
                {safeValues.length > 0 && (
                    <div className="mt-3 flex flex-col rounded-xl overflow-hidden border border-gray-100">
                        {safeValues.map((item, idx) => {
                            const rowMeta = options.find((x) => x.key === item.platform);

                            return (
                                <div
                                    key={`${item.platform}-${item.url}-${idx}`}
                                    className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 last:border-b-0 bg-white"
                                >
                                    <span className="shrink-0">
                                        {rowMeta?.icon ?? <Globe size={18} style={iconStyle} />}
                                    </span>

                                    <div className="min-w-0 flex-1 flex flex-col">
                                        <p className="text-[13px] font-semibold text-subTitleColor">
                                            {rowMeta?.label ?? item.platform}
                                        </p>
                                        <p className="text-[12px] text-gray-500 truncate">
                                            {(item.url?.length ?? 0) > 60 ? `${item.url.slice(0, 60)}...` : item.url}
                                        </p>
                                    </div>

                                    {/* Edit */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // ✅ prevent openModal
                                            startEdit(idx);
                                        }}
                                        disabled={disabled}
                                        className={`
                  p-2 rounded-lg transition hover:bg-gray-100
                  ${disabled ? 'opacity-60 cursor-not-allowed hover:bg-transparent' : ''}
                `}
                                        aria-label="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </fieldset>

            {showRequiredError &&

                <p className="text-red-500 text-xs mt-1">
                    {formErrors?.[id] || t("errorRequired")}
                </p>
            }

            <Modal
                open={open}
                onCancel={closeModal}
                footer={null}
                centered
                width={420}
                closeIcon={<X size={18} />}
                styles={{ content: { borderRadius: 8, padding: 28 } }}
            >
                <div className="space-y-5">
                    <h2 className="text-[18px] font-semibold text-blueSite leading-snug">
                        {t('social_links.modal_title')}
                    </h2>

                    <Field label={t('social_links.platform')}>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => setPickerOpen(true)}
                            className={`w-full flex items-center justify-between gap-3 text-[15px] text-blueSite
                ${disabled ? 'cursor-not-allowed' : ''}`}
                        >
                            <span className={`flex items-center gap-2 ${selectedMeta ? 'text-blueSite' : 'text-gray-400'}`}>
                                <span className="shrink-0">
                                    {selectedMeta?.icon ?? <Globe size={18} style={iconStyle} />}
                                </span>
                                <span className="truncate">{selectedMeta?.label ?? t('social_links.select_platform')}</span>
                            </span>
                            <ChevronDown size={18} className="opacity-60" />
                        </button>
                    </Field>

                    <Field label={t('social_links.link')}>
                        <Input
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                if (validate) runValidation(e.target.value);
                            }}
                            onPressEnter={(e) => {
                                e.preventDefault();
                                handleAdd();
                            }}
                            disabled={disabled}
                            placeholder={t('social_links.link_placeholder')}
                            className="p-2 !border-none [&_.ant-input]:!shadow-none [&_.ant-input]:!px-0
                [&_.ant-input]:!text-[14px] [&_.ant-input]:placeholder:!text-gray-400"
                        />
                    </Field>

                    {localError && validate && <p className="text-red-500 text-xs">{localError}</p>}

                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={disabled || !url.trim() || (!!localError && validate)}
                        className={`w-full p-2 h-[50px] rounded-xl text-white text-[16px] font-semibold transition
              bg-[var(--SiteColor)] hover:opacity-95 active:opacity-95 disabled:cursor-not-allowed`}
                    >
                        {t('social_links.add_button')}
                    </button>

                    {safeValues.length > 0 && (
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            {safeValues.map((item, idx) => {
                                const rowMeta = options.find((x) => x.key === item.platform);
                                return (
                                    <div
                                        key={`${item.platform}-${item.url}-${idx}`}
                                        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 bg-white"
                                    >
                                        <span className="shrink-0">
                                            {rowMeta?.icon ?? <Globe size={18} style={iconStyle} />}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-semibold text-subTitleColor">
                                                {rowMeta?.label ?? item.platform}
                                            </p>
                                            <p className="text-[12px] text-gray-500 truncate">{item.url}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => startEdit(idx)}
                                            disabled={disabled}
                                            className={`p-2 rounded-lg hover:bg-gray-100 transition ${disabled ? 'opacity-60 cursor-not-allowed hover:bg-transparent' : ''
                                                }`}
                                            aria-label="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            disabled={disabled}
                                            className={`p-2 rounded-lg hover:bg-gray-100 transition ${disabled ? 'opacity-60 cursor-not-allowed hover:bg-transparent' : ''
                                                }`}
                                            aria-label="Remove"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

                <PlatformPickerModal
                    open={pickerOpen}
                    onClose={() => setPickerOpen(false)}
                    selected={platform}
                    onSelect={(k) => setPlatform(k)}
                    disabled={disabled}
                    t={t}
                />
            </Modal>
        </div>
    );
};

export default memo(SocialLinksInput);
