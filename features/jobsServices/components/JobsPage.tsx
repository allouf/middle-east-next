import JobsHeroBanner from "./JobsHeroBanner";
import JobsListPage from "./JobsListPage";
import CompaniesListPage from "./CompaniesListPage";
import JobsFiltersWrapper from "./filters/JobsFiltersWrapper";

import type { Categorie, Job } from "../types/jobs.types";
import { fetchJobs } from "../api/jobs.api";
import { fetchJobs as fetchCategories } from "../api/fetchCategories";
import JobsSearchBarClient from "./JobsSearchBarClient";
import { CompanyProfile } from "../types/company.types";
import { fetchCountries } from "@/shared/utils/locationApi";

export default async function JobsPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: { locale: string };
}) {
  // Await the searchParams promise
  const resolvedSearchParams = searchParams;

  // Map old parameter names to new ones for backward compatibility
  const paramMapping: Record<string, string> = {
    'search': 'search',
    'location': 'country_code',
    'jobType': 'employment_type',
    'workplace': 'work_mode',
    'level': 'experience_level',
    'experience': 'experience_level',
    'min': 'min_salary',
    'max': 'max_salary',
    'company_name': 'company_name'
  };

  // Convert old parameters to new ones
  const convertedParams: Record<string, string> = {};
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      const newKey = paramMapping[key] || key;
      convertedParams[newKey] = value;
    }
  });

  // Extract all filter parameters from searchParams (with backward compatibility)
  const search = convertedParams.search || typeof resolvedSearchParams?.search === "string" ? resolvedSearchParams.search : "";
  const category_id = convertedParams.category_id || typeof resolvedSearchParams?.category_id === "string" ? resolvedSearchParams.category_id : "";
  const country_code = convertedParams.country_code || typeof resolvedSearchParams?.country_code === "string" ? resolvedSearchParams.country_code : "";
  const employment_type = convertedParams.employment_type || typeof resolvedSearchParams?.employment_type === "string" ? resolvedSearchParams.employment_type : "";
  const experience_level = convertedParams.experience_level || typeof resolvedSearchParams?.experience_level === "string" ? resolvedSearchParams.experience_level : "";
  const work_mode = convertedParams.work_mode || typeof resolvedSearchParams?.work_mode === "string" ? resolvedSearchParams.work_mode : "";
  const min_salary = convertedParams.min_salary || typeof resolvedSearchParams?.min_salary === "string" ? resolvedSearchParams.min_salary : "";
  const max_salary = convertedParams.max_salary || typeof resolvedSearchParams?.max_salary === "string" ? resolvedSearchParams.max_salary : "";
  const application_deadline_from = typeof resolvedSearchParams?.application_deadline_from === "string" ? resolvedSearchParams.application_deadline_from : "";
  const application_deadline_to = typeof resolvedSearchParams?.application_deadline_to === "string" ? resolvedSearchParams.application_deadline_to : "";
  const sort = typeof resolvedSearchParams?.sort === "string" ? resolvedSearchParams.sort : "newest";
  const page = typeof resolvedSearchParams?.page === "string" ? resolvedSearchParams.page : "1";
  const per_page = typeof resolvedSearchParams?.per_page === "string" ? resolvedSearchParams.per_page : "10";
  const scope = typeof resolvedSearchParams?.scope === "string" ? resolvedSearchParams.scope : "jobs";
  const company_name = convertedParams.company_name || typeof resolvedSearchParams?.company_name === "string" ? resolvedSearchParams.company_name : "";

  // ✅ build query string (server)
  const qs = new URLSearchParams();

  if (search && typeof search === 'string') qs.set("search", search);
  if (category_id && typeof category_id === 'string') qs.set("category_id", category_id);
  if (country_code && typeof country_code === 'string') qs.set("country_code", country_code);
  if (employment_type && typeof employment_type === 'string') qs.set("employment_type", employment_type);
  if (experience_level && typeof experience_level === 'string') qs.set("experience_level", experience_level);
  if (work_mode && typeof work_mode === 'string') qs.set("work_mode", work_mode);
  if (min_salary && typeof min_salary === 'string') qs.set("min_salary", min_salary);
  if (max_salary && typeof max_salary === 'string') qs.set("max_salary", max_salary);
  if (application_deadline_from && typeof application_deadline_from === 'string') qs.set("application_deadline_from", application_deadline_from);
  if (application_deadline_to && typeof application_deadline_to === 'string') qs.set("application_deadline_to", application_deadline_to);
  if (sort && typeof sort === 'string') qs.set("sort", sort);
  if (page && typeof page === 'string') qs.set("page", page);
  if (per_page && typeof per_page === 'string') qs.set("per_page", per_page);
  if (scope && typeof scope === 'string') qs.set("scope", scope);
  if (company_name && typeof company_name === 'string') qs.set("company_name", company_name);

  let jobs: Job[] = [];
  let meta: any = {};
  let companies: CompanyProfile[] = [];
  let companiesMeta: any = {};

  if (scope === "companies") {
    const result = await fetchJobs(qs.toString(), params?.locale);
    companies = result.jobs as CompanyProfile[];
    companiesMeta = result.meta;
  } else {
    const result = await fetchJobs(qs.toString(), params?.locale);
    jobs = result.jobs as Job[];
    meta = result.meta;
  }
  // Fetch categories from API
  const { categories: fetchedCategories } = await fetchCategories("", params?.locale);
  // Convert fetched categories to Option[] format
  const categoryOptions: Categorie[] = fetchedCategories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
  }));

  // Fetch countries from API
  const fetchedCountries = await fetchCountries();
  
  const countryOptions = (fetchedCountries || []).map((country) => ({
    labelKey: country.name,
    value: country.shortName,
  }));


  return (
    <div className="overflow-x-hidden">
      <JobsHeroBanner />
      <JobsFiltersWrapper
        jobsCount={scope === "companies" ? companiesMeta?.total ?? companies.length : meta?.total ?? jobs.length}
        categories={categoryOptions}
        countries={countryOptions}
        searchBar={
          <JobsSearchBarClient
            keyword={(typeof search === 'string' ? search : "")}
            location={(typeof country_code === 'string' ? country_code : "")}
          />
        }
        content={
          scope === "companies"
            ? <CompaniesListPage companies={companies} meta={companiesMeta} />
            : <JobsListPage filtered={jobs as Job[]} meta={meta} />
        }
      />
    </div>
  );
}
