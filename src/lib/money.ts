/** All amounts are integers in paise to avoid floating-point errors. */

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const rupees = (r: number) => Math.round(r * 100);
export const formatINR = (paise: number) => inr.format(paise / 100);
