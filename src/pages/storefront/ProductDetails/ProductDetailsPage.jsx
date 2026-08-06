import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { useProductDetails } from "./useProductDetails";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ReviewsSection } from "./ReviewsSection";
import { ProductCard } from "../../../components/storefront/ProductCard";
import { getLocalizedString } from "../../../utils/localization";

export const ProductDetailsPage = () => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const details = useProductDetails();

  if (!details.product) {
    return (
      <div className={cn("max-w-7xl mx-auto py-20 text-center")}>
        <h2 className={cn("text-2xl font-bold")}>{t("productNotFound")}</h2>
        <Link to="/" className={cn("text-red-600 underline mt-4 inline-block")}>
          {t("returnToStorefront")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "product-page-container max-w-7xl mx-auto px-4 md:px-8 py-10",
      )}
    >
      <div className={cn("product-details flex flex-col md:flex-row gap-12")}>
        <ProductGallery
          imagesList={details.imagesList}
          selectedImg={details.selectedImg}
          setSelectedImg={details.setSelectedImg}
          productName={getLocalizedString(
            details.product,
            "name",
            i18n.language,
          )}
        />

        <ProductInfo {...details} />
      </div>

      {details.suggestedProducts.length > 0 && (
        <div
          className={cn(
            "suggested-products mt-16 border-t border-gray-200 pt-10",
          )}
        >
          <h2 className={cn("text-2xl font-bold text-gray-900 mb-8")}>
            {t("youMightAlsoLike")}
          </h2>
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
            )}
          >
            {details.suggestedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <ReviewsSection {...details} />
    </div>
  );
};
