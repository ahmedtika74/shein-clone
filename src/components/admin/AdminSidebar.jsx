import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../store/authSlice";
import { selectSiteSettings } from "../../store/dataSlice";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation(["admin", "common"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const siteSettings = useSelector(selectSiteSettings);

  const menuItems = [
    { label: t("dashboard"), path: "/admin/dashboard", icon: "fa-chart-line" },
    { label: t("reports"), path: "/admin/reports", icon: "fa-chart-pie" },
    { label: t("products"), path: "/admin/products", icon: "fa-box" },
    { label: t("categories"), path: "/admin/categories", icon: "fa-list" },
    { label: t("heroBanners"), path: "/admin/hero", icon: "fa-house" },
    {
      label: t("announcement"),
      path: "/admin/announcement",
      icon: "fa-bullhorn",
    },
    { label: t("offers"), path: "/admin/offers", icon: "fa-tags" },
    {
      label: t("paymentMethods"),
      path: "/admin/payment-methods",
      icon: "fa-credit-card",
    },
    {
      label: t("shippingRates"),
      path: "/admin/shipping-rates",
      icon: "fa-truck",
    },
    { label: t("orders"), path: "/admin/orders", icon: "fa-cart-shopping" },
    { label: t("siteSettings"), path: "/admin/settings", icon: "fa-gear" },
  ];

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  return (
    <aside
      className={cn(
        "sidebar w-[250px] bg-[#111] text-white p-6 h-screen overflow-y-auto flex flex-col justify-between flex-shrink-0 z-50",
        "fixed md:sticky top-0 start-0 transition-transform duration-300 ease-in-out",
        isOpen
          ? "translate-x-0"
          : "-translate-x-full rtl:translate-x-full md:translate-x-0 rtl:md:translate-x-0",
      )}
    >
      <div>
        <div className={cn("flex justify-between items-center mb-8")}>
          <h2
            className={cn(
              "text-xl font-bold flex items-center gap-3 text-white uppercase",
            )}
          >
            <i className={cn("fa-solid fa-shop text-[#e60023] text-2xl")}></i>
            {siteSettings.siteName}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "md:hidden text-gray-400 hover:text-white cursor-pointer",
            )}
            aria-label="Close Menu"
          >
            <i className={cn("fa-solid fa-xmark text-xl")}></i>
          </button>
        </div>
        <ul className={cn("space-y-2")}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center p-3.5 rounded-[10px] cursor-pointer transition-colors text-sm font-semibold ${
                    isActive
                      ? "bg-[#e60023] text-white"
                      : "hover:bg-[#e60023]/80 text-gray-300"
                  }`
                }
              >
                <i
                  className={cn(
                    `fa-solid ${item.icon} w-[25px] text-center me-3`,
                  )}
                ></i>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col gap-2">
        <LanguageSwitcher variant="admin" />
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center p-3.5 rounded-[10px] cursor-pointer transition-colors text-sm font-semibold bg-gray-900 hover:bg-red-700 text-gray-300 hover:text-white",
          )}
        >
          <i
            className={cn(
              "fa-solid fa-right-from-bracket w-[25px] text-center me-3",
            )}
          ></i>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
};
