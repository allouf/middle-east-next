// components/DynamicMessage.tsx
"use client";

import { message } from "antd";
import { ReactNode } from "react";

export type MessageType = "success" | "error" | "info" | "warning" | "loading";

interface DynamicMessageProps {
  type: MessageType;
  content: ReactNode;
  duration?: number;
  onClose?: () => void;
}

export default function DynamicMessage({
  type,
  content,
  duration = 3,
  onClose,
}: DynamicMessageProps) {
  const api = message;

  api[type](content, duration, onClose);

  return null; // component renders nothing
}




