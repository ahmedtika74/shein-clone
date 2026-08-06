import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enStorefront from "./locales/en/storefront.json";
import enAdmin from "./locales/en/admin.json";

import arCommon from "./locales/ar/common.json";
import arStorefront from "./locales/ar/storefront.json";
import arAdmin from "./locales/ar/admin.json";

const resources = {
  en: {
    common: enCommon,
    storefront: enStorefront,
    admin: enAdmin,
  },
  ar: {
    common: arCommon,
    storefront: arStorefront,
    admin: arAdmin,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    debug: false,
    ns: ["common", "storefront", "admin"],
    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
