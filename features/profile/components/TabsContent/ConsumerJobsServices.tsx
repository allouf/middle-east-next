"use client"
import React, { useCallback, useState, useEffect } from 'react'
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';

const MyAppliedJobs = dynamic(() => import('../JobsServices/Applicants/MyAppliedJobs'), {
  ssr: false,
  loading: () => <div className="flex min-h-[400px] items-center justify-center"><Spin size="large" /></div>
});

const JobAppliedDetails = dynamic(() => import('../JobsServices/Applicants/JobAppliedDetails'), {
  ssr: false,
  loading: () => <div className="flex min-h-[400px] items-center justify-center"><Spin size="large" /></div>
});

const UserProfilePage = dynamic(() => import('../JobsServices/UserProfile/UserProfilePage'), {
  ssr: false,
  loading: () => <div className="flex min-h-[400px] items-center justify-center"><Spin size="large" /></div>
});

const ConsumerJobsServices = () => {
    const [view, setView] = useState<'applicants' | 'applied_jobs' | 'user_profile' | 'applied_detials'>('applied_jobs');
    const searchParams = useSearchParams();
    const router = useRouter()
    const [selectedJobId, setSelectedJobId] = useState<string | number | null>(null);

    // Initialize view from URL params on mount
    useEffect(() => {
        const urlView = searchParams.get('view') as typeof view;
        const urlId = searchParams.get('id');

        if (urlView && ['applicants', 'applied_jobs', 'user_profile', 'applied_detials'].includes(urlView)) {
            setView(urlView);
            if (urlId && (urlView === 'applied_detials' || urlView === 'applicants')) {
                setSelectedJobId(urlId);
            }
        }
    }, [searchParams]);

    const updateViewInUrl = useCallback((newView: string, id?: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newView === 'list') {
            params.delete('view');
            params.delete('id');
        } else {
            params.set('view', newView);
            if (id) {
                params.set('id', id.toString());
            } else {
                params.delete('id');
            }
        }
        router.push(`?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);
    const handleBackToList = () => {
        setSelectedJobId(null);
        // Remove profile_tab parameter and set view to applied_jobs
        const params = new URLSearchParams(searchParams.toString());
        params.delete('profile_tab');
        params.delete('id');
        params.set('view', 'applied_jobs');
        router.push(`?${params.toString()}`, { scroll: false });
        setView('applied_jobs');
    };
    const setViewWithUrl = useCallback((newView: typeof view, id?: string | number) => {
        setView(newView);
        updateViewInUrl(newView, id);
    }, [updateViewInUrl]);

    const handleViewAppliedJob = (id: number | string) => {
        console.log("job Id", id)
        setSelectedJobId(id);
        setViewWithUrl('applied_detials', id);
    };
    const handleViewApplicants = (id: string | number) => {
        setSelectedJobId(id);
        setViewWithUrl('applicants', id);
    };


    if (view === 'applied_detials' && selectedJobId) {
        return (
            <JobAppliedDetails
                jobId={selectedJobId}
                onBack={handleBackToList}
                // onEdit={handleEditJob}
                // onDelete={handleDeleteJob}
                // onStatusChange={handleStatusChange}
                onViewApplicants={handleViewApplicants}
                isApplied={true}
            />
        );
    }
    if (view === "user_profile") {
        return <UserProfilePage onBack={handleBackToList} />
    }

    return (
        <MyAppliedJobs
            onBack={handleBackToList}
            onViewJob={handleViewAppliedJob}
            hideBackButton={true}
            onProfileClick={() => setViewWithUrl('user_profile')}
        />
    )
}

export default ConsumerJobsServices