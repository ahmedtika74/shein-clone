import { cn } from "../../../utils/cn";
import { Pagination } from "../../../components/common/Pagination";
import { UserOrderCard } from "./UserOrderCard";

export const OrdersTab = ({
  filteredOrders,
  filterStatus,
  setFilterStatus,
  setCancelOrderId,
  setRefundOrderId,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  return (
    <div>
      <div className={cn("flex justify-between items-center mb-6")}>
        <h2 className={cn("text-xl font-bold text-gray-800")}>Recent Orders</h2>
        <div className={cn("flex items-center gap-2")}>
          <span
            className={cn(
              "text-xs font-bold text-gray-500 uppercase hidden sm:inline-block",
            )}
          >
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "h-9 px-3 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-black",
            )}
          >
            <option value="ALL">All Orders</option>
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

      {filteredOrders.length === 0 ? (
        <div
          className={cn(
            "empty bg-white p-10 text-center rounded-[15px] shadow-xs text-gray-500",
          )}
        >
          <i
            className={cn(
              "fa-solid fa-box-open text-4xl text-gray-300 mb-3 block",
            )}
          ></i>
          No order history yet.
        </div>
      ) : (
        <div className={cn("space-y-6")}>
          {filteredOrders.map((order) => (
            <UserOrderCard
              key={order.id}
              order={order}
              setCancelOrderId={setCancelOrderId}
              setRefundOrderId={setRefundOrderId}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={cn("mt-8")}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
