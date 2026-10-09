"use client";

import React, { useState } from 'react';
import { Edit3, Trash2, ChevronDown, GripVertical } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import DetailActionBtn from '../Shared/DetailActionBtn';

interface FAQ {
    id: string;
    question: string;
    answer: string;
}

interface FAQCardProps {
    faq: FAQ;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    showDragHandle?: boolean;
    onDragStart?: (e: React.DragEvent, index: number) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent, index: number) => void;
    onDragEnd?: () => void;
}

const FAQCard: React.FC<FAQCardProps> = ({
    faq,
    index,
    onEdit,
    onDelete,
    showDragHandle = true,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
}) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            className="border border-[#E9E9E9] rounded-lg bg-white hover:shadow-sm transition-shadow"
            draggable={showDragHandle}
            onDragStart={(e) => onDragStart?.(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop?.(e, index)}
            onDragEnd={onDragEnd}
        >
            <div className="flex items-start ">

                <div className="flex-1">
                    <div
                        className="flex items-center justify-between gap-2 text-sm font-semibold text-[#353635] bg-[#F8F9FA] p-2 cursor-pointer"
                        onClick={toggleExpanded}
                    >
                        {showDragHandle && (
                            <div className="flex items-center  h-full w-10 justify-center cursor-grab active:cursor-grabbing">
                                <GripVertical size={20} className="text-gray-400" />
                            </div>
                        )}
                        <div className="flex items-center gap-2 flex-1">

                            <span>{faq.question}</span>
                        </div>

                        <div className="flex gap-2 ml-4">
                            <DetailActionBtn
                                icon={<Edit3 size={16} className="text-[#00664F]" />}
                                onClick={() => onEdit(index)}
                            />
                            <DetailActionBtn
                                icon={<Trash2 size={16} className="text-[#BF2033]" />}
                                onClick={() => onDelete(index)}
                            />
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </div>
                    {isExpanded && (
                        <p className="text-sm text-[#353635]/90 leading-relaxed p-3 rounded-md">
                            {faq.answer}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default FAQCard;
