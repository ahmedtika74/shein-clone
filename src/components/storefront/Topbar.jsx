import { cn } from "../../utils/cn";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAnnouncements } from "../../store/dataSlice";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "../../utils/localization";

export const Topbar = () => {
  const { i18n } = useTranslation();
  const announcements = useSelector(selectAnnouncements);
  const [isDismissed, setIsDismissed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeAnnouncements = announcements.filter((a) => a.isActive);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("announcementDismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const goToNext = useCallback(() => {
    if (activeAnnouncements.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
      setIsAnimating(false);
    }, 400);
  }, [activeAnnouncements.length]);

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length, goToNext]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("announcementDismissed", "true");
  };

  if (activeAnnouncements.length === 0 || isDismissed) {
    return null;
  }

  const current = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  return (
    <div
      className={cn(
        "relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center text-[10px] sm:text-xs md:text-sm font-semibold h-10 flex items-center justify-center uppercase tracking-wider md:tracking-[0.2em] shadow-sm px-8 md:px-12 overflow-hidden",
      )}
    >
      <p
        className={cn(
          "truncate max-w-full transition-all duration-400",
          isAnimating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0",
        )}
      >
        {getLocalizedString(current, "text", i18n.language)}
      </p>

      {activeAnnouncements.length > 1 && (
        <div
          className={cn(
            "absolute start-1/2 -translate-x-1/2 bottom-0.5 flex gap-1",
          )}
        >
          {activeAnnouncements.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "w-1 h-1 rounded-full transition-all duration-300",
                idx === currentIndex ? "bg-white w-2.5" : "bg-white/40",
              )}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleDismiss}
        className={cn(
          "absolute end-2 md:end-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer",
        )}
        aria-label="Close announcement"
      >
        <i className={cn("fa-solid fa-xmark text-xs md:text-sm")}></i>
      </button>
    </div>
  );
};
