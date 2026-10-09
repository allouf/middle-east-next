import React from 'react';
import { Award, Calendar, ExternalLink, Eye } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Divider } from 'antd';
import { FaArrowRight, FaTrash } from 'react-icons/fa';
import { ListIcon } from '../../Icons/ListIcon';
import { FiEdit3 } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { CertificationRecord } from './certification';
import { AwardIcon } from '../../Icons/AwardIcon';
import { FolderIcon } from '../../Icons/FolderIcon';

interface CertificationCardProps {
    certification: CertificationRecord;
    handleEditClick: (cert: CertificationRecord) => void;
    handleDeleteClick: (id: string | number) => void;
    handleViewClick?: (cert: CertificationRecord) => void;
}

const CertificationCard = ({ certification, handleEditClick, handleDeleteClick, handleViewClick }: CertificationCardProps) => {
    const { t } = useTranslation();

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="p-4 rounded-[10px] bg-[#6A45BE0F]">
            {/* Header */}
            <div className='flex flex-row gap-2 items-center justify-between'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className="w-12 h-12 bg-[#6A45BE1A] rounded-full flex items-center justify-center text-[#6A45BE]">
                        <FolderIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[18px] text-subTitleColor font-semibold first-letter:uppercase">{certification.name}</h3>
                        <div className="flex flex-row  items-center gap-1 text-textGrayColor ">
                            <span className="flex flex-row  items-center gap-1 ">
                                <Calendar className="w-4 h-4" />
                                {new Date(certification.issue_date).toLocaleDateString()}
                            </span>
                            {certification.expiration_date &&
                                <>
                                    <FaArrowRight />
                                    <span className="flex flex-row  items-center gap-1 ">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(certification.expiration_date).toLocaleDateString()}
                                    </span>
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-2'>
                    {/* {handleViewClick && (
                        <Button unstyled scale={1.03} onClick={() => handleViewClick(certification)}>
                            <Eye className="w-5 h-5 text-blueSite" />
                        </Button>
                    )} */}
                    <Button unstyled scale={1.03} onClick={() => handleEditClick(certification)}>
                        <FiEdit3 className="w-5 h-5 text-blueSite" />
                    </Button>
                    <Button unstyled scale={1.03} onClick={() => handleDeleteClick(certification.id)}>
                        <FaTrash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            <Divider className='!my-3' />

            {/* Body */}
            <div>
                <ul className='space-y-2 text-[15px]'>
                    <li className='flex flex-row gap-2 items-center'>
                        <ListIcon />
                        <span className='text-textGrayColor text-sm'>{t('jobs.userProfile.certifications.issuer')} :</span>
                        <span className='text-subTitleColor font-medium'>{certification.issuer}</span>
                    </li>
                    {/* <li className='flex flex-row gap-2 items-center'>
                        <ListIcon />
                        <span className='text-textGrayColor text-sm'>{t('jobs.userProfile.certifications.issueDate', { defaultValue: 'Issue Date' })} :</span>
                        <span className='text-subTitleColor font-medium'>{formatDate(certification.issue_date)}</span>
                    </li> */}

                    {certification.credential_url && (
                        <li className='flex flex-row gap-2 items-center'>
                            <ListIcon />
                            <span className='text-textGrayColor text-sm'>{t('jobs.userProfile.certifications.url')} :</span>
                            <a
                                href={certification.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blueSite hover:underline flex items-center gap-1 truncate max-w-[250px]"
                            >
                                {certification.credential_url} <ExternalLink className="w-3 h-3" />
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CertificationCard;
