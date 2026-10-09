import React, { useEffect, useState } from 'react';
import ProfileUploader from '@/components/uploaders/ProfileUploader';
import { useUserProfileForm } from './hooks/useUserProfileForm';
import { App, Modal } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ProfileInfoProps {
  name?: string;
  bio?: string;
  avatarPreview?: string;
  coverPreview?: string;
  onProfileChange?: (value: any) => void;
  isLoading?: boolean;
  refetch?: () => Promise<any> | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  name = "User Name",
  bio = "Bio",
  avatarPreview = "",
  coverPreview = "",
  onProfileChange,
  isLoading = false,
  refetch
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [pendingUpdate, setPendingUpdate] = useState<{ file: File } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreviewState, setAvatarPreviewState] = useState<string | undefined>(avatarPreview);

  const profile = useUserProfileForm({
    initial: {
      name,
      bio,
    },
    required: {
      name: false,
      bio: false,
      avatar: false,
      cover: false,
    },
    onSuccess: () => {
      message.success('Profile updated successfully');
      refetch?.();
      setPendingUpdate(null);
    },
  });

  // Handle pending update when state is ready
  useEffect(() => {
    if (pendingUpdate && !profile.loading) {
      const submitUpdate = async () => {
        const res = await profile.submit();
        if (!res.ok) {
          message.error("Failed to update profile image");
          setPendingUpdate(null);
        }
      };
      submitUpdate();
    }
  }, [pendingUpdate, profile.loading, profile.avatarFile]);
  useEffect(()=>{
    setAvatarPreviewState(avatarPreview)
  },[avatarPreview])

  const handleProfileChange = (value: string | File) => {
    if (value instanceof File) {
      profile.setAvatar(value);
      setPendingUpdate({ file: value });
    }
    
    // Also call the original onProfileChange if provided
    onProfileChange?.(value);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      const submitUpdate = async () => {
        const res = await profile.submit();
        if (res.ok) {
          setIsEditing(false);
          refetch?.();
        } else {
          message.error("Failed to update profile");
        }
      };
      submitUpdate();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    profile.resetAll();
    setIsEditing(false);
  };

  const handleModalOk = () => {
    handleEditToggle();
  };

  const handleModalCancel = () => {
    handleCancel();
  };

  const handleRemoveImage = async (): Promise<void> => {
    profile.setAvatar(null);
    setAvatarPreviewState(undefined);
    const res = await profile.submit();
    if (!res.ok) {
      message.error('Failed to remove profile image');
    }
  };
// console.log(":profile", profile.formData);



  return (
    <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
      <div className='relative flex-shrink-0'>
        <ProfileUploader
          onChange={handleProfileChange}
          logoPreview={avatarPreviewState}
          isEditing={true}
          isBtnlight={true}
          size="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]"
          handleDeleteImg={handleRemoveImage}
          showDelete={!!avatarPreview}
          loading={profile.loading && !!profile.avatarFile}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-start gap-3 flex-1 min-w-40">
          <div className="w-3/4 sm:w-2/3 md:w-1/2 h-6 sm:h-7 bg-gray-200 animate-pulse rounded-full border border-gray-100 shadow-sm"></div>
          <div className="w-full h-4 bg-gray-100 animate-pulse rounded-full"></div>
          <div className="w-4/5 h-4 bg-gray-100 animate-pulse rounded-full"></div>
        </div>
      ) : (
        <div className="text-start space-y-1 sm:space-y-2 flex-1 min-w-0">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                <h2
                  className={`text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold text-subTitleColor leading-tight`}
                >
                  {name || profile.formData.name}
                </h2>
                <p className="text-[12px] sm:text-sm md:text-base text-textGrayColor leading-relaxed line-clamp-2">
                  {bio || profile.formData.bio}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 sm:px-4 py-2 bg-blueSite text-white text-sm font-medium rounded-lg hover:bg-blueSiteHover transition-colors"
                >
                  {t('common.edit', { defaultValue: 'Edit' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        title={t('common.editProfile', { defaultValue: 'Edit Profile' })}
        open={isEditing}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={profile.loading}
        okText={profile.loading ? t('common.saving', { defaultValue: 'Saving...' }) : t('common.save', { defaultValue: 'Save' })}
        cancelText={t('common.cancel', { defaultValue: 'Cancel' })}
        okButtonProps={{
          className: "bg-blueSite hover:bg-blueSiteHover"
        }}
        width={600}
        className="profile-edit-modal"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-subTitleColor mb-2">
              {t('common.name', { defaultValue: 'Name' })}
            </label>
            <input
              type="text"
              value={profile.formData.name}
              onChange={(e) => profile.setName(e.target.value)}
              className="w-full text-base text-subTitleColor bg-white border border-gray-300 rounded-lg px-3 py-2 focus:border-blueSite focus:ring-1 focus:ring-blueSite outline-none transition-all"
              placeholder={t('common.namePlaceholder', { defaultValue: 'Enter your name' })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-subTitleColor mb-2">
              {t('common.bio', { defaultValue: 'Bio' })}
            </label>
            <textarea
              value={profile.formData.bio}
              onChange={(e) => profile.setBio(e.target.value)}
              className="w-full text-base text-textGrayColor bg-white border border-gray-300 rounded-lg px-3 py-2 focus:border-blueSite focus:ring-1 focus:ring-blueSite outline-none resize-none transition-all"
              rows={4}
              placeholder={t('common.bioPlaceholder', { defaultValue: 'Tell us about yourself, your experience, and what you\'re looking for' })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileInfo;
