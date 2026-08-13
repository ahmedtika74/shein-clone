import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProducts,
  fetchReviewsThunk,
  selectReviewsByProductId,
} from "../../../store/dataSlice";
import { addToCart, selectCartItems } from "../../../store/cartSlice";
import { selectIsInWishlist } from "../../../store/wishlistSlice";
import { selectIsLoggedIn } from "../../../store/authSlice";
import { features } from "../../../config/features";
import {
  findFirstInStockVariant,
  getVariantImage,
  getVariantPrice,
  getVariantStock,
  resolveColor,
  resolveSize,
} from "../../../utils/variants";

const MAX_SUGGESTIONS = 4;

export const useProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const cartItems = useSelector(selectCartItems);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const product = products.find((item) => String(item.id) === String(id));
  const isFav = useSelector(selectIsInWishlist(product?.id));
  const reviews = useSelector(selectReviewsByProductId(product?.id));
  const reviewsByProduct = useSelector((state) => state.data.reviewsByProduct);
  const [reviewsLoading, setReviewsLoading] = useState(features.reviews);

  useEffect(() => {
    if (!features.reviews || !product?.id) {
      setReviewsLoading(false);
      return;
    }

    let cancelled = false;
    const cached = Object.prototype.hasOwnProperty.call(
      reviewsByProduct,
      String(product.id),
    );
    // Show spinner only when this product has never been fetched yet.
    setReviewsLoading(!cached);

    dispatch(fetchReviewsThunk(product.id))
      .unwrap()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReviewsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Intentionally depend on product.id only — cache check is for first paint of each product.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid refetch loop when cache fills
  }, [dispatch, product?.id]);

  const suggestedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (candidate) =>
          candidate.categoryId === product.categoryId &&
          String(candidate.id) !== String(product.id),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [products, product]);

  const imagesList = product?.images?.length ? product.images : [];

  const [selectedImg, setSelectedImg] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Navigating between product pages reuses this hook, so reset per product.
  useEffect(() => {
    if (!product) return;

    const { color: initialColor, size: initialSize } =
      findFirstInStockVariant(product);
    setSelectedColor(initialColor);
    setSelectedSize(initialSize);
    setSelectedImg(
      getVariantImage(product, initialColor) ||
        product.imageUrl ||
        product.img ||
        "",
    );
  }, [product]);

  const color = resolveColor(product, selectedColor);
  const size = resolveSize(product, selectedSize);

  const activePrice = getVariantPrice(product, color, size);
  const variantStock = getVariantStock(product, color, size);

  const cartItem = cartItems.find(
    (item) =>
      String(item.id) === String(product?.id) &&
      item.colorName === (color.nameEn || color.name) &&
      item.sizeName === size.name,
  );

  const currentVariantStock = Math.max(
    0,
    variantStock - (cartItem?.quantity ?? 0),
  );

  const selectColor = (nextColor) => {
    setSelectedColor(nextColor);
    setSelectedImg(getVariantImage(product, nextColor));
  };

  const handleAdd = () => {
    if (cartItem) {
      navigate("/cart");
      return;
    }
    if (currentVariantStock <= 0) return;

    dispatch(addToCart(product, color, size));
  };

  return {
    product,
    imagesList,
    selectedImg,
    setSelectedImg,
    selectedColor: color,
    selectColor,
    selectedSize: size,
    setSelectedSize,
    activePrice,
    isInCart: Boolean(cartItem),
    isFav,
    isLoggedIn,
    handleAdd,
    suggestedProducts,
    currentVariantStock,
    reviews,
    reviewsLoading,
    dispatch,
  };
};
