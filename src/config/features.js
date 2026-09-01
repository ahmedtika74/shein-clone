/**
 * Feature switches for customer account UI.
 * Missing/empty env values default to ON (production-ready).
 * Set a flag to "false" to hide that surface without removing API code.
 */
const isEnabled = (value) => {
  if (value === undefined || value === null || value === "") return true;
  return String(value).toLowerCase() === "true";
};

/** Only `"true"` counts; missing/empty/false means guests can buy. */
const isExplicitlyTrue = (value) => String(value).toLowerCase() === "true";

export const features = {
  reviews: isEnabled(import.meta.env.VITE_ENABLE_REVIEWS),
  refunds: isEnabled(import.meta.env.VITE_ENABLE_REFUNDS),
  savedAddresses: isEnabled(import.meta.env.VITE_ENABLE_SAVED_ADDRESSES),
  profileEdit: isEnabled(import.meta.env.VITE_ENABLE_PROFILE_EDIT),
  /**
   * Registered-only checkout. Keep false so guests can buy.
   * Set VITE_REQUIRE_LOGIN_TO_BUY=true (or this to true) to require login.
   */
  requireLoginToBuy: isExplicitlyTrue(
    import.meta.env.VITE_REQUIRE_LOGIN_TO_BUY,
  ),
};
