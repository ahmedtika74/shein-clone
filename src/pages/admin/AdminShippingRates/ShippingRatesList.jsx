import { cn } from "../../../utils/cn";
import { Card, CardContent } from "../../../components/ui";
import { Input, Button } from "../../../components/ui";

export const ShippingRatesList = ({
  shippingRates,
  editingId,
  editGovName,
  setEditGovName,
  editPrice,
  setEditPrice,
  editDeliveryDays,
  setEditDeliveryDays,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
}) => {
  return (
    <div className={cn("space-y-4")}>
      {shippingRates.map((rate) => (
        <Card key={rate.id} className={cn("bg-gray-50 border-gray-200")}>
          <CardContent className={cn("p-4")}>
            {editingId === rate.id ? (
              <div
                className={cn(
                  "w-full flex flex-col md:flex-row gap-3 items-start md:items-center",
                )}
              >
                <Input
                  value={editGovName}
                  onChange={(e) => setEditGovName(e.target.value)}
                  className={cn("flex-1")}
                  required
                />
                <Input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className={cn("w-full md:w-32")}
                  min="0"
                  step="0.01"
                  required
                />
                <Input
                  value={editDeliveryDays}
                  onChange={(e) => setEditDeliveryDays(e.target.value)}
                  className={cn("w-full md:w-48")}
                  placeholder="Delivery Days"
                  required
                />
                <div className={cn("flex items-center gap-2 w-full md:w-auto")}>
                  <Button
                    onClick={handleSaveEdit}
                    className={cn("flex-1 md:flex-none")}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="secondary"
                    className={cn("flex-1 md:flex-none")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                )}
              >
                <div>
                  <span className={cn("font-bold text-gray-900 block")}>
                    {rate.government}
                  </span>
                  {rate.deliveryDays && (
                    <span className={cn("text-xs text-gray-500")}>
                      Delivery: {rate.deliveryDays}
                    </span>
                  )}
                </div>
                <div className={cn("flex items-center gap-4")}>
                  <span className={cn("font-semibold text-[#e60023]")}>
                    EGP {rate.price.toFixed(2)}
                  </span>
                  <div className={cn("flex gap-2")}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(rate)}
                      className={cn(
                        "text-blue-600 hover:text-blue-800 hover:bg-blue-50",
                      )}
                      title="Edit Rate"
                    >
                      <i className={cn("fa-solid fa-pen")}></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rate.id)}
                      className={cn(
                        "text-red-600 hover:text-red-800 hover:bg-red-50",
                      )}
                      title="Delete Rate"
                    >
                      <i className={cn("fa-solid fa-trash")}></i>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {shippingRates.length === 0 && (
        <p className={cn("text-gray-500 text-center py-4")}>
          No shipping rates found.
        </p>
      )}
    </div>
  );
};
