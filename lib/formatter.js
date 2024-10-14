export const formatByte = new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
})

export const formatCurrency = new Intl.NumberFormat("en-US", {
    currency: "EGP",
    style: "currency"
})