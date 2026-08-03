import { cn } from "../../utils/cn";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectProducts,
  selectTopSellingProducts,
} from "../../store/dataSlice";
import { Hero } from "../../components/storefront/Hero";
import { Categories } from "../../components/storefront/Categories";
import { ProductCard } from "../../components/storefront/ProductCard";

export const HomePage = () => {
  const products = useSelector(selectProducts);
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeSearch = searchParams.get("search");

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
      matchesSearch =
        product.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        product.category?.toLowerCase().includes(activeSearch.toLowerCase());
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
                  Top Sales
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
              ? `Results for "${activeSearch}"`
              : activeCategory
                ? `${activeCategory} Collection`
                : "Recommended For You"}
          </h2>
          {(activeCategory || activeSearch) && (
            <a
              href="/"
              className={cn(
                "text-gray-900 font-bold hover:text-[#e60023] transition-colors text-sm md:text-base",
              )}
            >
              Clear Filters
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
              No products found
            </h3>
            <p className={cn("text-gray-500 mt-2")}>
              Try adjusting your search or category filter.
            </p>
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
