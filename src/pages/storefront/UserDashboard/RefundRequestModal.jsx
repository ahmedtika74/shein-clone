import { useState } from "react";
import { cn } from "../../../utils/cn";
import { updateOrderStatusThunk } from "../../../store/dataSlice";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";

export const RefundRequestModal = ({
  refundOrderId,
  setRefundOrderId,
  dispatch,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    dispatch(
      updateOrderStatusThunk({
        orderId: refundOrderId,
        status: "Refund Requested",
        refundReason: reason.trim(),
      }),
    );
    setRefundOrderId(null);
  };

  return (
    <Modal
      isOpen={!!refundOrderId}
      onClose={() => setRefundOrderId(null)}
      title="Request Refund"
      maxWidth="max-w-sm"
    >
      <div className={cn("text-center")}>
        <div
          className={cn(
            "w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-5",
          )}
        >
          <i className={cn("fa-solid fa-rotate-left text-3xl")}></i>
        </div>
        <p className={cn("text-gray-500 mb-6 text-sm")}>
          Please provide a reason for requesting a refund for Order #
          {refundOrderId}.
        </p>

        <form
          onSubmit={handleSubmit}
          className={cn("flex flex-col gap-4 text-left")}
        >
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for refund..."
            className={cn(
              "w-full h-24 p-3 border border-gray-300 rounded-xl outline-none focus:border-black resize-none text-sm",
            )}
          ></textarea>

          <div className={cn("flex flex-col gap-3 mt-2")}>
            <Button
              type="submit"
              disabled={!reason.trim()}
              className={cn(
                "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              Submit Request
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRefundOrderId(null)}
              className={cn(
                "w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition-all cursor-pointer",
              )}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
