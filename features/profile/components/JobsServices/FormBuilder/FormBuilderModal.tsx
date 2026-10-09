"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Move, Send, Menu, Settings, X } from 'lucide-react';
import { ConfigProvider, Input, Switch } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Modal from '@/components/ui/Modal';
import { FormElement, FormElementType, ELEMENT_TYPE_DEFAULTS, elementsToApiFields, apiFieldsToElements } from './formBuilderTypes';
import DraggableSidebarItem from './DraggableSidebarItem';
import SortableCanvasItem from './SortableCanvasItem';
import FormElementRenderer from './FormElementRenderer';
import FormPreviewModal from './FormPreviewModal';
import FormBuilderSaveModal from './FormBuilderSaveModal';
import useJobsApi from '../useJobsApi';
import { JobTemplate } from '../types';

interface FormBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName?: string;
    editTemplate?: JobTemplate | null;
    onSaved?: () => void;
}

const SIDEBAR_ELEMENTS: { type: FormElementType; labelKey: string; fallback: string }[] = [
    { type: 'short_text', labelKey: 'formBuilder.shortText', fallback: 'Short Text' },
    { type: 'long_text', labelKey: 'formBuilder.longText', fallback: 'Long Text' },
    { type: 'yes_no', labelKey: 'formBuilder.yesNo', fallback: 'Yes / No' },
    { type: 'single_choice', labelKey: 'formBuilder.singleChoice', fallback: 'Single Choice' },
    { type: 'multiple_choice', labelKey: 'formBuilder.multipleChoice', fallback: 'Multiple Choice' },
    { type: 'cv_upload', labelKey: 'formBuilder.cvUpload', fallback: 'CV Upload' },
    { type: 'portfolio_links', labelKey: 'formBuilder.portfolioLinks', fallback: 'Portfolio Links' },
    { type: 'expected_salary', labelKey: 'formBuilder.expectedSalary', fallback: 'Expected Salary' },
    { type: 'number', labelKey: 'formBuilder.number', fallback: 'Number' },
    { type: 'dropdown', labelKey: 'formBuilder.dropdown', fallback: 'Dropdown' },
    { type: 'time', labelKey: 'formBuilder.time', fallback: 'Time' },
    { type: 'date', labelKey: 'formBuilder.date', fallback: 'Date' },
];

/** A droppable gap zone between (or before/after) canvas items */
function DropGap({ id, isActive }: { id: string; isActive: boolean }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`transition-all duration-200 rounded-lg ${isOver
                ? 'h-16 bg-[#E6F0EE]/50 my-2'
                : isActive
                    ? 'h-3 my-1'
                    : 'h-0'
                }`}
        >
            {isOver && (
                <div className="flex items-center justify-center h-full">
                </div>
            )}
        </div>
    );
}

