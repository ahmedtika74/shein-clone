import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * index.html already sends PageView on first load. This fires again when the
 * SPA changes routes so Meta still sees each page.
 */
export const MetaPixelPageView = () => {
  const { pathname, search } = useLocation();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
};
