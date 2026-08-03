import { cn } from "../../../utils/cn";
import { updateOrderStatusThunk } from "../../../store/dataSlice";
import { Modal } from "../../../components/ui/Modal";

export const CancelOrderModal = ({
  cancelOrderId,
  setCancelOrderId,
  dispatch,
}) => {
  return (
    <Modal
      isOpen={!!cancelOrderId}
      onClose={() => setCancelOrderId(null)}
      title="Cancel Order"
      maxWidth="max-w-sm"
    >
      <div className={cn("text-center")}>
        <div
          className={cn(
            "w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5",
          )}
        >
          <i className={cn("fa-solid fa-triangle-exclamation text-3xl")}></i>
        </div>
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
    </Modal>
  );
};
