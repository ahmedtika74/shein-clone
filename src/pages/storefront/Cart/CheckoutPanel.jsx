import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { AddressFormModal } from "../../../components/common/AddressFormModal";
import { Button, Input } from "../../../components/ui";
import { addAddress } from "../../../store/authSlice";
import { getLocalizedString } from "../../../utils/localization";

export const CheckoutPanel = ({
  dispatch,
  userAddresses,
  selectedAddressId,
  setSelectedAddressId,
  guestAddress,
  setGuestAddress,
  showAddressModal,
  setShowAddressModal,
  user,
  shippingRates,
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  transactionNumber,
  setTransactionNumber,
  transactionScreenshot,
  setTransactionScreenshot,
  promoInput,
  setPromoInput,
  appliedPromo,
  setAppliedPromo,
  promoError,
  handleApplyPromo,
  cartTotal,
  discountAmount,
  productDiscountAmount,
  freeShipping,
  subtotalAfterDiscount,
  isFreeShippingEligible,
  baseShippingCost,
  shippingCost,
  selectedRate,
  finalTotal,
  checkoutError,
  handleCheckout,
  isCheckoutLoading,
}) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
  return (
    <div className={cn("w-full lg:w-[450px]")}>
      {/* Address & Payment Form */}
      <div
        className={cn(
          "bg-white p-6 rounded-[10px] shadow-[0_2px_10px_#ddd] border border-gray-100 mb-6",
        )}
      >
        <h2 className={cn("text-xl font-bold mb-4 border-b pb-3")}>
          {t("shippingAddress")}
        </h2>
        {user ? (
          <div className={cn("space-y-3")}>
            {userAddresses.map((addr) => (
              <label
                key={addr.id}
                className={cn(
                  "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                  selectedAddressId === addr.id
                    ? "border-black bg-gray-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <input
                  type="radio"
                  name="shippingAddress"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className={cn("mt-1 accent-black")}
                />
                <div className={cn("flex-1 text-sm")}>
                  <div className={cn("font-bold text-gray-900")}>
                    {addr.label}
                    {addr.isDefault && (
                      <span
                        className={cn(
                          "ms-2 text-[10px] bg-black text-white px-2 py-0.5 rounded-full",
                        )}
                      >
                        {t("default")}
                      </span>
                    )}
                  </div>
                  <div className={cn("text-gray-600 mt-1")}>
                    {addr.street}, {addr.city}
                  </div>
                  <div className={cn("text-gray-600")}>
                    {shippingRates.find(
                      (r) =>
                        (r.governmentEn || r.government) === addr.government,
                    )
                      ? getLocalizedString(
                          shippingRates.find(
                            (r) =>
                              (r.governmentEn || r.government) ===
                              addr.government,
                          ),
                          "government",
                          i18n.language,
                        )
                      : addr.government}
                  </div>
                  <div className={cn("text-gray-600 mt-1")}>
                    <i className={cn("fa-solid fa-phone text-xs me-1")}></i>{" "}
                    {addr.phone}
                  </div>
                </div>
              </label>
            ))}

            {userAddresses.length < 3 && (
              <Button
                onClick={() => setShowAddressModal(true)}
                variant="secondary"
                className={cn("w-full py-2.5 border-dashed border-2 mt-2")}
              >
                {t("addNewAddress")}
              </Button>
            )}

            <AddressFormModal
              isOpen={showAddressModal}
              onClose={() => setShowAddressModal(false)}
              onSave={(newAddr) => dispatch(addAddress(newAddr))}
              shippingRates={shippingRates}
              initialAddress={null}
            />
          </div>
        ) : (
          <div className={cn("space-y-4")}>
            <select
              value={guestAddress.government}
              onChange={(e) =>
                setGuestAddress({ ...guestAddress, government: e.target.value })
              }
              className={cn(
                "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
              )}
            >
              <option value="">{t("selectGovernment")}</option>
              {shippingRates.map((rate) => (
                <option
                  key={rate.id}
                  value={rate.governmentEn || rate.government}
                >
                  {getLocalizedString(rate, "government", i18n.language)}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder={t("city")}
              value={guestAddress.city}
              onChange={(e) =>
                setGuestAddress({ ...guestAddress, city: e.target.value })
              }
              className={cn(
                "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
              )}
            />
            <input
              type="text"
              placeholder={t("streetAddressPlaceholder")}
              value={guestAddress.street}
              onChange={(e) =>
                setGuestAddress({ ...guestAddress, street: e.target.value })
              }
              className={cn(
                "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
              )}
            />
            <input
              type="text"
              placeholder={t("phone")}
              value={guestAddress.phone}
              onChange={(e) =>
                setGuestAddress({ ...guestAddress, phone: e.target.value })
              }
              className={cn(
                "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
              )}
            />
          </div>
        )}

        <h2 className={cn("text-xl font-bold mb-4 border-b pb-3 mt-8")}>
          {t("paymentMethod")}
        </h2>
        <div className={cn("space-y-3")}>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-[10px] hover:border-black transition-colors",
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.nameEn || method.name}
                  checked={
                    selectedPaymentMethod === (method.nameEn || method.name)
                  }
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className={cn("w-4 h-4 accent-black mt-1")}
                />
                {method.img && (
                  <img
                    src={method.img}
                    alt={method.name}
                    className={cn(
                      "w-10 h-10 object-contain rounded border border-gray-200 bg-white",
                    )}
                  />
                )}
                <div className={cn("flex flex-col flex-1")}>
                  <span className={cn("text-gray-900 font-bold block")}>
                    {getLocalizedString(method, "name", i18n.language)}
                  </span>
                  {(method.detailsEn || method.detailsAr || method.details) && (
                    <span className={cn("text-sm text-gray-500 mt-1 block")}>
                      {getLocalizedString(method, "details", i18n.language)}
                    </span>
                  )}
                  {((method.nameEn || method.name || "")
                    .toLowerCase()
                    .includes("instapay") ||
                    (method.nameEn || method.name || "")
                      .toLowerCase()
                      .includes("vodafone")) &&
                    selectedPaymentMethod ===
                      (method.nameEn || method.name) && (
                      <div className={cn("mt-3 space-y-2")}>
                        <Input
                          placeholder={t("transactionNumber")}
                          value={transactionNumber}
                          onChange={(e) => setTransactionNumber(e.target.value)}
                        />
                        <div className={cn("flex items-center gap-2")}>
                          <span
                            className={cn("text-xs text-gray-500 font-bold")}
                          >
                            {t("or")}
                          </span>
                        </div>
                        <div className={cn("flex items-center gap-3")}>
                          <label
                            className={cn(
                              "cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg font-bold transition-colors border border-gray-200 inline-block",
                            )}
                          >
                            <i className="fa-solid fa-image me-1"></i>{" "}
                            {t("uploadScreenshot")}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setTransactionScreenshot(reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {transactionScreenshot && (
                            <div className={cn("flex items-center gap-2")}>
                              <span
                                className={cn(
                                  "text-xs text-green-600 font-bold flex items-center gap-1",
                                )}
                              >
                                <i className="fa-solid fa-check-circle"></i>{" "}
                                {t("uploaded")}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTransactionScreenshot("");
                                }}
                                className={cn(
                                  "text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1",
                                )}
                              >
                                {t("remove")}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </label>
            ))
          ) : (
            <p className={cn("text-sm text-red-500")}>
              {t("noPaymentMethods")}
            </p>
          )}
        </div>
      </div>
      {/* Order Summary */}
      <div
        className={cn(
          "bg-white p-6 rounded-[10px] shadow-[0_2px_10px_#ddd] border border-gray-100 sticky top-6",
        )}
      >
        <h2 className={cn("text-xl font-bold mb-4 border-b pb-3")}>
          {t("orderSummary")}
        </h2>

        <div className={cn("mb-6")}>
          <div className={cn("flex gap-2")}>
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder={t("enterPromoCode")}
              className={cn(
                "flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-black text-sm uppercase",
              )}
            />
            <button
              onClick={handleApplyPromo}
              className={cn(
                "bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors",
              )}
            >
              {t("apply")}
            </button>
          </div>
          {promoError && (
            <p className={cn("text-red-500 text-xs mt-1 font-bold")}>
              {promoError}
            </p>
          )}
          {appliedPromo && (
            <div
              className={cn(
                "flex justify-between items-center bg-green-50 text-green-800 p-2 rounded-lg mt-2 text-sm border border-green-200",
              )}
            >
              <span className={cn("font-bold")}>
                {appliedPromo.code} {t("applied")}
              </span>
              <button
                onClick={() => setAppliedPromo(null)}
                className={cn("text-xs font-bold hover:underline")}
              >
                {t("remove")}
              </button>
            </div>
          )}
        </div>

        <div className={cn("flex justify-between mb-3 text-gray-600")}>
          <span>{t("subtotal")}</span>
          <span className={cn("font-semibold")}>
            {t("egp")} {(cartTotal + (productDiscountAmount || 0)).toFixed(2)}
          </span>
        </div>

        {appliedPromo && (
          <div className={cn("flex justify-between mb-3 text-green-600")}>
            <span>
              {t("discount")} (
              {appliedPromo.discount ||
                (appliedPromo.discountType === "%"
                  ? `${appliedPromo.discountValue}%`
                  : `${t("egp")} ${appliedPromo.discountValue}`)}
              )
            </span>
            <span className={cn("font-semibold")}>
              - {t("egp")} {discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {productDiscountAmount > 0 && (
          <div className={cn("flex justify-between mb-3 text-green-600")}>
            <span>{t("productsDiscount")}</span>
            <span className={cn("font-semibold")}>
              - {t("egp")} {productDiscountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {freeShipping.enabled &&
          !isFreeShippingEligible &&
          subtotalAfterDiscount > 0 && (
            <div
              className={cn(
                "bg-blue-50 text-blue-800 p-3 rounded-lg text-sm border border-blue-100 mb-3 flex items-center gap-2",
              )}
            >
              <i className={cn("fa-solid fa-truck-fast")}></i>
              <span>
                {t("addMoreForFreeShipping").split("{{amount}}")[0]}
                <strong>
                  {t("egp")}{" "}
                  {(freeShipping.threshold - subtotalAfterDiscount).toFixed(2)}
                </strong>{" "}
                {t("addMoreForFreeShipping").split("{{amount}}")[1]}
              </span>
            </div>
          )}
        {freeShipping.enabled && isFreeShippingEligible && (
          <div
            className={cn(
              "bg-green-50 text-green-800 p-3 rounded-lg text-sm border border-green-100 mb-3 flex items-center gap-2 font-bold",
            )}
          >
            <i className={cn("fa-solid fa-gift")}></i>
            {t("unlockedFreeShipping")}
          </div>
        )}

        <div className={cn("flex justify-between mb-3 text-gray-600")}>
          <span>{t("shipping")}</span>
          <span className={cn("font-semibold")}>
            {baseShippingCost === 0 ? (
              t("chooseAddressFirst")
            ) : isFreeShippingEligible ? (
              <span className={cn("text-green-600")}>
                <span className={cn("line-through text-gray-400 me-2")}>
                  {t("egp")} {baseShippingCost.toFixed(2)}
                </span>
                {t("free")}
              </span>
            ) : (
              `${t("egp")} ${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        {selectedRate && selectedRate.deliveryDays && (
          <div
            className={cn("flex justify-between mb-3 text-sm text-gray-500")}
          >
            <span>{t("estDelivery")}</span>
            <span className={cn("font-medium")}>
              {selectedRate.deliveryDays}
            </span>
          </div>
        )}
        <div
          className={cn(
            "flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-3",
          )}
        >
          <span>{t("total")}</span>
          <span>
            {t("egp")} {finalTotal.toFixed(2)}
          </span>
        </div>

        {checkoutError && (
          <div
            className={cn(
              "mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 flex items-center gap-2",
            )}
          >
            <i className={cn("fa-solid fa-circle-exclamation")}></i>
            {checkoutError}
          </div>
        )}
        <button
          onClick={handleCheckout}
          disabled={isCheckoutLoading}
          className={cn(
            "checkout w-full h-13.75 bg-black text-white font-bold text-lg rounded-xl hover:bg-gray-900 transition-all cursor-pointer mt-4 disabled:opacity-50",
          )}
        >
          {isCheckoutLoading ? t("placingOrder") : t("placeOrder")}
        </button>
      </div>
    </div>
  );
};
