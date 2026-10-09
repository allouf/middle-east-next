"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Tabs } from 'antd';
import { Mail, Star, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ServiceProviderProfile } from '../../types/type';
import './ProviderProfilePublicPage.css';
import ServicesTab from './tabs/ServicesTab';
import ProfilePortfolioTab from './tabs/ProfilePortfolioTab';
import AboutTab from './tabs/AboutTab';

interface ProviderProfilePublicPageProps {
  id: string;
  locale: string;
  profileData: ServiceProviderProfile | null;
}

const ProviderProfilePublicPage: React.FC<ProviderProfilePublicPageProps> = ({ id, locale, profileData }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("1");

  const tabItems = [
    {
      key: "1",
      label: t("services.providerProfile.aboutTab", { defaultValue: "About" }),
      children: (
       <AboutTab profileId={Number(id)}/> 
      ),
    },
    {
      key: "2",
      label: t("services.providerProfile.servicesTab", { defaultValue: "Services" }),
      children: (
        <ServicesTab profileId={Number(id)}/>
      ),
    },
    {
      key: "3",
      label: t("services.providerProfile.portfolioTab", { defaultValue: "Portfolio" }),
      children: (
        <ProfilePortfolioTab profileId={Number(id)}/>
      ),
    },
  ];


  return (
    <div className="provider-profile-container w-full bg-white min-h-screen pb-20">
      <div className="w-full max-w-[1700px] mx-auto xl:px-8 px-4 py-8">
        
        {/* Cover Photo & Avatar Section */}
        <div className="relative mb-20 2xl:mb-24 w-full">
          <div className="relative w-full h-[250px] md:h-[300px] 2xl:h-[350px] rounded-2xl bg-gradient-to-r from-[#8e9089] via-[#c4c4be] to-[#b8bdba] overflow-hidden">
            {profileData?.cover && (
              <Image 
                src={profileData.cover} 
                alt={t("services.providerProfile.providerCoverAlt", { defaultValue: "Provider Cover" })} 
                fill 
                className="object-cover"
              />
            )}
          </div>
          
          <div className="absolute left-8 -bottom-[60px] 2xl:-bottom-[70px] flex items-end gap-6">
            <div className="relative w-[120px] h-[120px] 2xl:w-[150px] 2xl:h-[150px] rounded-full border-4 border-white bg-[#D6B598] overflow-hidden flex-shrink-0">
              <Image 
                src={profileData?.avatar || "/anonymous.png"} 
                alt={t("services.providerProfile.providerAvatarAlt", { defaultValue: "Provider Avatar" })} 
                fill 
                className="object-cover"
              />
              {/* Fallback avatar shape matching design if no image */}
              <div className="absolute inset-0 flex items-end justify-center">
                 {/* This handles the internal avatar illustration if preferred, else standard Image is used */}
              </div>
            </div>
            
            {/* Verified Badge */}
            {profileData?.is_verified && (
              <div className="absolute bottom-2 right-2 2xl:bottom-4 2xl:right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm z-10">
                <div className="w-5 h-5 rounded-full bg-[#00664F] flex items-center justify-center">
                   <ShieldCheck size={12} className="text-white" strokeWidth={2.5}/>
                </div>
              </div>
            )}
          </div>
          
          {/* Provider Name (Desktop positioning) */}
          <div className="absolute left-[170px] 2xl:left-[210px] -bottom-[50px] 2xl:-bottom-[60px] hidden sm:block">
            <h1 className="text-[28px] 2xl:text-[32px]  font-extrabold text-subTitleColor whitespace-nowrap">
              {profileData?.display_name || t("services.providerProfile.providerFallback", { defaultValue: "Provider" })}
            </h1>
          </div>
        </div>

        {/* Provider Name (Mobile positioning) */}
        <div className="sm:hidden mb-8  px-2 w-full">
            <h1 className="text-[26px] font-extrabold text-[#1E293B]">
              {profileData?.display_name || t("services.providerProfile.providerFallback", { defaultValue: "Provider" })}
            </h1>
        </div>
        {/* Main Content & Sidebar Grid */}
       
          {/* Left Column (Tabs) */}
         
             <Tabs 
              activeKey={activeTab}
              onChange={setActiveTab}
              className="provider-profile-tabs w-full"
              items={tabItems}
            />

      </div>
    </div>
  );
};

export default ProviderProfilePublicPage;