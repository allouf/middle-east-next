export function getCurrencyOptions(t: (key: string, params?: any) => string) {
    const currencyCodes = [
        "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR",
        "AED", "SAR", "QAR", "KWD", "BHD", "OMR", "JOD", "EGP", "LBP",
        "IQD", "SYP", "TRY", "MAD", "TND", "DZD", "LYD", "SDG", "YER",
        "KRW", "SGD", "MYR", "THB", "IDR", "PHP", "PKR", "BRL", "MXN",
        "ZAR", "NGN", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RUB",
        "NZD", "HKD", "TWD"
    ];

    return currencyCodes.map(code => ({
        id: code,
        label: `${code} - ${t(`jobs.currencies.${code}`, { defaultValue: code })}`
    }));
}

export function formatCurrency(t: (key: string, params?: any) => string, code: string) {
    const translationKey = `jobs.currencies.${code}`;
    const translatedName = t(translationKey, { defaultValue: code });
    return translatedName !== translationKey ? `${code} - ${translatedName}` : code;
}
