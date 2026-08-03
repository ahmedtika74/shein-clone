import { cn } from "../../../utils/cn";
import { Button, Input, Card, CardContent } from "../../../components/ui";

export const PaymentMethodsList = ({
  paymentMethods,
  editingId,
  editName,
  setEditName,
  editDetails,
  setEditDetails,
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
  return (
    <div className={cn("space-y-4")}>
      {paymentMethods.map((method) => (
        <Card key={method.id} className={cn("bg-gray-50 border-gray-200")}>
          <CardContent className={cn("p-4")}>
            {editingId === method.id ? (
              <div className={cn("flex-1 w-full flex flex-col gap-3")}>
                <div className={cn("flex flex-col sm:flex-row gap-3")}>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={cn("flex-1")}
                    required
                  />
                  <Input
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                    className={cn("flex-1")}
                    placeholder="Details"
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
                          "absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] cursor-pointer",
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
                          File
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
                          URL
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
                            Choose File
                          </label>
                        </div>
                      ) : (
                        <div className={cn("flex items-center gap-2 w-full")}>
                          <Input
                            value={editImageInputUrl}
                            onChange={(e) =>
                              setEditImageInputUrl(e.target.value)
                            }
                            placeholder="Image URL..."
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
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cn("flex items-center gap-2 ml-auto")}>
                    <Button onClick={handleSaveEdit}>Save</Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Cancel
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
                      {method.name}
                    </span>
                    {method.details && (
                      <span className={cn("text-sm text-gray-500 mt-1 block")}>
                        {method.details}
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
                    title="Edit Method"
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
                    title="Delete Method"
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
          No payment methods found.
        </p>
      )}
    </div>
  );
};
