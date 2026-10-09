import { useTranslation } from '@/lib/i18n/useTranslation';
import { Input, Tabs } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './UserProfilePage.css';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import { BriefcaseIcon } from '../Icons/BriefcaseIcon';
import { AcademicIcon } from '../Icons/AcademicIcon';
import { FolderIcon } from '../Icons/FolderIcon';
import { LanguagesIcon } from '../Icons/LanguagesIcon';
import { LinkIcon } from '../Icons/LinkIcon';
import { AwardIcon } from '../Icons/AwardIcon';
import ProfileInfo from './ProfileInfo';

const LoadingFallback = () => <div className="flex justify-center p-12"><Spin size="large" /></div>;

const WorkExperienceSection = dynamic(() => import('./WorkExperience/WorkExperienceSection'), { ssr: false, loading: LoadingFallback });
const AcademicSection = dynamic(() => import('./AcademicCertificate/AcademicSection'), { ssr: false, loading: LoadingFallback });
const LanguagesSection = dynamic(() => import('./Languages/LanguagesSection'), { ssr: false, loading: LoadingFallback });
const ProjectsSection = dynamic(() => import('./Projects/ProjectsSection'), { ssr: false, loading: LoadingFallback });
const LinksSection = dynamic(() => import('./Links/LinksSection'), { ssr: false, loading: LoadingFallback });
const CertificationSection = dynamic(() => import('./Certifications/CertificationSection'), { ssr: false, loading: LoadingFallback });
const SkillesSection = dynamic(() => import('./Skilles/SkillesSection'), { ssr: false, loading: LoadingFallback });
import { StarIcon } from '../Icons/StarIcon';
import useUserApi from './hooks/useUserApi';
import { UserProfile } from './types';

