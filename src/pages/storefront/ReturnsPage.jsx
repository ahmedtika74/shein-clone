import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { SEO } from "../../components/common/SEO";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { getImageUrl } from "../../utils/getImageUrl";
import { getLocalizedString } from "../../utils/localization";
import {
  fetchReturnsPageThunk,
  selectReturnsPage,
  selectSiteSettings,
} from "../../store/dataSlice";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80";

export const ReturnsPage = () => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  const dispatch = useDispatch();
  const returns = useSelector(selectReturnsPage);
  const siteSettings = useSelector(selectSiteSettings);
  const [loading, setLoading] = useState(true);
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setUsingPlaceholder(false);
    dispatch(fetchReturnsPageThunk())
      .unwrap()
      .then((data) => {
        if (cancelled) return;
        const hasContent =
          Boolean(data?.titleEn || data?.titleAr) ||
          Boolean(data?.contentEn || data?.contentAr);
        setUsingPlaceholder(!hasContent);
      })
      .catch(() => {
        if (!cancelled) setUsingPlaceholder(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const apiTitle = getLocalizedString(returns, "title", i18n.language);
  const apiContent = getLocalizedString(returns, "content", i18n.language);
  const apiImage = getImageUrl(returns.imageUrl);

  const title = usingPlaceholder
    ? t("returnsPlaceholderTitle")
    : apiTitle || t("returns");
  const content = usingPlaceholder
    ? t("returnsPlaceholderContent")
    : apiContent || t("returnsEmpty");
  const imageUrl = usingPlaceholder
    ? PLACEHOLDER_IMAGE
    : apiImage || PLACEHOLDER_IMAGE;
  const siteName = siteSettings.siteName || t("returns");

  return (
    <div className={cn("pb-28 md:pb-14")}>
      <SEO title={title} description={String(content).slice(0, 160)} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            className={cn(
              "w-full h-[220px] sm:h-[320px] md:h-[400px] overflow-hidden bg-[#111] relative",
            )}
          >
            <img
              src={imageUrl}
              alt={title}
              className={cn("w-full h-full object-cover opacity-90")}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent",
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 start-0 end-0 p-6 sm:p-10 max-w-3xl mx-auto w-full",
              )}
            >
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-wider text-white/70 mb-2",
                )}
              >
                {siteName}
              </p>
              <h1
                className={cn(
                  "text-3xl sm:text-4xl md:text-5xl font-bold text-white",
                )}
              >
                {title}
              </h1>
            </div>
          </div>

          <div className={cn("max-w-3xl mx-auto px-4 py-10 sm:py-14")}>
            {usingPlaceholder && (
              <p
                className={cn(
                  "mb-6 text-xs font-bold uppercase tracking-wider text-[#e60023]",
                )}
              >
                {t("returnsPlaceholderBadge")}
              </p>
            )}
            <div
              className={cn(
                "text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-line",
              )}
            >
              {content}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
