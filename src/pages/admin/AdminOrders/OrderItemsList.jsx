import { cn } from "../../../utils/cn";

export const OrderItemsList = ({ order }) => {
  return (
    <>
      <div className={cn("divide-y divide-gray-100 mb-4")}>
        {order.items &&
          order.items.map((item, idx) => (
            <div
              key={item.id || `orderitem-${idx}`}
              className={cn("flex items-center justify-between py-2.5 text-sm")}
            >
              <div className={cn("flex items-center gap-3")}>
                <img
                  src={item.img}
                  alt={item.name}
                  className={cn("w-12 h-12 object-cover rounded-md border")}
                />
                <div>
                  <p className={cn("font-bold text-gray-800")}>{item.name}</p>
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
    </>
  );
};
