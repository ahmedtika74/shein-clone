/**
 * Detect wallet type from payment method name (EN/AR).
 * Details fields hold the Instapay URL or VF Cash phone number.
 */
export const getPaymentMethodKind = (method) => {
  const name = [
    method?.nameEn,
    method?.nameAr,
    method?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (name.includes("instapay") || name.includes("insta pay") || name.includes("انستا")) {
    return "instapay";
  }
  if (
    name.includes("vodafone") ||
    name.includes("vf cash") ||
    name.includes("vfcash") ||
    name.includes("فودافون") ||
    name.includes("فودافون كاش")
  ) {
    return "vfcash";
  }
  return "other";
};

export const getPaymentDetailsText = (method, language = "en") => {
  if (!method) return "";
  if (language === "ar") {
    return (
      method.detailsAr ||
      method.detailsEn ||
      method.details ||
      ""
    ).trim();
  }
  return (
    method.detailsEn ||
    method.detailsAr ||
    method.details ||
    ""
  ).trim();
};

/** Prefer an explicit URL inside details; otherwise treat the whole field as a link. */
export const extractPaymentLink = (details) => {
  const text = String(details || "").trim();
  if (!text) return "";

  const match = text.match(/https?:\/\/[^\s<>"']+/i);
  if (match) return match[0].replace(/[.,);]+$/, "");

  if (/^https?:\/\//i.test(text)) return text;
  // Common Instapay deep-link / IPA schemes
  if (/^(ipa|instapay):\/\//i.test(text)) return text;

  return "";
};

/** Pull an Egyptian mobile (or longest digit run) from VF Cash details. */
export const extractPaymentNumber = (details) => {
  const text = String(details || "").trim();
  if (!text) return "";

  const egMobile = text.match(/(?:\+?20)?0?1[0125]\d{8}/);
  if (egMobile) {
    const raw = egMobile[0].replace(/\D/g, "");
    if (raw.startsWith("20") && raw.length === 12) return `0${raw.slice(2)}`;
    if (raw.length === 10 && raw.startsWith("1")) return `0${raw}`;
    return raw.startsWith("0") ? raw : egMobile[0];
  }

  const digits = text.replace(/\D/g, "");
  return digits.length >= 8 ? digits : text;
};

export const openPaymentLink = (details) => {
  const url = extractPaymentLink(details);
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};

export const copyPaymentNumber = async (details) => {
  const number = extractPaymentNumber(details);
  if (!number) return false;
  try {
    await navigator.clipboard.writeText(number);
    return number;
  } catch {
    // Fallback for older browsers / insecure contexts
    const input = document.createElement("input");
    input.value = number;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    return number;
  }
};
