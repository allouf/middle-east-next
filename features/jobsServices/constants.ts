import { Option } from "./types/jobs.types";

export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 10000;

export const DEFAULT_CATEGORIES = [
  { labelKey: "jobs.categories.engineering", value: "1" },
  { labelKey: "jobs.categories.design", value: "2" },
  { labelKey: "jobs.categories.marketing", value: "3" },
  { labelKey: "jobs.categories.business", value: "4" },
];

export const DEFAULT_EMPLOYMENT_TYPES = [
  { labelKey: "jobs.employment.fullTime", value: "FULL_TIME" },
  { labelKey: "jobs.employment.partTime", value: "PART_TIME" },
  { labelKey: "jobs.employment.contract", value: "CONTRACT" },
  { labelKey: "jobs.employment.internship", value: "INTERNSHIP" },
];

export const DEFAULT_WORK_MODES = [
  { labelKey: "jobs.workMode.onsite", value: "ONSITE" },
  { labelKey: "jobs.workMode.remote", value: "REMOTE" },
  { labelKey: "jobs.workMode.hybrid", value: "HYBRID" },
];

export const DEFAULT_EXPERIENCE_LEVELS = [
  { labelKey: "jobs.experience.junior", value: "JUNIOR" },
  { labelKey: "jobs.experience.mid", value: "MID" },
  { labelKey: "jobs.experience.senior", value: "SENIOR" },
  { labelKey: "jobs.experience.lead", value: "LEAD" },
];

export const DEFAULT_COUNTRIES = [
  { labelKey: "jobs.countries.us", value: "US" },
  { labelKey: "jobs.countries.uk", value: "UK" },
  { labelKey: "jobs.countries.ca", value: "CA" },
  { labelKey: "jobs.countries.de", value: "DE" },
  { labelKey: "jobs.countries.fr", value: "FR" },
];

export const SORT_OPTIONS = [
  { labelKey: "jobs.sort.newest", value: "newest" },
  { labelKey: "jobs.sort.oldest", value: "oldest" },
  { labelKey: "jobs.sort.deadlineSoon", value: "deadline_soon" },
  { labelKey: "jobs.sort.deadlineLatest", value: "deadline_latest" },
  { labelKey: "jobs.sort.salaryHigh", value: "salary_high" },
  { labelKey: "jobs.sort.salaryLow", value: "salary_low" },
];

