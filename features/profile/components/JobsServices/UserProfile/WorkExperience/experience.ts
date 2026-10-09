export interface WorkExperience {
    id: string | number;
    job_title: string;
    company_name: string;
    description: string;
    start_date: string;
    end_date: string | null;
    industry: string;
    is_current: boolean;
}