import { cn } from "../../../utils/cn";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui";

export const SlideForm = ({
  newSlideUrl,
  setNewSlideUrl,
  newSlideLink,
  setNewSlideLink,
  imageInputUrl,
  setImageInputUrl,
  inputMode,
  setInputMode,
  handleFileUpload,
  handleAddUrl,
  handleAddSlide,
}) => {
  return (
    <Card className={cn("max-w-xl")}>
      <CardHeader>
        <CardTitle className={cn("text-base")}>
          + Add New Slide Banner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddSlide} className={cn("space-y-4")}>
          <div className={cn("flex flex-col gap-4")}>
            {/* Image Preview */}
            {newSlideUrl && (
              <div className={cn("relative w-full h-40 group")}>
                <img
                  src={newSlideUrl}
                  alt="Banner Preview"
                  className={cn(
                    "w-full h-40 object-cover rounded-xl border border-gray-200",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setNewSlideUrl("")}
                  className={cn(
                    "absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer",
                  )}
                >
                  <i className={cn("fa-solid fa-times")}></i>
                </button>
              </div>
            )}

            {/* Upload or Link */}
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
                    Upload File
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
                    Image URL
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
                      )}
                    >
                      <i className={cn("fa-solid fa-upload mr-2")}></i>
                      Choose File...
                    </label>
                  </div>
                ) : (
                  <div className={cn("flex w-full gap-2 items-start")}>
                    <Input
                      value={imageInputUrl}
                      onChange={(e) => setImageInputUrl(e.target.value)}
                      placeholder="Image URL..."
                      className={cn("flex-1 min-w-0")}
                    />
                    <Button
                      type="button"
                      onClick={handleAddUrl}
                      className={cn("h-[46px]")}
                    >
                      Add URL
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Redirect Link */}
            <Input
              label="Redirect Link (Optional)"
              value={newSlideLink}
              onChange={(e) => setNewSlideLink(e.target.value)}
              placeholder="/products?category=Dresses"
            />
          </div>

          <div className={cn("flex justify-end pt-2")}>
            <Button
              type="submit"
              disabled={!newSlideUrl}
              className={cn("px-6 h-11 bg-[#111] hover:bg-[#e60023]")}
            >
              Save Slide
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
