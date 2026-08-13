import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import {
  requestRefundThunk,
  fetchMyOrdersThunk,
} from "../../../store/dataSlice";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";

export const RefundRequestModal = ({
  refundOrderId,
  setRefundOrderId,
  dispatch,
}) => {
  const { t } = useTranslation(["storefront", "common"]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setLoading(true);
    setError("");
    try {
      await dispatch(
        requestRefundThunk({
          orderId: refundOrderId,
          reason: reason.trim(),
        }),
      ).unwrap();
      dispatch(fetchMyOrdersThunk());
      setReason("");
      setRefundOrderId(null);
    } catch (err) {
      setError(err || t("genericErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={!!refundOrderId}
      onClose={() => setRefundOrderId(null)}
      title={t("requestRefund")}
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
          {t("provideRefundReason")}
          {refundOrderId}.
        </p>

        <form
          onSubmit={handleSubmit}
          className={cn("flex flex-col gap-4 text-start")}
        >
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("reasonForRefundPlaceholder")}
            className={cn(
              "w-full h-24 p-3 border border-gray-300 rounded-xl outline-none focus:border-black resize-none text-sm",
            )}
          ></textarea>

          {error && (
            <p className={cn("text-red-600 text-sm font-medium")}>{error}</p>
          )}

          <div className={cn("flex flex-col gap-3 mt-2")}>
            <Button
              type="submit"
              disabled={!reason.trim() || loading}
              className={cn(
                "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {t("submitRequest")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRefundOrderId(null)}
              className={cn(
                "w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition-all cursor-pointer",
              )}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
