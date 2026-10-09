"use client";

import React, { useState, useEffect } from "react";
import JobDetailsLayout, { overviewIcons } from "./JobDetailsLayout";
import ApplyForm from "./apply/AbblayForm";
import { Job } from "../../types/jobs.types";
import SuccessModal from "@/components/shered/SuccessModal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatEmploymentType, formatExperience, formatSalary, formatWorkMode } from "../../helper";
import { getCountryNameByCode } from "@/shared/utils/locationApi";


export default function JobDetailsClient({ job, profileCompletion }: { job: Job, profileCompletion?: number }) {
  const { t } = useTranslation();
  const [openApply, setOpenApply] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [countryName, setCountryName] = useState<string>(job.country_code || '');

  useEffect(() => {
    const fetchCountryName = async () => {
      if (job.country_code) {
        const name = await getCountryNameByCode(job.country_code);
        setCountryName(name);
      }
    };

    fetchCountryName();
  }, [job.country_code]);

  return (
    <>
      <JobDetailsLayout
        profileCompletion={profileCompletion}
        onApply={() => setOpenApply(true)}
        title={job.title}
        employerId={job?.employer?.id}
        icon={job?.employer?.image}
        company={`${job?.employer.company_name}`}
        badge={job.category?.name ?? "—"}
        salary={ !job.hide_salary ? formatSalary(job) : ""}
        location={`${job.region}, ${countryName}`}
        description={job.description}
        requirements={[]} // إذا عندك requirements من API مرّرها هنا
        overview={[
          {
            icon: overviewIcons.posted,
            label: t("jobs.details.overview.posted"),
            value: new Date(job.created_at).toLocaleDateString(),
          },
          {
            icon: overviewIcons.expire,
            label: t("jobs.details.overview.expire"),
            value: job.expires_in_days > 0 
              ? `${job.expires_in_days} ${t("jobs.details.overview.days")}`
              : t("jobs.details.overview.expired"),
          },
          // {
          //   icon: overviewIcons.level,
          //   label: t("jobs.details.overview.level"),
          //   value: formatExperience(t, job.experience_level),
          // },
          {
            icon: overviewIcons.exp,
            label: t("jobs.details.overview.experience"),
            value: formatExperience(t, job.experience_level),
          },
          {
            icon: overviewIcons.type,
            label: t("jobs.details.overview.employmentType"),
            value: formatEmploymentType(t, job.employment_type),
          },
          {
            icon: overviewIcons.mode,
            label: t("jobs.details.overview.workMode"),
            value: formatWorkMode(t, job.work_mode),
          },
        ]}

      />

      <ApplyForm
        open={openApply}
        handleClose={() => setOpenApply(false)}
        job={job}
        onCreated={() => {
          setOpenApply(false);
          setOpenSuccess(true);
        }}
      />

      <SuccessModal
        open={openSuccess}
        handleClose={() => setOpenSuccess(false)}
        title={t("jobs.applyForm.successModal.title")}
        description={t("jobs.applyForm.successModal.description")}
        buttonTextKey="common.done"
        onButtonClick={() => setOpenSuccess(false)}
        imageLink="/exceeded.png"
      />
    </>
  );
}
