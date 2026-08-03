import { cn } from "../../utils/cn";
import { useSelector } from "react-redux";
import { selectOrders, selectProducts } from "../../store/dataSlice";
import { Card, CardContent, Badge } from "../../components/ui";

export const AdminDashboardPage = () => {
  const orders = useSelector(selectOrders);
  const products = useSelector(selectProducts);

  const totalSales = orders.reduce(
    (sum, order) =>
      order.status !== "Refunded" && order.status !== "Cancelled"
        ? sum + (order.total || 0)
        : sum,
    0,
  );

  return (
    <div>
      <h1 className={cn("text-[35px] font-bold text-gray-900 mb-7.5")}>
        Dashboard
      </h1>

      <div
        className={cn("cards grid grid-cols-1 md:grid-cols-3 gap-6.25 mb-10")}
      >
        {/* Card 1: Orders */}
        <Card
          className={cn(
            "p-0 hover:-translate-y-1 transition-all shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px]",
          )}
        >
          <CardContent className={cn("p-7.5 flex items-center gap-5")}>
            <i
              className={cn(
                "fa-solid fa-cart-shopping bg-[#ffe5ea] text-[#e60023] text-[25px] p-5 rounded-full",
              )}
            ></i>
            <div>
              <h3 className={cn("text-gray-500 text-sm font-semibold mb-1")}>
                Orders
              </h3>
              <span className={cn("text-[30px] font-bold text-gray-900")}>
                {orders.length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Sales */}
        <Card
          className={cn(
            "p-0 hover:-translate-y-1 transition-all shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px]",
          )}
        >
          <CardContent className={cn("p-7.5 flex items-center gap-5")}>
            <i
              className={cn(
                "fa-solid fa-dollar-sign bg-[#ffe5ea] text-[#e60023] text-[25px] p-5 rounded-full",
              )}
            ></i>
            <div>
              <h3 className={cn("text-gray-500 text-sm font-semibold mb-1")}>
                Sales
              </h3>
              <span className={cn("text-[30px] font-bold text-gray-900")}>
                EGP {totalSales.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Products */}
        <Card
          className={cn(
            "p-0 hover:-translate-y-1 transition-all shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px]",
          )}
        >
          <CardContent className={cn("p-7.5 flex items-center gap-5")}>
            <i
              className={cn(
                "fa-solid fa-box bg-[#ffe5ea] text-[#e60023] text-[25px] p-5 rounded-full",
              )}
            ></i>
            <div>
              <h3 className={cn("text-gray-500 text-sm font-semibold mb-1")}>
                Products
              </h3>
              <span className={cn("text-[30px] font-bold text-gray-900")}>
                {products.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Overview Table */}
      <Card
        className={cn(
          "p-0 shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px]",
        )}
      >
        <CardContent className={cn("p-6")}>
          <h2 className={cn("text-xl font-bold text-gray-900 mb-4")}>
            Recent Transactions
          </h2>
          {orders.length === 0 ? (
            <p className={cn("text-gray-500 text-sm py-4")}>
              No recent orders found.
            </p>
          ) : (
            <div className={cn("overflow-x-auto")}>
              <table className={cn("w-full text-left border-collapse")}>
                <thead>
                  <tr
                    className={cn(
                      "border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider",
                    )}
                  >
                    <th className={cn("py-3 px-4 whitespace-nowrap")}>
                      Order ID
                    </th>
                    <th className={cn("py-3 px-4 whitespace-nowrap")}>Date</th>
                    <th className={cn("py-3 px-4 whitespace-nowrap")}>Items</th>
                    <th className={cn("py-3 px-4 whitespace-nowrap")}>Total</th>
                    <th className={cn("py-3 px-4 whitespace-nowrap")}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y divide-gray-100 text-sm")}>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className={cn("hover:bg-gray-50")}>
                      <td
                        className={cn(
                          "py-3 px-4 font-bold text-gray-900 whitespace-nowrap",
                        )}
                      >
                        #{order.id}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 text-gray-500 whitespace-nowrap",
                        )}
                      >
                        {order.date || "Recent"}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 text-gray-700 whitespace-nowrap",
                        )}
                      >
                        {order.items?.length || 0} items
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 font-bold text-[#e60023] whitespace-nowrap",
                        )}
                      >
                        EGP {order.total?.toFixed(2)}
                      </td>
                      <td className={cn("py-3 px-4 whitespace-nowrap")}>
                        <Badge variant="primary">
                          {order.status || "Pending"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
