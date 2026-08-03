import { cn } from "../../utils/cn";

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 my-8",
      )}
    >
      <i
        className={cn(
          "fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4",
        )}
      ></i>
      <h3 className={cn("text-lg font-bold text-gray-900 mb-2")}>
        Oops! Error Occurred
      </h3>
      <p className={cn("text-gray-500 mb-6 max-w-md")}>{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors",
          )}
        >
          Try Again
        </button>
      )}
    </div>
  );
};
