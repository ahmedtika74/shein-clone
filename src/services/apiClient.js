import axios from "axios";

export const ALL_ITEMS_PAGE_SIZE = 1000;

const ADMIN_TOKEN_KEY = "adminToken";
const CURRENT_USER_KEY = "currentUser";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/** Every backend response is wrapped in `{ isSuccess, message, errors, data }`. */
const unwrapEnvelope = (body) =>
  body && typeof body === "object" && "isSuccess" in body && "data" in body
    ? body.data
    : body;

/** Paged payloads nest the collection under `items`; plain ones are arrays. */
export const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
};

export const getApiErrorMessage = (error) => {
  const body = error?.response?.data;
  if (!body) {
    return error?.message || "Something went wrong";
  }
  if (typeof body === "string" && body.trim()) {
    return body.length > 300 ? `${body.slice(0, 300)}…` : body;
  }

  if (Array.isArray(body.errors) && body.errors[0]) {
    return body.errors[0];
  }

  // ASP.NET validation problem details: { errors: { Field: ["msg"] } }
  if (body.errors && typeof body.errors === "object") {
    const first = Object.values(body.errors).flat().find(Boolean);
    if (first) return first;
  }

  return (
    body.message ||
    body.detail ||
    body.title ||
    error?.message ||
    "Something went wrong"
  );
};

const readUserToken = () => {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY))?.token ?? null;
  } catch {
    return null;
  }
};

/**
 * Admin and customer sessions can coexist in one browser. Picking whichever
 * token happens to be in localStorage would send an admin bearer on storefront
 * calls, so the area decides. Pass `authScope` on a request to override.
 */
const resolveAuthScope = (config) =>
  config.authScope ??
  (window.location.pathname.startsWith("/admin") ? "admin" : "user");

apiClient.interceptors.request.use((config) => {
  const scope = resolveAuthScope(config);
  const token =
    scope === "none"
      ? null
      : scope === "admin"
        ? localStorage.getItem(ADMIN_TOKEN_KEY)
        : readUserToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Default JSON Content-Type breaks multipart uploads (missing boundary).
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => unwrapEnvelope(response.data),
  (error) => {
    const config = error.config ?? {};

    // 403 means "authenticated but not allowed" and must not end the session.
    if (error.response?.status === 401 && !config.skipAuthRedirect) {
      window.dispatchEvent(
        new CustomEvent("auth:unauthorized", {
          detail: { scope: resolveAuthScope(config) },
        }),
      );
    }
    return Promise.reject(error);
  },
);

export { apiClient };
