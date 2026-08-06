import { cn } from "../../../utils/cn";
import { Button, Input, Card, CardContent } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "../../../utils/localization";

export const PaymentMethodsList = ({
  paymentMethods,
  editingId,
  editNameEn,
  setEditNameEn,
  editNameAr,
  setEditNameAr,
  editDetailsEn,
  setEditDetailsEn,
  editDetailsAr,
  setEditDetailsAr,
  editImg,
  setEditImg,
  editImageInputUrl,
  setEditImageInputUrl,
  editInputMode,
  setEditInputMode,
  handleFileUpload,
  handleAddUrl,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
}) => {
  const { t, i18n } = useTranslation("admin");
  return (
    <div className={cn("space-y-4")}>
      {paymentMethods.map((method) => (
        <Card key={method.id} className={cn("bg-gray-50 border-gray-200")}>
          <CardContent className={cn("p-4")}>
            {editingId === method.id ? (
              <div className={cn("flex-1 w-full flex flex-col gap-3")}>
                <div className={cn("flex flex-col sm:flex-row gap-3")}>
                  <Input
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className={cn("flex-1")}
                    placeholder="EN Name"
                    required
                  />
                  <Input
                    value={editNameAr}
                    onChange={(e) => setEditNameAr(e.target.value)}
                    className={cn("flex-1")}
                    placeholder="AR Name"
                    required
                  />
                </div>
                <div className={cn("flex flex-col sm:flex-row gap-3")}>
                  <Input
                    value={editDetailsEn}
                    onChange={(e) => setEditDetailsEn(e.target.value)}
                    className={cn("flex-1")}
                    placeholder={`${t("detailsPlaceholder")} (EN)`}
                  />
                  <Input
                    value={editDetailsAr}
                    onChange={(e) => setEditDetailsAr(e.target.value)}
                    className={cn("flex-1")}
                    placeholder={`${t("detailsPlaceholder")} (AR)`}
                  />
                </div>

                <div className={cn("flex items-center gap-3")}>
                  {editImg ? (
                    <div className={cn("relative w-12 h-12 group shrink-0")}>
                      <img
                        src={editImg}
                        alt="Preview"
                        className={cn(
                          "w-12 h-12 object-contain rounded-md border border-gray-200 bg-white p-1",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setEditImg("")}
                        className={cn(
                          "absolute -top-1 -end-1 bg-red-500 text-white w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] cursor-pointer",
                        )}
                      >
                        <i className={cn("fa-solid fa-times")}></i>
                      </button>
                    </div>
                  ) : (
                    <div className={cn("flex flex-col gap-3 flex-1")}>
                      <div
                        className={cn("flex bg-gray-200 p-1 rounded-lg w-fit")}
                      >
                        <button
                          type="button"
                          onClick={() => setEditInputMode("upload")}
                          className={cn(
                            "px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                            editInputMode === "upload"
                              ? "bg-white text-black shadow-sm"
                              : "text-gray-500 hover:text-gray-700",
                          )}
                        >
                          {t("file")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditInputMode("url")}
                          className={cn(
                            "px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                            editInputMode === "url"
                              ? "bg-white text-black shadow-sm"
                              : "text-gray-500 hover:text-gray-700",
                          )}
                        >
                          {t("url", { defaultValue: "URL" })}
                        </button>
                      </div>

                      {editInputMode === "upload" ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setEditImg)}
                            className={cn("hidden")}
                            id={`edit-payment-img-${method.id}`}
                          />
                          <label
                            htmlFor={`edit-payment-img-${method.id}`}
                            className={cn(
                              "inline-flex items-center justify-center bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-700 transition-colors whitespace-nowrap h-[32px]",
                            )}
                          >
                            {t("chooseFile", { defaultValue: "Choose File" })}
                          </label>
                        </div>
                      ) : (
                        <div className={cn("flex items-center gap-2 w-full")}>
                          <Input
                            value={editImageInputUrl}
                            onChange={(e) =>
                              setEditImageInputUrl(e.target.value)
                            }
                            placeholder={t("imageUrlPlaceholder", {
                              defaultValue: "Image URL...",
                            })}
                            className={cn("flex-1 min-w-0 !p-1.5 !text-xs")}
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              handleAddUrl(
                                editImageInputUrl,
                                setEditImg,
                                setEditImageInputUrl,
                              )
                            }
                            className={cn(
                              "px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 h-[32px]",
                            )}
                          >
                            {t("addNew", { defaultValue: "Add" })}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cn("flex items-center gap-2 ms-auto")}>
                    <Button onClick={handleSaveEdit}>
                      {t("save", { defaultValue: "Save" })}
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      {t("cancel", { defaultValue: "Cancel" })}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn("flex items-center justify-between")}>
                <div className={cn("flex items-center gap-4")}>
                  {method.img && (
                    <img
                      src={method.img}
                      alt={method.name}
                      className={cn(
                        "w-12 h-12 object-contain rounded-md border border-gray-200 bg-white p-1",
                      )}
                    />
                  )}
                  <div>
                    <span className={cn("font-semibold text-gray-800 block")}>
                      {getLocalizedString(method, "name", i18n.language)}
                    </span>
                    {(method.detailsEn ||
                      method.detailsAr ||
                      method.details) && (
                      <span className={cn("text-sm text-gray-500 mt-1 block")}>
                        {getLocalizedString(method, "details", i18n.language)}
                      </span>
                    )}
                  </div>
                </div>
                <div className={cn("flex gap-2")}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(method)}
                    className={cn(
                      "text-blue-600 hover:text-blue-800 hover:bg-blue-50",
                    )}
                    title={t("editMethodTitle")}
                  >
                    <i className={cn("fa-solid fa-pen")}></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(method.id)}
                    className={cn(
                      "text-red-600 hover:text-red-800 hover:bg-red-50",
                    )}
                    title={t("deleteMethodTitle")}
                  >
                    <i className={cn("fa-solid fa-trash")}></i>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {paymentMethods.length === 0 && (
        <p className={cn("text-gray-500 text-center py-4")}>
          {t("noPaymentMethodsFound")}
        </p>
      )}
    </div>
  );
};
