import { cn } from "../../../utils/cn";
import { useState } from "react";
import { Button, Modal } from "../../../components/ui";

export const OrderExpandedDetails = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={cn(
        "mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm border border-gray-100",
      )}
    >
      <div>
        <h4 className={cn("font-bold text-gray-900 mb-2 border-b pb-1")}>
          Shipping Details
        </h4>
        {order.address ? (
          <ul className={cn("text-gray-600 space-y-1")}>
            <li>
              <span className={cn("font-semibold text-gray-800")}>Gov:</span>{" "}
              {order.address.government}
            </li>
            <li>
              <span className={cn("font-semibold text-gray-800")}>City:</span>{" "}
              {order.address.city}
            </li>
            <li>
              <span className={cn("font-semibold text-gray-800")}>Street:</span>{" "}
              {order.address.street}
            </li>
            <li>
              <span className={cn("font-semibold text-gray-800")}>Phone:</span>{" "}
              {order.address.phone}
            </li>
          </ul>
        ) : (
          <p className={cn("text-gray-400 italic")}>No address provided</p>
        )}
      </div>
      <div>
        <h4 className={cn("font-bold text-gray-900 mb-2 border-b pb-1")}>
          Payment & Pricing
        </h4>
        <ul className={cn("text-gray-600 space-y-1")}>
          <li>
            <span className={cn("font-semibold text-gray-800")}>Method:</span>{" "}
            {order.paymentMethod || "N/A"}
          </li>
          {order.transactionNumber && (
            <li>
              <span className={cn("font-semibold text-gray-800")}>
                Transaction code:
              </span>{" "}
              {order.transactionNumber}
            </li>
          )}
          {order.transactionScreenshot && (
            <li className="mt-2">
              <span className={cn("font-semibold text-gray-800")}>
                Screenshot:
              </span>
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsModalOpen(true)}
                >
                  <i className="fa-solid fa-image mr-2"></i> View Screenshot
                </Button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Transaction Screenshot"
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
                Promo Code:
              </span>{" "}
              <span className={cn("bg-green-100 text-green-800 px-1 rounded")}>
                {order.promoCode}
              </span>
            </li>
          )}
          <li>
            <span className={cn("font-semibold text-gray-800")}>Subtotal:</span>{" "}
            EGP{" "}
            {order.subtotal?.toFixed(2) ||
              (order.total - (order.shippingCost || 0)).toFixed(2)}
          </li>
          <li>
            <span className={cn("font-semibold text-gray-800")}>
              Shipping Cost:
            </span>{" "}
            EGP {order.shippingCost?.toFixed(2) || "0.00"}
          </li>
          {order.discount > 0 && (
            <li className={cn("text-green-600")}>
              <span className={cn("font-semibold")}>Discount:</span> - EGP{" "}
              {order.discount.toFixed(2)}
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
              <i className={cn("fa-solid fa-rotate-left")}></i> Refund
              Information
            </h4>
            <ul className={cn("text-orange-900 space-y-1 mt-2")}>
              <li>
                <span className={cn("font-semibold")}>Reason:</span>{" "}
                {order.refundReason}
              </li>
              {order.refundRequestedAt && (
                <li>
                  <span className={cn("font-semibold")}>Requested on:</span>{" "}
                  {new Date(order.refundRequestedAt).toLocaleString()}
                </li>
              )}
              {order.refundedAt && order.status !== "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold")}>Refunded on:</span>{" "}
                  {new Date(order.refundedAt).toLocaleString()}
                </li>
              )}
              {order.refusalReason && order.status !== "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold text-red-600")}>
                    Refusal Reason:
                  </span>{" "}
                  {order.refusalReason}
                </li>
              )}
              {order.refusedAt && order.status !== "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold text-red-600")}>
                    Refused on:
                  </span>{" "}
                  {new Date(order.refusedAt).toLocaleString()}
                </li>
              )}
              {order.status === "Refund Requested" && (
                <li>
                  <span className={cn("font-semibold text-orange-600")}>
                    Decision:
                  </span>{" "}
                  Pending
                </li>
              )}
            </ul>
          </div>
        )}
    </div>
  );
};
