"use client"
import React, { useEffect } from 'react'
import { InvitationData, InvitationResponse } from "@/features/stores/types/invite";
import { STORE_ENDPOINT } from '@/shared/constants/urls';
import usePostData from '@/lib/api/usePostData';
import { message } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const Invitation_client = ({ 
  token, 
  invitationData, 
  error 
}: { 
  token: string;
  invitationData?: InvitationResponse | null;
  error?: string | null;
}) => {
     const {postData:acceptInvitation,loading:accepting, error:acceptError} = usePostData(STORE_ENDPOINT.acceptInvitations(token))
     const [messageApi,contextHolder] = message.useMessage()
     const {t} = useTranslation()
     const router = useRouter()
  // Destructure the invitation data
  const {
    store,
    role_display,
    role_description,
    permissions_by_category,
    invited_by,
    invited_at,
    expires_at,
    is_expired,
    can_accept
  } = invitationData?.data || {} as InvitationData;

  useEffect(()=>{
    console.log( "invitation data",invitationData)
  },[invitationData])

    const handleAccept = async ()=>{

   await acceptInvitation({}, {
      onSuccess: () => {
        
        messageApi.success(t("members.invitation.accept_success"));
     
      },
      onError:(err)=>{
        console.log(err)
        messageApi.error(err.response?.data?.message||t("members.invitation.accept_failed"))
        setTimeout(() => {
         router.push('/')
        }, 1500);
      },
      showMessage:false
    });
  }

  return (
    <div className="min-h-screen  py-6 px-4">
        {contextHolder}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[30px] font-bold text-blueSite ">{t("members.invitation.title")}</h1>
          <p className={"text-textColor text-[24px]"}>
            {store?.name 
              ? t("members.invitation.join_store", { storeName: store.name })
              : t("members.invitation.join_store", { storeName: 'Store' })
            }
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Store Information Card */}
          <div className="bg-white rounded-[12px] border border-[#B0D0C8] p-4">
            <h2 className="text-xl font-semibold text-[#549889] mb-4">{t("members.invitation.store_information")}</h2>
            <div className="space-y-3">
              <div className='flex flex-row items-center gap-3'>
                <p className="text-[20px] text-subTitleColor font-semibold">{t("members.invitation.store_name")} : </p>
                <p className="font-medium text-textColor"> {store?.name || 'N/A'}</p>
              </div>
              <div className='flex flex-row items-center gap-3'>
                <p className="text-[20px] text-subTitleColor font-semibold">{t("members.invitation.description")} :</p>
                <p className="font-medium text-textColor text-wrap">{store?.description || t("members.invitation.no_description")}</p>
              </div>
              <div className='flex flex-row items-center gap-3'>
                <p className="text-[20px] text-subTitleColor font-semibold">{t("members.invitation.invited_by")} : </p>
                <p className="font-medium text-textColor">{invited_by?.name || 'N/A'}</p>
              </div>
              <div className='flex flex-row items-center gap-3'>
                <p className="text-[20px] text-subTitleColor font-semibold">{t("members.invitation.invited_on")} : </p>
                <p className="font-medium text-textColor">{invited_at ? new Date(invited_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Your Role Card */}
          <div className="bg-white rounded-[12px] border border-[#B0D0C8] p-4">
            <h2 className="text-xl font-semibold text-[#549889] mb-4">{t("members.invitation.your_role")}: {role_display || t("members.invitation.team_member")}</h2>
            <p className="text-gray-600 leading-relaxed">
              {role_description || t("members.invitation.invite_description")}
            </p>
          </div>

          {/* Your Permissions Card */}
          <div className="bg-white rounded-[12px] border border-[#B0D0C8] p-4">
            <h2 className="text-xl font-semibold text-[#549889] mb-4">{t("members.invitation.your_permissions")}</h2>
            <div className="space-y-4">
              {permissions_by_category && Object.entries(permissions_by_category).map(([category, permissions]) => {
                const permissionList = Array.isArray(permissions) ? permissions : Object.values(permissions);
                return (
                  <div key={category}>
                    <h3 className="font-medium text-gray-700 mb-2">{category}</h3>
                    <ul className="space-y-1 flex flex-row gap-4 flex-wrap">
                      {permissionList.map((permission, index) => (
                        <li key={index} className="flex items-center text-sm text-[#338572] rounded-full px-3 py-1 bg-[#E6F0ED]">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {permission.replace(/\./g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Information Card */}
          <div className="bg-white h-fit rounded-[12px] border border-[#B0D0C8] p-4">
            <h2 className="text-xl font-semibold text-[#549889] mb-4">{t("members.invitation.important_information")}</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>{t("members.invitation.expires_on", { date: expires_at ? new Date(expires_at).toLocaleDateString() : 'N/A' })}</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>{t("members.invitation.email_signin")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>{t("members.invitation.agree_terms")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>{t("members.invitation.role_modified")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>{t("members.invitation.leave_store")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Accept Button */}
        <div className="text-center">
          <Button
            unstyled
            scale={1.03} 
            onClick={handleAccept}
            className={`text-[20px] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg ${
              is_expired || !can_accept
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blueSite hover:bg-blueSiteHover text-white'
            }`}
            disabled={is_expired || !can_accept}
          >
            {is_expired ? t("members.invitation.invitation_expired") : !can_accept ? t("members.invitation.cannot_accept") : accepting ? t("members.invitation.accepting") : t("members.invitation.accept_invitation")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Invitation_client