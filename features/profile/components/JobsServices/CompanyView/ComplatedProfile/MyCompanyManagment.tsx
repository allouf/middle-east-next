"use client";


import React, { useEffect, useState } from 'react'
import CoverSection from './CoverSection';
import { InfoSection } from './InfoSection';
import Tabs from './Tabs';
import useCompanyApi from '../hooks/useCompanyApi';
import { CompanyProfile } from '../types';


interface CompanyProfileTabsProps {
    onBack: () => void;
}

const MyCompanyManagment  : React.FC<CompanyProfileTabsProps> = ({ onBack }) => {
  const { loading, error, getMyCompanyProfile, refetch } = useCompanyApi();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  useEffect(() => {
    getMyCompanyProfile({
      showMessage: false,
      onSuccess: (res) => setCompany(res.data ?? null),
    });
  }, [getMyCompanyProfile]);

  return (
    <div className='' >
    <CoverSection company={company} refetch={refetch} onBack={onBack} />
    <InfoSection 
      companyName={company?.company_name}
      about={company?.description || undefined}
      refetch={refetch}
    />
    <Tabs company={company} refetch={refetch} />
    </div>
  )
}

export default MyCompanyManagment