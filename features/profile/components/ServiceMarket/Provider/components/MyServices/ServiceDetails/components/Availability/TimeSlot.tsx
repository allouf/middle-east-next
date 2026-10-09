import React from 'react';
import DetailActionBtn from '../Shared/DetailActionBtn';
import { RiEditFill, RiDeleteBinFill } from 'react-icons/ri';

interface TimeSlotProps {
    startTime: string;
    endTime: string;
    isEditing?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const TimeSlot = ({ startTime, endTime, isEditing = false, onEdit, onDelete }: TimeSlotProps) => {
    return (
        <div className="flex items-center justify-between  w-full gap-3 py-2">
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    value={startTime}
                    readOnly
                    className="w-[240px] border border-transparent bg-[#F5F8F7] text-[#353635] rounded-md px-4 py-2.5 text-sm outline-none text-start"
                />
                <span className="text-[#00664F] font-bold mx-4">-</span>
                <input
                    type="text"
                    value={endTime}
                    readOnly
                    className="w-[240px] border border-transparent bg-[#F5F8F7] text-[#353635] rounded-md px-4 py-2.5 text-sm outline-none text-start"
                />
            </div>
            <div className="flex gap-1 ml-2">
                {onEdit && (
                    <DetailActionBtn
                        icon={<RiEditFill size={18} className="text-[#00664F]" />}
                        onClick={onEdit}
                    />
                )}
                {onDelete && (
                    <DetailActionBtn
                        icon={<RiDeleteBinFill size={18} className="text-[#BF2033]" />}
                        onClick={onDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default TimeSlot;
