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
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center")}>
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "bg-white rounded-2xl shadow-xl w-full mx-4 relative z-10 animate-fade-in-up",
          maxWidth,
          className,
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between p-6 border-b border-gray-100",
          )}
        >
          <h2 className={cn("text-xl font-bold text-gray-900")}>{title}</h2>
          <button
            onClick={onClose}
            className={cn(
              "text-gray-400 hover:text-gray-600 transition-colors cursor-pointer",
            )}
          >
            <i className={cn("fa-solid fa-times text-xl")}></i>
          </button>
        </div>
        <div className={cn("p-6")}>{children}</div>
      </div>
    </div>
  );
};
