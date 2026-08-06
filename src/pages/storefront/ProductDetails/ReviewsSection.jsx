import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";

export const ReviewsSection = ({
  product,
  hasPurchasedProduct,
  user,
  isAdmin,
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
}) => {
  const { t } = useTranslation(["storefront", "common"]);
  return (
    <div className={cn("reviews-section mt-16 border-t border-gray-200 pt-10")}>
      <h2 className={cn("text-2xl font-bold text-gray-900 mb-8")}>{t("customerReviews")}</h2>

      {product.reviews && product.reviews.length > 0 ? (
        <div className={cn("space-y-6 mb-10")}>
          {product.reviews.map((rev) => {
            const isOwner = user && user.email === rev.userEmail;
            const canDelete = isOwner || isAdmin;
            const isEditing = editingReviewId === rev.id;

            return (
              <div
                key={rev.id}
                className={cn(
                  "p-6 bg-gray-50 rounded-xl border border-gray-100",
                )}
              >
                {isEditing ? (
                  <form onSubmit={handleSaveEdit}>
                    <div className={cn("mb-4")}>
                      <label
                        className={cn(
                          "block text-sm font-bold text-gray-700 mb-2",
                        )}
                      >{t("rating")}</label>
                      <div className={cn("flex gap-2")}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className={cn(
                              `text-2xl ${
                                star <= editRating
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              } hover:scale-110 transition-transform cursor-pointer`,
                            )}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className={cn(
                        "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-3 min-h-[80px]",
                      )}
                      required
                    />
                    <div className={cn("flex gap-3")}>
                      <button
                        type="submit"
                        className={cn(
                          "bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer",
                        )}
                      >{t("save")}</button>
                      <button
                        type="button"
                        onClick={() => setEditingReviewId(null)}
                        className={cn(
                          "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer",
                        )}
                      >{t("cancel")}</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div
                      className={cn("flex justify-between items-start mb-3")}
                    >
                      <div>
                        <h4
                          className={cn("font-bold text-gray-900 capitalize")}
                        >
                          {rev.userName}
                        </h4>
                        <span className={cn("text-xs text-gray-500")}>
                          {rev.date}
                        </span>
                      </div>
                      <div className={cn("flex flex-col items-end gap-2")}>
                        <div className={cn("text-amber-400 text-sm")}>
                          {"★".repeat(rev.rating)}
                          {"☆".repeat(5 - rev.rating)}
                        </div>
                        <div className={cn("flex gap-3")}>
                          {isOwner && (
                            <button
                              onClick={() => handleEditClick(rev)}
                              className={cn(
                                "text-xs text-gray-500 hover:text-black font-semibold cursor-pointer",
                              )}
                            >{t("edit")}</button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className={cn(
                                "text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer",
                              )}
                            >{t("delete")}</button>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className={cn("text-gray-700")}>{rev.comment}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className={cn("text-gray-500 mb-10")}>{t("noReviewsYet")}</p>
      )}

      {hasPurchasedProduct ? (
        <div
          className={cn(
            "write-review bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-2xl",
          )}
        >
          <h3 className={cn("text-xl font-bold mb-6")}>{t("writeReview")}</h3>
          {reviewSubmitted && (
            <div
              className={cn(
                "mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg font-semibold",
              )}
            >{t("reviewThankYou")}</div>
          )}
          <form onSubmit={handleReviewSubmit}>
            <div className={cn("mb-4")}>
              <label
                className={cn("block text-sm font-bold text-gray-700 mb-2")}
              >{t("rating")}</label>
              <div className={cn("flex gap-2")}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={cn(
                      `text-2xl ${
                        star <= reviewRating
                          ? "text-amber-400"
                          : "text-gray-300"
                      } hover:scale-110 transition-transform cursor-pointer`,
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className={cn("mb-6")}>
              <label
                className={cn("block text-sm font-bold text-gray-700 mb-2")}
              >{t("yourReview")}</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={t("reviewPlaceholder")}
                className={cn(
                  "w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]",
                )}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={cn(
                "bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors cursor-pointer",
              )}
            >{t("submitReview")}</button>
          </form>
        </div>
      ) : (
        <div
          className={cn(
            "bg-gray-50 p-6 rounded-xl border border-gray-200 text-center max-w-2xl",
          )}
        >
          <i className={cn("fa-solid fa-lock text-gray-400 text-2xl mb-3")}></i>
          <p className={cn("text-gray-600 font-medium")}>{t("mustPurchaseToReview")}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteReviewId && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
          )}
        >
          <div
            className={cn(
              "bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in duration-200",
            )}
          >
            <div className={cn("flex flex-col items-center text-center")}>
              <div
                className={cn(
                  "w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl mb-4",
                )}
              >
                <i className={cn("fa-solid fa-triangle-exclamation")}></i>
              </div>
              <h3 className={cn("text-xl font-bold text-gray-900 mb-2")}>{t("deleteReview")}</h3>
              <p className={cn("text-gray-500 mb-6")}>{t("deleteReviewConfirm")}</p>
              <div className={cn("flex gap-3 w-full")}>
                <button
                  onClick={() => setDeleteReviewId(null)}
                  className={cn(
                    "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer",
                  )}
                >{t("cancel")}</button>
                <button
                  onClick={confirmDeleteReview}
                  className={cn(
                    "flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer",
                  )}
                >{t("delete")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
