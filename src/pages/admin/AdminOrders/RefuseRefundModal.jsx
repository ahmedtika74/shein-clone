import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["admin", "common"]);

  return (
    <Modal
      isOpen={!!refusingOrderId}
      onClose={() => setRefusingOrderId(null)}
      title={t("refuseRefund")}
    >
      <div className={cn("space-y-4")}>
        <p className={cn("text-gray-500 text-sm")}>{t("refuseRefundHint")}</p>
        <textarea
          value={refusalReason}
          onChange={(e) => setRefusalReason(e.target.value)}
          className={cn(
            "w-full h-24 p-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none text-sm",
          )}
          placeholder={t("enterRefusalReason")}
        ></textarea>
        <div className={cn("flex justify-end gap-3 pt-2")}>
          <Button variant="secondary" onClick={() => setRefusingOrderId(null)}>
            {t("cancel", { ns: "common" })}
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
            {t("submitRefusal")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
