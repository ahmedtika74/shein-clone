import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { useCategoryNav, categoryHref } from "./useCategoryNav";

const ActiveUnderline = () => (
  <span
    className={cn(
      "absolute bottom-0 start-0 w-full h-[3px] bg-black rounded-t-md",
    )}
  ></span>
);

export const Navbar = () => {
  const { t } = useTranslation("storefront");
  const { items, activeKey } = useCategoryNav();

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
                "relative py-2 hover:text-black transition-colors uppercase",
                activeKey ? "text-gray-500" : "text-black",
              )}
            >
              {t("all")}
              {!activeKey && <ActiveUnderline />}
            </Link>
          </li>

          {items.map((item) => (
            <li key={item.key}>
              <Link
                to={categoryHref(item.key)}
                className={cn(
                  "relative py-2 transition-colors uppercase",
                  activeKey === item.key
                    ? "text-black"
                    : item.isSale
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-500 hover:text-black",
                )}
              >
                {item.label}
                {activeKey === item.key && <ActiveUnderline />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
