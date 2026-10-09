export type FormElementType =
    | 'short_text'
    | 'long_text'
    | 'yes_no'
    | 'single_choice'
    | 'multiple_choice'
    | 'cv_upload'
    | 'portfolio_links'
    | 'expected_salary'
    | 'number'
    | 'dropdown'
    | 'time'
    | 'date';

export interface FormElement {
    id: string;
    type: FormElementType;
    label: string;
    required: boolean;
    placeholder: string;
    options?: string[];
}

export interface FormTemplate {
    id: string;
    name: string;
    elements: FormElement[];
    lastEdited?: string;
}

export const ELEMENT_TYPE_DEFAULTS: Record<FormElementType, { label: string; placeholder: string; options?: string[] }> = {
    short_text: { label: 'Type A Question', placeholder: 'Write an explanation of the question you want....' },
    long_text: { label: 'Type A Question', placeholder: 'Write an explanation of the question you want....' },
    yes_no: { label: 'Type A Question', placeholder: '' },
    single_choice: { label: 'Type A Question', placeholder: '', options: ['Type option 1', 'Type option 2'] },
    multiple_choice: { label: 'Type A Question', placeholder: '', options: ['Type option 1', 'Type option 2'] },
    cv_upload: { label: 'CV Upload', placeholder: '' },
    portfolio_links: { label: 'Portfolio Links', placeholder: 'Please Select...' },
    expected_salary: { label: 'Expected Salary', placeholder: 'ex.3500$' },
    number: { label: 'Number', placeholder: 'ex.25326.434' },
    dropdown: { label: 'Type A Question', placeholder: 'Please Select....', options: ['Type option 1', 'Type option 2'] },
    time: { label: 'Time', placeholder: '' },
    date: { label: 'Date', placeholder: 'Select Date' },
};

// ─── API ↔ Frontend Type Mapping ────────────────────────────

import type { JobTemplateField } from '../types';

/** Map frontend element type → API field type */
const FRONTEND_TO_API: Record<FormElementType, string> = {
    short_text: 'text',
    long_text: 'textarea',
    yes_no: 'checkbox',
    single_choice: 'select',
    multiple_choice: 'multi-select',
    cv_upload: 'file',
    portfolio_links: 'url',
    expected_salary: 'number',
    number: 'number',
    dropdown: 'select',
    time: 'time',
    date: 'date',
};

/** Map API field type → frontend element type */
const API_TO_FRONTEND: Record<string, FormElementType> = {
    text: 'short_text',
    textarea: 'long_text',
    checkbox: 'yes_no',
    select: 'single_choice',
    'multi-select': 'multiple_choice',
    file: 'cv_upload',
    url: 'portfolio_links',
    number: 'number',
    email: 'short_text',
    date: 'date',
    time: 'time',
};

export const toApiFieldType = (t: FormElementType): string => FRONTEND_TO_API[t] || 'text';
export const fromApiFieldType = (t: string): FormElementType => API_TO_FRONTEND[t] || 'short_text';

/** Convert canvas elements → API fields payload */
export const elementsToApiFields = (
    elements: FormElement[]
): Omit<JobTemplateField, 'id'>[] =>
    elements.map((el, idx) => {
        const field: Omit<JobTemplateField, 'id'> = {
            label: el.label,
            type: toApiFieldType(el.type),
            sort_order: idx,
            is_required: el.required ? 1 : 0,
        };
        if (el.options && el.options.length > 0) {
            field.options = el.options;
        }
        return field;
    });

/** Convert API fields → canvas elements */
export const apiFieldsToElements = (fields: JobTemplateField[]): FormElement[] =>
    [...fields]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((field) => {
            let type = fromApiFieldType(field.type);

            // Heuristic: if API stored it as 'text' but the label indicates Time, restore it
            if (field.type === 'text' && field.label?.toLowerCase() === 'time') {
                type = 'time';
            }

            const defaults = ELEMENT_TYPE_DEFAULTS[type];
            return {
                id: `el-${field.id ?? Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                type,
                label: field.label || defaults.label,
                required: !!field.is_required,
                placeholder: defaults.placeholder,
                options: field.options ?? defaults.options,
            };
        });
