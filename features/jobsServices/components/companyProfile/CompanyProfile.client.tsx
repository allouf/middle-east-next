"use client";
import CompanyCoverHeader from './CompanyCoverHeader'
import CompanyProfileIntro from './CompanyProfileIntro'
import CompanyOpportunitiesGrid, { JobCardItem } from './CompanyOpportunitiesGrid'
import CompanyGalleryMosaic from './CompanyGalleryMosaic';
import CompanyTeamSlider from './CompanyTeamSlider';
import type { CompanyProfile } from '../../types/company.types';
import { Job } from '../../types/jobs.types';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getCountryNameByCode } from "@/shared/utils/locationApi";
import { useState, useEffect } from "react";

interface CompanyProfileClientProps {
  company: CompanyProfile | null;
  jobs: Job[] | null;
}

const CompanyProfileclient = ({ company, jobs }: CompanyProfileClientProps) => {
  const { t } = useTranslation();
  const [transformedJobs, setTransformedJobs] = useState<JobCardItem[]>([]);

  useEffect(() => {
    const transformJobs = async () => {
      if (!jobs) return;

      const jobsWithCountryNames = await Promise.all(
        jobs.map(async (job) => {
          const countryName = job.country_code ? await getCountryNameByCode(job.country_code) : job.country_code;
          return {
            id: job.id,
            title: job.title,
            location: `${job.region}, ${countryName}${job.work_mode === 'REMOTE' ? ` ${t("jobs.profile.remote")}` : ''}`,
            type: job.employment_type,
            salary: job.hide_salary ? t("jobs.profile.competitive") : `${job.salary_min} - ${job.salary_max}`,
            posted: `${job.expires_in_days} ${t("jobs.profile.daysLeft")}`,
            excerpt: job.description
          };
        })
      );

      setTransformedJobs(jobsWithCountryNames);
    };

    transformJobs();
  }, [jobs, t]);

  return (
    <div className='px-4 py-8 md container max-w-7xl mx-auto space-y-8'>
      <CompanyCoverHeader
        coverUrl={company?.cover}
        avatarUrl={company?.logo}
        companyName={company?.company_name}
      />

      <CompanyProfileIntro
        companyName={company?.company_name}
        category={company?.description || "N/A"}
        about={company?.description || "No description available"}
        team={company?.team_members}
      />
      {transformedJobs.length > 0 &&
        <CompanyOpportunitiesGrid
          totalJobs={transformedJobs.length}
          companyName={company?.company_name}
          jobs={transformedJobs}
          rangeText={`${transformedJobs.length} ${t("jobs.profile.opportunitiesAvailable")}`}
        />
      }


      {company && company.gallery.length > 0 && (
        <CompanyGalleryMosaic
          totalPhotos={company.gallery.length}
          images={company.gallery.map((url, index) => ({ id: index + 1, url }))}
        />
      )}

      {company && company.team_members.length > 0 && (
        <CompanyTeamSlider
          totalMembers={company.team_members.length}
          members={company.team_members.map(member => ({
            id: member.id,
            name: member.name,
            role: member.position || "Team Member",
            photo: member.image
          }))}
        />
      )}
    </div>
  )
}

export default CompanyProfileclient