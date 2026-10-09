"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { FormElement } from './formBuilderTypes';

interface SortableCanvasItemProps {
    element: FormElement;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    children: React.ReactNode;
}

const SortableCanvasItem: React.FC<SortableCanvasItemProps> = ({
    element,
    isSelected,
    onSelect,
    onDelete,
    children,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: element.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 `}
            onClick={onSelect}
        >
            {/* Form element content */}
            <div className={`flex-1 border rounded-lg p-3 sm:p-4 transition-all ${isSelected ? 'border-[#00664F] bg-[#f5f7f7]' : 'border-[#f5f7f7]'
                }`}>
                {children}
            </div>

            {/* Actions column */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 pt-3 sm:pt-4">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1.5 sm:p-1 text-gray-400 hover:text-gray-600 touch-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Delete button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1.5 sm:p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
            </div>
        </div>
    );
};

export default SortableCanvasItem;
