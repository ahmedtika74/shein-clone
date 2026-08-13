/**
 * Prices are numbers everywhere in state; the currency is only attached at
 * render time so it follows the active language.
 */
export const formatPrice = (price, t) => {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return "";

  return `${t("egp")} ${amount.toFixed(2)}`;
};
