import useGetData from '@/lib/api/useGetData'
import { PUBLIC_PROVIDER_PROFILE } from '@/shared/constants/api-endpoints'
import { getCountryNameByCode } from '@/shared/utils/locationApi'
import { Mail, ShieldCheck, Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

const AboutTab = ({profileId}:{profileId:number}) => { 
  const { t } = useTranslation();
  const { data, loading, error } = useGetData({url:PUBLIC_PROVIDER_PROFILE.about(profileId)})
  const profile = data?.data

    const [countryName, setCountryName] = useState<string>('-');
    useEffect(() => {
    const load = async () => {
    if (profile?.country_code) {
        const name = await getCountryNameByCode(profile.country_code);
        setCountryName(name);
    }
    };
    load();
    }, [data]);

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 w-full">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3 mt-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mt-8"></div>
          <div className="flex gap-3 mt-4">
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-64 bg-gray-200 rounded-[12px] w-full"></div>
          <div className="h-24 bg-gray-200 rounded-[12px] w-full"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center py-10 w-full">{error}</div>
  }



  if (!profile) return null;

  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 w-full">
        <div className="lg:col-span-8 min-w-0">
        <div className="animate-in fade-in duration-500">
            <h2 className="text-[20px] font-bold text-subTitleColor mb-4">
              {t("services.providerProfile.aboutHeader", { name: profile.display_name, defaultValue: `About ${profile.display_name}` })}
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-textGrayColor mb-8 whitespace-pre-line">
              {profile.bio || t("services.providerProfile.noBioAvailable", { defaultValue: "No bio available." })}
            </div>

            {profile.service_languages && profile.service_languages.length > 0 && (
              <>
                <h3 className="text-[16px] font-bold text-subTitleColor mb-3">
                  {t("services.providerProfile.serviceLanguagesLabel", { defaultValue: "Service Languages :" })}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.service_languages.map((lang: any) => (
                    <span key={lang.id} className="px-4 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[16px] font-medium">
                      {lang.name}
                    </span>
                  ))}
                </div>
              </>
            )}
        </div>
        </div>


        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-6 min-w-0 animate-in fade-in duration-500">
            {/* Contact Card */}
            <div className="bg-white border text-textGrayColor border-gray-200 rounded-[12px] p-6 shadow-sm w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-blueSite hover:bg-blueSiteHover text-white py-3.5 rounded-lg font-bold text-[16px] transition-colors mb-8">
                <Mail size={18} />
                {t("services.providerProfile.contactProvider", { defaultValue: "Contact Provider" })}
            </button>

            <div className="space-y-4 text-[14px]">
                <div className="flex justify-between items-center">
                <span className="text-textGrayColor">
                  {t("services.providerProfile.averageRatingLabel", { defaultValue: "Average Rating" })}
                </span>
                <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
                    <Star size={16} fill="#FACC15" className="text-[#FACC15]" />
                    {profile.average_rating.toFixed(2)}
                </div>
                </div>
                
                <div className="flex justify-between items-center">
                <span className="text-textGrayColor">
                  {t("services.providerProfile.totalReviewsLabel", { defaultValue: "Total Reviews" })}
                </span>
                <span className="font-bold text-[#1E293B]">{profile.total_reviews}</span>
                </div>
                
                {profile.country_code && (
                  <div className="flex justify-between items-center">
                  <span className="text-textGrayColor">
                    {t("services.providerProfile.countryLabel", { defaultValue: "Country" })}
                  </span>
                  <span className="font-bold text-[#1E293B]">{countryName}</span>
                  </div>
                )}
                
                {profile.region && (
                  <div className="flex justify-between items-center">
                  <span className="text-textGrayColor">
                    {t("services.providerProfile.cityLabel", { defaultValue: "City" })}
                  </span>
                  <span className="font-bold text-[#1E293B]">{profile.region}</span>
                  </div>
                )}
            </div>
            </div>

            {/* Verified Professional Card */}
            {profile.is_verified && (
              <div className="bg-[#00664F1A] border border-[#00664F33] rounded-[12px] p-5 flex items-start gap-3">
              <ShieldCheck size={24} className="text-[#00664F] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                  <h4 className="text-[16px] font-bold text-subTitleColor mb-1">
                    {t("services.providerProfile.verifiedProfessionalHeader", { defaultValue: "Verified Professional" })}
                  </h4>
                  <p className="text-[13px] text-[#475569] leading-relaxed m-0">
                  {profile.verification_message || t("services.providerProfile.verificationFallbackMessage", { defaultValue: "Identity and professional background have been verified by ProService." })}
                  </p>
              </div>
              </div>
            )}

        </div>
    </div>
  )
}

export default AboutTab