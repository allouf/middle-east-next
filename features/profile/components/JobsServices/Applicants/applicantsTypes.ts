export type ApplicantStatus = 'new' | 'under_review' | 'shortlisted' | 'interviews' | 'job_offer' | 'hired' | 'rejected';

export interface ApplicantCandidate {
    id: number;
    name: string;
    email: string;
    phone?: string;
    country_code?: string;
    region?: string;
}

export interface Applicant {
    id: string | number;
    job_id?: number;
    name: string;
    rating: number;
    hasCvUpload: boolean;
    tags: { id: string | number; label: string; color: string }[];
    status: ApplicantStatus;
    resume_url?: string;
    cover_letter?: string;
    candidate?: ApplicantCandidate;
    expectedSalary?: string;
    longAnswer?: string;
    attachments?: { name: string; editedOn: string; iconColor: string }[];
    ratingText?: string;
    notes?: string;
    form_answers?: { question: string; answer: string }[];
    history?: { id: number; action: string; from_status?: string; to_status?: string; date: string }[];
    created_at?: string;
    updated_at?: string;
}

export interface KanbanColumn {
    id: ApplicantStatus;
    title: string;
    count: number;
    applicants: Applicant[];
}

export interface KanbanColumnMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface KanbanApiColumn {
    candidates: any[];
    meta: KanbanColumnMeta;
}
