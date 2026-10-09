"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentType, CSSProperties } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type LogoutModalStyle = {
  /** Extra classes */
  modalClassName?: string;
  topBar?: string;

  /** Inline styles */
  modalStyle?: CSSProperties;
  topBarStyle?: CSSProperties;
};

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;

  title: React.ReactNode;
  description?: React.ReactNode;

  onConfirm: () => void;

  /** Optional icon component (e.g. from lucide-react) */
  icon?: ComponentType<{ className?: string }>;

  style?: LogoutModalStyle;
};

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  icon: Icon,
  style,
}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const modalClassName = `bg-white shadow-lg w-full max-w-md mx-4 ${
    style?.modalClassName ?? ""
  }`;

  const topBarClassName = `flex justify-center items-center p-4 rounded-t-[20px] ${style?.topBar ?? ""
    }`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className={modalClassName} style={style?.modalStyle}>
        {/* Top bar */}
        <div className={topBarClassName} style={style?.topBarStyle}>
          {Icon ? <Icon className="h-6 w-6 text-textWhiteColor" /> : null}
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="mb-2 text-xl font-bold">{title}</h2>

          {description ? (
            <p className="mb-6 text-subTitleColor">{description}</p>
          ) : null}

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 font-semibold text-subTitleColor hover:bg-gray-300"
            >
              {t("buttons.cancel")}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className={`rounded px-4 py-2 font-semibold text-textWhiteColor ${
                style?.topBar ?? ""
              }`}
            >
              {t("buttons.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutModal;
