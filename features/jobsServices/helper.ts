import { Job } from "./types/jobs.types";

export  function formatEmploymentType(t: (k: string) => string, v: Job["employment_type"]) {
  const map: Record<string, string> = {
    FULL_TIME: "jobs.employment.fullTime",
    PART_TIME: "jobs.employment.partTime",
    CONTRACT: "jobs.employment.contract",
    INTERNSHIP: "jobs.employment.internship",
  };
  return t(map[v] ?? "common.unknown");
}

export  function formatWorkMode(t: (k: string) => string, v: Job["work_mode"]) {
  const map: Record<string, string> = {
    ONSITE: "jobs.workMode.onsite",
    REMOTE: "jobs.workMode.remote",
    HYBRID: "jobs.workMode.hybrid",
  };
  return t(map[v] ?? "common.unknown");
}

export  function formatExperience(t: (k: string) => string, v: Job["experience_level"]) {
  const map: Record<string, string> = {
    ENTRY: "jobs.experience.junior", // أو اعمل key جديد entry لو تبي
    MID: "jobs.experience.mid",
    SENIOR: "jobs.experience.senior",
    LEAD: "jobs.experience.lead",
  };
  return t(map[v] ?? "common.unknown");
}


export function formatSalary(job: Job) {
  if (job.hide_salary) return "Salary hidden";
  const min = Number(job.salary_min);
  const max = Number(job.salary_max);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return "-";
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}
