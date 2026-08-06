import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, Modal } from "../../../components/ui";

export const OrderExpandedDetails = ({ order }) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("admin");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={cn(
        "mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm border border-gray-100",
      )}
    >
      <div>
        <h4 className={cn("font-bold text-gray-900 mb-2 border-b pb-1")}>
          {t("shippingDetails")}
        </h4>
        {order.address ? (
          <ul className={cn("text-gray-600 space-y-1")}>
            <li>
              <span className={cn("font-semibold text-gray-800")}>
                {t("govLabel")}
              </span>{" "}
              {order.address.government}
            </li>
            <li>
              <span className={cn("font-semibold text-gray-800")}>
                {t("cityLabel")}
              </span>{" "}
              {order.address.city}
            </li>
            <li>
              <span className={cn("font-semibold text-gray-800")}>
                {t("streetLabel")}
              </span>{" "}
              {order.address.street}
            </li>
            <li>
              <span className={cn("font-semibold text-gray-800")}>
                {t("phoneLabel")}
              </span>{" "}
              {order.address.phone}
            </li>
          </ul>
        ) : (
          <p className={cn("text-gray-400 italic")}>{t("noAddressProvided")}</p>
        )}
      </div>
      <div>
        <h4 className={cn("font-bold text-gray-900 mb-2 border-b pb-1")}>
          {t("paymentAndPricing")}
        </h4>
        <ul className={cn("text-gray-600 space-y-1")}>
          <li>
            <span className={cn("font-semibold text-gray-800")}>
              {t("methodLabel")}
            </span>{" "}
            {order.paymentMethod || t("na")}
          </li>
          {order.transactionNumber && (
            <li>
              <span className={cn("font-semibold text-gray-800")}>
                {t("transactionCode")}
              </span>{" "}
              {order.transactionNumber}
            </li>
          )}
          {order.transactionScreenshot && (
            <li className="mt-2">
              <span className={cn("font-semibold text-gray-800")}>
                {t("screenshot")}
              </span>
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsModalOpen(true)}
                >
                  <i className="fa-solid fa-image me-2"></i>{" "}
                  {t("viewScreenshot")}
                </Button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title={t("transactionScreenshot")}
                  maxWidth="max-w-md"
                >
                  <img
                    src={order.transactionScreenshot}
                    alt="Transaction"
                    className={cn(
                      "w-full h-auto rounded-lg object-contain bg-white",
                    )}
                  />
                </Modal>
              </div>
            </li>
          )}
          {order.promoCode && (
            <li>
              <span className={cn("font-semibold text-gray-800")}>
                {t("promoCodeLabel")}
              </span>{" "}
              <span className={cn("bg-green-100 text-green-800 px-1 rounded")}>
                {order.promoCode}
              </span>
            </li>
          )}
          <li>
            <span className={cn("font-semibold text-gray-800")}>
              {t("subtotalLabel")}
            </span>{" "}
            {tCommon("egp")}{" "}
            {order.subtotal?.toFixed(2) ||
              (order.total - (order.shippingCost || 0)).toFixed(2)}
          </li>
          <li>
            <span className={cn("font-semibold text-gray-800")}>
              {t("shippingCostLabel")}
            </span>{" "}
            {tCommon("egp")} {order.shippingCost?.toFixed(2) || "0.00"}
          </li>
          {order.discount > 0 && (
            <li className={cn("text-green-600")}>
              <span className={cn("font-semibold")}>{t("discountLabel")}</span>{" "}
              - {tCommon("egp")} {order.discount.toFixed(2)}
            </li>
          )}
        </ul>
      </div>

      {order.refundReason &&
        ["Refund Requested", "Refunded", "Refund Refused"].includes(
          order.status,
        ) && (
          <div
            className={cn(
              "md:col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-100",
            )}
          >
            <h4
              className={cn(
                "font-bold text-orange-800 mb-2 border-b border-orange-200 pb-1 flex items-center gap-2",
              )}
            >
              <i className={cn("fa-solid fa-rotate-left")}></i>{" "}
              {t("refundInformation")}
            </h4>
            <ul className={cn("text-orange-900 space-y-1 mt-2")}>
              <li>
                <span className={cn("font-semibold")}>{t("reasonLabel")}</span>{" "}
                {order.refundReason}
              </li>
              {order.refundRequestedAt && (
                <li>
                  <span className={cn("font-semibold")}>
                    {t("requestedOn")}
                  </span>{" "}
                  {new Date(order.refundRequestedAt).toLocaleString()}
                </li>
              )}
              {order.refundedAt && order.status !== "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold")}>{t("refundedOn")}</span>{" "}
                  {new Date(order.refundedAt).toLocaleString()}
                </li>
              )}
              {order.refusalReason && order.status !== "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold text-red-600")}>
                    {t("refusalReasonLabel")}
                  </span>{" "}
                  {order.refusalReason}
                </li>
              )}
              {order.refusedAt && order.status !== "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold text-red-600")}>
                    {t("refusedOn")}
                  </span>{" "}
                  {new Date(order.refusedAt).toLocaleString()}
                </li>
              )}
              {order.status === "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold text-orange-600")}>
                    {t("decisionLabel")}
                  </span>{" "}
                  {t("pending", { defaultValue: "Pending" })}
                </li>
              )}
            </ul>
          </div>
        )}
    </div>
  );
};
