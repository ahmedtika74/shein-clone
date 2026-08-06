import { cn } from "../../utils/cn";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectProducts,
  selectTopSellingProducts,
  selectCategories,
} from "../../store/dataSlice";
import { Hero } from "../../components/storefront/Hero";
import { Categories } from "../../components/storefront/Categories";
import { ProductCard } from "../../components/storefront/ProductCard";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "../../utils/localization";

export const HomePage = () => {
  const { t, i18n } = useTranslation("storefront");
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeSearch = searchParams.get("search");

  const activeCategoryObj = categories?.find(
    (c) => c.nameEn === activeCategory,
  );
  const activeCategoryDisplay = activeCategoryObj
    ? getLocalizedString(activeCategoryObj, "name", i18n.language)
    : activeCategory;

  const topSellingProducts = useSelector(selectTopSellingProducts) || [];

  const filteredProducts = (products || []).filter((product) => {
    let matchesCategory = true;
    if (
      activeCategory &&
      activeCategory !== "ALL" &&
      activeCategory !== "NEW IN" &&
      activeCategory !== "SALE"
    ) {
      matchesCategory =
        product.category?.toLowerCase() === activeCategory.toLowerCase();
    } else if (activeCategory === "SALE") {
      matchesCategory = !!product.oldPrice || !!product.offer;
    }

    let matchesSearch = true;
    if (activeSearch) {
      const searchTarget = activeSearch.toLowerCase();
      const pNameEn = (product.nameEn || product.name || "").toLowerCase();
      const pNameAr = (product.nameAr || product.name || "").toLowerCase();

      matchesSearch =
        pNameEn.includes(searchTarget) ||
        pNameAr.includes(searchTarget) ||
        product.category?.toLowerCase().includes(searchTarget);
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {!activeCategory && !activeSearch && (
        <>
          <Hero />
          <Categories />

          {topSellingProducts.length > 0 && (
            <section className={cn("w-[95%] max-w-7xl mx-auto mt-15 mb-10")}>
              <div
                className={cn(
                  "section-title flex justify-between items-center mb-7.5",
                )}
              >
                <h2
                  className={cn(
                    "text-2xl md:text-[32px] font-bold text-gray-900",
                  )}
                >
                  {t("topSelling")}
                </h2>
              </div>
              <div
                className={cn(
                  "product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6.25",
                )}
              >
                {topSellingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className={cn("w-[95%] max-w-7xl mx-auto my-15")}>
        <div
          className={cn(
            "section-title flex justify-between items-center mb-7.5",
          )}
        >
          <h2 className={cn("text-2xl md:text-[32px] font-bold text-gray-900")}>
            {activeSearch
              ? t("resultsFor", { search: activeSearch })
              : activeCategory
                ? t("collection", { category: activeCategoryDisplay })
                : t("recommendedForYou")}
          </h2>
          {(activeCategory || activeSearch) && (
            <a
              href="/"
              className={cn(
                "text-gray-900 font-bold hover:text-[#e60023] transition-colors text-sm md:text-base",
              )}
            >
              {t("clearFilters")}
            </a>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div
            className={cn(
              "text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 my-8",
            )}
          >
            <i
              className={cn("fa-solid fa-box-open text-5xl text-gray-400 mb-4")}
            ></i>
            <h3 className={cn("text-xl font-bold text-gray-700")}>
              {t("noProductsFound")}
            </h3>
            <p className={cn("text-gray-500 mt-2")}>{t("tryAdjusting")}</p>
          </div>
        ) : (
          <div
            className={cn(
              "product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6.25",
            )}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
