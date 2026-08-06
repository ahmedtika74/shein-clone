export const getLocalizedString = (item, baseField, language = "en") => {
  if (!item) return "";

  if (language === "ar") {
    return (
      item[`${baseField}Ar`] || item[`${baseField}En`] || item[baseField] || ""
    );
  }

  return item[`${baseField}En`] || item[baseField] || "";
};
