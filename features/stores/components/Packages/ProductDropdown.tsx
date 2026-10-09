'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

/* =========================
   Utils
========================= */

type ProductLite = {
    id: number | string;
    name?: string;
    gallery?: Array<{ file_path?: string }>;
    image?: string;
};

export const getProductImage = (p?: ProductLite | null) =>
    p?.gallery?.[0]?.file_path || p?.image || 'https://placehold.co/40x40?text=P';

export function useOutsideClick<T extends HTMLElement>(
    onOutside: () => void,
    enabled: boolean
) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const handler = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) onOutside();
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [enabled, onOutside]);

    return ref;
}

/* =========================
   Reusable Dropdown
========================= */

type ProductDropdownProps = {
    label: string;
    disabled?: boolean;

    valueId: number | null;
    products: ProductLite[];
    loading?: boolean;

    searchValue: string;
    onSearchChange: (v: string) => void;

    onSelect: (id: number | null) => void;
    formErrors?: Record<string, string>;

    placeholder?: string;
    noneLabel?: string;
    noResultsLabel?: string;

    // optional right-side action (ex: trash)
    rightAction?: React.ReactNode;
    required?: boolean;
    validate?: boolean;
    isSubmited?: boolean;
};

export const ProductDropdown: React.FC<ProductDropdownProps> = ({
    label,
    disabled = false,

    valueId,
    products,
    loading = false,

    searchValue,
    onSearchChange,

    onSelect,
    formErrors = {},
    placeholder = 'Search...',
    noneLabel = 'None',
    noResultsLabel = 'No products found',
    rightAction,
    required = false,
    validate = false,
    isSubmited = false,
}) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const selected = useMemo(
        () => products.find((p) => Number(p.id) === Number(valueId)) || null,
        [products, valueId]
    );

    const wrapRef = useOutsideClick<HTMLDivElement>(() => setOpen(false), open);

    return (
        <div>
            <fieldset className="bg-white border rounded-lg  h-[85px]">
                <legend className="px-2 mx-2 text-sm md:text-base font-semibold text-subTitleColor">
                    {label}
                </legend>

                <div className="relative" ref={wrapRef}>
                    <button
                        type="button"
                        onClick={() => !disabled && setOpen((v) => !v)}
                        disabled={disabled}
                        className={`w-full flex items-center justify-between gap-3 p-3
            ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}
          `}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {selected ? (
                                <>
                                    <img
                                        src={getProductImage(selected)}
                                        alt={selected?.name || 'product'}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium truncate">{selected?.name}</span>
                                </>
                            ) : (
                                <span className="text-sm text-textColor">{t('common.selectProduct')}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {rightAction}
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </button>

                    {open && (
                        <div className="absolute  left-0 right-0 top-full mt-2 z-[50] border rounded-lg shadow-lg bg-white overflow-hidden">
                            <div className="flex items-center gap-2 bg-bgGray mx-2 my-2 rounded-full py-2 px-4">
                                <input
                                    type="text"
                                    placeholder={placeholder}
                                    value={searchValue}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full outline-none text-sm bg-transparent"
                                />
                                <Search className="w-4 h-4 text-textColor" />
                            </div>

                            <div className="max-h-[200px] overflow-auto p-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(null);
                                        setOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md border mb-2 text-sm
                  ${valueId === null ? 'border-blueSite bg-[#E6F0ED]' : 'border-gray-200 hover:bg-gray-50'}
                `}
                                >
                                    {noneLabel}
                                </button>

                                {loading ? (
                                    <div className="space-y-2 px-2 py-2">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : products.length ? (
                                    products.map((p) => {
                                        const active = Number(valueId) === Number(p.id);
                                        return (
                                            <button
                                                key={String(p.id)}
                                                type="button"
                                                onClick={() => {
                                                    onSelect(Number(p.id));
                                                    setOpen(false);
                                                }}
                                                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md border mb-2
                        ${active ? 'border-blueSite bg-[#E6F0ED]' : 'border-gray-200 hover:bg-gray-50'}
                      `}
                                            >
                                                <img
                                                    src={getProductImage(p)}
                                                    alt={p?.name || 'product'}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <span className="text-sm font-medium">{p?.name}</span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-textColor px-3 py-3">{noResultsLabel}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </fieldset>


            {isSubmited && !selected && (
                <p className="text-red-500 text-xs mt-1">
                    {t('errorRequired')}
                </p>
            )}
        </div>
    );
};
