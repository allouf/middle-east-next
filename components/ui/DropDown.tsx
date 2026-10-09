'use client';

import React from "react";
import { Dropdown } from "antd";

interface DropDownProps {
  isOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  handleClose?: () => void;
  unStyled?: boolean;
  position?: string; // kept for compatibility
  containerRef?: React.RefObject<any>; // kept for compatibility
  maxHeight?: number;

  triggerNode?: React.ReactNode;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

  /** NEW: remove internal scroll */
  disableScroll?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({
  isOpen = false,
  children,
  className = "",
  handleClose,
  unStyled = false,
  maxHeight = 200,
  triggerNode,
  placement = "bottomLeft",
  disableScroll = false,
}) => {
  return (
    <Dropdown
      open={isOpen}
      placement={placement}
      onOpenChange={(open) => {
        if (!open) handleClose?.();
      }}
      dropdownRender={() => (
        <div
          className={
            unStyled ? className : `bg-white rounded-md shadow-lg ${className}`
          }
          style={
            disableScroll
              ? undefined
              : { maxHeight, overflowY: "auto" }
          }
        >
          {children}
        </div>
      )}
      trigger={["click"]}
      overlayStyle={{ zIndex: 9999 }}
    >
      {triggerNode ? (
        <span>{triggerNode}</span>
      ) : (
        <span className="inline-block w-px h-px opacity-0" />
      )}
    </Dropdown>
  );
};

export default DropDown;