function DroppableCanvas({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
    const { setNodeRef, isOver } = useDroppable({ id: 'canvas-droppable' });
    const { t } = useTranslation();

    return (
        <div ref={setNodeRef} className="flex-1 min-h-[200px] sm:min-h-[300px]">
            {isEmpty ? (
                <div
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center transition-colors min-h-[200px] sm:min-h-[250px] ${isOver
                        ? 'border-[#00664F] bg-[#E6F0EE]/50'
                        : 'border-gray-300 bg-gray-50/50'
                        }`}
                >
                    <Move className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 mb-2 sm:mb-3" />
                    <p className="text-gray-500 text-xs sm:text-sm font-medium text-center px-4">
                        {t('formBuilder.dragFirst', 'Drag Your First Element Here From The Left')}
                    </p>
                </div>
            ) : (
                <div className={`min-h-[200px] sm:min-h-[250px] rounded-xl p-2 sm:p-2 transition-colors ${isOver ? 'bg-[#E6F0EE]/30' : ''}`}>
                    {children}
                </div>
            )}
        </div>
    );
}

const FormBuilderModal: React.FC<FormBuilderModalProps> = ({
    isOpen,
    onClose,
    templateName: defaultTemplateName = 'Name Form',
    editTemplate = null,
    onSaved,
}) => {
    const { t } = useTranslation();
    const { createTemplate, updateTemplate, loading } = useJobsApi();

    const [elements, setElements] = useState<FormElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [saveModalType, setSaveModalType] = useState<'success' | 'error'>('success');
    const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
    const [templateTitle, setTemplateTitle] = useState(defaultTemplateName);
    const [isElementsPanelOpen, setIsElementsPanelOpen] = useState(false);
    const [isCustomizationPanelOpen, setIsCustomizationPanelOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Close panels when switching to desktop
    useEffect(() => {
        if (!isMobile) {
            setIsElementsPanelOpen(false);
            setIsCustomizationPanelOpen(false);
        }
    }, [isMobile]);

    // ─── Populate canvas when editing an existing template ────
    useEffect(() => {
        if (isOpen && editTemplate) {
            setTemplateTitle(editTemplate.title || '');
            if (editTemplate.fields && editTemplate.fields.length > 0) {
                setElements(apiFieldsToElements(editTemplate.fields));
            } else {
                setElements([]);
            }
            setSelectedElementId(null);
        } else if (isOpen && !editTemplate) {
            // Creating new — reset
            setTemplateTitle('');
            setElements([]);
            setSelectedElementId(null);
        }
    }, [isOpen, editTemplate]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const selectedElement = elements.find(el => el.id === selectedElementId) || null;

    const generateId = () => `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const addElementAt = useCallback((type: FormElementType, insertIndex?: number) => {
        const defaults = ELEMENT_TYPE_DEFAULTS[type];
        const newElement: FormElement = {
            id: generateId(),
            type,
            label: defaults.label,
            required: true,
            placeholder: defaults.placeholder,
            options: defaults.options ? [...defaults.options] : undefined,
        };
        setElements(prev => {
            if (insertIndex !== undefined && insertIndex >= 0) {
                const next = [...prev];
                next.splice(insertIndex, 0, newElement);
                return next;
            }
            return [...prev, newElement];
        });
        setSelectedElementId(newElement.id);
        // Close elements panel on mobile after adding
        if (isMobile) {
            setIsElementsPanelOpen(false);
        }
    }, [isMobile]);

    const handleElementClick = useCallback((type: FormElementType) => {
        if (isMobile) {
            addElementAt(type);
        }
    }, [isMobile, addElementAt]);

    const deleteElement = useCallback((id: string) => {
        setElements(prev => prev.filter(el => el.id !== id));
        if (selectedElementId === id) setSelectedElementId(null);
    }, [selectedElementId]);

    const updateElement = useCallback((updated: FormElement) => {
        setElements(prev => prev.map(el => el.id === updated.id ? updated : el));
    }, []);

    const updateSelectedField = useCallback((field: keyof FormElement, value: any) => {
        if (!selectedElementId) return;
        setElements(prev =>
            prev.map(el => el.id === selectedElementId ? { ...el, [field]: value } : el)
        );
    }, [selectedElementId]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        const fromSidebar = event.active.data.current?.fromSidebar;
        setIsDraggingFromSidebar(!!fromSidebar);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setIsDraggingFromSidebar(false);

        if (!over) return;

        // Dragging from sidebar to canvas
        const fromSidebar = active.data.current?.fromSidebar;
        if (fromSidebar) {
            const type = active.data.current?.type as FormElementType;
            const overId = over.id as string;

            if (overId === 'canvas-droppable') {
                // Dropped on empty canvas — append
                addElementAt(type);
            } else if (overId.startsWith('gap-')) {
                // Dropped on a gap zone — parse the index
                const gapIndex = parseInt(overId.replace('gap-', ''), 10);
                addElementAt(type, gapIndex);
            } else {
                // Dropped on an existing element — insert at that position
                const overIndex = elements.findIndex(el => el.id === overId);
                if (overIndex !== -1) {
                    addElementAt(type, overIndex);
                } else {
                    addElementAt(type);
                }
            }
            return;
        }

        // Reordering within canvas
        if (active.id !== over.id) {
            setElements(prev => {
                const oldIndex = prev.findIndex(el => el.id === active.id);
                const newIndex = prev.findIndex(el => el.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return prev;
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = async () => {
        const fields = elementsToApiFields(elements);
        const payload = {
            title: templateTitle || 'Untitled Template',
            category_id: editTemplate?.category_id ?? null,
            is_active: 1,
            fields,
        };

        try {
            if (editTemplate) {
                await updateTemplate(editTemplate.id, payload, { showMessage: true });
            } else {
                await createTemplate(payload, { showMessage: true });
            }
            setSaveModalType('success');
            setIsSaveModalOpen(true);
            onSaved?.();
        } catch {
            setSaveModalType('error');
            setIsSaveModalOpen(true);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                className="!max-w-none !w-[95vw] !h-[95vh] !max-h-[98vh] !rounded-2xl flex flex-col sm:!w-[90vw] lg:!w-[95vw] xl:!max-w-7xl"
                classNameContent="!p-0 flex-1 flex flex-col h-full overflow-hidden"
                showLine={false}
                showCloseButton={!(isElementsPanelOpen || isCustomizationPanelOpen)}
                padding="p-0"
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <ConfigProvider theme={{ token: { colorPrimary: '#00664F' } }}>

                        {/* Main 3-panel layout */}
                        <div className="flex overflow-hidden flex-1 h-full p-2 sm:p-6 gap-2 sm:gap-6 flex-col lg:flex-row pt-14 lg:p-0">
                            {/* Mobile Header with Controls */}
                            {isMobile && (
                                <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setIsElementsPanelOpen(!isElementsPanelOpen);
                                                setIsCustomizationPanelOpen(false);
                                            }}
                                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                                                isElementsPanelOpen 
                                                    ? 'bg-[#00664F] text-white' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Menu className="w-4 h-4" />
                                            <span className="text-sm font-medium">Elements</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCustomizationPanelOpen(!isCustomizationPanelOpen);
                                            setIsElementsPanelOpen(false);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                                            isCustomizationPanelOpen 
                                                ? 'bg-[#00664F] text-white' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="text-sm font-medium">Customize</span>
                                    </button>
                                </div>
                            )}

                            {/* Mobile Backdrop */}
                            {isMobile && (isElementsPanelOpen || isCustomizationPanelOpen) && (
                                <div 
                                    className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
                                    onClick={() => {
                                        setIsElementsPanelOpen(false);
                                        setIsCustomizationPanelOpen(false);
                                    }}
                                />
                            )}

                            {/* Left Sidebar - Form Elements Palette */}
                            <div className={`${isMobile ? 'fixed left-0 top-0 h-full z-50' : ''} ${isElementsPanelOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-full lg:w-[270px] bg-[#00664F] p-2 sm:p-4 flex flex-col overflow-y-auto flex-shrink-0 rounded-[20px] lg:rounded-[20px] order-2 lg:order-1 max-h-[45vh] lg:max-h-none ${isMobile ? 'shadow-xl' : ''}`}>
                                {isMobile && (
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white font-medium text-sm sm:text-md">
                                            {t('formBuilder.formElements', 'Form Elements')}
                                        </h3>
                                        <button
                                            onClick={() => setIsElementsPanelOpen(false)}
                                            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {!isMobile && (
                                    <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                                        <h3 className="text-white font-medium text-sm sm:text-md">
                                            {t('formBuilder.formElements', 'Form Elements')}
                                        </h3>
                                    </div>
                                )}
                                <div className="flex flex-col px-1 pb-4 gap-2 sm:gap-0">
                                    {SIDEBAR_ELEMENTS.map(item => (
                                        <DraggableSidebarItem
                                            key={item.type}
                                            type={item.type}
                                            label={t(item.labelKey, item.fallback)}
                                            onClick={isMobile ? () => handleElementClick(item.type) : undefined}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Center Canvas */}
                            <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-[#FAFAFA] rounded-[20px] order-1 lg:order-2 min-h-[55vh] lg:min-h-0">
                                <div className="mx-auto p-2 sm:p-6">
                                    {/* Editable template title */}
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <Input
                                            value={templateTitle}
                                            onChange={(e) => setTemplateTitle(e.target.value)}
                                            placeholder={t('formBuilder.templateTitle', 'Template Title')}
                                            className="!text-lg sm:!text-xl !font-bold !text-[#00664F] !border-none !shadow-none !bg-transparent !p-0"
                                            variant="borderless"
                                        />
                                    </div>

                                    <div className="mt-6">
                                        <SortableContext
                                            items={elements.map(el => el.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <DroppableCanvas isEmpty={elements.length === 0}>
                                                {/* Gap before first element */}
                                                {elements.length > 0 && isDraggingFromSidebar && (
                                                    <DropGap id="gap-0" isActive={isDraggingFromSidebar} />
                                                )}
                                                {elements.map((element, index) => (
                                                    <React.Fragment key={element.id}>
                                                        <SortableCanvasItem
                                                            element={element}
                                                            isSelected={selectedElementId === element.id}
                                                            onSelect={() => setSelectedElementId(element.id)}
                                                            onDelete={() => deleteElement(element.id)}
                                                        >
                                                            <FormElementRenderer
                                                                element={element}
                                                                onUpdateElement={updateElement}
                                                            />
                                                        </SortableCanvasItem>
                                                        {/* Gap after each element */}
                                                        {isDraggingFromSidebar && (
                                                            <DropGap
                                                                id={`gap-${index + 1}`}
                                                                isActive={isDraggingFromSidebar}
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </DroppableCanvas>
                                        </SortableContext>
                                    </div>

                                    {/* Submit button */}
                                    <div className="mt-6">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex items-center gap-2 bg-[#00664F] text-white px-4 sm:px-8 py-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#005542] transition-colors disabled:opacity-50 w-full sm:w-auto justify-center h-12 sm:h-auto"
                                        >
                                            <Send className="w-4 h-4" />
                                            {loading
                                                ? t('formBuilder.saving', 'Saving...')
                                                : editTemplate
                                                    ? t('formBuilder.update', 'Update')
                                                    : t('formBuilder.submit', 'Submit')
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar - Customization Panel */}
                            <div className={`${isMobile ? 'fixed right-0 top-0 h-full z-50' : ''} ${isCustomizationPanelOpen || !isMobile ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-full lg:w-[280px] p-2 sm:p-4 overflow-y-auto flex-shrink-0 order-3 lg:order-3 max-h-[45vh] lg:max-h-none ${isMobile ? 'shadow-xl bg-white' : ''}`}>
                                {isMobile && (
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[#424242] font-medium text-sm sm:text-md">
                                            {t('formBuilder.customizesForm', 'Customizes Form')}
                                        </h3>
                                        <button
                                            onClick={() => setIsCustomizationPanelOpen(false)}
                                            className="text-gray-600 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {!isMobile && (
                                    <button
                                        onClick={() => setIsPreviewOpen(true)}
                                        className="flex items-center gap-2 bg-[#00664F] text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#005542] transition-colors mb-4 sm:mb-16 w-full sm:w-auto justify-center"
                                    >
                                        <span className="w-5 h-3 rounded-full border-2 border-white relative">
                                            <span className="absolute right-0.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                                        </span>
                                        {t('formBuilder.preview', 'Preview')}
                                    </button>
                                )}
                                <div className="bg-[#E6F0EE] rounded-[20px] py-6 sm:py-16 px-2 sm:px-5 min-h-[200px] sm:min-h-[280px]">
                                    {!isMobile && (
                                        <h3 className="text-sm sm:text-md text-[#424242] mb-3 sm:mb-5">
                                            {t('formBuilder.customizesForm', 'Customizes Form')} :
                                        </h3>
                                    )}

                                    {selectedElement ? (
                                        <div className="flex flex-col gap-3 sm:gap-5">
                                            {/* Field Label */}
                                            <div>
                                                <label className="text-xs font-medium text-[#00664F] mb-1.5 sm:mb-1.5 block">
                                                    {t('formBuilder.fieldLabel', 'Field Label')}
                                                </label>
                                                <Input
                                                    value={selectedElement.label}
                                                    onChange={(e) => updateSelectedField('label', e.target.value)}
                                                    placeholder={t('formBuilder.typeQuestion', 'Type a question')}
                                                    size="middle"
                                                    className="!bg-transparent"
                                                    style={{ borderRadius: 8 }}
                                                />
                                            </div>

                                            {/* Required Toggle */}
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={selectedElement.required}
                                                    onChange={(checked) => updateSelectedField('required', checked)}
                                                    size="small"
                                                    style={{ backgroundColor: selectedElement.required ? '#00664F' : undefined }}
                                                />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {t('formBuilder.required', 'Required')}
                                                </span>
                                            </div>

                                            {/* Placeholder */}
                                            <div>
                                                <label className="text-xs font-medium text-gray-700 mb-1.5 sm:mb-1.5 block">
                                                    {t('formBuilder.placeholder', 'Placeholder')}
                                                </label>
                                                <Input
                                                    value={selectedElement.placeholder}
                                                    onChange={(e) => updateSelectedField('placeholder', e.target.value)}
                                                    placeholder={t('formBuilder.typePlaceholder', 'Type a placeholder')}
                                                    size="middle"
                                                    className="!bg-transparent"
                                                    style={{ borderRadius: 8 }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic text-center px-2">
                                            {t('formBuilder.selectElement', 'Select an element to customize')}
                                        </p>
                                    )}
                                </div>
                                {isMobile && (
                                    <button
                                        onClick={() => setIsPreviewOpen(true)}
                                        className="flex items-center gap-2 bg-[#00664F] text-white px-3 sm:px-5 py-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#005542] transition-colors mt-4 w-full justify-center h-12"
                                    >
                                        <span className="w-5 h-3 rounded-full border-2 border-white relative">
                                            <span className="absolute right-0.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                                        </span>
                                        {t('formBuilder.preview', 'Preview')}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Drag overlay */}
                        <DragOverlay>
                            {activeId && activeId.startsWith('sidebar-') ? (
                                <div className="bg-[#00664F] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl opacity-90">
                                    {SIDEBAR_ELEMENTS.find(s => `sidebar-${s.type}` === activeId)?.fallback}
                                </div>
                            ) : null}
                        </DragOverlay>
                    </ConfigProvider>

                </DndContext>
            </Modal>

            {/* Preview Modal */}
            <FormPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                elements={elements}
                templateName={templateTitle}
            />

            {/* Save Success/Error Modal */}
            <FormBuilderSaveModal
                isOpen={isSaveModalOpen}
                onClose={() => {
                    setIsSaveModalOpen(false);
                    if (saveModalType === 'success') onClose();
                }}
                type={saveModalType}
            />
        </>
    );
};

export default FormBuilderModal;
