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
import { getImageUrl } from "../../../utils/getImageUrl";

export const SlideForm = ({
  editId,
  newSlideUrl,
  setNewSlideUrl,
  newSlideLink,
  setNewSlideLink,
  imageInputUrl,
  setImageInputUrl,
  inputMode,
  setInputMode,
  formError,
  isLoading,
  isUploading,
  handleFileUpload,
  handleAddUrl,
  handleAddSlide,
  resetSlideForm,
}) => {
  const { t } = useTranslation("admin");
  return (
    <Card className={cn("max-w-xl")}>
      <CardHeader>
        <CardTitle className={cn("text-base")}>
          {editId
            ? t("editSlideBanner", {
                defaultValue: `Edit Slide #${editId}`,
                id: editId,
              })
            : t("addNewSlideBanner")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddSlide} className={cn("space-y-4")}>
          <div className={cn("flex flex-col gap-4")}>
            {newSlideUrl && (
              <div className={cn("relative w-full h-40 group")}>
                <img
                  src={getImageUrl(newSlideUrl)}
                  alt={t("bannerPreview")}
                  className={cn(
                    "w-full h-40 object-cover rounded-xl border border-gray-200",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setNewSlideUrl("")}
                  className={cn(
                    "absolute -top-2 -end-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer",
                  )}
                >
                  <i className={cn("fa-solid fa-times")}></i>
                </button>
              </div>
            )}

            {!newSlideUrl && (
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
                    {t("imageModeUrl")}
                  </button>
                </div>

                {inputMode === "upload" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className={cn("hidden")}
                      id="banner-image-upload"
                    />
                    <label
                      htmlFor="banner-image-upload"
                      className={cn(
                        "inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-[42px]",
                        isUploading && "opacity-60 pointer-events-none",
                      )}
                    >
                      <i className={cn("fa-solid fa-upload me-2")}></i>
                      {isUploading
                        ? t("uploading", { defaultValue: "Uploading..." })
                        : t("chooseFile")}
                    </label>
                  </div>
                ) : (
                  <div className={cn("flex w-full gap-2 items-start")}>
                    <Input
                      value={imageInputUrl}
                      onChange={(e) => setImageInputUrl(e.target.value)}
                      placeholder="/products/CasualJeans.jpg"
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

            <Input
              label={t("redirectLinkOptional")}
              value={newSlideLink}
              onChange={(e) => setNewSlideLink(e.target.value)}
              placeholder="/products?category=Dresses"
            />
          </div>

          {formError && (
            <p className={cn("text-sm text-red-600 font-medium")}>{formError}</p>
          )}

          <div className={cn("flex justify-end gap-3 pt-2")}>
            {editId && (
              <Button
                type="button"
                variant="secondary"
                onClick={resetSlideForm}
                className={cn("px-6 h-11")}
              >
                {t("cancelEdit")}
              </Button>
            )}
            <Button
              type="submit"
              disabled={!newSlideUrl || isLoading || isUploading}
              className={cn("px-6 h-11 bg-[#111] hover:bg-[#e60023]")}
            >
              {isLoading
                ? t("saving")
                : editId
                  ? t("updateSlide", { defaultValue: "Update Slide" })
                  : t("saveSlide")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
