import { cn } from "../../../utils/cn";

export const OrderFilters = ({
  filterStatus,
  handleFilterChange,
  totalOrders,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4",
      )}
    >
      <h1 className={cn("text-3xl font-bold text-gray-900")}>
        Manage Customer Orders
      </h1>

      <div className={cn("flex items-center gap-2")}>
        <span className={cn("text-xs font-bold text-gray-500 uppercase")}>
          Filter Status:
        </span>
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className={cn(
            "h-10 px-4 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-[#e60023]",
          )}
        >
          <option value="ALL">All Orders ({totalOrders})</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refund Requested">Refund Requested</option>
          <option value="Refunded">Refunded</option>
          <option value="Refund Refused">Refund Refused</option>
        </select>
      </div>
    </div>
  );
};
