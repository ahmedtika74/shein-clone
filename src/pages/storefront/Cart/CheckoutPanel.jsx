import { cn } from "../../../utils/cn";

export const CheckoutPanel = ({
  address,
  setAddress,
  shippingRates,
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  transactionNumber,
  setTransactionNumber,
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
  return (
    <div className={cn("w-full lg:w-[450px]")}>
      {/* Address & Payment Form */}
      <div
        className={cn(
          "bg-white p-6 rounded-[10px] shadow-[0_2px_10px_#ddd] border border-gray-100 mb-6",
        )}
      >
        <h2 className={cn("text-xl font-bold mb-4 border-b pb-3")}>
          Shipping Address
        </h2>
        <div className={cn("space-y-4")}>
          <select
            value={address.government}
            onChange={(e) =>
              setAddress({ ...address, government: e.target.value })
            }
            className={cn(
              "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
            )}
          >
            <option value="">Select Government</option>
            {shippingRates.map((rate) => (
              <option key={rate.id} value={rate.government}>
                {rate.government}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className={cn(
              "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
            )}
          />
          <input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className={cn(
              "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
            )}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className={cn(
              "w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-black",
            )}
          />
        </div>

        <h2 className={cn("text-xl font-bold mb-4 border-b pb-3 mt-8")}>
          Payment Method
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
                  value={method.name}
                  checked={selectedPaymentMethod === method.name}
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
                <div className={cn("flex-1")}>
                  <span className={cn("text-gray-900 font-bold block")}>
                    {method.name}
                  </span>
                  {method.details && (
                    <span className={cn("text-sm text-gray-500 mt-1 block")}>
                      {method.details}
                    </span>
                  )}
                  {(method.name.toLowerCase().includes("instapay") ||
                    method.name.toLowerCase().includes("vodafone")) &&
                    selectedPaymentMethod === method.name && (
                      <div className={cn("mt-3")}>
                        <input
                          type="text"
                          placeholder="Transaction Number"
                          value={transactionNumber}
                          onChange={(e) => setTransactionNumber(e.target.value)}
                          className={cn(
                            "w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-black text-sm",
                          )}
                        />
                      </div>
                    )}
                </div>
              </label>
            ))
          ) : (
            <p className={cn("text-sm text-red-500")}>
              No payment methods available.
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
          Order Summary
        </h2>

        <div className={cn("mb-6")}>
          <div className={cn("flex gap-2")}>
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Enter Promo Code"
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
              Apply
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
                {appliedPromo.code} Applied!
              </span>
              <button
                onClick={() => setAppliedPromo(null)}
                className={cn("text-xs font-bold hover:underline")}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className={cn("flex justify-between mb-3 text-gray-600")}>
          <span>Subtotal</span>
          <span className={cn("font-semibold")}>
            EGP {(cartTotal + (productDiscountAmount || 0)).toFixed(2)}
          </span>
        </div>

        {appliedPromo && (
          <div className={cn("flex justify-between mb-3 text-green-600")}>
            <span>
              Discount (
              {appliedPromo.discount ||
                (appliedPromo.discountType === "%"
                  ? `${appliedPromo.discountValue}%`
                  : `EGP ${appliedPromo.discountValue}`)}
              )
            </span>
            <span className={cn("font-semibold")}>
              - EGP {discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {productDiscountAmount > 0 && (
          <div className={cn("flex justify-between mb-3 text-green-600")}>
            <span>Products Discount</span>
            <span className={cn("font-semibold")}>
              - EGP {productDiscountAmount.toFixed(2)}
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
                Add{" "}
                <strong>
                  EGP{" "}
                  {(freeShipping.threshold - subtotalAfterDiscount).toFixed(2)}
                </strong>{" "}
                more to get Free Shipping!
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
            You&apos;ve unlocked Free Shipping!
          </div>
        )}

        <div className={cn("flex justify-between mb-3 text-gray-600")}>
          <span>Shipping</span>
          <span className={cn("font-semibold")}>
            {baseShippingCost === 0 ? (
              "Choose address first"
            ) : isFreeShippingEligible ? (
              <span className={cn("text-green-600")}>
                <span className={cn("line-through text-gray-400 mr-2")}>
                  EGP {baseShippingCost.toFixed(2)}
                </span>
                Free
              </span>
            ) : (
              `EGP ${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        {selectedRate && selectedRate.deliveryDays && (
          <div
            className={cn("flex justify-between mb-3 text-sm text-gray-500")}
          >
            <span>Est. Delivery</span>
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
          <span>Total</span>
          <span>EGP {finalTotal.toFixed(2)}</span>
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
          {isCheckoutLoading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};
