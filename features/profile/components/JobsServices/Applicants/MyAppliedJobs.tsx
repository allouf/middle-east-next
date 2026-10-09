"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Search, Briefcase, ArrowRight } from 'lucide-react';
import { Input, Select, Tabs, Spin, Alert } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useRouter, useSearchParams } from 'next/navigation';
import AppliedJobCard from './AppliedJobCard';
import '../../JobsServices/UserProfile/UserProfilePage.css';
import useJobsApi from '../useJobsApi';
import { JobApplication } from '../types';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="38"
    viewBox="0 0 36 38"
    fill="none"
    className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M24.7501 10.5945C24.7501 15.387 21.8551 19.5 18.0001 19.5C14.1421 19.5 11.2501 15.387 11.2501 10.593C11.2501 5.802 13.7401 3 18.0001 3C22.2601 3 24.7501 5.8005 24.7501 10.5945ZM6.15308 30.213C6.73058 30.9 9.21758 33 18.0001 33C26.7826 33 29.2681 30.9 29.8471 30.2145C29.9008 30.1486 29.9405 30.0725 29.9637 29.9907C29.9869 29.9089 29.9932 29.8233 29.9821 29.739C29.8501 28.416 28.6591 22.5 18.0001 22.5C7.34108 22.5 6.15008 28.416 6.01658 29.739C6.00572 29.8234 6.01222 29.9091 6.0357 29.9909C6.05917 30.0726 6.09912 30.1472 6.15308 30.213Z" fill="#00664F" />
    <circle cx="27" cy="30" r="8" fill="#CCE0DC" />
    <g clipPath="url(#clip0_461_2660)">
      <path d="M31.6921 26.2632H22.5501C22.0621 26.2632 21.6665 26.6589 21.6665 27.1468V28.357L26.173 29.3074V28.7049H28.0432V29.3074L32.5756 28.3509V27.1468C32.5756 26.6589 32.18 26.2632 31.6921 26.2632Z" fill="#00664F" />
      <path d="M28.0434 31.1984H26.1733V29.9836L21.9785 29.1505V32.7044C21.9785 33.1923 22.3739 33.588 22.8618 33.588H31.3808C31.8687 33.588 32.2642 33.1923 32.2642 32.7044V29.1443L28.0434 29.9836V31.1984Z" fill="#00664F" />
      <path d="M27.5759 29.1721H26.6409V30.7303H27.5759V29.1721Z" fill="#00664F" />
      <path d="M25.7956 24.8717C25.7958 24.8355 25.8092 24.8066 25.8329 24.7821C25.8569 24.7586 25.8859 24.7455 25.9219 24.7451H28.3205C28.3564 24.7455 28.3857 24.7586 28.4097 24.7821C28.4332 24.8066 28.4465 24.8355 28.4466 24.8717V25.503H29.204V24.8717C29.2041 24.6286 29.1046 24.4057 28.9452 24.2468C28.7866 24.0874 28.5631 23.9876 28.3205 23.9878H25.9219C25.6791 23.9876 25.4558 24.0874 25.2971 24.2468C25.138 24.4057 25.0381 24.6286 25.0386 24.8717V25.503H25.7956V24.8717Z" fill="#00664F" />
    </g>
    <defs>
      <clipPath id="clip0_461_2660">
        <rect width="10.9091" height="10.9091" fill="white" transform="translate(21.6665 23.3335)" />
      </clipPath>
    </defs>
  </svg>
);

