"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spin } from "antd";
import JobsSearchBar from "./JobsSearchBar";

type TabKey = "jobs" | "companies";

export default function JobsSearchBarClient({
    keyword,
    location,
}: {
    keyword: string;
    location: string;
}) {
    const router = useRouter();
    const sp = useSearchParams();

    const [k, setK] = useState(keyword);
    const [l, setL] = useState(location);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>(
        sp?.get("scope") === "companies" ? "companies" : "jobs"
    );

    const updateURL = async (updates: Record<string, string | null>) => {
        setLoading(true);
        const params = new URLSearchParams(sp?.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (!value) params.delete(key);
            else params.set(key, value);
        });

        params.set("page", "1"); // optional
        router.push(`?${params.toString()}`, { scroll: false });

        // Simulate loading time or wait for navigation to complete
        setTimeout(() => setLoading(false), 500);
    };

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        setK("");
        setL("");
        const params = new URLSearchParams(sp?.toString());
        const keysToDelete = Array.from(params.keys());
        keysToDelete.forEach(key => params.delete(key));
        params.set("scope", tab);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleClear = () => {
        setLoading(true);
        setK("");
        setL("");
        const params = new URLSearchParams(sp?.toString());
        const keysToDelete = Array.from(params.keys());
        keysToDelete.forEach(key => params.delete(key));
        params.set("scope", activeTab);
        router.push(`?${params.toString()}`, { scroll: false });
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <Spin spinning={loading}>
            <JobsSearchBar
                keyword={k}
                setKeyword={setK}
                onFind={() => updateURL({ search: k || null, location: l || null })}
                onClear={handleClear}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
        </Spin>
    );
}
