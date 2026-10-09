import Modal from '@/components/ui/Modal'
import useGetData from '@/lib/api/useGetData'
import { STORE_ENDPOINT } from '@/shared/constants/urls'
import React, { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils/format'
import { FaCalendar, FaUser, FaEnvelope, FaPhone, FaEdit, FaTrash } from 'react-icons/fa'
import { BsShieldFillCheck } from 'react-icons/bs'
import Button from '@/components/ui/Button'
import { useTranslation } from '@/lib/i18n/useTranslation'
import Image from 'next/image'
import { baseURL } from '@/shared/constants/data'
import { ShowMemberProps, Member, MemberResponse } from '@/features/stores/types/storeMembers'
import usePostData from '@/lib/api/usePostData'

const SkeletonLoader = () => (
 <div className="animate-pulse">
    <div className="space-y-4">
      <div>
        <div className="h-10 bg-gray-200 rounded w-48 mb-4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-10"></div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-40"></div>
      </div>
      <div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
)

const ShowMember: React.FC<ShowMemberProps> = ({memberId,open,handleClose,handleEditMember ,handleDeleteMember ,refetch,messageApi,store_id}) => {
    const {t} = useTranslation()
    const [imageError, setImageError] = useState(false)
     const {postData:resendInvitation,loading:resending, error:resendError} = usePostData(STORE_ENDPOINT.resendInvitation)
       const {postData:revokeInvitation,loading:revoking, error:revokeError} = usePostData(STORE_ENDPOINT.revokeInvitations(memberId))
    const {data,loading,error,refetch:refetchMember} = useGetData<MemberResponse>({url:STORE_ENDPOINT.showMember(memberId),
        enabled:!!memberId
    })
    const member = data?.data

    useEffect(()=>{
        console.log("storeMember",data)
    },[data])

    useEffect(()=>{
        // Reset image error when member changes
        setImageError(false)
    }, [memberId])
  const handleResend = async ()=>{

    
    const payload = {
      store_id:store_id,
      email:member?.user?.email
    }
    console.log(payload)

      await resendInvitation(payload, {
      onSuccess: () => {
        refetch();
        messageApi.success(t("members.invite.resend_success"));
        handleClose();
      },
      onError:(err)=>{
        console.log(err)
        messageApi.error(err.response?.data?.message||t("members.ivite.resend_failed"))
      },
      showMessage:false
    });
  }

  const handleRevoke = async ()=>{


        await revokeInvitation({}, {
      onSuccess: () => {
        refetch();
        messageApi.success(t("members.invite.revoke_success"));
        handleClose();
      },
      onError:(err)=>{
        console.log(err)
        messageApi.error(err.response?.data?.message||t("members.ivite.revoke_failed"))
      },
      showMessage:false
    });
  }
  return (
    <Modal 
      isOpen={open}
      onClose={handleClose}
      className=" "
      style={{ maxWidth: "700px" }} 
      padding='py-2 px-6'>
        {loading ? (
          <SkeletonLoader />
        ) : member ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
            <div>
                <Image 
                    src={imageError ?"https://placehold.co/96x96?text=M": !member.user?.photo ? "https://placehold.co/96x96?text=M" : baseURL + member.user.photo} 
                    alt={t("members.add.iconAlt")} 
                    width={96} 
                    height={96}
                    className="rounded-full"
                    onError={() => {
                        setImageError(true)
                    }}
                />
            </div>
              <div className='flex flex-col items-start gap-4'>
                <div className='flex flex-row items-center gap-4'>
                    <h1 className='text-[30px] lg:text-[32px] font-semibold text-subTitleColor'>{member.user?.name}</h1>
                     <div className={`w-5 h-5 rounded-full text-sm font-medium ${
                            member.status === 'active' 
                            ?'bg-green-500 text-green-800'
                            : member.status==="invited"?"bg-[#00664F]"  
                            : 'bg-red-700 text-red-800'
                        }`}>
                 
                    </div>
                    
                </div>
                <p className='text-gray-500 text-[18px]'>ID: {member.id}</p>
               
              </div>
            </div>
            
            <div className='space-y-2'>
              <h2 className='border-s-2 border-blueSite text-[20px] text-blueSite px-3 font-semibold'>{t('members.show.invitationInfo')} :</h2>
              <div className="flex flex-col gap-5 text-[20px] py-4 space-y-3">
                <div className='flex flex-col gap-5'>
                  <div className="flex flex-row items-center gap-2">
                    <span>
                      <FaEnvelope className="text-blueIcons" />
                    </span> 
                    <span className="text-textColor ">
                      {t("members.show.emailAddress")}: 
                    </span>
                    <span className="font-medium text-textGrayColor">
                      {member.user?.email}
                    </span>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2">
                    <span>
                      <FaPhone className="text-blueIcons" />
                    </span> 
                    <span className="text-textColor">
                      {t('members.show.phoneNumber')}: 
                    </span>
                    <span className="font-medium text-textGrayColor">
                      {member.user?.phone || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2">
                    <span>
                      <FaCalendar className="text-blueIcons" />
                    </span> 
                    <span className="text-textColor">
                      {t('members.show.invitationDate')}: 
                    </span>
                    <span className="font-medium text-textGrayColor">
                      {formatDate(member.invited_at)}
                    </span>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2">
                    <span>
                      <FaCalendar className="text-blueIcons" />
                    </span> 
                    <span className="text-textColor">
                      {t('members.show.acceptanceDate')}: 
                    </span>
                    <span className="font-medium text-textGrayColor">
                      {member.accepted_at ? formatDate(member.accepted_at) : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2">
                    <span>
                      <FaUser className="text-blueIcons" />
                    </span> 
                    <span className="text-textColor">
                      {t('members.show.role')}: 
                    </span>
                    <span className="font-medium text-textGrayColor">
                      {member.role_display}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-3 pt-4">
              {member.status === 'active' && handleEditMember && <Button 
                scale={1.03}
                unstyled 
                onClick={()=>handleEditMember?.(member)}
                className="flex justify-center items-center gap-2 px-4 w-full py-2 bg-blueSite hover:bg-blueSiteHover text-white text-[20px] rounded-lg"
              >
                <FaEdit />
                {t('members.show.editInformation')}
              </Button>}
              {member.status === 'invited' && 
              <Button         
                  scale={1.03}              
                  disabled={revoking}
                  onClick={handleRevoke}
                  unstyled
                  className="w-full mt-4 bg-red-500 hover:bg-red-700 text-textWhiteColor font-medium py-2 rounded-lg transition"
                >
                  {revoking? t("members.invite.canceling"):t("members.cancel_invitation")}
                </Button>}

              {/* {member.status === 'revoked' && <Button 
                scale={1.03}
                unstyled
                onClick={handleResend}
                disabled={resending}
                className="flex justify-center items-center gap-2 px-4 w-full py-2 bg-blueSite hover:bg-blueSiteHover text-white text-[20px] rounded-lg"
              >
             
                {resending ? t('members.show.resending') : t('members.show.resendTheInvitation')}
              </Button>} */}
              {handleDeleteMember && <Button 
                scale={1.03}
                unstyled 
                onClick={()=>handleDeleteMember(member.id)}
                className="flex items-center justify-center gap-2 px-4 w-full py-2 text-red-500 hover:text-red-600 text-[20px] underline underline-offset-2 rounded-lg"
              >
                <FaTrash />
                {t('common.delete')}
              </Button>}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('members.show.noData')}</p>
          </div>
        )}
      </Modal>
  )
}

export default ShowMember