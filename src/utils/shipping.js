/** Match an address government value to a shipping rate (EN/AR/legacy). */
export const findShippingRate = (rates, government) => {
  if (!government || !Array.isArray(rates)) return null;

  return (
    rates.find(
      (rate) =>
        rate.governmentEn === government ||
        rate.governmentAr === government ||
        rate.government === government,
    ) || null
  );
};

/** Stable value stored on the address (prefer English name from the API). */
export const shippingRateValue = (rate) =>
  rate?.governmentEn || rate?.government || rate?.governmentAr || "";
