import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProducts,
  selectOrders,
  addReview,
  removeReview,
  editReview,
} from "../../../store/dataSlice";
import { selectUser, selectIsAdminLoggedIn } from "../../../store/authSlice";
import { addToCart, selectCartItems } from "../../../store/cartSlice";
import { selectIsInWishlist } from "../../../store/wishlistSlice";

export const useProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);
  const isAdmin = useSelector(selectIsAdminLoggedIn);
  const cartItems = useSelector(selectCartItems);

  const product =
    products.find((p) => String(p.id) === String(id)) || products[0];
  const isFav = useSelector(selectIsInWishlist(product?.id));

  const hasPurchasedProduct = useMemo(() => {
    if (!user) return false;
    return orders.some(
      (order) =>
        order.userEmail === user.email &&
        order.items.some((item) => String(item.id) === String(product.id)),
    );
  }, [user, orders, product]);

  const suggestedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.category === product.category &&
          String(p.id) !== String(product.id),
      )
      .slice(0, 4);
  }, [products, product]);

  // Image state
  const imagesList =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.img || "/images/top.jpg"];
  const [selectedImg, setSelectedImg] = useState(
    imagesList[product?.mainIndex || 0] || imagesList[0],
  );

  // Variant state
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || { name: "Default" },
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || { name: "M", priceAdjustment: 0 },
  );

  // Price computation
  const baseNumeric = product?.numericPrice || 0;
  const activePriceNumeric =
    (selectedColor?.price ?? baseNumeric) +
    (selectedSize?.priceAdjustment || 0);
  const activePriceStr = `EGP ${activePriceNumeric}`;

  const cName = selectedColor?.name || "Default";
  const sName = selectedSize?.name || "Free Size";
  const variantKey = `${cName}-${sName}`;
  const totalVariantStock =
    product?.variantsStock?.[variantKey] !== undefined
      ? product.variantsStock[variantKey]
      : 0;

  const cartItem = cartItems.find(
    (item) =>
      String(item.id) === String(product?.id) &&
      (item.color?.name || item.color) === selectedColor?.name &&
      (item.size?.name || item.size) === selectedSize?.name,
  );
  
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const currentVariantStock = Math.max(0, totalVariantStock - quantityInCart);

  const isInCart = !!cartItem;

  const handleAdd = () => {
    if (isInCart) {
      navigate("/cart");
    } else {
      dispatch(addToCart(product, selectedColor, selectedSize));
    }
  };

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    dispatch(
      addReview({
        productId: product.id,
        review: {
          id: crypto.randomUUID(),
          userEmail: user.email,
          userName: user.name || user.email || "Customer",
          rating: reviewRating,
          comment: reviewComment,
          date: new Date().toLocaleDateString(),
        },
      }),
    );
    setReviewComment("");
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleEditClick = (rev) => {
    setEditingReviewId(rev.id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    dispatch(
      editReview({
        productId: product.id,
        reviewId: editingReviewId,
        rating: editRating,
        comment: editComment,
      }),
    );
    setEditingReviewId(null);
  };

  const handleDeleteReview = (reviewId) => {
    setDeleteReviewId(reviewId);
  };

  const confirmDeleteReview = () => {
    if (deleteReviewId) {
      dispatch(
        removeReview({ productId: product.id, reviewId: deleteReviewId }),
      );
      setDeleteReviewId(null);
    }
  };

  return {
    product,
    imagesList,
    selectedImg,
    setSelectedImg,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    activePriceStr,
    isInCart,
    isFav,
    handleAdd,
    suggestedProducts,
    hasPurchasedProduct,
    user,
    isAdmin,
    currentVariantStock,
    // Review state & handlers
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    reviewSubmitted,
    editingReviewId,
    setEditingReviewId,
    editRating,
    setEditRating,
    editComment,
    setEditComment,
    deleteReviewId,
    setDeleteReviewId,
    handleReviewSubmit,
    handleEditClick,
    handleSaveEdit,
    handleDeleteReview,
    confirmDeleteReview,
    dispatch,
  };
};
