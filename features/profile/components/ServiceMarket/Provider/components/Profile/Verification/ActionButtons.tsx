import React from 'react';
import Button from '@/components/ui/Button';

interface ActionButtonsProps {
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  disabled?: boolean;
}

const ActionButtons = ({ 
  onSave, 
  onCancel, 
  saveText = "Save Changes",
  cancelText = "Cancel",
  disabled = false
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center gap-4 pt-2">
      <Button
        onClick={onSave}
        disabled={disabled}
        className="rounded-xl bg-[#00664F] px-6 py-3 text-sm font-medium text-white hover:bg-[#005541] transition disabled:opacity-50 disabled:cursor-not-allowed"
        unstyled
        addDisableStyle
      >
        {saveText}
      </Button>

      <Button
        onClick={onCancel}
        className="text-sm font-medium text-[#1B1F1E] hover:text-[#00664F] transition"
        unstyled
      >
        {cancelText}
      </Button>
    </div>
  );
};

export default ActionButtons;
