import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../../utils/getImageUrl";

export const RevenueCharts = ({ stats, filterMonth, filterProductId }) => {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <div
      className={cn(
        `grid grid-cols-1 ${filterMonth === "all" ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-8 mb-8`,
      )}
    >
      {filterMonth === "all" && (
        <div
          className={cn(
            "bg-white p-6 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full",
          )}
        >
          <h2
            className={cn("text-lg font-bold text-gray-900 mb-6 border-b pb-3")}
          >
            {t("revenueOverTime")}
          </h2>

          <div
            className={cn("flex flex-col justify-center flex-grow gap-8 py-4")}
          >
            <div>
              <div
                className={cn("flex justify-between text-sm font-bold mb-2")}
              >
                <span className={cn("text-gray-600")}>{t("todayDaily")}</span>
                <span className={cn("text-gray-900")}>
                  {t("egp", { ns: "common" })} {stats.dailyRevenue.toFixed(2)}
                </span>
              </div>
              <div
                className={cn(
                  "w-full bg-gray-100 rounded-full h-3.5 overflow-hidden",
                )}
              >
                <div
                  className={cn(
                    "bg-black h-full rounded-full transition-all duration-1000",
                  )}
                  style={{
                    width: `${(stats.dailyRevenue / stats.maxTimeRevenue) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div
                className={cn("flex justify-between text-sm font-bold mb-2")}
              >
                <span className={cn("text-gray-600")}>
                  {t("thisMonthMonthly")}
                </span>
                <span className={cn("text-gray-900")}>
                  {t("egp", { ns: "common" })} {stats.monthlyRevenue.toFixed(2)}
                </span>
              </div>
              <div
                className={cn(
                  "w-full bg-gray-100 rounded-full h-3.5 overflow-hidden",
                )}
              >
                <div
                  className={cn(
                    "bg-[#e60023] h-full rounded-full transition-all duration-1000",
                  )}
                  style={{
                    width: `${(stats.monthlyRevenue / stats.maxTimeRevenue) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div
                className={cn("flex justify-between text-sm font-bold mb-2")}
              >
                <span className={cn("text-gray-600")}>
                  {t("thisYearYearly")}
                </span>
                <span className={cn("text-gray-900")}>
                  {t("egp", { ns: "common" })} {stats.yearlyRevenue.toFixed(2)}
                </span>
              </div>
              <div
                className={cn(
                  "w-full bg-gray-100 rounded-full h-3.5 overflow-hidden",
                )}
              >
                <div
                  className={cn(
                    "bg-purple-600 h-full rounded-full transition-all duration-1000",
                  )}
                  style={{
                    width: `${(stats.yearlyRevenue / stats.maxTimeRevenue) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "bg-white p-6 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full",
        )}
      >
        <h2
          className={cn("text-lg font-bold text-gray-900 mb-6 border-b pb-3")}
        >
          {filterProductId === "all"
            ? t("top5Selling")
            : t("productSalesPerformance")}
        </h2>

        {stats.topProducts.length === 0 ? (
          <div
            className={cn(
              "flex-grow flex items-center justify-center text-gray-500 py-8 font-medium",
            )}
          >
            {t("noSalesData")}
          </div>
        ) : (
          <div className={cn("flex flex-col justify-center flex-grow gap-5")}>
            {stats.topProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn("flex items-center gap-4 group")}
              >
                <div
                  className={cn(
                    "w-6 font-black text-gray-300 text-lg text-center group-hover:text-black transition-colors",
                  )}
                >
                  #{index + 1}
                </div>
                <img
                  src={getImageUrl(product.img || product.imageUrl)}
                  alt={product.name}
                  className={cn(
                    "w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100 shadow-sm",
                  )}
                />

                <div className={cn("flex-1")}>
                  <h4
                    className={cn(
                      "text-sm font-bold text-gray-900 line-clamp-1 mb-1.5",
                    )}
                  >
                    {product.name}
                  </h4>

                  <div
                    className={cn(
                      "w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-1.5",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-green-500 h-full rounded-full transition-all duration-1000",
                      )}
                      style={{
                        width: `${(product.quantity / stats.maxProductQty) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div
                    className={cn("flex justify-between text-xs text-gray-500")}
                  >
                    <span className={cn("font-medium")}>
                      {product.quantity} {t("itemsSoldSuffix")}
                    </span>
                    <span className={cn("font-black text-gray-900")}>
                      {t("egp", { ns: "common" })}{" "}
                      {Number(product.revenue || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
