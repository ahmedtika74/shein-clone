import { cn } from "../../../utils/cn";
import { Button, Input, Card, CardContent } from "../../../components/ui";

export const PaymentMethodForm = ({
  handleAdd,
  newMethodName,
  setNewMethodName,
  newMethodDetails,
  setNewMethodDetails,
  newMethodImg,
  setNewMethodImg,
  inputMode,
  setInputMode,
  handleFileUpload,
  imageInputUrl,
  setImageInputUrl,
  handleAddUrl,
}) => {
  return (
    <Card className={cn("mb-8 bg-gray-50")}>
      <CardContent className={cn("space-y-4")}>
        <form onSubmit={handleAdd} className={cn("space-y-4")}>
          <div className={cn("flex flex-col md:flex-row gap-4 items-start")}>
            <Input
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              placeholder="Method Name (e.g. InstaPay)"
              className={cn("flex-1")}
              required
            />
            <Input
              value={newMethodDetails}
              onChange={(e) => setNewMethodDetails(e.target.value)}
              placeholder="Details (Number or Link)"
              className={cn("flex-1")}
            />
          </div>

          <div className={cn("flex flex-col gap-2")}>
            <label className={cn("font-bold text-sm text-gray-800")}>
              Payment Icon / Image
            </label>
            {newMethodImg ? (
              <div className={cn("relative w-16 h-16 group")}>
                <img
                  src={newMethodImg}
                  alt="Preview"
                  className={cn(
                    "w-16 h-16 object-contain rounded-md border border-gray-200 bg-white p-1",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setNewMethodImg("")}
                  className={cn(
                    "absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px]",
                  )}
                >
                  <i className={cn("fa-solid fa-times")}></i>
                </button>
              </div>
            ) : (
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
                      onChange={(e) => handleFileUpload(e, setNewMethodImg)}
                      className={cn("hidden")}
                      id="add-payment-img"
                    />
                    <label
                      htmlFor="add-payment-img"
                      className={cn(
                        "inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-[42px]",
                      )}
                    >
                      <i className={cn("fa-solid fa-upload mr-2")}></i>Choose
                      File...
                    </label>
                  </div>
                ) : (
                  <div className={cn("flex flex-1 gap-2 items-start")}>
                    <Input
                      value={imageInputUrl}
                      onChange={(e) => setImageInputUrl(e.target.value)}
                      placeholder="Image URL..."
                      className={cn("flex-1 min-w-0")}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        handleAddUrl(
                          imageInputUrl,
                          setNewMethodImg,
                          setImageInputUrl,
                        )
                      }
                      className={cn("h-[46px]")}
                    >
                      Add URL
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className={cn("w-full h-11")}>
            Add Method
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
