import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../../components/ui";
import { Input, Button } from "../../../components/ui";

export const FreeShippingToggle = ({
  freeShipping,
  fsThreshold,
  setFsThreshold,
  isSaved,
  handleToggleFreeShipping,
  handleSaveFsThreshold,
  isLoading,
}) => {
  const { t } = useTranslation("admin");
  return (
    <Card className={cn("bg-gray-50 border-gray-200 mb-8")}>
      <CardContent>
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          )}
        >
          <div>
            <h3 className={cn("text-lg font-bold text-gray-900")}>
              {t("freeShippingOffer")}
            </h3>
            <p className={cn("text-sm text-gray-500")}>
              {t("freeShippingDesc")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleFreeShipping}
            disabled={isLoading}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50",
              freeShipping.enabled ? "bg-black" : "bg-gray-300",
            )}
            title={
              freeShipping.enabled
                ? t("disableFreeShipping")
                : t("enableFreeShipping")
            }
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                freeShipping.enabled
                  ? "translate-x-6 rtl:-translate-x-6"
                  : "translate-x-1 rtl:-translate-x-1",
              )}
            />
          </button>
        </div>

        {freeShipping.enabled && (
          <div
            className={cn(
              "flex items-end gap-4 mt-4 pt-4 border-t border-gray-200",
            )}
          >
            <div className={cn("flex-1")}>
              <Input
                label={t("minOrderAmountEGP")}
                type="number"
                value={fsThreshold}
                onChange={(e) => setFsThreshold(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className={cn("flex items-center gap-3 h-[46px]")}>
              {isSaved && (
                <span
                  className={cn(
                    "text-green-600 font-bold text-sm transition-opacity",
                  )}
                >
                  {t("saved")}
                </span>
              )}
              <Button
                onClick={handleSaveFsThreshold}
                disabled={isLoading}
                className={cn("h-full")}
              >
                {isLoading ? t("saving") : t("saveThreshold")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
