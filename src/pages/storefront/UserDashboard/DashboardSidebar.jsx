import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../../../store/authSlice";

export const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  dispatch,
  navigate,
}) => {
  const { t } = useTranslation(["storefront", "common"]);
  return (
    <aside
      className={cn(
        "sidebar w-[250px] bg-[#111] text-white p-6 hidden md:flex flex-col justify-between h-[calc(100vh-165px)] sticky top-[165px] overflow-y-auto flex-shrink-0",
      )}
    >
      <div>
        <h2
          className={cn("text-center text-2xl font-bold mb-10 tracking-tight")}
        >
          <i className={cn("fa-regular fa-user me-2")}></i> {t("myProfile")}
        </h2>

        <ul className={cn("space-y-2")}>
          <li
            onClick={() => setActiveTab("orders")}
            className={cn(
              `p-3.5 rounded-lg cursor-pointer font-semibold transition-colors flex items-center gap-3 ${
                activeTab === "orders"
                  ? "bg-white text-[#111]"
                  : "hover:bg-gray-800 text-gray-300"
              }`,
            )}
          >
            <i className={cn("fa-solid fa-box")}></i>
            {t("myOrders")}
          </li>

          <li
            onClick={() => setActiveTab("profile")}
            className={cn(
              `p-3.5 rounded-lg cursor-pointer font-semibold transition-colors flex items-center gap-3 ${
                activeTab === "profile"
                  ? "bg-white text-[#111]"
                  : "hover:bg-gray-800 text-gray-300"
              }`,
            )}
          >
            <i className={cn("fa-solid fa-id-card")}></i> {t("personalInfo")}
          </li>
        </ul>
      </div>

      <div className={cn("pt-6 border-t border-gray-800")}>
        <button
          onClick={() => {
            dispatch(logoutUser());
            navigate("/");
          }}
          className={cn(
            "w-full flex items-center p-3.5 rounded-[10px] cursor-pointer transition-colors text-sm font-semibold bg-gray-900 hover:bg-red-700 text-gray-300 hover:text-white",
          )}
        >
          <i
            className={cn(
              "fa-solid fa-end-from-bracket w-[25px] text-center me-3",
            )}
          ></i>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
};
