import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { updateOrderStatusThunk } from "../../../store/dataSlice";
import { Modal } from "../../../components/ui/Modal";

export const CancelOrderModal = ({
  cancelOrderId,
  setCancelOrderId,
  dispatch,
}) => {
  const { t } = useTranslation(["storefront", "common"]);
  return (
    <Modal
      isOpen={!!cancelOrderId}
      onClose={() => setCancelOrderId(null)}
      title={t("cancelOrder")}
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
        <p className={cn("text-gray-500 mb-8")}>{t("cancelOrderConfirm")}</p>
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
            {t("yesCancelOrder")}
          </button>
          <button
            onClick={() => setCancelOrderId(null)}
            className={cn(
              "w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition-all cursor-pointer",
            )}
          >
            {t("keepOrder")}
          </button>
        </div>
      </div>
    </Modal>
  );
};
