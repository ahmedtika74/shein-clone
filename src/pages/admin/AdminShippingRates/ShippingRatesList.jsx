import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "../../../utils/localization";
import { Card, CardContent } from "../../../components/ui";
import { Input, Button } from "../../../components/ui";

export const ShippingRatesList = ({
  shippingRates,
  editingId,
  editGovNameEn,
  setEditGovNameEn,
  editGovNameAr,
  setEditGovNameAr,
  editPrice,
  setEditPrice,
  editDeliveryDays,
  setEditDeliveryDays,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
  isLoading,
}) => {
  const { t, i18n } = useTranslation("admin");
  const { t: tCommon } = useTranslation("common");
  return (
    <div className={cn("space-y-4")}>
      {shippingRates.map((rate) => (
        <Card key={rate.id} className={cn("bg-gray-50 border-gray-200")}>
          <CardContent className={cn("p-4")}>
            {editingId === rate.id ? (
              <div
                className={cn(
                  "w-full flex flex-col lg:flex-row gap-3 items-start lg:items-center",
                )}
              >
                <div className={cn("flex flex-1 w-full gap-2")}>
                  <Input
                    value={editGovNameEn}
                    onChange={(e) => setEditGovNameEn(e.target.value)}
                    className={cn("flex-1")}
                    placeholder="EN"
                    required
                  />
                  <Input
                    value={editGovNameAr}
                    onChange={(e) => setEditGovNameAr(e.target.value)}
                    className={cn("flex-1")}
                    placeholder="AR"
                    required
                  />
                </div>
                <div
                  className={cn(
                    "flex flex-1 w-full flex-col sm:flex-row gap-3 items-start sm:items-center",
                  )}
                >
                  <Input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className={cn("flex-1 w-full sm:w-auto")}
                    min="0"
                    step="0.01"
                    required
                  />
                  <Input
                    value={editDeliveryDays}
                    onChange={(e) => setEditDeliveryDays(e.target.value)}
                    className={cn("flex-1 w-full sm:w-auto")}
                    placeholder={t("deliveryDays")}
                    required
                  />
                  <div
                    className={cn(
                      "flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0",
                    )}
                  >
                    <Button
                      onClick={handleSaveEdit}
                      disabled={isLoading}
                      className={cn("flex-1 sm:flex-none")}
                    >
                      {isLoading
                        ? t("saving")
                        : t("save", { defaultValue: "Save" })}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="secondary"
                      className={cn("flex-1 sm:flex-none")}
                    >
                      {t("cancel", { defaultValue: "Cancel" })}
                    </Button>
                  </div>
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
                    {getLocalizedString(rate, "government", i18n.language)}
                  </span>
                  {rate.deliveryDays && (
                    <span className={cn("text-xs text-gray-500")}>
                      {t("deliveryLabel")} {rate.deliveryDays}
                    </span>
                  )}
                </div>
                <div className={cn("flex items-center gap-4")}>
                  <span className={cn("font-semibold text-[#e60023]")}>
                    {tCommon("egp")} {Number(rate.price || 0).toFixed(2)}
                  </span>
                  <div className={cn("flex gap-2")}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(rate)}
                      className={cn(
                        "text-blue-600 hover:text-blue-800 hover:bg-blue-50",
                      )}
                      title={t("editRateTitle")}
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
                      title={t("deleteRateTitle")}
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
          {t("noShippingRatesFound")}
        </p>
      )}
    </div>
  );
};
