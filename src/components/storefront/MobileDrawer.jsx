import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";
import { selectCategories } from "../../store/dataSlice";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { getLocalizedString } from "../../utils/localization";

export const MobileDrawer = ({ isOpen, setIsOpen }) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const user = useSelector(selectUser);
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
          )}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 start-0 h-full w-[80%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col",
          isOpen
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b border-gray-100",
          )}
        >
          <div className={cn("flex items-center gap-3")}>
            <div
              className={cn(
                "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center",
              )}
            >
              <i className={cn("fa-regular fa-user text-lg")}></i>
            </div>
            <div className={cn("flex flex-col")}>
              <span className={cn("text-xs text-gray-500")}>
                {t("welcome")}
              </span>
              <span className={cn("font-bold text-sm")}>
                {user?.name || t("guest")}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
            className={cn(
              "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors",
            )}
          >
            <i className={cn("fa-solid fa-xmark")}></i>
          </button>
        </div>

        <div className={cn("flex-grow overflow-y-auto")}>
          <ul className={cn("py-2")}>
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={cn(
                  `block px-6 py-4 font-semibold border-s-4 transition-colors uppercase ${!currentCategory ? "border-black text-black bg-gray-50" : "border-transparent text-gray-600"}`,
                )}
              >
                ALL
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={`/?category=${encodeURIComponent(item.category)}`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    `block px-6 py-4 font-semibold border-s-4 transition-colors uppercase ${
                      currentCategory === item.category
                        ? "border-black text-black bg-gray-50"
                        : item.isSale
                          ? "border-transparent text-red-500"
                          : "border-transparent text-gray-600"
                    }`,
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto border-t border-gray-100">
          <LanguageSwitcher variant="drawer" />
        </div>
      </div>
    </>
  );
};
