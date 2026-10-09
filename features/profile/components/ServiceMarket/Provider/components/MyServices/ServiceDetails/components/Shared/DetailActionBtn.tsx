interface DetailActionBtnProps {
    icon: React.ReactNode;
    onClick?: () => void;
    type?: 'edit' | 'delete' | 'view';
}

const DetailActionBtn = ({ icon, onClick, type = 'edit' }: DetailActionBtnProps) => {
    return (
        <button onClick={onClick} className="p-1 hover:bg-black/5 rounded transition-colors text-textColor">
            {icon}
        </button>
    )
}

export default DetailActionBtn;
