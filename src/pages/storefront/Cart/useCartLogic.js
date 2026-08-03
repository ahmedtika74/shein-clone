import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../../../store/cartSlice";
import {
  createOrderThunk,
  selectShippingRates,
  selectPaymentMethods,
  selectOffers,
  selectOrders,
  selectFreeShipping,
  selectSiteSettings,
} from "../../../store/dataSlice";
import { selectUser, updateProfile } from "../../../store/authSlice";

export const useCartLogic = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const siteSettings = useSelector(selectSiteSettings);
  const shippingRates = useSelector(selectShippingRates);
  const freeShipping = useSelector(selectFreeShipping) || {
    enabled: false,
    threshold: 1000,
  };
  const paymentMethods = useSelector(selectPaymentMethods);
  const offers = useSelector(selectOffers);
  const orders = useSelector(selectOrders);

  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const [address, setAddress] = useState(
    user?.address || {
      street: "",
      city: "",
      government: "",
      phone: "",
    },
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const selectedRate = shippingRates.find(
    (rate) => rate.government === address.government,
  );
  const baseShippingCost = selectedRate ? selectedRate.price : 0;

  let discountAmount = 0;
  if (appliedPromo) {
    const val =
      Number(appliedPromo.discountValue) ||
      parseInt(appliedPromo.discount) ||
      0;
    const isPercentage =
      appliedPromo.discountType === "%" ||
      (appliedPromo.discount && String(appliedPromo.discount).includes("%"));
    if (isPercentage) {
      discountAmount = (cartTotal * val) / 100;
    } else {
      discountAmount = val;
    }
  }

  const subtotalAfterDiscount = cartTotal - discountAmount;
  const fsThresholdValue = Number(freeShipping.threshold) || 0;
  const isFreeShippingEligible =
    freeShipping.enabled && subtotalAfterDiscount >= fsThresholdValue;
  const shippingCost = isFreeShippingEligible ? 0 : baseShippingCost;

  const finalTotal = Math.max(0, subtotalAfterDiscount + shippingCost);

  const handleApplyPromo = () => {
    setPromoError("");
    if (!promoInput.trim()) return;

    const offer = offers.find(
      (o) => o.code && o.code.toUpperCase() === promoInput.trim().toUpperCase(),
    );

    if (!offer) {
      setPromoError("Invalid promo code.");
      return;
    }

    if (
      offer.expDate &&
      new Date(offer.expDate) < new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      setPromoError("This promo code has expired.");
      return;
    }

    const hasUsed = orders.some(
      (o) =>
        o.promoCode && o.promoCode.toUpperCase() === offer.code.toUpperCase(),
    );

    if (hasUsed) {
      setPromoError("You have already used this promo code.");
      return;
    }

    setAppliedPromo(offer);
    setPromoInput("");
  };

  const handleCheckout = () => {
    setCheckoutError("");
    if (cart.length === 0) {
      setCheckoutError("Cart is empty");
      return;
    }
    if (
      !address.street ||
      !address.city ||
      !address.government ||
      !address.phone
    ) {
      setCheckoutError("Please fill in all address fields.");
      return;
    }
    if (!selectedPaymentMethod) {
      setCheckoutError("Please select a payment method.");
      return;
    }

    const isDigitalWallet =
      selectedPaymentMethod.toLowerCase().includes("instapay") ||
      selectedPaymentMethod.toLowerCase().includes("vodafone");
    if (isDigitalWallet && !transactionNumber.trim()) {
      setCheckoutError(
        `Please enter the transaction number for ${selectedPaymentMethod}.`,
      );
      return;
    }

    const newOrder = {
      id: Date.now(),
      userEmail: user?.email,
      items: cart,
      total: finalTotal,
      subtotal: cartTotal,
      discount: discountAmount,
      promoCode: appliedPromo ? appliedPromo.code : null,
      shippingCost,
      address,
      paymentMethod: selectedPaymentMethod,
      transactionNumber: isDigitalWallet ? transactionNumber.trim() : null,
      status: "Pending",
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    };

    setIsCheckoutLoading(true);
    dispatch(createOrderThunk(newOrder))
      .unwrap()
      .then(() => {
        if (user) {
          dispatch(updateProfile({ address }));
        }
        dispatch(clearCart());
        setCheckoutMessage("Order placed successfully!");
      })
      .catch((err) => {
        setCheckoutError(err || "Checkout failed");
      })
      .finally(() => {
        setIsCheckoutLoading(false);
      });
  };

  return {
    dispatch,
    siteSettings,
    cart,
    cartTotal,
    shippingRates,
    paymentMethods,
    freeShipping,
    checkoutMessage,
    checkoutError,
    address,
    setAddress,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    transactionNumber,
    setTransactionNumber,
    promoInput,
    setPromoInput,
    appliedPromo,
    setAppliedPromo,
    promoError,
    selectedRate,
    baseShippingCost,
    discountAmount,
    subtotalAfterDiscount,
    isFreeShippingEligible,
    shippingCost,
    finalTotal,
    handleApplyPromo,
    handleCheckout,
    isCheckoutLoading,
  };
};
