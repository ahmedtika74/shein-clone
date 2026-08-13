import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { selectSiteSettings } from "../../store/dataSlice";

export const SEO = ({
  title,
  description,
  type = "website",
  name,
  url,
  image,
  noindex = false,
}) => {
  const siteSettings = useSelector(selectSiteSettings);

  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const siteName = name || siteSettings.siteName || "Online Fashion & Shopping";
  const defaultDescription =
    "Discover the latest fashion trends, stylish clothing, and trendy accessories at affordable prices.";
  const metaDescription = description || defaultDescription;

  const formattedTitle = title ? `${title} - ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={metaDescription} />

      <link rel="canonical" href={currentUrl} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={currentUrl} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};
