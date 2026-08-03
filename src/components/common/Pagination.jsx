import { cn } from "../../utils/cn";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex justify-center items-center gap-2 mt-8")}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        <i className={cn("fa-solid fa-chevron-left")}></i>
      </button>

      <div className={cn("flex gap-1")}>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              `w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`,
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        <i className={cn("fa-solid fa-chevron-right")}></i>
      </button>
    </div>
  );
};
