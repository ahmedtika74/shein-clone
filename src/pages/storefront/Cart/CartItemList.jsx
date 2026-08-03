import { cn } from "../../../utils/cn";
import { changeQty, removeItem } from "../../../store/cartSlice";
import { Link } from "react-router-dom";

export const CartItemList = ({ cart, dispatch }) => {
  return (
    <div className={cn("flex-1")}>
      {cart.map((item, index) => (
        <div
          key={
            item.id
              ? `${item.id}-${item.color?.name || "def"}-${item.size?.name || "def"}`
              : `cart-${index}`
          }
          className={cn(
            "cart-item bg-white p-5 mb-5 rounded-[10px] shadow-[0_2px_10px_#ddd] flex flex-col sm:flex-row items-center gap-6",
          )}
        >
          <Link
            to={`/product/${item.id}`}
            className={cn("shrink-0 block hover:opacity-80 transition-opacity")}
          >
            <img
              src={item.img}
              alt={item.name}
              className={cn("w-35 h-42.5 object-cover rounded-md shrink-0")}
            />
          </Link>
          <div className={cn("cart-info flex-1 w-full")}>
            <Link to={`/product/${item.id}`} className={cn("hover:underline")}>
              <h3 className={cn("text-xl font-bold text-gray-900 mb-1")}>
                {item.name}
              </h3>
            </Link>
            {(item.color || item.size) && (
              <p className={cn("text-xs text-gray-500 mb-2")}>
                {item.color && (
                  <span>
                    Color:{" "}
                    {typeof item.color === "object"
                      ? item.color.name
                      : item.color}{" "}
                  </span>
                )}
                {item.size && (
                  <span>
                    | Size:{" "}
                    {typeof item.size === "object" ? item.size.name : item.size}
                  </span>
                )}
              </p>
            )}
            <p className={cn("price text-lg font-bold text-[#e60023] mb-3")}>
              EGP {item.price.toFixed(2)}
            </p>
            <div
              className={cn(
                "flex items-center justify-between flex-wrap gap-4 mt-4",
              )}
            >
              <div className={cn("quantity flex items-center gap-3")}>
                <button
                  onClick={() => dispatch(changeQty({ index, delta: -1 }))}
                  className={cn(
                    "w-8.75 h-8.75 border border-gray-300 bg-white font-bold text-lg hover:bg-gray-100 rounded-md cursor-pointer flex items-center justify-center",
                  )}
                >
                  -
                </button>
                <span className={cn("font-bold text-base w-6 text-center")}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => dispatch(changeQty({ index, delta: 1 }))}
                  className={cn(
                    "w-8.75 h-8.75 border border-gray-300 bg-white font-bold text-lg hover:bg-gray-100 rounded-md cursor-pointer flex items-center justify-center",
                  )}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => dispatch(removeItem(index))}
                className={cn(
                  "remove bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-red-600 transition-colors cursor-pointer",
                )}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
