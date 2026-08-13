const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let scriptPromise = null;

export const getGoogleClientId = () =>
  String(import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();

export const isGoogleSignInConfigured = () => Boolean(getGoogleClientId());

export const loadGoogleIdentityScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Sign-In requires a browser"));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Sign-In")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Google Sign-In"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};
