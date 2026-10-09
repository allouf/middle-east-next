"use client";

// Patches the React 19 internals that antd v5 still relies on (wave
// effect uses unstable APIs that React 19 reshuffled). Without this
// the dev console fills with the "antd v5 support React is 16 ~ 18"
// warning. Imported once here so it loads alongside ConfigProvider.
import "@ant-design/v5-patch-for-react-19";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider, ThemeConfig } from "antd";
import React from "react";

interface AntdRegistryProps {
  children: React.ReactNode;
  locale?: string;
  nonce?: string;
}

const theme: ThemeConfig = {
  token: {
    colorPrimary: "var(--SiteColor)",
    borderRadius: 8,
  },
  components: {
    Input: {
      activeBg: "transparent",
      colorTextPlaceholder: "#00382bb2",
    },
    Select: {
      optionSelectedBg: "var(--bgGray)",
    },
  },
};

const Registry: React.FC<AntdRegistryProps> = ({ children, locale, nonce }) => {
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <AntdRegistry nonce={nonce}>
      <ConfigProvider theme={theme} direction={direction} csp={{ nonce }}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
};

export default Registry;
