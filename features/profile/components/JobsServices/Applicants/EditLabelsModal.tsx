"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { X, Plus, Check, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Applicant } from './applicantsTypes';

interface Label {
    id: string;
    text: string;
    color: string;
    textColor: string;
}

interface EditLabelsModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: Applicant | null;
    allLabels: Label[];
    onSave: (applicantId: string | number, selectedLabelIds: string[]) => Promise<void> | void;
    jobId?: string | number | null;
    onCreateTag?: (name: string, color: string) => Promise<void>;
    onUpdateTag?: (id: string | number, name: string, color: string) => Promise<void>;
    onDeleteTag?: (id: string | number) => Promise<void>;
}

const TAG_COLOR_OPTIONS = ['#D6A439', '#E14C8E', '#123F84', '#39A81D', '#8B5CF6', '#EF4444', '#F97316', '#06B6D4'];

const EditLabelsModal: React.FC<EditLabelsModalProps> = ({
    isOpen,
    onClose,
    applicant,
    allLabels,
    onSave,
    jobId,
    onCreateTag,
    onUpdateTag,
    onDeleteTag,
}) => {
    const { t } = useTranslation();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(TAG_COLOR_OPTIONS[0]);

    const [editingTagId, setEditingTagId] = useState<string | null>(null);
    const [editTagName, setEditTagName] = useState('');
    const [editTagColor, setEditTagColor] = useState(TAG_COLOR_OPTIONS[0]);

    useEffect(() => {
        if (isOpen && applicant) {
            const currentIds = (applicant.tags || []).map(tag => String(tag.id));
            setSelectedIds(currentIds);
            setIsCreating(false);
            setNewTagName('');
            setNewTagColor(TAG_COLOR_OPTIONS[0]);
            setEditingTagId(null);
        }
    }, [isOpen, applicant]);

    const toggleLabel = (id: string) => {
        if (editingTagId === id) return; // don't toggle while editing
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!applicant) return;
        setIsLoading(true);
        try {
            await onSave(applicant.id, selectedIds);
            onClose();
        } catch (error) {
            console.error("Failed to save labels", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim() || !onCreateTag) return;
        setIsLoading(true);
        try {
            await onCreateTag(newTagName.trim(), newTagColor);
            setNewTagName('');
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to create tag", error);
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (label: Label, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingTagId(label.id);
        setEditTagName(label.text);
        setEditTagColor(label.textColor || TAG_COLOR_OPTIONS[0]);
        setIsCreating(false);
    };

    const handleUpdateTag = async (id: string) => {
        if (!editTagName.trim() || !onUpdateTag) return;
        setIsLoading(true);
        try {
            await onUpdateTag(id, editTagName.trim(), editTagColor);
            setEditingTagId(null);
        } catch (error) {
            console.error("Failed to update tag", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTag = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onDeleteTag) return;
        setIsLoading(true);
        try {
            await onDeleteTag(id);
            setSelectedIds(prev => prev.filter(sid => sid !== id));
            if (editingTagId === id) setEditingTagId(null);
        } catch (error) {
            console.error("Failed to delete tag", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!applicant) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={460}
            closeIcon={<X className="w-5 h-5 text-gray-500" />}
            className="edit-labels-modal [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-2xl overflow-hidden"
            centered
        >
            <div className="p-6">
                {/* Header */}
                <h2 className="text-lg font-semibold text-[#00664F] mb-1">
                    {t('applicants.editLabels.title', { defaultValue: 'Edit Labels' })}
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                    {t('applicants.editLabels.subtitle', { defaultValue: 'Select labels for this applicant' })}
                </p>

                {/* Labels list */}
                <div className="flex flex-col gap-2 mb-5 max-h-[280px] overflow-y-auto pr-1">
                    {allLabels.length === 0 && !isCreating && (
                        <p className="text-sm text-gray-400 text-center py-4">
                            {t('applicants.editLabels.noLabels', { defaultValue: 'No labels yet. Create one below.' })}
                        </p>
                    )}
                    {allLabels.map((label) => {
                        const isSelected = selectedIds.includes(label.id);
                        const isEditing = editingTagId === label.id;

                        if (isEditing) {
                            return (
                                <div key={label.id} className="border border-[#00664F]/40 rounded-lg p-3 bg-[#00664F]/5">
                                    <input
                                        type="text"
                                        value={editTagName}
                                        onChange={(e) => setEditTagName(e.target.value)}
                                        placeholder={t('applicants.editLabels.tagNamePlaceholder', { defaultValue: 'Tag name...' })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-[#00664F] transition-colors mb-3"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex gap-2 mb-3">
                                        {TAG_COLOR_OPTIONS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={(e) => { e.stopPropagation(); setEditTagColor(color); }}
                                                className={`w-6 h-6 rounded-full transition-transform ${editTagColor === color ? 'ring-2 ring-offset-1 ring-[#00664F] scale-110' : ''}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleUpdateTag(label.id); }}
                                            disabled={!editTagName.trim() || isLoading}
                                            className="bg-[#00664F] hover:bg-[#005542] text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                        >
                                            {t('common.save', { defaultValue: 'Save' })}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditingTagId(null); }}
                                            className="text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors"
                                        >
                                            {t('common.cancel', { defaultValue: 'Cancel' })}
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={label.id}
                                className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border transition-all ${isSelected
                                    ? 'border-[#00664F] bg-[#00664F]/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {/* Clickable label area */}
                                <button
                                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                    onClick={() => toggleLabel(label.id)}
                                >
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: label.textColor }}
                                    />
                                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                                        {label.text}
                                    </span>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-[#00664F] shrink-0" />
                                    )}
                                </button>

                                {/* Edit & Delete action buttons */}
                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {onUpdateTag && (
                                        <button
                                            onClick={(e) => startEditing(label, e)}
                                            title={t('common.edit', { defaultValue: 'Edit' })}
                                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[#00664F] transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    {onDeleteTag && (
                                        <button
                                            onClick={(e) => handleDeleteTag(label.id, e)}
                                            title={t('common.delete', { defaultValue: 'Delete' })}
                                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Create new tag section */}
                {isCreating ? (
                    <div className="border border-gray-200 rounded-lg p-3 mb-5">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder={t('applicants.editLabels.tagNamePlaceholder', { defaultValue: 'Tag name...' })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-[#00664F] transition-colors mb-3"
                            autoFocus
                        />
                        <div className="flex gap-2 mb-3">
                            {TAG_COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setNewTagColor(color)}
                                    className={`w-6 h-6 rounded-full transition-transform ${newTagColor === color ? 'ring-2 ring-offset-1 ring-[#00664F] scale-110' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateTag}
                                disabled={!newTagName.trim() || isLoading}
                                className="bg-[#00664F] hover:bg-[#005542] text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                {t('common.create', { defaultValue: 'Create' })}
                            </button>
                            <button
                                onClick={() => { setIsCreating(false); setNewTagName(''); }}
                                className="text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors"
                            >
                                {t('common.cancel', { defaultValue: 'Cancel' })}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => { setIsCreating(true); setEditingTagId(null); }}
                        className="flex items-center gap-2 text-sm text-[#00664F] hover:text-[#005542] font-medium mb-5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t('applicants.editLabels.createNew', { defaultValue: 'Create New Label' })}
                    </button>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-[#00664F] hover:bg-[#005542] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? t('common.saving', { defaultValue: 'Saving...' }) : t('common.save', { defaultValue: 'Save' })}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                    >
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditLabelsModal;

