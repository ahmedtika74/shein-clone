import { cn } from "../../../utils/cn";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";

export const UserOrderCard = ({
  order,
  setCancelOrderId,
  setRefundOrderId,
}) => {
  const getStatusVariant = (status) => {
    if (status === "Completed") return "success";
    if (status === "Cancelled" || status === "Refund Refused") return "error";
    if (status === "Refund Requested") return "warning";
    return "default";
  };

  return (
    <div
      className={cn(
        "order-card bg-white rounded-[15px] p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100",
      )}
    >
      <div
        className={cn(
          "order-header flex justify-between items-start sm:items-center mb-4 border-b pb-3 gap-2",
        )}
      >
        <div className="min-w-0">
          <span
            className={cn(
              "font-bold text-gray-900 text-sm sm:text-base truncate block sm:inline",
            )}
          >
            Order #{order.id}
          </span>
          <span className={cn("text-xs text-gray-400 sm:ml-3 block sm:inline")}>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : order.date || "Recent"}
          </span>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {order.status || "Pending"}
        </Badge>
      </div>

      {/* Items inside order */}
      <div className={cn("divide-y divide-gray-100")}>
        {order.items &&
          order.items.map((item, idx) => (
            <div
              key={item.id || `item-${idx}`}
              className={cn("product-item flex items-center gap-4 py-3")}
            >
              <img
                src={item.img}
                alt={item.name}
                className={cn("w-17.5 h-17.5 object-cover rounded-[10px]")}
              />
              <div className={cn("flex-1 min-w-0")}>
                <h4 className={cn("font-bold text-gray-800 text-sm truncate")}>
                  {item.name}
                </h4>
                <p className={cn("text-xs text-gray-500")}>
                  Qty: {item.quantity}{" "}
                  {item.color
                    ? `| Color: ${typeof item.color === "object" ? item.color.name : item.color}`
                    : ""}{" "}
                  {item.size
                    ? `| Size: ${typeof item.size === "object" ? item.size.name : item.size}`
                    : ""}
                </p>
              </div>
              <span className={cn("font-bold text-black text-sm")}>
                EGP {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
      </div>

      {/* Order Tracking Progress Bar */}
      <div className={cn("tracking flex justify-between mt-6 gap-2")}>
        <div
          className={cn(
            `flex-1 text-center py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold ${
              order.status === "Pending" ||
              order.status === "Processing" ||
              order.status === "Completed"
                ? "bg-[#111] text-white"
                : "bg-gray-200 text-gray-500"
            }`,
          )}
        >
          Ordered
        </div>
        <div
          className={cn(
            `flex-1 text-center py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold ${
              order.status === "Shipped" || order.status === "Completed"
                ? "bg-[#111] text-white"
                : "bg-gray-200 text-gray-500"
            }`,
          )}
        >
          Shipped
        </div>
        <div
          className={cn(
            `flex-1 text-center py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold ${
              order.status === "Completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`,
          )}
        >
          Delivered
        </div>
      </div>

      <div
        className={cn(
          "mt-4 pt-3 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-3 sm:gap-0",
        )}
      >
        <div className="flex justify-between items-center sm:block">
          {(order.status === "Pending" || order.status === "Processing") && (
            <Button
              variant="danger"
              onClick={() => setCancelOrderId(order.id)}
              className="py-1 px-3 text-xs"
            >
              Cancel Order
            </Button>
          )}
          {order.status === "Completed" && (
            <Button
              onClick={() => setRefundOrderId(order.id)}
              className="py-1 px-3 text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200"
            >
              Request Refund
            </Button>
          )}
          {order.status === "Refund Requested" && (
            <span
              className={cn("text-orange-600 font-bold text-xs sm:text-sm")}
            >
              Refund Pending
            </span>
          )}
          {order.status === "Refund Refused" && (
            <div
              className={cn(
                "text-red-600 font-bold text-xs sm:text-sm flex flex-col",
              )}
            >
              <span>Refund Refused</span>
              {order.refusalReason && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  Reason: {order.refusalReason}
                </span>
              )}
              {order.refusedAt && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  Refused on: {new Date(order.refusedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}
          {order.status === "Refunded" && (
            <div
              className={cn(
                "text-green-600 font-bold text-xs sm:text-sm flex flex-col",
              )}
            >
              <span>Refunded</span>
              {order.refundedAt && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-normal mt-1">
                  Accepted on: {new Date(order.refundedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto",
          )}
        >
          <span
            className={cn("font-bold text-gray-700 hidden sm:inline-block")}
          >
            Total Order Amount:
          </span>
          <span className={cn("font-bold text-gray-700 sm:hidden")}>
            Total:
          </span>
          <span className={cn("font-bold text-[#e60023] text-lg")}>
            EGP {order.total?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
