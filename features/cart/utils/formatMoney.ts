export const formatMoney = (n: number | null | undefined): string => {
    if (n == null) return "0";

    const hasDecimals = !Number.isInteger(n);
    return n.toLocaleString(undefined, {
        minimumFractionDigits: hasDecimals ? 1 : 0,
        maximumFractionDigits: hasDecimals ? 20 : 0,
    });
};
