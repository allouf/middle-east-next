"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { message, notification, Modal } from "antd";
import type { MessageArgsProps, NotificationArgsProps } from "antd";

type MessageType = "success" | "error" | "info" | "warning" | "loading";
type NotificationType = "success" | "error" | "info" | "warning" | "open";

interface AlertContextType {
  // Message methods
  message: {
    success: (content: string, duration?: number) => void;
    error: (content: string, duration?: number) => void;
    info: (content: string, duration?: number) => void;
    warning: (content: string, duration?: number) => void;
    loading: (content: string, duration?: number) => void;
  };
  // Notification methods
  notify: {
    success: (props: Omit<NotificationArgsProps, "type">) => void;
    error: (props: Omit<NotificationArgsProps, "type">) => void;
    info: (props: Omit<NotificationArgsProps, "type">) => void;
    warning: (props: Omit<NotificationArgsProps, "type">) => void;
  };
  // Confirm dialog
  confirm: {
    delete: (title: string, content: string, onOk: () => void) => void;
    confirm: (title: string, content: string, onOk: () => void) => void;
    warning: (title: string, content: string, onOk: () => void) => void;
  };
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();

  // Message methods
  const showMessage = (type: MessageType, content: string, duration = 3) => {
    messageApi[type](content, duration);
  };

  // Notification methods
  const showNotification = (
    type: NotificationType,
    props: Omit<NotificationArgsProps, "type">
  ) => {
    notificationApi[type](props);
  };

  // Confirm dialogs
  const showDeleteConfirm = (
    title: string,
    content: string,
    onOk: () => void
  ) => {
    modalApi.confirm({
      title,
      content,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk,
    });
  };

  const showConfirm = (title: string, content: string, onOk: () => void) => {
    modalApi.confirm({
      title,
      content,
      onOk,
    });
  };

  const showWarningConfirm = (
    title: string,
    content: string,
    onOk: () => void
  ) => {
    modalApi.confirm({
      title,
      content,
      okType: "danger",
      onOk,
    });
  };

  const value: AlertContextType = {
    message: {
      success: (content, duration) => showMessage("success", content, duration),
      error: (content, duration) => showMessage("error", content, duration),
      info: (content, duration) => showMessage("info", content, duration),
      warning: (content, duration) => showMessage("warning", content, duration),
      loading: (content, duration) => showMessage("loading", content, duration),
    },
    notify: {
      success: (props) => showNotification("success", props),
      error: (props) => showNotification("error", props),
      info: (props) => showNotification("info", props),
      warning: (props) => showNotification("warning", props),
    },
    confirm: {
      delete: showDeleteConfirm,
      confirm: showConfirm,
      warning: showWarningConfirm,
    },
  };

  return (
    <AlertContext.Provider value={value}>
      {messageContextHolder}
      {notificationContextHolder}
      {modalContextHolder}
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
