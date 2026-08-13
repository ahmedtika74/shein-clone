const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f3f4f6"/><path d="M140 250l45-55 35 42 30-35 50 68z" fill="#d1d5db"/><circle cx="165" cy="160" r="22" fill="#d1d5db"/></svg>`,
  );

/**
 * The API stores relative paths (`/products/shirt.png`) but does not serve
 * static files, so those resolve against this app's own `public/` folder.
 * Set VITE_ASSET_BASE_URL once images move to a CDN or the API serves them.
 */
const assetBaseUrl = (import.meta.env.VITE_ASSET_BASE_URL || "").replace(
  /\/$/,
  "",
);

export const getImageUrl = (url) => {
  if (!url) return PLACEHOLDER;
  if (/^(https?:|data:|blob:)/.test(url)) return url;

  const path = url.startsWith("/") ? url : `/${url}`;
  return assetBaseUrl ? `${assetBaseUrl}${path}` : path;
};
