import { cn } from "../../utils/cn";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAnnouncement } from "../../store/dataSlice";

export const Topbar = () => {
  const announcement = useSelector(selectAnnouncement);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("announcementDismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("announcementDismissed", "true");
  };

  if (!announcement?.isActive || isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center text-[10px] sm:text-xs md:text-sm font-semibold h-10 flex items-center justify-center uppercase tracking-wider md:tracking-[0.2em] shadow-sm px-8 md:px-12",
      )}
    >
      <p className={cn("truncate max-w-full")}>{announcement.text}</p>
      <button
        onClick={handleDismiss}
        className={cn(
          "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer",
        )}
        aria-label="Close announcement"
      >
        <i className={cn("fa-solid fa-xmark text-xs md:text-sm")}></i>
      </button>
    </div>
  );
};
