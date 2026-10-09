import React from 'react';
import { Edit2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    onEdit?: () => void;
    formatValue?: boolean; // For capitalizing and replacing underscores
}

const InfoCard = ({ icon: Icon, label, value, onEdit, formatValue = true }: InfoCardProps) => {
    const displayValue = formatValue && value ? value.replace(/_/g, ' ') : value;
    
    return (
        <div 
            className="bg-[#F8F9FA] rounded-xl flex flex-col items-center justify-center p-6 border border-transparent hover:border-[#00664F20] hover:shadow-sm transition-all cursor-pointer group"
            onClick={onEdit}
        >
            <Icon className="text-[#00664F] w-7 h-7 mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-gray-500 font-medium tracking-wider mb-1">{label}</span>
            <span className="text-[#353635] font-semibold capitalize">
                {displayValue || "Not Set"}
            </span>
            {onEdit && (
                <Edit2 className="w-3 h-3 text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </div>
    );
};

export default InfoCard;
