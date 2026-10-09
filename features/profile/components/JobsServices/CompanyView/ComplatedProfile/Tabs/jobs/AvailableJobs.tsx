import React, { useEffect, useState } from 'react'
import { Card, Pagination } from 'antd'
import { DollarOutlined, ClockCircleOutlined, EnvironmentOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import useJobsApi from '../../../../useJobsApi'
import { Job } from '../../../../types'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { generateSlug } from '@/lib/utils/helper'
import SafeHtml from "@/components/shared/SafeHtml";

// Define the response structure based on API response
interface JobsResponse {
  jobs: Job[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
}

function formatEmploymentType(t: (k: string) => string, v: Job["employment_type"]) {
  if (!v) return t('common.unknown');

  const map: Record<string, string> = {
    FULL_TIME: "jobs.employment.fullTime",
    PART_TIME: "jobs.employment.partTime",
    CONTRACT: "jobs.employment.contract",
    INTERNSHIP: "jobs.employment.internship",
  };
  return t(map[v] ?? "common.unknown");
}

const AvailableJobs = () => {
  const { t, locale } = useTranslation();
  const { getMyJobs, loading, error } = useJobsApi();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [perPage] = useState(15);
  const isRTL = locale === 'ar';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getMyJobs({ page: currentPage, per_page: perPage });
        const typedResponse = response.data as any;
        if (typedResponse?.jobs) {
          setJobs(typedResponse.jobs);
          setTotalJobs(typedResponse.meta?.total || typedResponse.jobs.length);
        } else if (Array.isArray(response.data)) {
          setJobs(response.data);
          setTotalJobs(response.data.length);
        } else {
          setJobs([]);
          setTotalJobs(0);
        }
        setIsDataFetched(true);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
        setTotalJobs(0);
        setIsDataFetched(true);
      }
    };

    fetchJobs();
  }, [getMyJobs, currentPage, perPage]);

  if (loading && !isDataFetched) {
    return <div className="w-full h-96 flex items-center justify-center">
      <div className="text-lg">{t('common.loadingJobs')}</div>
    </div>;
  }

  if (error) {
    return <div className="w-full p-4">
      <div className="text-red-500">Error: {error}</div>
    </div>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      <h2 className="text-base md:text-xl font-semibold mb-0 sm:mb-4">{t('jobs.availableJobs')}</h2>

      {jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobs.map((job, index) => (
              <Card
                key={job.id}
                className="rounded-xl border border-zinc-200 shadow-none hover:shadow-sm transition"
                bodyStyle={{ padding: 16 }}
              >
                {/* Title row */}
                <Link
                  href={`/jobs/${generateSlug(job.title)}/${job.id}`}
                  className="flex text-start items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-zinc-900 truncate">
                      {job.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                      <EnvironmentOutlined className="text-emerald-700" />
                      <span className="truncate">{`${job.region}, ${job.country_code}`}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => console.log('View details:', job)}
                    className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    {t('common.viewDetails')}
                    {!isRTL ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                  </button>
                </Link>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <ClockCircleOutlined className="text-emerald-700" />
                    {formatEmploymentType(t, job.employment_type)}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <DollarOutlined className="text-emerald-700" />
                    {job.salary || t('common.salary')}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <ClockCircleOutlined className="text-emerald-700" />
                    {job.created_at || t('common.posted')}
                  </span>
                </div>
                {/* <div className="my-3 h-px w-full bg-zinc-100" /> */}
                <SafeHtml className="text-xs my-3 text-zinc-500 leading-5 line-clamp-2"
                  html={typeof job.description === 'string' ? job.description : t('common.jobDescriptionNotAvailable')}
                  config="STRICT" />
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={totalJobs}
              pageSize={perPage}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                t('common.pagination.showing', {
                  start: range[0],
                  end: range[1],
                  total
                }) || `${range[0]}-${range[1]} of ${total} items`
              }
              className="responsive-pagination"
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">{t('common.noJobsFound')}</div>
        </div>
      )}
    </div>
  )
}

export default AvailableJobs