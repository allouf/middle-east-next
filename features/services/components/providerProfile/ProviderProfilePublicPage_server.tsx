import React from 'react'
import ProviderProfilePublicPage from './ProviderProfilePublicPage'
import { fetchProfileData } from '@/features/services/api/getProfileInfo'

const ProviderProfilePublicPage_server = async ({id, locale}: {id: string, locale: string}) => {

    const profileData = await fetchProfileData(Number(id), "", locale);

  return (
    <ProviderProfilePublicPage id={id} locale={locale} profileData={profileData}/>
  )
}

export default ProviderProfilePublicPage_server