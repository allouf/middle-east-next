import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Star, Move, Pencil, StickyNote, StarIcon, SquareCheck, Trash2 } from 'lucide-react';
import { Applicant } from './applicantsTypes';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';

/* ── Context Menu (portaled to body) ── */
interface CardMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: (action: string) => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    openLeft?: boolean;
}

const CardContextMenu: React.FC<CardMenuProps> = ({ isOpen, onClose, onAction, anchorRef, openLeft = false }) => {
    const { t } = useTranslation();
    const {isRTL} = useLocaleDirection();
    const menuRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Calculate + track position from the anchor button
    useEffect(() => {
        if (!isOpen || !anchorRef.current) return;

        const updatePos = () => {
            if (!anchorRef.current) return;
            const rect = anchorRef.current.getBoundingClientRect();
            const menuWidth = menuRef.current ? menuRef.current.offsetWidth : 200;
            setPos({
                top: rect.top,
                left: openLeft&&!isRTL ? rect.left - menuWidth - 8 : rect.right + 8,
            });
        };

        updatePos();

        // Re-calc on scroll (any ancestor) and resize so menu follows the card
        window.addEventListener('scroll', updatePos, true);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [isOpen, anchorRef]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const items = [
        { key: 'labels', icon: <img src="/edit-labels.svg" alt="" className="w-5 h-5" />, color: '#00664F', label: t('applicants.menu.editLabels', { defaultValue: 'Edit Labels' }) },
        { key: 'notes', icon: <img src="/note-add.svg" alt="" className="w-5 h-5" />, color: '#00664F', label: t('applicants.menu.addNotes', { defaultValue: 'Add Notes' }) },
        { key: 'rating', icon: <img src="/add-rate.svg" alt="" className="w-5 h-5" />, color: '#E8B84B', label: t('applicants.menu.addRating', { defaultValue: 'Add Rating' }) },
        { key: 'open', icon: <img src="/open-folder.svg" alt="" className="w-5 h-5" />, color: '#00664F', label: t('applicants.menu.openCard', { defaultValue: 'Open Card' }) },
        { key: 'delete', icon: <img src="/delete.svg" alt="" className="w-5 h-5" />, color: '#E74C3C', label: t('applicants.menu.deleteCard', { defaultValue: 'Delete Card' }) },
    ];

    return createPortal(
        <div
            ref={menuRef}
            className="fixed z-[1000] bg-white rounded-xl shadow-lg border border-gray-100 py-4 px-2 min-w-[200px]"
            style={{ top: pos.top, left: pos.left }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <p className="text-sm text-[#18191C] mb-3 px-3">
                {t('applicants.menu.title', { defaultValue: 'Available procedures :' })}
            </p>

            <div className="flex flex-col">
                {items.map((item, index) => (
                    <React.Fragment key={item.key}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onAction(item.key); onClose(); }}
                            className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left w-full"
                        >
                            <span style={{ color: item.color }}>{item.icon}</span>
                            <span className="text-sm text-[#424242]">{item.label}</span>
                        </button>
                        {index < items.length - 1 && (
                            <div className="border-b border-gray-300 mx-3" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>,
        document.body
    );
};

/* ── Card UI ── */
interface ApplicantCardUIProps {
    applicant: Applicant;
    onClick: (applicant: Applicant) => void;
    onMenuAction?: (action: string, applicant: Applicant) => void;
    isDragging?: boolean;
    isOverlay?: boolean;
    style?: React.CSSProperties;
    setNodeRef?: (node: HTMLElement | null) => void;
    attributes?: Record<string, any>;
    listeners?: Record<string, any>;
}

const ApplicantCardUI: React.FC<ApplicantCardUIProps> = React.memo(({
    applicant,
    onClick,
    onMenuAction,
    isDragging,
    isOverlay,
    style,
    setNodeRef,
    attributes,
    listeners,
}) => {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuBtnRef = useRef<HTMLButtonElement>(null);

    const handleMenuAction = (action: string) => {
        switch (action) {
            case 'open':
                onClick(applicant);
                break;
            default:
                if (onMenuAction) onMenuAction(action, applicant);
                break;
        }
    };

   

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`relative bg-white p-3 rounded-xl border border-gray-200 shadow-sm select-none touch-none ${isDragging ? 'opacity-30' : 'opacity-100'
                } ${isOverlay ? 'cursor-grabbing shadow-xl ring-2 ring-[#00664F]/40 rotate-1' : 'cursor-grab active:cursor-grabbing hover:shadow-md'}`}
            onClick={(e) => {
                e.stopPropagation();
                if (!isDragging && !menuOpen) onClick(applicant);
            }}
        >
            {/* Header row */}
            <div className="flex justify-between items-start mb-1.5">
                <span className="text-[10px] text-gray-400 font-medium">#{applicant.id}</span>
                <button
                    ref={menuBtnRef}
                    className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setMenuOpen(!menuOpen); }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Context Menu */}
            <CardContextMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                onAction={handleMenuAction}
                anchorRef={menuBtnRef}
                openLeft={applicant.status === 'rejected'}
            />

            {/* Name + Rating */}
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">{applicant.name}</h3>
                <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 text-[#00664F] fill-[#00664F]" />
                    <span className="text-xs font-semibold text-[#00664F]">{applicant.rating || 0}</span>
                </div>
            </div>

            {/* CV Upload */}
            {applicant.hasCvUpload && (
                <div className="flex items-center gap-1.5 mb-3">
                    <img src="/FileIcon.svg" alt="file" width={14} height={14} className="mt-0.5 shrink-0" />
                    <span className="text-[11px] font-medium text-gray-400 hover:text-gray-600 underline cursor-pointer truncate">
                        {t('jobs.cvUpload', { defaultValue: 'CV Upload' })}
                    </span>
                </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
                {applicant.tags.map((tag: any, index: number) => (
                    <span
                        key={index}
                        className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: `${tag.color || '#00664F'}15`, color: tag.color || '#00664F' }}
                    >
                        {tag.label || tag.name}
                    </span>
                ))}
            </div>
        </div>
    );
});

ApplicantCardUI.displayName = 'ApplicantCardUI';

// Named export for use in DragOverlay (no sortable hook)
export { ApplicantCardUI };

// Default export: Sortable-wrapped card for use inside columns
interface SortableApplicantCardProps {
    applicant: Applicant;
    onClick: (applicant: Applicant) => void;
    onMenuAction?: (action: string, applicant: Applicant) => void;
}

const SortableApplicantCard: React.FC<SortableApplicantCardProps> = React.memo(({ applicant, onClick, onMenuAction }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: applicant.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <ApplicantCardUI
            applicant={applicant}
            onClick={onClick}
            onMenuAction={onMenuAction}
            isDragging={isDragging}
            setNodeRef={setNodeRef}
            style={style}
            attributes={attributes}
            listeners={listeners}
        />
    );
});

SortableApplicantCard.displayName = 'SortableApplicantCard';

export default SortableApplicantCard;

