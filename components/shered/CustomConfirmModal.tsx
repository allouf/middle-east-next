"use client";

import React, { useMemo, useState } from "react";
import { Modal, Button, Space, Typography, theme } from "antd";
import type { ButtonProps } from "antd";
import {
  ExclamationCircleFilled,
  CheckCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { useToken } = theme;

export type ConfirmModalType = "danger" | "warning" | "info" | "success";

type StyleOverrides = {
  modal?: React.CSSProperties;
  content?: React.CSSProperties;
  iconWrap?: React.CSSProperties;
  title?: React.CSSProperties;
  subtitle?: React.CSSProperties;
  cancelButton?: React.CSSProperties;
  okButton?: React.CSSProperties;
};

type Props = {
  open: boolean;
  onClose: () => void;

  /** content */
  title: React.ReactNode;
  subtitle?: React.ReactNode;

    /** behaviors */
    onConfirm: () => Promise<boolean | void> | boolean | void;

  /** UI */
  type?: ConfirmModalType;
  icon?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;

  /** buttons */
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;

  /** if you want to control loading from parent */
  loading?: boolean;

  /** style overrides */
  styles?: StyleOverrides;

  /** modal width override */
  width?: number | string;
  zIndex?: number;
};

const defaultIcons: Record<ConfirmModalType, React.ReactNode> = {
  danger: <ExclamationCircleFilled />,
  warning: <WarningFilled />,
  info: <InfoCircleFilled />,
  success: <CheckCircleFilled />,
};

function getTypeColors(type: ConfirmModalType, token: any) {
  switch (type) {
    case "danger":
      return {
        bg: "#e6f4f1",
        fg: token.colorError,
        gradientFrom: "#BF2033",
        // gradientTo: token.red7,
      };
    case "warning":
      return {
        bg: token.colorWarningBg,
        fg: token.colorWarning,
        gradientFrom: token.colorWarning,
        // gradientTo: token.gold7,
      };
    case "success":
      return {
        bg: "#e6f4f1",
        fg: "#00664f",
        gradientFrom: "#00664f",
        // gradientTo: "#055542",
      };
    case "info":
    default:
      return {
        bg: token.colorInfoBg,
        fg: token.colorInfo,
        gradientFrom: token.colorInfo,  
        // gradientTo: token.blue7,
      };
  }
}

const CustomConfirmModal: React.FC<Props> = ({
  open,
  onClose,
  title,
  subtitle,
  onConfirm,

  type = "info",
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",

  confirmButtonProps,
  cancelButtonProps,

    loading: loadingProp,
    styles,
    width = 416,
    zIndex = 9999,
}) => {
  const { token } = useToken();
  const colors = useMemo(() => getTypeColors(type, token), [type, token]);

  const [loadingInternal, setLoadingInternal] = useState(false);
  const loading = loadingProp ?? loadingInternal;

  const finalIcon = icon ?? defaultIcons[type];

    const handleConfirm = async () => {
        try {
            if (loadingProp == null) setLoadingInternal(true);

            const result = await onConfirm?.();
            if (result !== false) onClose();
        } finally {
            if (loadingProp == null) setLoadingInternal(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            zIndex={zIndex}
            width={width}
            className=""
            style={{
                maxHeight: "100vh",
                ...styles?.modal,
            }}
        >
            <div style={{ ...styles?.content }}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {/* Icon */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                backgroundColor: colors.bg,
                                ...styles?.iconWrap,
                            }}
                        >
                            <span style={{ fontSize: 28, color: colors.fg }}>{finalIcon}</span>
                        </div>
                    </div>

          {/* Title */}
          <Title
            level={4}
            className="text-base sm:text-lg"
            style={{
              textAlign: "center",
              margin: 0,
              color: token.colorTextHeading,
              ...styles?.title,
            }}
          >
            {title}
          </Title>

          {/* Subtitle */}
          {!!subtitle && (
            <Paragraph
              className="text-sm sm:text-base"
              style={{
                textAlign: "center",
                margin: 0,
                color: token.colorTextSecondary,
                ...styles?.subtitle,
              }}
            >
              {subtitle}
            </Paragraph>
          )}

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row justify-between space-x-0 sm:space-x-4 gap-2 sm:gap-3">
              <Button
                type="primary"
                onClick={handleConfirm}
                className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
                loading={loading}
                style={{
                  // background: `linear-gradient(to right, ${colors.gradientFrom}, ${colors.gradientTo})`,
                  background: `${colors.gradientFrom}`,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  height: "auto",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  ...styles?.okButton,
                }}
                {...confirmButtonProps}
              >
                {confirmText}
              </Button>
              <Button
                className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
                onClick={onClose}
                disabled={loading}
                style={{
                  borderRadius: 8,
                  padding: "8px 16px",
                  height: "auto",
                  ...styles?.cancelButton,
                }}
                {...cancelButtonProps}
              >
                {cancelText}
              </Button>
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default CustomConfirmModal;
