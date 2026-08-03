import { cn } from "../../../utils/cn";
import { updateOrderStatusThunk } from "../../../store/dataSlice";

export const CancelOrderModal = ({
  cancelOrderId,
  setCancelOrderId,
  dispatch,
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      )}
    >
      <div
        className={cn(
          "bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100 animate-fade-in-up",
        )}
      >
        <div
          className={cn(
            "w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5",
          )}
        >
          <i className={cn("fa-solid fa-triangle-exclamation text-3xl")}></i>
        </div>
        <h3 className={cn("text-2xl font-bold text-gray-900 mb-2")}>
          Cancel Order?
        </h3>
        <p className={cn("text-gray-500 mb-8")}>
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </p>
        <div className={cn("flex flex-col gap-3")}>
          <button
            onClick={() => {
              dispatch(
                updateOrderStatusThunk({
                  orderId: cancelOrderId,
                  status: "Cancelled",
                }),
              );
              setCancelOrderId(null);
            }}
            className={cn(
              "w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer",
            )}
          >
            Yes, Cancel Order
          </button>
          <button
            onClick={() => setCancelOrderId(null)}
            className={cn(
              "w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition-all cursor-pointer",
            )}
          >
            Keep Order
          </button>
        </div>
      </div>
    </div>
  );
};
