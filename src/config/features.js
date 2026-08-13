/**
 * Feature switches for customer account UI.
 * Missing/empty env values default to ON (production-ready).
 * Set a flag to "false" to hide that surface without removing API code.
 */
const isEnabled = (value) => {
  if (value === undefined || value === null || value === "") return true;
  return String(value).toLowerCase() === "true";
};

export const features = {
  reviews: isEnabled(import.meta.env.VITE_ENABLE_REVIEWS),
  refunds: isEnabled(import.meta.env.VITE_ENABLE_REFUNDS),
  savedAddresses: isEnabled(import.meta.env.VITE_ENABLE_SAVED_ADDRESSES),
  profileEdit: isEnabled(import.meta.env.VITE_ENABLE_PROFILE_EDIT),
};
