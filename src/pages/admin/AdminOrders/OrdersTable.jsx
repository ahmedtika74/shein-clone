import { cn } from "../../../utils/cn";
import { Pagination } from "../../../components/common/Pagination";
import { Card, CardContent, Button } from "../../../components/ui";

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
                "flex justify-between items-center mb-4 pb-3 border-b flex-wrap gap-4",
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

              <div className={cn("flex items-center gap-4")}>
                <div className={cn("flex items-center gap-2")}>
                  <span className={cn("text-xs font-bold text-gray-500")}>
                    Status:
                  </span>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      handleUpdateStatus(order.id, e.target.value)
                    }
                    className={cn(
                      "h-9 px-3 border border-gray-300 rounded-md text-xs font-bold bg-gray-50 outline-none focus:border-black",
                    )}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
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

            {expandedOrders[order.id] && (
              <div
                className={cn(
                  "mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm border border-gray-100",
                )}
              >
                <div>
                  <h4
                    className={cn("font-bold text-gray-900 mb-2 border-b pb-1")}
                  >
                    Shipping Details
                  </h4>
                  {order.address ? (
                    <ul className={cn("text-gray-600 space-y-1")}>
                      <li>
                        <span className={cn("font-semibold text-gray-800")}>
                          Gov:
                        </span>{" "}
                        {order.address.government}
                      </li>
                      <li>
                        <span className={cn("font-semibold text-gray-800")}>
                          City:
                        </span>{" "}
                        {order.address.city}
                      </li>
                      <li>
                        <span className={cn("font-semibold text-gray-800")}>
                          Street:
                        </span>{" "}
                        {order.address.street}
                      </li>
                      <li>
                        <span className={cn("font-semibold text-gray-800")}>
                          Phone:
                        </span>{" "}
                        {order.address.phone}
                      </li>
                    </ul>
                  ) : (
                    <p className={cn("text-gray-400 italic")}>
                      No address provided
                    </p>
                  )}
                </div>
                <div>
                  <h4
                    className={cn("font-bold text-gray-900 mb-2 border-b pb-1")}
                  >
                    Payment & Pricing
                  </h4>
                  <ul className={cn("text-gray-600 space-y-1")}>
                    <li>
                      <span className={cn("font-semibold text-gray-800")}>
                        Method:
                      </span>{" "}
                      {order.paymentMethod || "N/A"}
                    </li>
                    {order.transactionNumber && (
                      <li>
                        <span className={cn("font-semibold text-gray-800")}>
                          Transaction code:
                        </span>{" "}
                        {order.transactionNumber}
                      </li>
                    )}
                    {order.promoCode && (
                      <li>
                        <span className={cn("font-semibold text-gray-800")}>
                          Promo Code:
                        </span>{" "}
                        <span
                          className={cn(
                            "bg-green-100 text-green-800 px-1 rounded",
                          )}
                        >
                          {order.promoCode}
                        </span>
                      </li>
                    )}
                    <li>
                      <span className={cn("font-semibold text-gray-800")}>
                        Subtotal:
                      </span>{" "}
                      EGP{" "}
                      {order.subtotal?.toFixed(2) ||
                        (order.total - (order.shippingCost || 0)).toFixed(2)}
                    </li>
                    <li>
                      <span className={cn("font-semibold text-gray-800")}>
                        Shipping Cost:
                      </span>{" "}
                      EGP {order.shippingCost?.toFixed(2) || "0.00"}
                    </li>
                    {order.discount > 0 && (
                      <li className={cn("text-green-600")}>
                        <span className={cn("font-semibold")}>Discount:</span> -
                        EGP {order.discount.toFixed(2)}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Order Items Table */}
            <div className={cn("divide-y divide-gray-100 mb-4")}>
              {order.items &&
                order.items.map((item, idx) => (
                  <div
                    key={item.id || `orderitem-${idx}`}
                    className={cn(
                      "flex items-center justify-between py-2.5 text-sm",
                    )}
                  >
                    <div className={cn("flex items-center gap-3")}>
                      <img
                        src={item.img}
                        alt={item.name}
                        className={cn(
                          "w-12 h-12 object-cover rounded-md border",
                        )}
                      />
                      <div>
                        <p className={cn("font-bold text-gray-800")}>
                          {item.name}
                        </p>
                        <p className={cn("text-xs text-gray-400")}>
                          Qty: {item.quantity}{" "}
                          {item.color
                            ? `| Color: ${typeof item.color === "object" ? item.color.name : item.color}`
                            : ""}{" "}
                          {item.size
                            ? `| Size: ${typeof item.size === "object" ? item.size.name : item.size}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <span className={cn("font-bold text-gray-900")}>
                      EGP {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>

            <div
              className={cn(
                "flex justify-between items-center pt-3 border-t text-sm font-bold",
              )}
            >
              <span className={cn("text-gray-600")}>
                Total Items: {order.items?.length || 0}
              </span>
              <span className={cn("text-xl text-[#e60023]")}>
                EGP {order.total?.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
