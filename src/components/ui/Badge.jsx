import { cn } from "../../utils/cn";

const variants = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  brand: "bg-[#e60023] text-white",
};

export const Badge = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
