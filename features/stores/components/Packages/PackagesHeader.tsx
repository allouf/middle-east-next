"use client";

import React from "react";
import { Input, Button as AntButton } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

type Props = {
    t: any;
    search: string;
    setSearch: (v: string) => void;
    onCreate: () => void;
};

export default function PackagesHeader({ t, search, setSearch, onCreate }: Props) {
    return (
        <div className="flex flex-col md:flex-row max-md:flex-col-reverse justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3 w-full lg:w-1/3">
                <p className="text-blueSite font-semibold text-sm md:text-xl">
                    {t("packages.packaging")}
                </p>

                <Input
                    size="large"
                    allowClear
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("packages.search_placeholder")}
                    prefix={<SearchOutlined className="text-textColor" />}
                    className="rounded-full"
                />
            </div>

            <AntButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreate}
                className="!bg-blueBtn hover:!bg-blueSiteHover !rounded-lg w-full md:max-w-[150px]"
            >
                {t("packages.add_btn")}
            </AntButton>
        </div>
    );
}
