import React from 'react'
import { ProfileApiResponse } from '../../types';
import { fetchProfileData } from '../../api/getProfileData';
import { getT } from '@/lib/i18n/server';
import CompanyContent from './CompanyContent';
import ErrorReload from '@/components/shared/ErrorReload';

const CompanyContent_server = async ({ locale }: { locale: string }) => {
  const t = await getT(locale);
  let profileData: ProfileApiResponse | null = null;

  try {
    profileData = await fetchProfileData("", locale);
  } catch (err) {
    console.log("error message ", err);
  }

  if (!profileData) {
    return (
      <div className="container mx-auto">
        <ErrorReload
          title={t('profile.unavailable')}
          message={t('profile.couldntLoad')}
        />
      </div>
    );
  }
  return (
    <div className='p-6 md:p-7 md:pt-[4vh]'>
      <CompanyContent userData={profileData} />
    </div>
  )
}

export default CompanyContent_server