import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectCategories } from "../../store/dataSlice";
import { getLocalizedString } from "../../utils/localization";

export const SALE_CATEGORY = "SALE";

/**
 * Category links are keyed by id rather than name so the filter keeps working
 * when the shopper switches language.
 */
export const useCategoryNav = () => {
  const { t, i18n } = useTranslation("storefront");
  const categories = useSelector(selectCategories);
  const [searchParams] = useSearchParams();

  const items = [
    ...categories.map((category) => ({
      key: String(category.id),
      label: getLocalizedString(category, "name", i18n.language).toUpperCase(),
      isSale: false,
    })),
    { key: SALE_CATEGORY, label: t("sale").toUpperCase(), isSale: true },
  ];

  return { items, activeKey: searchParams.get("category") };
};

export const categoryHref = (key) =>
  `/?category=${encodeURIComponent(key)}`;
