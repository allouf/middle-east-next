import { fetchJobById } from "../../api/fetchJobById";
import PageHeaderBanner from "../PageHeaderBanner";
import JobDetailsClient from "./JobDetailsClient";
import JobNotFoundError from "./JobNotFoundError";


interface JobDetailsServerProps {
  id: string;
  locale: string;
}

export default async function JobDetailsServerPage({
  id, locale,
}: JobDetailsServerProps) {


  const data = await fetchJobById(id, locale);

  if (!data) {
    return <JobNotFoundError />;
  }

  const job = data.data.job;
  const profileCompletion = data.data.profile_completion_percentage;

  if (!job) {
    return <JobNotFoundError />;
  }
  return (
    <>
      <PageHeaderBanner
       title={job.title} 
      crumbs={[{ label: "jobs.title", href: `/jobs` }, { label: job.category?.name, href: `/jobs?category_id=${job.category?.id}` }, { label: job?.title }]} 
      classButtonBack="px-1 sm:px-2 md:px-6 lg:px-8" />
      <JobDetailsClient job={job} profileCompletion={profileCompletion} />
    </>
  );
}
