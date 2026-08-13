import { cn } from "../../utils/cn";
import { useEffect } from "react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = "max-w-md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full relative z-10 animate-fade-in-up max-h-[92dvh] sm:max-h-[90vh] flex flex-col",
          maxWidth,
          className,
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 shrink-0",
          )}
        >
          <h2 className={cn("text-lg sm:text-xl font-bold text-gray-900 pe-2")}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0",
            )}
          >
            <i className={cn("fa-solid fa-times text-xl")}></i>
          </button>
        </div>
        <div className={cn("p-4 sm:p-6 overflow-y-auto overscroll-contain")}>
          {children}
        </div>
      </div>
    </div>
  );
};
