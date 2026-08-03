import { cn } from "../../../utils/cn";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";

export const RefuseRefundModal = ({
  refusingOrderId,
  setRefusingOrderId,
  refusalReason,
  setRefusalReason,
  handleUpdateStatus,
}) => {
  return (
    <Modal
      isOpen={!!refusingOrderId}
      onClose={() => setRefusingOrderId(null)}
      title="Refuse Refund"
    >
      <div className={cn("space-y-4")}>
        <p className={cn("text-gray-500 text-sm")}>
          Please provide a reason for refusing this refund request. This reason
          will be visible to the customer.
        </p>
        <textarea
          value={refusalReason}
          onChange={(e) => setRefusalReason(e.target.value)}
          className={cn(
            "w-full h-24 p-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none text-sm",
          )}
          placeholder="Enter reason..."
        ></textarea>
        <div className={cn("flex justify-end gap-3 pt-2")}>
          <Button variant="secondary" onClick={() => setRefusingOrderId(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (refusalReason.trim()) {
                handleUpdateStatus(
                  refusingOrderId,
                  "Refund Refused",
                  refusalReason,
                );
                setRefusingOrderId(null);
              }
            }}
            disabled={!refusalReason.trim()}
          >
            Submit Refusal
          </Button>
        </div>
      </div>
    </Modal>
  );
};
