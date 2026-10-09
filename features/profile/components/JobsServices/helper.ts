import { Job } from "./types";
import { EmploymentType, WorkMode, ExperienceLevel } from "./enums";

export  function formatEmploymentType(t: (k: string) => string, v: EmploymentType) {
  const map: Record<EmploymentType, string> = {
    FULL_TIME: "jobs.employment.fullTime",
    PART_TIME: "jobs.employment.partTime",
    CONTRACT: "jobs.employment.contract",
    INTERNSHIP: "jobs.employment.internship",
    TEMPORARY: "jobs.employment.temporary",
  };
  return t(map[v] ?? "common.unknown");
}

export  function formatWorkMode(t: (k: string) => string, v: WorkMode) {
  const map: Record<WorkMode, string> = {
    ONSITE: "jobs.workMode.onsite",
    REMOTE: "jobs.workMode.remote",
    HYBRID: "jobs.workMode.hybrid",
  };
  return t(map[v] ?? "common.unknown");
}

export  function formatExperience(t: (k: string) => string, v: ExperienceLevel) {
  const map: Record<ExperienceLevel, string> = {
    JUNIOR: "jobs.experience.junior", 
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


export  const getCertificateTypeOptions = (t: (k: string, opt?: any) => string) => [
    { id: 'diploma', name: t('jobs.userProfile.academicCertificates.degrees.diploma', { defaultValue: 'Diploma' }) },
    { id: 'bachelor', name: t('jobs.userProfile.academicCertificates.degrees.bachelor', { defaultValue: 'Bachelor Degree' }) },
    { id: 'master', name: t('jobs.userProfile.academicCertificates.degrees.master', { defaultValue: 'Master Degree' }) },
    { id: 'phd', name: t('jobs.userProfile.academicCertificates.degrees.phd', { defaultValue: 'PhD' }) },
    { id: 'certificate', name: t('jobs.userProfile.academicCertificates.degrees.certificate', { defaultValue: 'Certificate' }) },
    { id: 'other', name: t('jobs.userProfile.academicCertificates.degrees.other', { defaultValue: 'Other' }) }
  ];

export function formatDegreeType(t: (k: string, opt?: any) => string, v: string) {
  const options = getCertificateTypeOptions(t);
  return options.find(opt => opt.id === v)?.name || v;
}

export const getPlatformOptions = (t: (k: string) => string) => [
  { id: 'instagram', name: t('social_links.platforms.instagram') },
  { id: 'facebook', name: t('social_links.platforms.facebook') },
  { id: 'x', name: t('social_links.platforms.x') },
  { id: 'tiktok', name: t('social_links.platforms.tiktok') },
  { id: 'youtube', name: t('social_links.platforms.youtube') },
  { id: 'linkedin', name: t('social_links.platforms.linkedin') },
  { id: 'whatsapp', name: t('social_links.platforms.whatsapp') },
  { id: 'github', name: t('social_links.platforms.github') },
  { id: 'website', name: t('social_links.platforms.website') },
];

export function formatPlatform(t: (k: string) => string, v: string) {
  const options = getPlatformOptions(t);
  return options.find(opt => opt.id === v)?.name || v;
}

export function formatCurrency(t: (k: string) => string, v: string) {
    const translationKey = `jobs.currencies.${v}`;
    const translatedName = t(translationKey);
    // If translation is the same as the key, it means it wasn't found (using i18n-next behavior)
    // In that case, we might want to just show the code or a generic label.
    const name = translatedName !== translationKey ? translatedName : "";
    return name ? `${v} - ${name}` : v;
}

export function formatJobStatus(t: (k: string) => string, v: string) {
    const map: Record<string, string> = {
        DRAFT: "jobs.status.draft",
        ACTIVE: "jobs.status.active",
        PAUSED: "jobs.status.paused",
        CLOSED: "jobs.status.closed",
        EXPIRED: "jobs.status.expired",
    };
    return t(map[v] ?? `jobs.status.${v.toLowerCase()}`);
}
