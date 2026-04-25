export const priceFormatter = (price) => {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
        return "Rs.0";
    }

    return `Rs.${new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
    }).format(numericPrice)}`;
};