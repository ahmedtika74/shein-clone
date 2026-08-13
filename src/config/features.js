/**
 * Feature switches for customer account UI. Defaults follow env; turn a flag
 * off to hide that surface without removing the wired API code.
 */
const isEnabled = (value) => String(value).toLowerCase() === "true";

export const features = {
  reviews: isEnabled(import.meta.env.VITE_ENABLE_REVIEWS),
  refunds: isEnabled(import.meta.env.VITE_ENABLE_REFUNDS),
  savedAddresses: isEnabled(import.meta.env.VITE_ENABLE_SAVED_ADDRESSES),
  profileEdit: isEnabled(import.meta.env.VITE_ENABLE_PROFILE_EDIT),
};
