import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

export const ErrorState = ({ title, message, onRetry, retryLabel }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 my-8",
      )}
      role="alert"
    >
      <i
        className={cn(
          "fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4",
        )}
      ></i>
      <h3 className={cn("text-lg font-bold text-gray-900 mb-2")}>
        {title || t("error")}
      </h3>
      <p className={cn("text-gray-500 mb-6 max-w-md")}>
        {message || t("genericErrorMessage")}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors cursor-pointer",
          )}
        >
          {retryLabel || t("retry")}
        </button>
      )}
    </div>
  );
};
