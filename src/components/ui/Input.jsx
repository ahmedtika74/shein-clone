import { cn } from "../../utils/cn";
import { useId } from "react";

export const Input = ({
  label,
  error,
  helperText,
  className,
  id: providedId,
  ...props
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className={cn("w-full flex flex-col gap-1")}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block text-xs font-bold text-gray-700 uppercase",
            error && "text-red-500",
          )}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full p-3 border rounded-lg text-sm outline-none transition-colors",
          error
            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500"
            : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black",
          className,
        )}
        {...props}
      />
      {(error || helperText) && (
        <span
          className={cn(
            "text-xs mt-1",
            error ? "text-red-500 font-medium" : "text-gray-500",
          )}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
};
