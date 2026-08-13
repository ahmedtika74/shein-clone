import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { features } from "../../../config/features";
import {
  createReviewThunk,
  updateReviewThunk,
  deleteReviewThunk,
} from "../../../store/dataSlice";
import { selectUser } from "../../../store/authSlice";
import { Button } from "../../../components/ui/Button";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

const MAX_STARS = 5;

const StarRating = ({ rating }) => (
  <div className={cn("flex gap-0.5")} aria-label={`${rating} / ${MAX_STARS}`}>
    {Array.from({ length: MAX_STARS }, (_, index) => (
      <i
        key={index}
        className={cn(
          "fa-solid fa-star text-sm",
          index < rating ? "text-yellow-400" : "text-gray-300",
        )}
      ></i>
    ))}
  </div>
);

const StarPicker = ({ rating, onChange }) => (
  <div className={cn("flex gap-2")}>
    {Array.from({ length: MAX_STARS }, (_, index) => {
      const value = index + 1;
      return (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn("text-xl cursor-pointer")}
          aria-label={`${value} stars`}
        >
          <i
            className={cn(
              "fa-solid fa-star",
              value <= rating ? "text-yellow-400" : "text-gray-300",
            )}
          ></i>
        </button>
      );
    })}
  </div>
);

const isOwnReview = (review, user) => {
  if (!user || !review) return false;
  if (review.userId != null && user.id != null) {
    return String(review.userId) === String(user.id);
  }
  if (review.userEmail && user.email) {
    return (
      String(review.userEmail).toLowerCase() === String(user.email).toLowerCase()
    );
  }
  const displayName = user.fullName || user.name;
  return Boolean(displayName && review.userName === displayName);
};

export const ReviewsSection = ({
  product,
  reviews = [],
  reviewsLoading = false,
  isLoggedIn,
}) => {
  const { t } = useTranslation(["storefront", "common"]);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  if (!features.reviews) return null;

  const alreadyReviewed = reviews.some((review) => isOwnReview(review, user));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !product?.id) return;
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await dispatch(
        createReviewThunk({
          productId: product.id,
          rating,
          comment: comment.trim(),
        }),
      ).unwrap();
      setComment("");
      setRating(5);
      setSuccess(t("reviewSubmitted"));
    } catch (err) {
      setError(err || t("genericErrorMessage"));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating || 5);
    setEditComment(review.comment || "");
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!product?.id || !editingId) return;
    setEditSaving(true);
    setEditError("");
    try {
      await dispatch(
        updateReviewThunk({
          productId: product.id,
          reviewId: editingId,
          rating: editRating,
          comment: editComment.trim(),
        }),
      ).unwrap();
      setEditingId(null);
      setSuccess(t("reviewUpdated"));
    } catch (err) {
      setEditError(err || t("genericErrorMessage"));
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!product?.id || !reviewId) return;
    if (!window.confirm(t("deleteReviewConfirm"))) return;

    setDeletingId(reviewId);
    setError("");
    try {
      await dispatch(
        deleteReviewThunk({ productId: product.id, reviewId }),
      ).unwrap();
      if (editingId === reviewId) cancelEdit();
      setSuccess(t("reviewDeleted"));
    } catch (err) {
      setError(err || t("genericErrorMessage"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className={cn("mt-16 border-t border-gray-200 pt-10")}>
      <h2 className={cn("text-2xl font-bold text-gray-900 mb-8")}>
        {t("customerReviews")}
      </h2>

      {success && (
        <p className={cn("text-green-600 text-sm font-medium mb-4")}>
          {success}
        </p>
      )}
      {error && !editingId && (
        <p className={cn("text-red-600 text-sm font-medium mb-4")}>{error}</p>
      )}

      {reviewsLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      {isLoggedIn && !alreadyReviewed && (
        <form
          onSubmit={handleSubmit}
          className={cn(
            "mb-10 border border-gray-200 rounded-xl p-5 space-y-4 max-w-xl",
          )}
        >
          <h3 className={cn("font-bold text-gray-900")}>{t("writeReview")}</h3>
          <StarPicker rating={rating} onChange={setRating} />
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className={cn(
              "w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-black resize-none",
            )}
            placeholder={t("writeReview")}
          />
          <Button type="submit" disabled={submitting || !comment.trim()}>
            {t("submitReview")}
          </Button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className={cn("text-gray-500")}>{t("noReviewsYet")}</p>
      ) : (
        <ul className={cn("space-y-6")}>
          {reviews.map((review) => {
            const own = isOwnReview(review, user);
            const isEditing = String(editingId) === String(review.id);

            return (
              <li
                key={review.id}
                className={cn("border border-gray-200 rounded-xl p-5")}
              >
                {isEditing ? (
                  <form onSubmit={handleUpdate} className={cn("space-y-3")}>
                    <div
                      className={cn("flex items-center justify-between mb-1")}
                    >
                      <span className={cn("font-bold text-gray-900")}>
                        {review.userName}
                      </span>
                      <span className={cn("text-xs text-gray-400")}>
                        {review.date}
                      </span>
                    </div>
                    <StarPicker rating={editRating} onChange={setEditRating} />
                    <textarea
                      required
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                      className={cn(
                        "w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-black resize-none",
                      )}
                    />
                    {editError && (
                      <p className={cn("text-red-600 text-sm font-medium")}>
                        {editError}
                      </p>
                    )}
                    <div className={cn("flex gap-2")}>
                      <Button
                        type="submit"
                        disabled={editSaving || !editComment.trim()}
                      >
                        {t("saveReview")}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={cancelEdit}
                      >
                        {t("cancel", { ns: "common" })}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div
                      className={cn("flex items-center justify-between mb-2")}
                    >
                      <span className={cn("font-bold text-gray-900")}>
                        {review.userName}
                        {own && (
                          <span
                            className={cn(
                              "ms-2 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold",
                            )}
                          >
                            {t("yourReview")}
                          </span>
                        )}
                      </span>
                      <span className={cn("text-xs text-gray-400")}>
                        {review.date}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className={cn("text-gray-600 mt-3")}>{review.comment}</p>
                    {own && (
                      <div className={cn("flex gap-3 mt-4")}>
                        <button
                          type="button"
                          onClick={() => startEdit(review)}
                          className={cn(
                            "text-sm font-bold text-blue-600 hover:underline cursor-pointer",
                          )}
                        >
                          {t("editReview")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                          className={cn(
                            "text-sm font-bold text-red-600 hover:underline cursor-pointer disabled:opacity-50",
                          )}
                        >
                          {t("deleteReview")}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
        </>
      )}
    </section>
  );
};
