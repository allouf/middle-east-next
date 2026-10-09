'use client';

import React, { ReactNode } from 'react';
import { GoArrowRight } from 'react-icons/go';
import Button from '@/components/ui/Button';
import type { AccountType } from '../types';

interface AccountTypeCardProps {
  type: AccountType;
  icon: ReactNode;
  title: string;
  description: string;
  selectedType: AccountType | null;
  onSelect: (type: AccountType) => void;
  isRTL?: boolean;
}

const AccountTypeCard: React.FC<AccountTypeCardProps> = ({
  type,
  icon,
  title,
  description,
  selectedType,
  onSelect,
  isRTL = false,
}) => {
  const isSelected = selectedType === type;

  return (
    <Button
      unstyled
      scale={1.02}
      onClick={() => onSelect(type)}
      className={`group flex items-center justify-between gap-3 rounded-lg p-4 sm:p-5 md:p-6 border-[2px] transition
        ${isSelected ? "border-blueSite bg-blueLight" : "bg-grayLight"}
        hover:border-blueSite hover:bg-blueLight`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className={`${isSelected ? "bg-blueSite" : "bg-blueLight"} shrink-0  p-2.5 sm:p-3 rounded-md border border-blueIcons group-hover:bg-blueIcons`}>
          <span className={`${isSelected ? "text-textWhiteColor" : "text-blueSite"} text-lg sm:text-xl group-hover:text-textWhiteColor`}>
            {icon}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="font-medium text-base sm:text-[18px] text-blueSiteHover text-start">{title}</h3>
          <p className="text-xs sm:text-sm text-textColor font-normal text-start line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <GoArrowRight
        className={`text-blueSite text-[30px] transition ${isRTL ? "rotate-180" : ""}`}
      />
    </Button>
  );
};

export default AccountTypeCard;

