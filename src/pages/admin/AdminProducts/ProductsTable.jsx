import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { Pagination } from "../../../components/common/Pagination";
import { Input, Button } from "../../../components/ui";
import { getLocalizedString } from "../../../utils/localization";

export const ProductsTable = ({ products, categories, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation(["admin", "common"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const filteredProducts = products.filter((p) => {
    const localizedName = getLocalizedString(p, "name", i18n.language) || "";
    const matchesSearch = localizedName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100",
        )}
      >
        <div className={cn("flex-1 relative")}>
          <i
            className={cn(
              "fa-solid fa-search absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 z-10",
            )}
          ></i>
          <Input
            type="text"
            placeholder={t("searchProducts")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={cn("ps-10 h-10 w-full")}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          className={cn(
            "w-full sm:w-64 h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-black outline-none bg-white",
          )}
        >
          <option value="ALL">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div
        className={cn(
          "table-box bg-white rounded-[20px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] mb-12",
        )}
      >
        <div className={cn("overflow-x-auto")}>
          <table className={cn("w-full text-start border-collapse")}>
            <thead>
              <tr className={cn("bg-[#111] text-white text-sm font-bold")}>
                <th className={cn("p-4 whitespace-nowrap text-start")}>
                  {t("image")}
                </th>
                <th className={cn("p-4 whitespace-nowrap text-start")}>
                  {t("name")}
                </th>
                <th className={cn("p-4 whitespace-nowrap text-start")}>
                  {t("newPrice")}
                </th>
                <th className={cn("p-4 whitespace-nowrap text-start")}>
                  {t("oldPrice")}
                </th>
                <th className={cn("p-4 whitespace-nowrap text-start")}>
                  {t("category")}
                </th>
                <th className={cn("p-4 whitespace-nowrap text-start")}>
                  {t("totalStock")}
                </th>
                <th className={cn("p-4 whitespace-nowrap text-start")}>
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className={cn("divide-y divide-gray-100 text-sm")}>
              {currentProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className={cn("p-8 text-center text-gray-500")}
                  >
                    {t("noProductsMatching")}
                  </td>
                </tr>
              ) : (
                currentProducts.map((p) => {
                  const mainImg =
                    p.images?.[p.mainIndex || 0] || p.img || "/images/top.jpg";

                  const totalStock = p.variantsStock
                    ? Object.values(p.variantsStock).reduce(
                        (acc, curr) => acc + curr,
                        0,
                      )
                    : 0;

                  return (
                    <tr key={p.id} className={cn("hover:bg-gray-50")}>
                      <td className={cn("p-4 whitespace-nowrap")}>
                        <img
                          src={mainImg}
                          alt={getLocalizedString(p, "name", i18n.language)}
                          className={cn(
                            "w-17.5 h-17.5 object-cover rounded-xl border",
                          )}
                        />
                      </td>
                      <td
                        className={cn(
                          "p-4 font-bold text-gray-900 whitespace-nowrap",
                        )}
                      >
                        {getLocalizedString(p, "name", i18n.language)}
                      </td>
                      <td
                        className={cn(
                          "p-4 text-[#e60023] font-bold whitespace-nowrap",
                        )}
                      >
                        {p.newPrice}
                      </td>
                      <td
                        className={cn(
                          "p-4 text-gray-400 line-through whitespace-nowrap",
                        )}
                      >
                        {p.oldPrice || "-"}
                      </td>
                      <td
                        className={cn(
                          "p-4 text-gray-500 font-medium whitespace-nowrap",
                        )}
                      >
                        {p.category || "Uncategorized"}
                      </td>
                      <td
                        className={cn(
                          "p-4 font-bold whitespace-nowrap",
                          totalStock > 0 ? "text-green-600" : "text-red-500",
                        )}
                      >
                        {totalStock}
                      </td>
                      <td
                        className={cn(
                          "p-4 flex items-center gap-3 whitespace-nowrap",
                        )}
                      >
                        <div className={cn("flex items-center gap-2")}>
                          <Button
                            variant="primary"
                            size="icon"
                            onClick={() => onEdit(p)}
                            className={cn(
                              "w-10 h-10 rounded-full bg-[#111] hover:bg-[#e60023]",
                            )}
                            title="Edit Product"
                          >
                            <i className={cn("fa-solid fa-pen text-xs")}></i>
                          </Button>
                          <Button
                            variant="primary"
                            size="icon"
                            onClick={() => onDelete(p)}
                            className={cn(
                              "w-10 h-10 rounded-full bg-[#111] hover:bg-red-700",
                            )}
                            title="Delete Product"
                          >
                            <i className={cn("fa-solid fa-trash text-xs")}></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className={cn("pb-6")}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};
