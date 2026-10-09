import { CompanyProfile } from "./company.types";

export type JobType = "Full time" | "Part time" | "Contract";
export type Workplace = "OnSite" | "Remote" | "Hybrid";

export type JobStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";

export type ExperienceLevel =
  | "ENTRY"
  | "MID"
  | "SENIOR";

export type WorkMode =
  | "ONSITE"
  | "REMOTE"
  | "HYBRID";

export interface JobCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Employer {
  id: number;
  name: string;
  email: string;
  image?: string;
  company_name :string;
}

export interface JobTemplateField {
  id: number;
  label: string;
  type: "text" | "number" | "email" | "textarea" | "select" | "checkbox" | "radio" | "date" | "time";
  validation_rules: any;
  options: any;
  sort_order: number;
  is_required: boolean;
}

export interface JobTemplate {
  id: number;
  employer_id: number | null;
  title: string;
  is_system_template: boolean;
  is_active: boolean;
  fields: JobTemplateField[];
}

export interface Job {
  id: number;
  title: string;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  company_name: string;
  country_code: string;
  region: string;
  work_mode: WorkMode;
  description: string;
  salary_min: string;
  salary_max: string;
  hide_salary: boolean;
  application_deadline: string;
  expires_at: string;
  expires_in_days: number;
  status: JobStatus;
  application_link: string | null;
  job_template_id: number | null;
  employer_id: number;
  category_id: number;
  job_template: JobTemplate | null;
  category: JobCategory;
  employer: Employer;
  created_at: string;
  updated_at: string;
}

export interface JobsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export interface CatMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export interface Categorie {
  id: number | string;
  name: string;
  description: string;
  slug: string;
}
export interface JobsResponse {
  data: {
    jobs: Job[];
    meta: JobsMeta;
  };
}

export interface CompaniesResponse {
  data: {
    companies: CompanyProfile[];
    meta: JobsMeta;
  };
}

export interface CatResponse {
  data: {
    categories: Categorie[];
    meta: JobsMeta;
  };
}


export type JobsQuery = {
  keyword?: string;
  location?: string;
};


export type Option = { label?: string; labelKey: string; value: string };

export type SortOption = "newest" | "oldest" | "deadline_soon" | "deadline_latest" | "salary_high" | "salary_low";

export type JobsFiltersState = {
  category_id?: string | null;
  country_code?: string | null;
  search?: string | null;
  employment_type?: string | null;
  experience_level?: string | null;
  work_mode?: string | null;
  min_salary?: number | null;
  max_salary?: number | null;
  application_deadline_from?: string | null;
  application_deadline_to?: string | null;
  sort?: SortOption;
  page?: number;
  per_page?: number;
};

export type JobsFiltersLoading = {
  category_id: boolean;
  country_code: boolean;
  search: boolean;
  employment_type: boolean;
  experience_level: boolean;
  work_mode: boolean;
  min_salary: boolean;
  max_salary: boolean;
  application_deadline_from: boolean;
  application_deadline_to: boolean;
  sort: boolean;
  page: boolean;
  per_page: boolean;
};



export type ApplyAnswer = { field_id: number; value: string };

export type ApplyFormState = {
  cover_letter: string;
  answers: ApplyAnswer[];
};

export type ApplyFormErrors = Partial<Record<
  "cover_letter" | "cv" | `answers.${number}.value` | `field_${number}`,
  string
>>;
