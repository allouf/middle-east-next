'use client';

import { useTranslation } from 'react-i18next';
import { Job, JobsMeta } from "../types/jobs.types";
import JobCard from "./JobCard";
import NoJobsFound from "./NoJobsFound";
import { useJobsFiltersUrl } from '../hooks/useJobsFiltersUrl';
import Pagination from "./Pagination";


export default function JobsListPage({ filtered, meta }: { filtered: Job[]; meta?: JobsMeta }) {
  const { t } = useTranslation();
const {actions} =  useJobsFiltersUrl({});
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-7xl  py-6 ">
        <div className="mt-6 flex items-end gap-2">
          <span className="text-3xl font-bold text-emerald-700">
            {filtered.length}
          </span>
          <span className="text-2xl font-semibold text-gray-900">
            {t('jobs.jobs')}
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-6 space-y-5">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} onApply={() => { }} />
            ))}
          </div>
        ) : (
          <NoJobsFound resetFilter={actions.resetAll} />
        )}

        {/* Pagination */}
        {meta && (
          <Pagination 
            meta={meta} 
            onPageChange={(page) => actions.setPage(page)}
            onPerPageChange={(per_page) => actions.setPerPage(per_page)}
          />
        )}
      </div>
    </div>
  );
}



