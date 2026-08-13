import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../../../store/cartSlice";
import {
  createOrderThunk,
  fetchMyOrdersThunk,
  selectShippingRates,
  selectPaymentMethods,
  selectOffers,
  selectMyOrders,
  selectFreeShipping,
  selectSiteSettings,
} from "../../../store/dataSlice";
import { fetchAddressesThunk, selectUser } from "../../../store/authSlice";
import { toOrderPayload } from "../../../services/mappers";
import { findShippingRate } from "../../../utils/shipping";
import { features } from "../../../config/features";

export const useCartLogic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("storefront");
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
  const orders = useSelector(selectMyOrders);

  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const userAddresses = user?.addresses ?? [];
  const defaultAddress =
    userAddresses.find((a) => a.isDefault) || userAddresses[0] || null;

  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id || null,
  );
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (user?.token && features.savedAddresses) {
      dispatch(fetchAddressesThunk());
    }
  }, [dispatch, user?.token]);

  useEffect(() => {
    if (!userAddresses.length) {
      setSelectedAddressId(null);
      return;
    }
    const stillValid = userAddresses.some(
      (a) => String(a.id) === String(selectedAddressId),
    );
    if (!stillValid) {
      setSelectedAddressId(defaultAddress?.id ?? userAddresses[0].id);
    }
  }, [user?.addresses, defaultAddress?.id, selectedAddressId]);

  const address = user
    ? userAddresses.find((a) => a.id === selectedAddressId) || null
    : null;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionScreenshot, setTransactionScreenshot] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const selectedRate = findShippingRate(shippingRates, address?.government);
  const baseShippingCost = selectedRate ? Number(selectedRate.price) || 0 : 0;

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

  let productDiscountAmount = 0;
  cart.forEach((item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      productDiscountAmount +=
        (item.originalPrice - item.price) * item.quantity;
    }
  });

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
      setPromoError(t("invalidPromoCode"));
      return;
    }

    if (
      offer.expiryDate &&
      new Date(offer.expiryDate) < new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      setPromoError(t("promoExpired"));
      return;
    }

    const hasUsed = orders.some(
      (o) =>
        o.promoCode && o.promoCode.toUpperCase() === offer.code.toUpperCase(),
    );

    if (hasUsed) {
      setPromoError(t("promoAlreadyUsed"));
      return;
    }

    setAppliedPromo(offer);
    setPromoInput("");
  };

  const handleCheckout = () => {
    setCheckoutError("");

    if (!user) {
      setCheckoutError(t("loginToCheckout"));
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (cart.length === 0) {
      setCheckoutError(t("cartEmpty", { defaultValue: "Cart is empty" }));
      return;
    }
    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.government ||
      !address.phone
    ) {
      setCheckoutError(t("provideShippingAddress"));
      return;
    }
    if (!selectedPaymentMethod) {
      setCheckoutError(t("selectPaymentMethodError"));
      return;
    }

    const isDigitalWallet =
      selectedPaymentMethod.toLowerCase().includes("instapay") ||
      selectedPaymentMethod.toLowerCase().includes("vodafone");
    if (
      isDigitalWallet &&
      !transactionNumber.trim() &&
      !transactionScreenshot
    ) {
      setCheckoutError(
        t("transactionProofRequired", { method: selectedPaymentMethod }),
      );
      return;
    }

    const orderPayload = toOrderPayload({
      customerName:
        user.name || user.fullName || address.label || "Customer",
      userEmail: user.email || "",
      cartItems: cart,
      subtotal: cartTotal,
      discount: discountAmount,
      productDiscount: productDiscountAmount,
      promoCode: appliedPromo ? appliedPromo.code : null,
      shippingCost,
      total: finalTotal,
      address,
      paymentMethod: selectedPaymentMethod,
      transactionNumber: isDigitalWallet ? transactionNumber.trim() : null,
      transactionScreenshotUrl: isDigitalWallet
        ? transactionScreenshot || null
        : null,
    });

    if (orderPayload.items.some((item) => !item.productId)) {
      setCheckoutError(t("invalidCartProducts"));
      return;
    }

    setIsCheckoutLoading(true);
    dispatch(createOrderThunk(orderPayload))
      .unwrap()
      .then(() => {
        dispatch(clearCart());
        dispatch(fetchMyOrdersThunk());
        setCheckoutMessage(t("orderPlacedSuccess"));
      })
      .catch((err) => {
        setCheckoutError(err || t("checkoutFailed"));
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
    userAddresses,
    selectedAddressId,
    setSelectedAddressId,
    showAddressModal,
    setShowAddressModal,
    user,
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
    selectedRate,
    baseShippingCost,
    discountAmount,
    productDiscountAmount,
    subtotalAfterDiscount,
    isFreeShippingEligible,
    shippingCost,
    finalTotal,
    handleApplyPromo,
    handleCheckout,
    isCheckoutLoading,
  };
};
