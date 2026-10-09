import React, { useEffect, useState } from 'react';
import { JobFormData } from '../../types';
import { WorkMode, EmploymentType, ExperienceLevel } from '../../enums';
import SelectField from '@/components/ui/SelectFiled';
import InputField from '@/components/ui/InputField';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Button, Input } from 'antd';
import { Search, Plus, FileText, Eye } from 'lucide-react';
import FormBuilderModal from '../../FormBuilder/FormBuilderModal';
import useJobsApi from '../../useJobsApi';
import { formatWorkMode, formatEmploymentType, formatExperience } from '../../helper';
import { locationApi } from "@/shared/utils/locationApi";
import useProfile from "@/features/profile/hooks/useProfile";
import { useMemo } from 'react';
import FormPreviewModal from '../../FormBuilder/FormPreviewModal';
import { apiFieldsToElements, FormElement } from '../../FormBuilder/formBuilderTypes';

interface JobBasicProps {
    data: JobFormData;
    updateData: (data: Partial<JobFormData>) => void;
    errors?: Record<string, string>;
    initialTemplateName?: string;
}

const JobBasic: React.FC<JobBasicProps> = ({ data, updateData, errors = {}, initialTemplateName }) => {
    const { t } = useTranslation();
    const { getJobCategories, getMyTemplates, getTemplate } = useJobsApi();
    const [templateSearch, setTemplateSearch] = useState("");
    const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
    const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewElements, setPreviewElements] = useState<FormElement[]>([]);
    const [previewName, setPreviewName] = useState("");

    const { data: profileData } = useProfile();
    const [templates, setTemplates] = useState<{ name: string, id: string | number }[]>([]);
    const [categories, setCategories] = useState<{ name: string, id: string | number }[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [regions, setRegions] = useState<any[]>([]);

    const deriveCountryCode = (country: any) =>
        country?.alpha_2_code ||
        country?.alpha2_code ||
        country?.code ||
        country?.alpha_3_code ||
        country?.country_code ||
        country?.shortName ||
        country?.short_name ||
        country?.id ||
        null;

    const fetchTemplates = async () => {
        const temps = await getMyTemplates({paginate:false});
        let loadedTemplates: { name: string, id: string | number }[] = [];

        if (temps && temps.data && Array.isArray((temps.data as any).templates)) {
            loadedTemplates = (temps.data as any).templates.map((t: any) => ({ name: t.title || t.template_name || t.name, id: String(t.id) }));
        } else if (temps && Array.isArray(temps.data)) {
            loadedTemplates = temps.data.map((t: any) => ({ name: t.title || t.template_name || t.name, id: String(t.id) }));
        } else if (Array.isArray(temps)) {
            loadedTemplates = temps.map((t: any) => ({ name: t.title || t.template_name || t.name, id: String(t.id) }));
        }

        // Inject initial template if missing (for Edit mode)
        if (data.templateId && initialTemplateName) {
            const exists = loadedTemplates.find(t => String(t.id) === String(data.templateId));
            if (!exists) {
                loadedTemplates = [{ name: initialTemplateName, id: data.templateId }, ...loadedTemplates];
            }
        }

        setTemplates(loadedTemplates);

    };

    useEffect(() => {
        const fetchData = async () => {
            const cats = await getJobCategories({paginate:false});
            if (cats && cats.data && Array.isArray((cats.data as any).categories)) {
                setCategories((cats.data as any).categories.map((c: any) => ({ name: c.name || c.title, id: String(c.id) })));
            } else if (cats && Array.isArray(cats.data)) {
                setCategories(cats.data.map((c: any) => ({ name: c.name || c.title, id: String(c.id) })));
            } else if (Array.isArray(cats)) {
                setCategories(cats.map((c: any) => ({ name: c.name || c.title, id: String(c.id) })));
            }

            await fetchTemplates();
        };
        fetchData();
    }, []);

    // Fetch countries
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const res = await fetch(locationApi("/api/location/countries"));
                const payload = await res.json();
                if (res.ok && payload?.status === "OK" && Array.isArray(payload.data)) {
                    setCountries(payload.data);
                }
            } catch {
                /* ignore */
            }
        };
        loadCountries();
    }, []);

    // Pre-fill from profile (only for new jobs, not edit)
    useEffect(() => {
        if (profileData?.data?.user && !data.country && !data.countryCode) {
            const user = profileData.data.user;
            const userCountryCode = deriveCountryCode(user.country);
            // Only update if not already set
            updateData({
                country: user.country?.id?.toString() || undefined,
                countryCode: userCountryCode,
                city: (typeof user.region === 'object' ? (user.region as any)?.name : user.region) || undefined
            });
        }
    }, [profileData]);

    // Resolve countryCode → country ID for edit mode
    useEffect(() => {
        if (countries.length > 0 && data.countryCode && !data.country) {
            const match = countries.find((c: any) => {
                const code = deriveCountryCode(c);
                return code && String(code).toUpperCase() === String(data.countryCode).toUpperCase();
            });
            if (match) {
                updateData({
                    country: String(match.id),
                });
            }
        }
    }, [countries, data.countryCode]);

    const countryObject = useMemo(() => {
        return countries.find(
            (c) => String(c.id) === String(data.country)
        );
    }, [countries, data.country]);

    const regionCountryParam = useMemo(() => {
        return countryObject?.name || "";
    }, [countryObject]);

    // Fetch regions when country changes
    useEffect(() => {
        const loadRegions = async () => {
            if (!regionCountryParam) {
                setRegions([]);
                return;
            }
            try {
                const res = await fetch(
                    locationApi(`/api/location/regions?country=${encodeURIComponent(regionCountryParam)}`)
                );
                const payload = await res.json();
                if (res.ok && payload?.status === "OK" && Array.isArray(payload.data)) {
                    // Map regions to use name as ID if possible, or keep ID
                    // But since we store "City Name" in formData, we want SelectField to use Name as ID
                    // so that value={data.city} (which is a name) matches an option.
                    setRegions(payload.data.map((r: any) => ({ ...r, id: r.name })));
                } else {
                    setRegions([]);
                }
            } catch {
                setRegions([]);
            }
        };
        loadRegions();
    }, [regionCountryParam]);

    useEffect(()=>{
          const selectedCategory = categories.find((cat)=>cat.id===data.category);
            updateData({ categoryName: selectedCategory?.name })
    },[categories])


    const handleCountryChange = (e: any) => {
        const value = e?.target?.value ?? e;
        const selectedCountry = countries.find(c => String(c.id) === String(value));
        updateData({
            country: value,
            countryCode: deriveCountryCode(selectedCountry),
            city: undefined // Reset city/region when country changes
        });
    };

    const handleCityChange = (e: any) => {
        const value = e?.target?.value ?? e;
        // Since we mapped regions to have id = name, value is the name.
        updateData({ city: value });
    };


    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(templateSearch.toLowerCase())
    );

    const handlePreviewTemplate = async (e: React.MouseEvent, templateId: string | number) => {
        e.stopPropagation();
        e.preventDefault();
        setIsTemplateDropdownOpen(false);
        try {
            const res = await getTemplate(templateId);
            const templateData = res?.data?.template || res?.data || res;
            if (templateData) {
                const fields = templateData.fields || templateData.template_fields || [];
                setPreviewElements(apiFieldsToElements(fields));
                setPreviewName(templateData.title || templateData.template_name || templateData.name || 'Template Preview');
                setPreviewOpen(true);
            }
        } catch (err) {
            console.error('Failed to fetch template for preview:', err);
        }
    };



    return (
        <div className="flex flex-col gap-6">
            {/* Row 1: Template + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                    id="template"
                    label={t("jobs.templateJob", "Template Job")}
                    placeholder={t("jobs.selectTemplate", "Select your template of the job you want ...")}
                    withFieldset
                    selectorOptions={filteredTemplates}
                    value={data.templateId}
                    onChange={(e) => updateData({ templateId: e.target.value })}
                    showSearch={false}
                    open={isTemplateDropdownOpen}
                    onDropdownVisibleChange={setIsTemplateDropdownOpen}
                    dropdownRender={(menu) => (
                        <div className="p-2">
                            <Input
                                size="large"
                                placeholder={t("jobs.searchPlaceholder", "Search for...")}
                                value={templateSearch}
                                onChange={(e) => setTemplateSearch(e.target.value)}
                                className="mb-2 rounded-full px-6 py-2 text-sm border-[0.5px] border-[#00664F] placeholder:!text-[#00664F] placeholder:font-medium !shadow-none text-blueSite font-medium"
                                prefix={<Search className="w-4 h-4 text-[#00664F]" />}
                            />
                            {menu}
                            <Button
                                type="primary"
                                className="w-full mt-2 bg-[#00664F] hover:!bg-[#00523F] flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium"
                                icon={<Plus className="w-4 h-4" />}
                                onClick={() => {
                                    setIsTemplateDropdownOpen(false);
                                    setIsFormBuilderOpen(true);
                                }}
                            >
                                {t("jobs.template.create", "Add Other Template")}
                            </Button>
                        </div>
                    )}
                    renderOption={(option) => (
                        <div className="flex items-center justify-between w-full py-1">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00664F]" />
                                <span className="text-gray-700 text-sm font-medium">{option.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => handlePreviewTemplate(e, option.id)}
                                    className="p-1 rounded-full hover:bg-[#E6F0ED] transition-colors"
                                    title="Preview template"
                                >
                                    <Eye className="w-4 h-4 text-[#00664F]" />
                                </button>
                                <FileText className="w-4 h-4 text-[#00664F]" />
                            </div>
                        </div>
                    )}
                />
                <SelectField
                    id="category"
                    label={t("jobs.category", "Category")}
                    placeholder={t("jobs.selectCategory", "Select your category of the job you want ...")}
                    withFieldset
                    selectorOptions={categories}
                    value={data.category}
                    onChange={(e) => {
                        updateData({ category: e.target.value })
                        const selectedCategory = categories.find((cat)=>cat.id===e.target.value);
                        updateData({ categoryName: selectedCategory?.name })
                    }}
                    error={errors.category}
                />
            </div>

            {/* Row 2: Work Mode + Job Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                    id="workMode"
                    label={t("jobs.workModeLabel", "Work Mode")}
                    placeholder={t("jobs.selectWorkMode", "Choose your preferred work style (remote / onsite / hybrid )...")}
                    withFieldset
                    selectorOptions={[
                        { name: formatWorkMode(t, WorkMode.REMOTE), id: WorkMode.REMOTE },
                        { name: formatWorkMode(t, WorkMode.ONSITE), id: WorkMode.ONSITE },
                        { name: formatWorkMode(t, WorkMode.HYBRID), id: WorkMode.HYBRID },
                    ]}
                    value={data.workMode}
                    onChange={(e) => updateData({ workMode: e.target.value })}
                    error={errors.workMode}
                />
                <InputField
                    id="job-title"
                    label={t("jobs.jobTitle", "Job Title")}
                    placeholder={t("jobs.enterJobTitle", "Write the title of the job you want....")}
                    withFieldset
                    value={data.title || ''}
                    onChange={(e: any) => {
                        const val = e?.target?.value !== undefined ? e.target.value : e;
                        updateData({ title: val });
                    }}
                    error={errors.title}
                />
            </div>

            {/* Row 3: Employment Type + Experience Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                    id="employmentType"
                    label={t("jobs.employmentType", "Employment Type")}
                    placeholder={t("jobs.selectEmploymentType", "Choose the type of employment you want ....")}
                    withFieldset
                    selectorOptions={[
                        { name: formatEmploymentType(t, EmploymentType.FULL_TIME), id: EmploymentType.FULL_TIME },
                        { name: formatEmploymentType(t, EmploymentType.PART_TIME), id: EmploymentType.PART_TIME },
                        { name: formatEmploymentType(t, EmploymentType.CONTRACT), id: EmploymentType.CONTRACT },
                        { name: formatEmploymentType(t, EmploymentType.TEMPORARY), id: EmploymentType.TEMPORARY },
                        { name: formatEmploymentType(t, EmploymentType.INTERNSHIP), id: EmploymentType.INTERNSHIP },
                    ]}
                    value={data.employmentType}
                    onChange={(e) => updateData({ employmentType: e.target.value })}
                    error={errors.employmentType}
                />
                <SelectField
                    id="experienceLevel"
                    label={t("jobs.experienceLevel", "Experience Level")}
                    placeholder={t("jobs.selectExperienceLevel", "Choose the work style that represents the job")}
                    withFieldset
                    selectorOptions={[
                        { name: formatExperience(t, ExperienceLevel.JUNIOR), id: ExperienceLevel.JUNIOR },
                        { name: formatExperience(t, ExperienceLevel.MID), id: ExperienceLevel.MID },
                        { name: formatExperience(t, ExperienceLevel.SENIOR), id: ExperienceLevel.SENIOR },
                        { name: formatExperience(t, ExperienceLevel.LEAD), id: ExperienceLevel.LEAD },
                    ]}
                    value={data.experienceLevel}
                    onChange={(e) => updateData({ experienceLevel: e.target.value })}
                    error={errors.experienceLevel}
                />
            </div>

            {/* Row 4: Country + City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                    id="country"
                    label={t("jobs.country", "Country")}
                    placeholder={t("jobs.selectCountry", "Choose the country where the job opportunity is available...")}
                    withFieldset
                    selectorOptions={countries}
                    value={data.country}
                    onChange={handleCountryChange}
                    labelName="name"
                    error={errors.country}
                />
                <SelectField
                    id="city"
                    label={t("jobs.city", "City")}
                    placeholder={t("jobs.selectCity", "Choose the city where the job opportunity is available...")}
                    withFieldset
                    selectorOptions={regions}
                    value={data.city}
                    onChange={handleCityChange}
                    labelName="name"
                    error={errors.city}
                />
            </div>

            {/* Form Builder Modal */}
            <FormBuilderModal
                isOpen={isFormBuilderOpen}
                onClose={() => setIsFormBuilderOpen(false)}
                onSaved={fetchTemplates}
            />

            {/* Template Preview Modal */}
            <FormPreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                elements={previewElements}
                templateName={previewName}
            />
        </div>
    );
};

export default JobBasic;
