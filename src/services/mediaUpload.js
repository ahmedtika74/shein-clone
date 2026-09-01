import { apiClient, getApiErrorMessage } from "./apiClient";

/**
 * MediaUsageCategory values from the API (swagger lists 0–5).
 * Confirm labels with backend if uploads land in the wrong folder.
 */
export const MediaUsageCategory = {
  Product: 0,
  Category: 1,
  Hero: 2,
  PaymentMethod: 3,
  Transaction: 4,
  Other: 5,
};

/**
 * Uploads a file via multipart POST /media/upload.
 * Returns a public URL string from the response envelope data.
 */
export const uploadMedia = async (
  file,
  usageCategory = MediaUsageCategory.Other,
  folder = "",
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("usageCategory", String(usageCategory));
  if (folder) formData.append("folder", folder);

  try {
    const data = await apiClient.post("/media/upload", formData, {
      // Let the browser set multipart boundary; default JSON Content-Type breaks uploads.
      headers: { "Content-Type": undefined },
    });

    return extractMediaUrl(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

const extractMediaUrl = (data) => {
  if (typeof data === "string") return data;
  return (
    data?.url ||
    data?.secureUrl ||
    data?.publicUrl ||
    data?.imageUrl ||
    data?.path ||
    ""
  );
};

/**
 * Customer checkout: upload payment proof via POST /orders/Screenshot.
 * Uses Transaction category; requires a logged-in user bearer token.
 */
export const uploadOrderScreenshot = async (
  file,
  folder = "",
  { guest = false } = {},
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("usageCategory", String(MediaUsageCategory.Transaction));
  if (folder) formData.append("folder", folder);

  try {
    const data = await apiClient.post("/orders/Screenshot", formData, {
      headers: { "Content-Type": undefined },
      authScope: guest ? "none" : "user",
    });
    return extractMediaUrl(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
