import { cn } from "../../../utils/cn";
import { Pagination } from "../../../components/common/Pagination";

export const OrdersTab = ({
  filteredOrders,
  filterStatus,
  setFilterStatus,
  setCancelOrderId,
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
            <div
              key={order.id}
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
                  <span
                    className={cn(
                      "text-xs text-gray-400 sm:ml-3 block sm:inline",
                    )}
                  >
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
                <span
                  className={cn(
                    `status shrink-0 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${
                      order.status === "Completed"
                        ? "bg-green-600"
                        : order.status === "Cancelled"
                          ? "bg-red-600"
                          : "bg-[#111]"
                    }`,
                  )}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Items inside order */}
              <div className={cn("divide-y divide-gray-100")}>
                {order.items &&
                  order.items.map((item, idx) => (
                    <div
                      key={item.id || `item-${idx}`}
                      className={cn(
                        "product-item flex items-center gap-4 py-3",
                      )}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className={cn(
                          "w-17.5 h-17.5 object-cover rounded-[10px]",
                        )}
                      />
                      <div className={cn("flex-1 min-w-0")}>
                        <h4
                          className={cn(
                            "font-bold text-gray-800 text-sm truncate",
                          )}
                        >
                          {item.name}
                        </h4>
                        <p className={cn("text-xs text-gray-500")}>
                          Qty: {item.quantity}{" "}
                          {item.color ? `| Color: ${typeof item.color === 'object' ? item.color.name : item.color}` : ""}{" "}
                          {item.size ? `| Size: ${typeof item.size === 'object' ? item.size.name : item.size}` : ""}
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
                  {(order.status === "Pending" ||
                    order.status === "Processing") && (
                    <button
                      onClick={() => setCancelOrderId(order.id)}
                      className={cn(
                        "bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1 sm:py-1.5 px-3 sm:px-4 text-xs sm:text-sm rounded-md transition-colors cursor-pointer",
                      )}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto",
                  )}
                >
                  <span
                    className={cn(
                      "font-bold text-gray-700 hidden sm:inline-block",
                    )}
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
