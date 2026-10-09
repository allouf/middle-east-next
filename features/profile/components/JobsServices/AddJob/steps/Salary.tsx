import React from 'react';
import { JobFormData } from '../../types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import SelectField from '@/components/ui/SelectFiled';
import InputField from '@/components/ui/InputField';
import { Switch } from 'antd';

interface SalaryProps {
    data: JobFormData;
    updateData: (data: Partial<JobFormData>) => void;
    errors?: Record<string, string>;
}

const Salary: React.FC<SalaryProps> = ({ data, updateData, errors = {} }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-6">
            {/* Row 1: Min Salary + Max Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    id="salaryMin"
                    label={t("jobs.minSalary", "Min Salary")}
                    placeholder={t("jobs.writeMinSalary", "Write the minimum salary...")}
                    type="number"
                    withFieldset
                    value={data.salaryMin}
                    onChange={(e: any) => {
                        const val = e?.target?.value !== undefined ? e.target.value : e;
                        updateData({ salaryMin: val ? Number(val) : undefined });
                    }}
                    error={errors.salaryMin}
                />
                <InputField
                    id="salaryMax"
                    label={t("jobs.maxSalary", "Max Salary")}
                    placeholder={t("jobs.writeMaxSalary", "Write the maximum salary...")}
                    type="number"
                    withFieldset
                    value={data.salaryMax}
                    onChange={(e: any) => {
                        const val = e?.target?.value !== undefined ? e.target.value : e;
                        updateData({ salaryMax: val ? Number(val) : undefined });
                    }}
                    error={errors.salaryMax}
                />
            </div>

            {/* Row 2: Currency (full width) */}
            <SelectField
                id="currency"
                label={t("jobs.currency", "Currency")}
                placeholder={t("jobs.selectCurrency", "Choose your preferred currency...")}
                withFieldset
                selectorOptions={[
                    { name: "USD - US Dollar", id: "USD" },
                    { name: "EUR - Euro", id: "EUR" },
                    { name: "GBP - British Pound", id: "GBP" },
                    { name: "JPY - Japanese Yen", id: "JPY" },
                    { name: "CHF - Swiss Franc", id: "CHF" },
                    { name: "CAD - Canadian Dollar", id: "CAD" },
                    { name: "AUD - Australian Dollar", id: "AUD" },
                    { name: "CNY - Chinese Yuan", id: "CNY" },
                    { name: "INR - Indian Rupee", id: "INR" },
                    { name: "AED - UAE Dirham", id: "AED" },
                    { name: "SAR - Saudi Riyal", id: "SAR" },
                    { name: "QAR - Qatari Riyal", id: "QAR" },
                    { name: "KWD - Kuwaiti Dinar", id: "KWD" },
                    { name: "BHD - Bahraini Dinar", id: "BHD" },
                    { name: "OMR - Omani Rial", id: "OMR" },
                    { name: "JOD - Jordanian Dinar", id: "JOD" },
                    { name: "EGP - Egyptian Pound", id: "EGP" },
                    { name: "LBP - Lebanese Pound", id: "LBP" },
                    { name: "IQD - Iraqi Dinar", id: "IQD" },
                    { name: "SYP - Syrian Pound", id: "SYP" },
                    { name: "TRY - Turkish Lira", id: "TRY" },
                    { name: "MAD - Moroccan Dirham", id: "MAD" },
                    { name: "TND - Tunisian Dinar", id: "TND" },
                    { name: "DZD - Algerian Dinar", id: "DZD" },
                    { name: "LYD - Libyan Dinar", id: "LYD" },
                    { name: "SDG - Sudanese Pound", id: "SDG" },
                    { name: "YER - Yemeni Rial", id: "YER" },
                    { name: "KRW - South Korean Won", id: "KRW" },
                    { name: "SGD - Singapore Dollar", id: "SGD" },
                    { name: "MYR - Malaysian Ringgit", id: "MYR" },
                    { name: "THB - Thai Baht", id: "THB" },
                    { name: "IDR - Indonesian Rupiah", id: "IDR" },
                    { name: "PHP - Philippine Peso", id: "PHP" },
                    { name: "PKR - Pakistani Rupee", id: "PKR" },
                    { name: "BRL - Brazilian Real", id: "BRL" },
                    { name: "MXN - Mexican Peso", id: "MXN" },
                    { name: "ZAR - South African Rand", id: "ZAR" },
                    { name: "NGN - Nigerian Naira", id: "NGN" },
                    { name: "SEK - Swedish Krona", id: "SEK" },
                    { name: "NOK - Norwegian Krone", id: "NOK" },
                    { name: "DKK - Danish Krone", id: "DKK" },
                    { name: "PLN - Polish Zloty", id: "PLN" },
                    { name: "CZK - Czech Koruna", id: "CZK" },
                    { name: "HUF - Hungarian Forint", id: "HUF" },
                    { name: "RUB - Russian Ruble", id: "RUB" },
                    { name: "NZD - New Zealand Dollar", id: "NZD" },
                    { name: "HKD - Hong Kong Dollar", id: "HKD" },
                    { name: "TWD - Taiwan Dollar", id: "TWD" },
                ]}
                value={data.currency}
                onChange={(e) => updateData({ currency: e.target.value })}
                error={errors.currency}
            />

            {/* Hide Salary Toggle */}
            <div className="flex items-center gap-3">
                <Switch
                    checked={data.hideSalary || false}
                    onChange={(checked) => updateData({ hideSalary: checked })}
                    className={data.hideSalary ? '!bg-[#00664F]' : ''}
                />
                <span className="text-[#373737] text-sm font-medium">
                    {t("jobs.hideSalary", "Hiding the salary")}
                </span>
            </div>
        </div>
    );
};

export default Salary;
