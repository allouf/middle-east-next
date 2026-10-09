import React, { useState } from 'react'
import { CompanyProfile } from '../../../types'
import { Trash2 } from 'lucide-react'
import DeleteModal from '@/components/shered/DeleteModel'
import { JOBS_ENDPOINTS } from '@/shared/constants/api-endpoints'
import { useTranslation } from '@/lib/i18n/useTranslation'
import AddGalleryModal from './AddGalleryModal'

interface OurGalleryProps {
  company?: CompanyProfile | null;
  refetch?: () => Promise<any> | null;
}

const OurGallery: React.FC<OurGalleryProps> = ({ company, refetch }) => {
  const { t } = useTranslation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [addGalleryModalOpen, setAddGalleryModalOpen] = useState(false);

  const handleDeleteImage = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedImageIndex(null);
  };

  const handleDeleteSuccess = () => {
    refetch?.();
  };

  const handleAddGallerySuccess = () => {
    refetch?.();
  };

  const handleOpenAddGallery = () => {
    setAddGalleryModalOpen(true);
  };

  const handleCloseAddGallery = () => {
    setAddGalleryModalOpen(false);
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
        <h2 className="text-base md:text-xl font-semibold mb-0 sm:mb-4">{t("jobs.company.gallery.title")}</h2>

        <button
          className='bg-blueSite text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blueSiteDark transition-colors text-sm sm:text-base w-full sm:w-auto shrink-0'
          onClick={handleOpenAddGallery}
        >
          {t("jobs.company.gallery.addGallery")}
        </button>
      </div>
      {company?.gallery && company.gallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {company.gallery.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-24 sm:h-28 md:h-32 lg:h-36 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-2 sm:top-3 end-2 sm:end-3 p-1.5 sm:p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title={t("jobs.company.messages.gallery.delete")}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">{t("jobs.company.messages.gallery.no_images")}</p>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        url={JOBS_ENDPOINTS.deleteImageGallery}
        id={selectedImageIndex || 0}
        onSuccess={handleDeleteSuccess}
        title={t("jobs.company.messages.gallery.delete_title")}
        description={t("jobs.company.messages.gallery.delete_description")}
      />

      <AddGalleryModal
        isOpen={addGalleryModalOpen}
        onClose={handleCloseAddGallery}
        onSuccess={handleAddGallerySuccess}
      />
    </div>
  )
}

export default OurGallery