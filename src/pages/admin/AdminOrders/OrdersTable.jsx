import { useState } from "react";
import { cn } from "../../../utils/cn";
import { Pagination } from "../../../components/common/Pagination";
import { Card, CardContent, Button } from "../../../components/ui";
import { OrderExpandedDetails } from "./OrderExpandedDetails";
import { OrderItemsList } from "./OrderItemsList";
import { RefuseRefundModal } from "./RefuseRefundModal";

export const OrdersTable = ({
  currentOrders,
  expandedOrders,
  toggleExpand,
  handleUpdateStatus,
  handleDeleteOrder,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const [refusingOrderId, setRefusingOrderId] = useState(null);
  const [refusalReason, setRefusalReason] = useState("");

  return (
    <div className={cn("space-y-6")}>
      {currentOrders.map((order) => (
        <Card
          key={order.id}
          className={cn(
            "shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px] p-0",
          )}
        >
          <CardContent className={cn("p-6")}>
            <div
              className={cn(
                "flex flex-col md:flex-row md:justify-between md:items-center mb-4 pb-3 border-b gap-4",
              )}
            >
              <div>
                <h3 className={cn("text-lg font-bold text-gray-900")}>
                  Order #{order.id}
                </h3>
                <p className={cn("text-xs text-gray-400")}>
                  Placed on:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : order.date || "Recent"}
                </p>
              </div>

              <div className={cn("flex flex-wrap items-center gap-2 sm:gap-4")}>
                <div className={cn("flex items-center gap-2")}>
                  <span className={cn("text-xs font-bold text-gray-500")}>
                    Status:
                  </span>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "Refund Refused") {
                        setRefusingOrderId(order.id);
                        setRefusalReason("");
                      } else {
                        handleUpdateStatus(order.id, val);
                      }
                    }}
                    className={cn(
                      "h-9 px-3 border border-gray-300 rounded-md text-xs font-bold bg-gray-50 outline-none focus:border-black",
                    )}
                  >
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

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleExpand(order.id)}
                >
                  {expandedOrders[order.id] ? "Hide Details" : "View Details"}
                </Button>

                <Button
                  variant="primary"
                  size="icon"
                  onClick={() => handleDeleteOrder(order.id)}
                  disabled={isLoading}
                  className={cn(
                    "w-8 h-8 rounded-full bg-red-100 hover:bg-red-600 text-red-600 hover:text-white disabled:opacity-50",
                  )}
                  title="Delete Order"
                >
                  <i className={cn("fa-solid fa-trash text-xs")}></i>
                </Button>
              </div>
            </div>

            {expandedOrders[order.id] && <OrderExpandedDetails order={order} />}

            {/* Order Items Table */}
            <OrderItemsList order={order} />
          </CardContent>
        </Card>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <RefuseRefundModal
        refusingOrderId={refusingOrderId}
        setRefusingOrderId={setRefusingOrderId}
        refusalReason={refusalReason}
        setRefusalReason={setRefusalReason}
        handleUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
