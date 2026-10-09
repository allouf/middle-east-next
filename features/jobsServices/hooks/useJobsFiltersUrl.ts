"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Categorie, JobsFiltersLoading, Option } from "@/features/jobsServices/types/jobs.types";

type UseJobsFiltersUrlArgs = {
  categories?: Categorie[];
  countries?: Option[];
};

export function useJobsFiltersUrl({ categories, countries }: UseJobsFiltersUrlArgs) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [loading, setLoading] = useState<JobsFiltersLoading>({
    category_id: false,
    country_code: false,
    search: false,
    employment_type: false,
    experience_level: false,
    work_mode: false,
    min_salary: false,
    max_salary: false,
    application_deadline_from: false,
    application_deadline_to: false,
    sort: false,
    page: false,
    per_page: false,
  });

  const [category_id, setCategoryId] = useState<string | number | null>(
    urlSearchParams?.get("category_id") || null
  );
  const [country_code, setCountryCode] = useState(urlSearchParams?.get("country_code") || "");
  const [search, setSearch] = useState(urlSearchParams?.get("search") || "");
  const [employment_type, setEmploymentType] = useState(urlSearchParams?.get("employment_type") || "");
  const [experience_level, setExperienceLevel] = useState(urlSearchParams?.get("experience_level") || "");
  const [work_mode, setWorkMode] = useState(urlSearchParams?.get("work_mode") || "");
  const [min_salary, setMinSalary] = useState<number | null>(
    urlSearchParams?.get("min_salary") ? Number(urlSearchParams.get("min_salary")) : null
  );
  const [max_salary, setMaxSalary] = useState<number | null>(
    urlSearchParams?.get("max_salary") ? Number(urlSearchParams.get("max_salary")) : null
  );
  const [application_deadline_from, setApplicationDeadlineFrom] = useState(urlSearchParams?.get("application_deadline_from") || "");
  const [application_deadline_to, setApplicationDeadlineTo] = useState(urlSearchParams?.get("application_deadline_to") || "");
  const [sort, setSort] = useState(urlSearchParams?.get("sort") || "newest");
  const [page, setPage] = useState(Number(urlSearchParams?.get("page") || "1"));
  const [per_page, setPerPage] = useState(Number(urlSearchParams?.get("per_page") || "10"));

  const [categorySearch, setCategorySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  // mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // update URL
  const updateURL = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(urlSearchParams?.toString());

    Object.entries(updates).forEach(([key, value]) => {
      const isEmpty = value === null || value === undefined || value === "";
      if (isEmpty) params.delete(key);
      else params.set(key, String(value));
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // sync from URL (external changes)
  useEffect(() => {
    const currentCategoryId = urlSearchParams?.get("category_id") || null;
    const currentCountryCode = urlSearchParams?.get("country_code") || "";
    const currentSearch = urlSearchParams?.get("search") || "";
    const currentEmploymentType = urlSearchParams?.get("employment_type") || "";
    const currentExperienceLevel = urlSearchParams?.get("experience_level") || "";
    const currentWorkMode = urlSearchParams?.get("work_mode") || "";
    const currentMinSalary = urlSearchParams?.get("min_salary") ? Number(urlSearchParams.get("min_salary")) : null;
    const currentMaxSalary = urlSearchParams?.get("max_salary") ? Number(urlSearchParams.get("max_salary")) : null;
    const currentApplicationDeadlineFrom = urlSearchParams?.get("application_deadline_from") || "";
    const currentApplicationDeadlineTo = urlSearchParams?.get("application_deadline_to") || "";
    const currentSort = urlSearchParams?.get("sort") || "newest";
    const currentPage = Number(urlSearchParams?.get("page") || "1");
    const currentPerPage = Number(urlSearchParams?.get("per_page") || "10");

    if (currentCategoryId !== category_id) setCategoryId(currentCategoryId);
    if (currentCountryCode !== country_code) setCountryCode(currentCountryCode);
    if (currentSearch !== search) setSearch(currentSearch);
    if (currentEmploymentType !== employment_type) setEmploymentType(currentEmploymentType);
    if (currentExperienceLevel !== experience_level) setExperienceLevel(currentExperienceLevel);
    if (currentWorkMode !== work_mode) setWorkMode(currentWorkMode);
    if (currentMinSalary !== min_salary) setMinSalary(currentMinSalary);
    if (currentMaxSalary !== max_salary) setMaxSalary(currentMaxSalary);
    if (currentApplicationDeadlineFrom !== application_deadline_from) setApplicationDeadlineFrom(currentApplicationDeadlineFrom);
    if (currentApplicationDeadlineTo !== application_deadline_to) setApplicationDeadlineTo(currentApplicationDeadlineTo);
    if (currentSort !== sort) setSort(currentSort);
    if (currentPage !== page) setPage(currentPage);
    if (currentPerPage !== per_page) setPerPage(currentPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams]);

  // stop loading when url matches state
  useEffect(() => {
    const currentCategoryId = urlSearchParams?.get("category_id") || null;
    const currentCountryCode = urlSearchParams?.get("country_code") || "";
    const currentSearch = urlSearchParams?.get("search") || "";
    const currentEmploymentType = urlSearchParams?.get("employment_type") || "";
    const currentExperienceLevel = urlSearchParams?.get("experience_level") || "";
    const currentWorkMode = urlSearchParams?.get("work_mode") || "";
    const currentMinSalary = urlSearchParams?.get("min_salary") ? Number(urlSearchParams.get("min_salary")) : null;
    const currentMaxSalary = urlSearchParams?.get("max_salary") ? Number(urlSearchParams.get("max_salary")) : null;
    const currentApplicationDeadlineFrom = urlSearchParams?.get("application_deadline_from") || "";
    const currentApplicationDeadlineTo = urlSearchParams?.get("application_deadline_to") || "";
    const currentSort = urlSearchParams?.get("sort") || "newest";
    const currentPage = Number(urlSearchParams?.get("page") || "1");
    const currentPerPage = Number(urlSearchParams?.get("per_page") || "10");

    setLoading((prev) => ({
      ...prev,
      category_id: prev.category_id && currentCategoryId !== category_id ? prev.category_id : false,
      country_code: prev.country_code && currentCountryCode !== country_code ? prev.country_code : false,
      search: prev.search && currentSearch !== search ? prev.search : false,
      employment_type: prev.employment_type && currentEmploymentType !== employment_type ? prev.employment_type : false,
      experience_level: prev.experience_level && currentExperienceLevel !== experience_level ? prev.experience_level : false,
      work_mode: prev.work_mode && currentWorkMode !== work_mode ? prev.work_mode : false,
      min_salary: prev.min_salary && currentMinSalary !== min_salary ? prev.min_salary : false,
      max_salary: prev.max_salary && currentMaxSalary !== max_salary ? prev.max_salary : false,
      application_deadline_from: prev.application_deadline_from && currentApplicationDeadlineFrom !== application_deadline_from ? prev.application_deadline_from : false,
      application_deadline_to: prev.application_deadline_to && currentApplicationDeadlineTo !== application_deadline_to ? prev.application_deadline_to : false,
      sort: prev.sort && currentSort !== sort ? prev.sort : false,
      page: prev.page && currentPage !== page ? prev.page : false,
      per_page: prev.per_page && currentPerPage !== per_page ? prev.per_page : false,
    }));
  }, [urlSearchParams, category_id, country_code, search, employment_type, experience_level, work_mode, min_salary, max_salary, application_deadline_from, application_deadline_to, sort, page, per_page]);

  // actions
  const actions = {
    toggleMenu: () => setShowMenu((p) => !p),
    closeMenu: () => setShowMenu(false),

    setCategorySearch,
    setCountrySearch,

    setCategoryId: (value: string) => {
      const next = category_id === value ? null : value;
      setCategoryId(next);
      setLoading((p) => ({ ...p, category_id: true }));
      updateURL({ category_id: next });
      if (isMobile) setShowMenu(false);
    },

    setCountryCode: (value: string) => {
      const next = country_code === value ? null : value;
      setCountryCode(next || "");
      setLoading((p) => ({ ...p, country_code: true }));
      updateURL({ country_code: next });
      if (isMobile) setShowMenu(false);
    },

    setSearch: (value: string) => {
      setSearch(value);
      setLoading((p) => ({ ...p, search: true }));
      updateURL({ search: value || null });
    },

    setEmploymentType: (value: string) => {
      const next = employment_type === value ? "" : value;
      setEmploymentType(next);
      setLoading((p) => ({ ...p, employment_type: true }));
      updateURL({ employment_type: next || null });
      if (isMobile) setShowMenu(false);
    },

    setExperienceLevel: (value: string) => {
      const next = experience_level === value ? "" : value;
      setExperienceLevel(next);
      setLoading((p) => ({ ...p, experience_level: true }));
      updateURL({ experience_level: next || null });
      if (isMobile) setShowMenu(false);
    },

    setWorkMode: (value: string) => {
      const next = work_mode === value ? "" : value;
      setWorkMode(next);
      setLoading((p) => ({ ...p, work_mode: true }));
      updateURL({ work_mode: next || null });
      if (isMobile) setShowMenu(false);
    },

    setMinSalary: (value: number | null) => {
      setMinSalary(value);
      setLoading((p) => ({ ...p, min_salary: true }));
      updateURL({ min_salary: value });
    },

    setMaxSalary: (value: number | null) => {
      setMaxSalary(value);
      setLoading((p) => ({ ...p, max_salary: true }));
      updateURL({ max_salary: value });
    },
    setSalaryRange: (min: number | null, max: number | null) => {
      setMinSalary(min);
      setMaxSalary(max);
      setLoading((p) => ({ ...p, min_salary: true, max_salary: true }));
      updateURL({ min_salary: min, max_salary: max, page: 1 }); // غالبًا منطقياً ترجع صفحة 1
    },
    setApplicationDeadlineFrom: (value: string) => {
      setApplicationDeadlineFrom(value);
      setLoading((p) => ({ ...p, application_deadline_from: true }));
      updateURL({ application_deadline_from: value || null });
    },

    setApplicationDeadlineTo: (value: string) => {
      setApplicationDeadlineTo(value);
      setLoading((p) => ({ ...p, application_deadline_to: true }));
      updateURL({ application_deadline_to: value || null });
    },

    setSort: (value: string) => {
      setSort(value);
      setLoading((p) => ({ ...p, sort: true }));
      updateURL({ sort: value || null });
    },

    setPage: (value: number) => {
      setPage(value);
      setLoading((p) => ({ ...p, page: true }));
      updateURL({ page: value });
    },

    setPerPage: (value: number) => {
      setPerPage(value);
      setLoading((p) => ({ ...p, per_page: true }));
      updateURL({ per_page: value });
    },

    resetAll: () => {
      setCategoryId(null);
      setCountryCode("");
      setSearch("");
      setEmploymentType("");
      setExperienceLevel("");
      setWorkMode("");
      setMinSalary(null);
      setMaxSalary(null);
      setApplicationDeadlineFrom("");
      setApplicationDeadlineTo("");
      setSort("newest");
      setPage(1);
      setPerPage(10);
      setCategorySearch("");
      setCountrySearch("");

      setLoading({
        category_id: true,
        country_code: true,
        search: true,
        employment_type: true,
        experience_level: true,
        work_mode: true,
        min_salary: true,
        max_salary: true,
        application_deadline_from: true,
        application_deadline_to: true,
        sort: true,
        page: true,
        per_page: true,
      });

      // Keep scope parameter when resetting
      const currentScope = urlSearchParams?.get("scope") || "jobs";
      router.push(`?scope=${currentScope}&page=1`, { scroll: false });
      if (isMobile) setShowMenu(false);
    },
  };

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories || [];
    return categories?.filter((c) => c.name.toLowerCase().includes(q)) || [];
  }, [categories, categorySearch]);

  return {
    ui: { showMenu, isMobile, categorySearch, countrySearch },
    state: {
      category_id,
      country_code,
      search,
      employment_type,
      experience_level,
      work_mode,
      min_salary,
      max_salary,
      application_deadline_from,
      application_deadline_to,
      sort,
      page,
      per_page
    },
    loading,
    filteredCategories,
    actions,
  };
}
