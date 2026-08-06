import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCategories } from "../../store/dataSlice";
import { getLocalizedString } from "../../utils/localization";

export const Navbar = () => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");

  const categories = useSelector(selectCategories);

  const navItems = [
    ...categories.map((c) => ({
      label: getLocalizedString(c, "name", i18n.language).toUpperCase(),
      category: c.name || c.nameEn,
    })),
    { label: t("sale"), category: "SALE", isSale: true },
  ];

  return (
    <nav
      className={cn(
        "bg-transparent py-2 border-b border-gray-100 hidden md:block",
      )}
    >
      <div className={cn("w-[95%] max-w-7xl mx-auto")}>
        <ul
          className={cn(
            "flex items-center justify-center gap-6 md:gap-10 flex-wrap text-sm font-semibold tracking-wider",
          )}
        >
          <li>
            <Link
              to="/"
              className={cn(
                `relative py-2 text-gray-500 hover:text-black transition-colors uppercase ${
                  !currentCategory ? "text-black" : ""
                }`,
              )}
            >
              ALL
              {!currentCategory && (
                <span
                  className={cn(
                    "absolute bottom-0 start-0 w-full h-[3px] bg-black rounded-t-md",
                  )}
                ></span>
              )}
            </Link>
          </li>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={`/?category=${encodeURIComponent(item.category)}`}
                className={cn(
                  `relative py-2 transition-colors uppercase ${
                    currentCategory === item.category
                      ? "text-black"
                      : item.isSale
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-500 hover:text-black"
                  }`,
                )}
              >
                {item.label}
                {currentCategory === item.category && (
                  <span
                    className={cn(
                      "absolute bottom-0 start-0 w-full h-[3px] bg-black rounded-t-md",
                    )}
                  ></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