const MyAppliedJobs = ({ onBack, onViewJob, hideBackButton, onProfileClick }: { onBack: () => void, onViewJob?: (id: string | number) => void, hideBackButton?: boolean, onProfileClick?: () => void }) => {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getMyAppliedJobs, loading, error } = useJobsApi();

  const [allAppliedJobs, setAllAppliedJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('default');
  const contentRef = useRef<HTMLDivElement>(null);

  // Get status filter from URL or default to 'all'
  const statusFilter = searchParams.get('status') || 'all';
  const currentView = searchParams.get('view');

  const handleStatusFilterChange = (key: string) => {
    // Update URL with new status filter
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('status', key);
    router.push(currentUrl.pathname + currentUrl.search);
  };

  const handleProfileClick = () => {
    // Update URL to show profile view
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('view', 'user_profile');
    router.push(currentUrl.pathname + currentUrl.search);
    onProfileClick?.();
  };

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [statusFilter, debouncedSearchTerm, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchJobs = async () => {
    try {
      // Fetch ALL jobs matching search/sort to calculate counts for all tabs
      const response = await getMyAppliedJobs({
        status: undefined, // Don't filter by status on the API level
        search: debouncedSearchTerm || undefined,
        sort: sortBy
      });
      if (response?.data?.applications) {
        setAllAppliedJobs(response.data.applications);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [sortBy, debouncedSearchTerm]);

  // Handle local filtering for the active tab list
  const filteredJobs = useMemo(() => {
    if (statusFilter === 'all') return allAppliedJobs;
    return allAppliedJobs.filter(job => job.status === statusFilter);
  }, [allAppliedJobs, statusFilter]);

  // Status configuration for Ant Design Tabs
  const statusTabsConfig: Record<string, { key: string; label: string }> = {
    all: { key: 'all', label: t('jobs.applicationStatus.all', { defaultValue: 'All Jobs' }) },
    new: { key: 'new', label: t('jobs.applicationStatus.new', { defaultValue: 'New' }) },
    under_review: { key: 'under_review', label: t('jobs.applicationStatus.under_review', { defaultValue: 'Under Review' }) },
    shortlisted: { key: 'shortlisted', label: t('jobs.applicationStatus.shortlisted', { defaultValue: 'Shortlisted' }) },
    interviews: { key: 'interviews', label: t('jobs.applicationStatus.interviews', { defaultValue: 'Interviews' }) },
    job_offer: { key: 'job_offer', label: t('jobs.applicationStatus.job_offer', { defaultValue: 'Job Offer' }) },
    hired: { key: 'hired', label: t('jobs.applicationStatus.hired', { defaultValue: 'Hired' }) },
    rejected: { key: 'rejected', label: t('jobs.applicationStatus.rejected', { defaultValue: 'Rejected' }) }
  };

  // Generate tab items with count badges using the full list
  const statusTabItems = Object.entries(statusTabsConfig).map(([statusKey, config]) => {
    const count = statusKey === 'all'
      ? allAppliedJobs.length
      : allAppliedJobs.filter(job => job.status === statusKey).length;

    return {
      key: config.key,
      label: (
        <div className="flex items-center gap-2 px-2 py-2 text-[16px] font-medium whitespace-nowrap transition-colors">
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs">
            {count}
          </span>
          <span className={`${statusFilter === config.key
            ? 'text-blueSite'
            : 'text-subTitleColor hover:text-blueSite'
            }`}>
            {config.label}
          </span>
        </div>
      ),
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className=" px-6 py-6"
        style={{
          backgroundImage: 'url(/jobBg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top 0 left 0',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className="flex flex-row justify-between items-start mb-3">
          <div className="flex flex-col items-start gap-[20px]">
            {!hideBackButton && (
              <button
                className="flex items-center gap-2 text-[#00664F] hover:opacity-80 transition-opacity font-normal uppercase text-[20px]"
                onClick={() => onBack()}
              >
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t('common.goBack', { defaultValue: 'GO BACK' })}
              </button>
            )}
            <h1 className="text-[24px] font-medium text-gray-900">
              {t('jobs.myAppliedJobs', { defaultValue: 'My Applied Jobs' })} ({allAppliedJobs.length})
            </h1>
          </div>
          {onProfileClick && (
            <button
              onClick={handleProfileClick}
              className="bg-[#00664F]/20 hover:bg-[#00664F]/30 text-[#00664F] px-6 h-10 rounded-[10px] font-medium transition-colors flex items-center gap-2"
            >
              <ProfileIcon className="w-6 h-6 text-[#00664F]" />
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex justify-between items-center flex-wrap gap-4 pt-4">
          <Input
            placeholder={t('jobs.searchJobs', { defaultValue: 'Search jobs...' })}
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full border-[#00664F]/30 hover:border-[#00664F] focus:border-[#00664F] text-sm py-2 px-4 shadow-none w-full md:w-[400px] lg:w-[500px]"
          />

          <div className="flex flex-row items-center gap-4">

            <span className="text-[16px] text-subTitleColor">
              {t('jobs.sortBy', { defaultValue: 'Sort by' })}
            </span>

            <Select
              value={sortBy || null}
              onChange={setSortBy}
              placeholder={t('common.sortBy')}
              className="!w-40 rounded-md"
              options={[
                { value: 'default', label: t('jobs.sortOptions.default', { defaultValue: 'Default' }) },
                { value: 'newest', label: t('jobs.sortOptions.date-desc', { defaultValue: 'Newest First' }) },
                { value: 'oldest', label: t('jobs.sortOptions.date-asc', { defaultValue: 'Oldest First' }) },
                { value: 'highest_salary', label: t('jobs.sortOptions.salary-desc', { defaultValue: 'Highest Salary' }) },
                { value: 'lowest_salary', label: t('jobs.sortOptions.salary-asc', { defaultValue: 'Lowest Salary' }) },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="px-6 mb-1">
        <div className="">
          <Tabs
            activeKey={statusFilter}
            onChange={handleStatusFilterChange}
            className="profile-tabs"
            style={{
              borderBottom: 'none',
            }}
            items={statusTabItems}
          />
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="flex-1 px-6 py-4" ref={contentRef}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job: JobApplication) => (
              <AppliedJobCard
                key={job.id}
                job={job}
                statusConfig={statusTabsConfig}
                onViewDetails={onViewJob}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('jobs.noAppliedJobs', { defaultValue: 'No applied jobs found' })}
            </h3>
            <p className="text-sm text-gray-500">
              {t('jobs.noAppliedJobsSubtitle', { defaultValue: 'Start applying for jobs to see them here' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppliedJobs;
