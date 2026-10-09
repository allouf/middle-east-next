interface HeaderButtonProps {
    icon?: React.ReactNode;
    text: string;
    onClick?: () => void;
    variant?: 'default' | 'danger' | 'primary';
}

const HeaderButton = ({ icon, text, onClick, variant = 'default' }: HeaderButtonProps) => {
    let baseClass = "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors border ";
    if (variant === 'default') baseClass += "bg-[#F8F9FA] text-[#353635] border-transparent hover:bg-gray-200";
    if (variant === 'danger') baseClass += "bg-white text-[#BF2033] border-transparent hover:bg-red-50";
    if (variant === 'primary') baseClass += "bg-[#E6F0EE] text-[#00664F] border-transparent hover:bg-[#D0E5DF]";

    return (
        <button onClick={onClick} className={baseClass}>
            {icon}
            {text}
        </button>
    )
}

export default HeaderButton;
