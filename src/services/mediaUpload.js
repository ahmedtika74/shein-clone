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

    if (typeof data === "string") return data;
    return (
      data?.url ||
      data?.secureUrl ||
      data?.publicUrl ||
      data?.imageUrl ||
      data?.path ||
      ""
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
