import React, { useState } from 'react'
import { CompanyProfile } from '../../../types'
import { Avatar } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import DeleteModal from '@/components/shered/DeleteModel';
import { JOBS_ENDPOINTS } from '@/shared/constants/api-endpoints';
import { useTranslation } from '@/lib/i18n/useTranslation';
import EditTeamMemberModal from './EditTeamMemberModal';
import AddMultipleTeamMembersModal from './AddMultipleTeamMembersModal';

interface OurTeamProps {
  company?: CompanyProfile | null;
  refetch?: () => Promise<any> | null;
}

const OurTeam: React.FC<OurTeamProps> = ({ company, refetch }) => {
  const { t } = useTranslation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [addMultipleModalOpen, setAddMultipleModalOpen] = useState(false);

  const handleEditMember = (member: any) => {
    console.log("Edit member:", member);
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleDeleteMember = (memberId: number) => {
    setSelectedMemberId(memberId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedMemberId(null);
  };

  const handleAddMember = () => {
    setAddMultipleModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    refetch?.();
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
        <h2 className="text-base md:text-xl font-semibold mb-0 sm:mb-4">{t("jobs.company.team.title")}</h2>
        <button
          className='bg-blueSite text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blueSiteDark transition-colors text-sm sm:text-base w-full sm:w-auto shrink-0'
          onClick={handleAddMember}
        >
          {t("jobs.company.team.add_member")}
        </button>
      </div>
      {company?.team_members && company.team_members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {company.team_members.map((member) => (
            <div
              key={member.id}
              className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              {/* Action buttons */}
              <div className="absolute top-2 sm:top-3 end-2 sm:end-3 flex gap-1">
                <button
                  onClick={() => handleEditMember(member)}
                  className="p-1.5 sm:p-2 rounded-lg text-blueSite hover:text-white hover:bg-blueSite transition-colors"
                  title={t("jobs.company.messages.team.edit")}
                >
                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-1.5 sm:p-2 rounded-lg text-red-500 hover:text-white hover:bg-red-600 transition-colors"
                  title={t("jobs.company.messages.team.delete")}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar
                  size={40}
                  src={member.image || undefined}
                  className="shrink-0 ring-2 ring-zinc-100"
                >
                  {!member.image ? (member.name?.[0] || "?").toUpperCase() : null}
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="text-sm sm:text-base font-semibold text-zinc-900 truncate">
                    {member.name}
                  </div>
                  <div className="mt-0.5 text-xs sm:text-sm text-zinc-500 truncate">
                    {member.position || ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">{t("jobs.company.messages.team.no_members")}</p>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        url={JOBS_ENDPOINTS.deleteCompanyTeam}
        id={selectedMemberId || 0}
        onSuccess={handleDeleteSuccess}
        title={t("jobs.company.messages.team.delete_title")}
        description={t("jobs.company.messages.team.delete_description")}
      />

      <EditTeamMemberModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSuccess={() => {
          refetch?.();
          setEditModalOpen(false);
          setSelectedMember(null);
        }}
      />

      <AddMultipleTeamMembersModal
        isOpen={addMultipleModalOpen}
        onClose={() => setAddMultipleModalOpen(false)}
        onSuccess={() => {
          refetch?.();
          setAddMultipleModalOpen(false);
        }}
      />
    </div>
  )
}

export default OurTeam