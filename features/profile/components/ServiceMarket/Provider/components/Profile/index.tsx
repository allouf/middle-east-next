"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import CoverSection from "./CoverSection";
import { ProviderProfile } from "../../types";
import ProviderInfo from "./ProviderInfo";
import Verification from "./Verification/index";

import { useProviderProfile } from "../../hooks/Profile/useProviderProfile";
import { providerProfileService } from "../../services/provider-profile.service";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import { Spin } from "antd";
import StatusNotification from "./StatusNotification";

const Profile = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profileData, setProfileData] = useState<ProviderProfile | null>(null);
  const [team, setTeam] = useState([]);
  const [showNotification, setShowNotification] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // URL-based state
  const action = searchParams.get('action');

  const { fetchProfile, loading, error } = useProviderProfile();

  const fetchData = async () => {
    try {
      // Fetch provider profile
      await fetchProfile({
        onSuccess: (data) => {
          if (data.data) {
            setProfileData(data.data);
          }
        },
      });

      setTeam([]);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setIsMounted(true);
  }, [fetchProfile]);

  const handleRetry = () => {
    fetchData();
  };

  const handleBackFromVerification = async () => {
    await fetchData();
    const params = new URLSearchParams(searchParams.toString());
    params.delete('action');
    router.push(`?${params.toString()}`);
  };

  const handleSubmitVerification = async () => {
    await providerProfileService.submitVerification({
      onSuccess: async () => {
        // Refresh profile data after submission
        await fetchData();
        // Navigate to verification form
        // router.push("/dashboard?tab=service_market&subTab=profile&action=verification");
      },
      onError: (error) => {
        console.error('Failed to submit verification:', error);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 h-full m-auto">
        <Spin size="large" className="[&_.ant-spin-dot-item]:!bg-blueSite" />
      </div>
    );
  }

  if (error) {
    return <ErrorWithRetry onRetry={handleRetry} />;
  }

  if (!profileData && isMounted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Data</h3>
          <p className="text-sm text-gray-500 mb-4">Unable to load profile information</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blueSite hover:bg-[#005D48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00664F]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show Verification form when action is 'verification'
  if (action === 'verification') {
    return <Verification onBack={handleBackFromVerification} profileData={profileData} />;
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="container mx-auto  relative">
      {showNotification && profileData.verification_status && profileData.verification_status !== "verified" && (
        <div className="absolute top-5 left-4 z-50 w-full max-w-lg">
          {(profileData.verification_status === "none"  ) && (
            <StatusNotification
              variant="verification"
              title={t('serviceMarket.verification.notifications.verificationRequired')}
              description={t('serviceMarket.verification.notifications.verificationRequiredDescription')}
              buttonText={t('serviceMarket.verification.notifications.submitVerification')}
              onButtonClick={handleSubmitVerification}
              onClose={() => setShowNotification(false)}
            />
          )}
          {profileData.verification_status === "pending" && (
            <StatusNotification
              variant="under_review"
              title={t('serviceMarket.verification.notifications.verificationPending')}
              description={t('serviceMarket.verification.notifications.verificationPendingDescription')}
              onClose={() => setShowNotification(false)}
            />
          )}
          {profileData.verification_status === "rejected" && (
            <StatusNotification
              variant="suspended"
              title={t('serviceMarket.verification.notifications.verificationRejected')}
              buttonText={t('serviceMarket.verification.notifications.viewDetails')}
              onButtonClick={() => router.push("/dashboard?tab=service_market&subTab=profile&action=verification")}
              description={t('serviceMarket.verification.notifications.verificationRejectedDescription')}
              onClose={() => setShowNotification(false)}
            />
          )}
        </div>
      )}
      <CoverSection provider={profileData} />
      <ProviderInfo
        name={profileData.display_name || ""}
        location={`${profileData.country_code || ""}, ${profileData.region || ""}`}
        languages={profileData.languages?.map((lang) => lang.id) || [1, 2]}
        about={profileData.bio || undefined}
        bio={profileData.bio || undefined}
        country_code={profileData.country_code || undefined}
        region={profileData.region || undefined}
        onEdit={() => console.log("Edit clicked")}
        onSave={(data) => {
          console.log("Saving provider info:", data);
          // Update profile data with new values
          setProfileData((prev) => prev ? ({
            ...prev,
            display_name: data.name,
            bio: data.bio || null,
            country_code: data.country_code || undefined,
            region: data.region || undefined,
            languages: data.language_ids?.map(id => ({
              id,
              code: prev.languages?.find(lang => lang.id === id)?.code || "",
              name: prev.languages?.find(lang => lang.id === id)?.name || ""
            })) || prev.languages || [],
          }) : null);
        }}
      />
      {/* <ProfileTabs services={[]} orders={[]} team={team} /> */}
    </div>
  );
};

export default Profile;