import React, { useMemo } from 'react'
import { Link2, Instagram, Linkedin, Github, Twitter, Facebook, Globe, ExternalLink, Eye } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Divider } from 'antd'
import { FaTrash } from 'react-icons/fa'
import { ListIcon } from '../../Icons/ListIcon'
import { FiEdit3 } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { LinkRecord } from './link'
import { LinkIcon } from '../../Icons/LinkIcon'
import { formatPlatform } from '../../helper'

interface LinkCardProps {
    link: LinkRecord;
    handleEditClick: (link: LinkRecord) => void;
    handleDeleteClick: (id: string | number) => void;
    handleViewClick?: (link: LinkRecord) => void;
}

const LinkCard = ({ link, handleEditClick, handleDeleteClick, handleViewClick }: LinkCardProps) => {
    const { t } = useTranslation();

    const { Icon, colorScheme } = useMemo(() => {
        const type = link.type.toLowerCase();
        let platformIcon: React.ElementType = LinkIcon;
        let colors = {
            bg: 'bg-[#00664F0F]',
            text: 'text-[#00664F]',
            accent: 'bg-[#00664F33]',
            iconBg: 'bg-[#00664F1A]'
        };

        if (type.includes('instagram')) {
            platformIcon = Instagram;
            colors = {
                bg: 'bg-[#C62F940F]',
                text: 'text-[#C62F94]',
                accent: 'bg-[#C62F9433]',
                iconBg: 'bg-[#C62F941A]'
            };
        } else if (type.includes('linkedin')) {
            platformIcon = Linkedin;
            colors = {
                bg: 'bg-[#0077b50F]',
                text: 'text-[#0077b5]',
                accent: 'bg-[#0077b533]',
                iconBg: 'bg-[#0077b51A]'
            };
        } else if (type.includes('github')) {
            platformIcon = Github;
            colors = {
                bg: 'bg-[#3330F]',
                text: 'text-[#333]',
                accent: 'bg-[#33333]',
                iconBg: 'bg-[#3331A]'
            };
        } else if (type.includes('twitter')) {
            platformIcon = Twitter;
            colors = {
                bg: 'bg-[#1DA1F20F]',
                text: 'text-[#1DA1F2]',
                accent: 'bg-[#1DA1F233]',
                iconBg: 'bg-[#1DA1F21A]'
            };
        } else if (type.includes('facebook')) {
            platformIcon = Facebook;
            colors = {
                bg: 'bg-[#1877F20F]',
                text: 'text-[#1877F2]',
                accent: 'bg-[#1877F233]',
                iconBg: 'bg-[#1877F21A]'
            };
        }

        return { Icon: platformIcon, colorScheme: colors };
    }, [link.type]);

    return (
        <div className={`p-4 rounded-[10px] ${colorScheme.bg}`}>
            {/* header  */}
            <div className='flex flex-row gap-2 items-center justify-between'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className={`w-12 h-12 ${colorScheme.iconBg} rounded-full flex items-center justify-center text-blueSite`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[18px] text-subTitleColor font-semibold">{link.label}</h3>
                        {/* <Button
                            unstyled
                            scale={1.03}
                            className='text-textGrayColor underline text-sm block truncate max-w-[200px]'
                            to={link.url}
                        >
                            {link.url}
                        </Button> */}
                    </div>
                </div>

                <div className='flex flex-row gap-2'>
                    {/* {handleViewClick && (
                        <Button unstyled scale={1.03} onClick={() => handleViewClick(link)}>
                            <Eye className="w-5 h-5 text-blueSite" />
                        </Button>
                    )} */}
                    <Button unstyled scale={1.03} onClick={() => handleEditClick(link)}>
                        <FiEdit3 className="w-5 h-5 text-blueSite" />
                    </Button>
                    <Button unstyled scale={1.03} onClick={() => handleDeleteClick(link.id)}>
                        <FaTrash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            <Divider className='!my-3' />
            {/* body  */}
            <div>
                <ul className='space-y-2 text-[15px]'>
                    <li className='flex flex-row gap-2 items-center'>
                        <ListIcon />
                        <span className='text-textGrayColor text-sm'>{t('jobs.userProfile.links.platform')} :</span>
                        <span className='text-subTitleColor font-medium capitalize'>{formatPlatform(t, link.type)}</span>
                    </li>
                    <li className='flex flex-row gap-2 items-center'>
                        <ListIcon />
                        <span className='text-textGrayColor text-sm'>{t('jobs.userProfile.links.url')} :</span>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blueSite hover:underline flex items-center gap-1 truncate max-w-[250px]"
                        >
                            {link.url} <ExternalLink className="w-3 h-3" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LinkCard
