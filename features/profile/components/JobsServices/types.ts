import { JobStatus } from "./enums";

export interface JobCategory {
    id: number;
    name: string;
}

export interface Job {
    id: number | string;
    title: string;
    employment_type?: string;
    experience_level?: string;
    country_code?: string;
    region?: string;
    work_mode: string;
    description?: string;
    salary_min?: string;
    salary_max?: string;
    hide_salary?: boolean;
    application_deadline?: string;
    expires_at?: string;
    expires_in_days?: number;
    status?: string;
    state?: JobStatus;
    application_link?: string | null;
    job_template_id?: number | null;
    employer_id?: number;
    category_id?: number;
    job_template?: {
        id: number;
        title: string;
        employer_id?: number;
        is_system_template?: boolean;
        is_active?: boolean;
        fields?: any[];
    } | null;
    category?: string | { id: number; name: string; slug?: string };
    currency?: string;
    salary?: string;
    application_date?: string;
    visibility?: string;
    expiry_date?: string;
    location?: string;
    visibility_duration?: string;
    created_at?: string;
    updated_at?: string;
    employer?: {
        id: number;
        name: string;
        email?: string;
        image?: string | null;
        logo?: string | null;
    };
    latest_applications?: {
        id: number;
        job_id: number;
        status: string;
        job?: {
            id: number;
            title: string;
            category?: { id: number; name: string };
            employer?: { id: number; name: string; logo?: string | null };
        };
        created_at?: string;
        updated_at?: string;
    }[];
    profile_completion_percentage?: number;
}

export interface JobFormData {
    // Step 1: Basic Info
    templateId?: string;
    category?: string;
    workMode?: string;
    title?: string;
    employmentType?: string;
    experienceLevel?: string;
    country?: string;
    countryCode?: string | null;
    city?: string;

    // Step 2: Description
    description?: string;

    // Step 3: Salary
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    hideSalary?: boolean;

    // Step 4: Visibility & Deadline
    applicationDeadline?: string | null;
    visibilityDuration?: string;
    categoryName?:string;
}

export interface JobStatistics {
    activeJobs: { count: number; trend: number };
    pausedJobs: { count: number; trend: number };
    draftJobs: { count: number; trend: number };
    expiredJobs: { count: number; trend: number };
}

export interface JobFilterState {
    category: string | null;
    workMode: string | null;
    applicationDate: string | null;
    minSalary: string | null;
    maxSalary: string | null;
    sortBy: string | null;
    search: string;
    status: string | null;
}

export interface JobFilterParams {
    category_id?: number | string;
    work_mode?: string;
    application_deadline_to?: string;
    min_salary?: string;
    max_salary?: string;
    status?: string;
    search?: string;
    page?: number | string;
    per_page?: number | string;
}

export interface PaginationConfig {
    current: number;
    pageSize: number;
    total: number;
}

// ─── Job Template Types ────────────────────────────────────

export interface JobTemplateField {
    id?: number;
    label: string;
    type: string;
    validation_rules?: string[];
    sort_order: number;
    is_required: number;
    options?: string[];
}

export interface JobTemplate {
    id: number;
    title: string;
    category_id: number | null;
    employer_id: number | null;
    is_system_template: boolean;
    is_active: number;
    fields: JobTemplateField[];
    created_at?: string;
    updated_at?: string;
}

export interface CreateJobTemplatePayload {
    title: string;
    category_id: number | null;
    employer_id?: number | null;
    is_system_template?: boolean;
    is_active?: number;
    fields: Omit<JobTemplateField, 'id'>[];
}

export interface UpdateJobTemplatePayload extends CreateJobTemplatePayload { }

export interface JobApplication {
    id: number;
    job_id: number;
    status: string;
    job: {
        id: number;
        title: string;
        description?: string;
        location?: {
            region: string;
            country_code: string;
            display: string;
        };
        employment_type?: string;
        salary_range?: {
            min: number;
            max: number;
        };
        work_mood?: string;
        category?: {
            id: number;
            name: string;
        };
        employer: {
            id: number;
            name: string;
            logo: string | null;
        };
    };
    created_at: string;
    updated_at: string;
}

export interface JobApplicationResponse {
    applications: JobApplication[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        has_more: boolean;
    };
}

