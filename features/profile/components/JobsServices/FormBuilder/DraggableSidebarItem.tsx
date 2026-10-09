"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FormElementType } from './formBuilderTypes';
import {
    Type, AlignLeft, ToggleLeft, CircleDot, CheckSquare,
    Upload, Link, DollarSign, Hash, ChevronDown, Clock, Calendar
} from 'lucide-react';

interface DraggableSidebarItemProps {
    type: FormElementType;
    label: string;
    onClick?: () => void;
}

const ELEMENT_ICONS: Record<FormElementType, React.ReactNode> = {
    short_text: <Type className="w-4 h-4 sm:w-4 sm:h-4" />,
    long_text: <AlignLeft className="w-4 h-4 sm:w-4 sm:h-4" />,
    yes_no: <ToggleLeft className="w-4 h-4 sm:w-4 sm:h-4" />,
    single_choice: <CircleDot className="w-4 h-4 sm:w-4 sm:h-4" />,
    multiple_choice: <CheckSquare className="w-4 h-4 sm:w-4 sm:h-4" />,
    cv_upload: <Upload className="w-4 h-4 sm:w-4 sm:h-4" />,
    portfolio_links: <Link className="w-4 h-4 sm:w-4 sm:h-4" />,
    expected_salary: <DollarSign className="w-4 h-4 sm:w-4 sm:h-4" />,
    number: <Hash className="w-4 h-4 sm:w-4 sm:h-4" />,
    dropdown: <ChevronDown className="w-4 h-4 sm:w-4 sm:h-4" />,
    time: <Clock className="w-4 h-4 sm:w-4 sm:h-4" />,
    date: <Calendar className="w-4 h-4 sm:w-4 sm:h-4" />,
};

const DraggableSidebarItem: React.FC<DraggableSidebarItemProps> = ({ type, label, onClick }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: { type, fromSidebar: true },
    });

    const handleClick = (e: React.MouseEvent) => {
        // Prevent drag when clicking on mobile
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            className={`flex items-center gap-3 px-3 py-3 sm:px-2 sm:py-2 cursor-grab active:cursor-grabbing rounded-lg transition-all text-white/90 hover:bg-white/10 min-h-[44px] sm:min-h-[40px] ${isDragging ? 'opacity-50' : ''
                } ${onClick ? 'sm:cursor-grab sm:active:cursor-grabbing cursor-pointer' : ''}`}
        >
            <span className="w-8 h-8 sm:w-8 sm:h-8 rounded-md border border-white/30 flex items-center justify-center flex-shrink-0">
                {ELEMENT_ICONS[type]}
            </span>
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
};

export default DraggableSidebarItem;
export { ELEMENT_ICONS };
