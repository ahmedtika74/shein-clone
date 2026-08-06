export const formatPrice = (price, t) => {
  if (price === undefined || price === null) return "";

  // If price is a number, we can format it nicely and add the currency from translation
  if (typeof price === "number") {
    return `${t("egp")} ${price.toFixed(2)}`;
  }

  // If price is a string, replace "EGP" with the translation
  return String(price).replace(/EGP/g, t("egp"));
};
