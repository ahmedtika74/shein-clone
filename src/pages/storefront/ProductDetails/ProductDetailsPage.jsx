import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { useProductDetails } from "./useProductDetails";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ReviewsSection } from "./ReviewsSection";
import { ProductCard } from "../../../components/storefront/ProductCard";
import { SEO } from "../../../components/common/SEO";
import { getLocalizedString } from "../../../utils/localization";
import { getImageUrl } from "../../../utils/getImageUrl";

export const ProductDetailsPage = () => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const details = useProductDetails();
  const { product } = details;

  if (!product) {
    return (
      <div className={cn("max-w-7xl mx-auto py-20 text-center")}>
        <h2 className={cn("text-2xl font-bold")}>{t("productNotFound")}</h2>
        <Link to="/" className={cn("text-red-600 underline mt-4 inline-block")}>
          {t("returnToStorefront")}
        </Link>
      </div>
    );
  }

  const productName = getLocalizedString(product, "name", i18n.language);

  return (
    <div
      className={cn(
        "product-page-container max-w-7xl mx-auto px-4 md:px-8 py-10",
      )}
    >
      <SEO
        title={productName}
        description={getLocalizedString(product, "description", i18n.language)}
        image={getImageUrl(product.img)}
      />

      <div className={cn("product-details flex flex-col md:flex-row gap-12")}>
        <ProductGallery
          imagesList={details.imagesList}
          selectedImg={details.selectedImg}
          setSelectedImg={details.setSelectedImg}
          productName={productName}
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
            {details.suggestedProducts.map((suggestion) => (
              <ProductCard key={suggestion.id} product={suggestion} />
            ))}
          </div>
        </div>
      )}

      <ReviewsSection
        product={product}
        reviews={details.reviews}
        reviewsLoading={details.reviewsLoading}
        isLoggedIn={details.isLoggedIn}
      />
    </div>
  );
};
