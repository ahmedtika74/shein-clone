import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

export const LoadingSpinner = ({ fullScreen = false }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        fullScreen ? "h-screen w-full" : "h-full w-full py-12",
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin",
        )}
      />
      <p className={cn("text-gray-500 font-medium")}>{t("loading")}</p>
    </div>
  );
};
