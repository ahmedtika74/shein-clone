import { cn } from "../../utils/cn";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-[10px] shadow-sm border border-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "px-6 py-4 border-b border-gray-100 flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={cn("text-lg font-bold text-gray-900", className)} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4 border-t border-gray-100 bg-gray-50", className)}
      {...props}
    >
      {children}
    </div>
  );
};
