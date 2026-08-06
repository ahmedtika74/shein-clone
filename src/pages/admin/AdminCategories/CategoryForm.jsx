import { cn } from "../../../utils/cn";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui";
import { useTranslation } from "react-i18next";

export const CategoryForm = ({
  editId,
  catNameEn,
  setCatNameEn,
  catNameAr,
  setCatNameAr,
  catImg,
  setCatImg,
  imageInputUrl,
  setImageInputUrl,
  inputMode,
  setInputMode,
  handleFileUpload,
  handleAddUrl,
  handleSubmit,
  resetForm,
  isLoading,
}) => {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <Card
      className={cn(
        "max-w-xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] rounded-[20px]",
      )}
    >
      <CardHeader className={cn("border-b pb-3 mb-6")}>
        <CardTitle className={cn("text-xl")}>
          {editId
            ? t("editCategoryId", {
                id: editId,
                defaultValue: `Edit Category #${editId}`,
              })
            : t("addNewCategory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={cn("space-y-6")}>
          <Input
            label={`${t("categoryName")} (English)`}
            placeholder={`${t("egDresses")} (EN)`}
            value={catNameEn}
            onChange={(e) => setCatNameEn(e.target.value)}
            required
            className={cn("h-11")}
          />
          <Input
            label={`${t("categoryName")} (Arabic)`}
            placeholder={`${t("egDresses")} (AR)`}
            value={catNameAr}
            onChange={(e) => setCatNameAr(e.target.value)}
            required
            className={cn("h-11")}
          />

          <div>
            <label
              className={cn(
                "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2",
              )}
            >
              {t("categoryImage")}
            </label>

            <div className={cn("flex flex-col gap-4")}>
              {/* Image Preview */}
              {catImg && (
                <div className={cn("relative w-24 h-24 group")}>
                  <img
                    src={catImg}
                    alt={t("categoryPreview")}
                    className={cn(
                      "w-24 h-24 object-cover rounded-xl border border-gray-200",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setCatImg("")}
                    className={cn(
                      "absolute -top-2 -end-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer",
                    )}
                  >
                    <i className={cn("fa-solid fa-times")}></i>
                  </button>
                </div>
              )}

              {/* Upload or Link */}
              {!catImg && (
                <div className={cn("flex flex-col gap-3")}>
                  <div className={cn("flex bg-gray-100 p-1 rounded-lg w-fit")}>
                    <button
                      type="button"
                      onClick={() => setInputMode("upload")}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                        inputMode === "upload"
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-500 hover:text-gray-700",
                      )}
                    >
                      {t("uploadFile")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode("url")}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                        inputMode === "url"
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-500 hover:text-gray-700",
                      )}
                    >
                      {t("imageLink")}
                    </button>
                  </div>

                  {inputMode === "upload" ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className={cn("hidden")}
                        id="category-image-upload"
                      />
                      <label
                        htmlFor="category-image-upload"
                        className={cn(
                          "inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-[42px]",
                        )}
                      >
                        <i className={cn("fa-solid fa-upload me-2")}></i>
                        {t("chooseFile")}
                      </label>
                    </div>
                  ) : (
                    <div className={cn("flex w-full gap-2 items-start")}>
                      <Input
                        value={imageInputUrl}
                        onChange={(e) => setImageInputUrl(e.target.value)}
                        placeholder={`${t("imageLink")}...`}
                        className={cn("flex-1 min-w-0")}
                      />
                      <Button
                        type="button"
                        onClick={handleAddUrl}
                        className={cn("h-[46px]")}
                      >
                        {t("addUrl")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={cn("flex gap-4 pt-4")}>
            <Button
              type="submit"
              disabled={isLoading}
              className={cn("flex-1 h-11 bg-[#111] hover:bg-[#e60023]")}
            >
              {isLoading
                ? t("saving")
                : editId
                  ? t("updateCategory")
                  : t("saveCategory")}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                className={cn("flex-1 h-11")}
              >
                {t("cancelEdit", { defaultValue: "Cancel" })}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