interface UserProfilePageProps {
  onBack: () => void;
}
const UserProfilePage = ({ onBack }: UserProfilePageProps) => {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('work_experience');
  const contentRef = useRef<HTMLDivElement>(null);

  // User API hook
  const { loading: profileLoading, error: profileError, getMyUserProfile } = useUserApi();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Initialize active tab from URL params on mount
  useEffect(() => {
    const urlTab = searchParams.get('profile_tab');
    if (urlTab && Object.keys(profileTabsConfig).includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getMyUserProfile({
        showMessage: false
      });
      if (result?.data) {
        setUserProfile(result.data);
      }
    };
    fetchProfile();
  }, [getMyUserProfile]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeTab]);
  useEffect(()=>{
    console.log("userProfile",userProfile)
  },[userProfile])

  // Profile tabs configuration
  const profileTabsConfig: Record<string, { label: string; icon: React.ReactNode }> = {
    work_experience: {
      label: t('jobs.userProfile.tabs.workExperience', { defaultValue: 'Work Experience' }),
      icon: <BriefcaseIcon className="w-5 h-5" />
    },
    academic_certificates: {
      label: t('jobs.userProfile.tabs.academicCertificates', { defaultValue: 'Academic Certificates' }),
      icon: <AcademicIcon className="w-5 h-5" />
    },
    languages: {
      label: t('jobs.userProfile.tabs.languages', { defaultValue: 'Languages' }),
      icon: <LanguagesIcon className="w-5 h-5" />
    },
    projects: {
      label: t('jobs.userProfile.tabs.projects', { defaultValue: 'Projects' }),
      icon: <FolderIcon className="w-5 h-5" />
    },
    links: {
      label: t('jobs.userProfile.tabs.links', { defaultValue: 'Links' }),
      icon: <LinkIcon className="w-5 h-5" />
    },
    certifications: {
      label: t('jobs.userProfile.tabs.certifications', { defaultValue: 'Certifications' }),
      icon: <AwardIcon className="w-5 h-5" />
    },
    skills: {
      label: t('jobs.userProfile.tabs.skills', { defaultValue: 'Skills' }),
      icon: <StarIcon className="w-5 h-5" />
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Update URL with new tab
    const params = new URLSearchParams(searchParams.toString());
    params.set('profile_tab', key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className='flex flex-col overflow-x-hidden min-h-screen'>
      <div className="px-4 sm:px-6 py-4 relative mb-4"
        style={{
          backgroundImage: 'url(/jobBg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top 0 left 0',
          backgroundRepeat: 'no-repeat'
        }}>
        <div
          className="absolute -right-10 -top-5 w-[120px] sm:w-[150px] lg:w-[170px] h-[120px] sm:h-[150px] lg:h-[170px] pointer-events-none"
          style={{
            backgroundImage: 'url(/jobbug.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />


        <div className="flex flex-col items-start gap-[16px] sm:gap-[20px] mb-3">
          <button
            className="flex items-center gap-2 text-[#00664F] hover:opacity-80 transition-opacity font-normal uppercase text-[16px] sm:text-[18px] md:text-[20px]"
            onClick={() => {
              // Remove status and profile_tab parameters when going back
              const params = new URLSearchParams(searchParams.toString());
              params.delete('profile_tab');
              router.push(`?${params.toString()}`, { scroll: false });
              onBack();
            }}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">{t('common.goBack', { defaultValue: 'GO BACK' })}</span>
            <span className="sm:hidden">{t('common.back', { defaultValue: 'BACK' })}</span>
          </button>
          {/* <h1 className={`text-[24px] font-medium text-subTitleColor ${isRTL ? 'pr-3 border-r-0' : 'pl-3'} max-w-[400px] relative before:content-[''] before:absolute ${isRTL ? 'before:right-0 before:left-auto' : 'before:left-0'} before:top-0 before:w-[6px] before:h-10 before:bg-blueSite before:rounded-sm`}>
            {t('jobs.userProfile.completeProfile', { defaultValue: 'Complete your professional profile to find \n a job that suits you ' })}
          </h1> */}
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
          <ProfileInfo
            onProfileChange={(value) => {
              // handleFileChange(value)
              // handleSubmit();
            }}
            isLoading={profileLoading}
            name={userProfile?.name}
            bio={userProfile?.bio || undefined}
            avatarPreview={userProfile?.avatar || undefined}
            coverPreview={userProfile?.cover || undefined}
            refetch={async () => {
              const result = await getMyUserProfile();
              if (result?.data) {
                setUserProfile(result.data);
              }
              return result;
            }}
          />
        </div>


      </div>

      {/* Profile Tabs */}
      <div className="px-4 sm:px-6 mb-1">
        <div className="w-full overflow-x-auto">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="profile-tabs"
            style={{
              borderBottom: 'none',
            }}
            items={Object.entries(profileTabsConfig).map(([key, config]) => ({
              key,
              label: (
                <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-2 text-[14px] sm:text-[16px] font-medium whitespace-nowrap transition-colors">
                  <span className={`${activeTab === key
                    ? 'text-blueSite'
                    : 'text-subTitleColor'
                    } flex-shrink-0`}>
                    {config.icon}
                  </span>
                  <span className={`${activeTab === key
                    ? 'text-blueSite '
                    : 'text-subTitleColor hover:text-blueSite'
                    } hidden xs:inline sm:inline`}>
                    {config.label}
                  </span>
                  <span className={`${activeTab === key
                    ? 'text-blueSite '
                    : 'text-subTitleColor hover:text-blueSite'
                    } xs:hidden sm:hidden text-xs`}>
                    {config.label.split(' ')[0]}
                  </span>
                </div>
              ),
            }))}
          />
        </div>
      </div>


      {/* Profile Content */}
      <div className='px-4 sm:px-6 pb-6' ref={contentRef}>

        {activeTab === 'work_experience' &&
          <WorkExperienceSection />
        }

        {activeTab === 'academic_certificates' &&
          <AcademicSection />
        }

        {activeTab === 'languages' &&
          <LanguagesSection />
        }

        {activeTab === 'projects' &&
          <ProjectsSection />
        }

        {activeTab === 'links' &&
          <LinksSection />
        }

        {activeTab === 'certifications' &&
          <CertificationSection />
        }

        {activeTab === 'skills' &&
          <SkillesSection />
        }


      </div>
    </div>
  )
}

export default UserProfilePage