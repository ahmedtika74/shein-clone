import { cn } from "../../../utils/cn";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui";
import { Input } from "../../../components/ui";
import { Button } from "../../../components/ui";
import { useTranslation } from "react-i18next";

export const OfferForm = ({
  editingId,
  titleEn,
  setTitleEn,
  titleAr,
  setTitleAr,
  discountValue,
  setDiscountValue,
  discountType,
  setDiscountType,
  code,
  setCode,
  expDate,
  setExpDate,
  handleSubmit,
  resetForm,
}) => {
  const { t } = useTranslation("admin");
  return (
    <Card className={cn("max-w-lg")}>
      <CardHeader>
        <CardTitle>
          {editingId ? t("editOffer", { id: editingId }) : t("createNewOffer")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={cn("space-y-4")}>
          <Input
            label={`${t("offerTitle")} (English)`}
            placeholder={`${t("egWeekendFlashDeal")} (EN)`}
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            required
          />
          <Input
            label={`${t("offerTitle")} (Arabic)`}
            placeholder={`${t("egWeekendFlashDeal")} (AR)`}
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            required
          />

          <div className={cn("flex gap-4")}>
            <div className={cn("flex-1")}>
              <Input
                label={t("discountValue")}
                type="number"
                placeholder={t("egFlash25")}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className={cn("w-1/3 flex flex-col gap-1")}>
              <label
                className={cn(
                  "block text-xs font-bold text-gray-700 uppercase",
                )}
              >
                {t("type")}
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className={cn(
                  "w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors",
                )}
              >
                <option value="%">{t("percentage")}</option>
                <option value="EGP">{t("egpFixed")}</option>
              </select>
            </div>
          </div>

          <Input
            label={t("promoCodeOptional")}
            placeholder={t("egFlash25")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Input
            label={t("expirationDateOptional")}
            type="date"
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
          />

          <div className={cn("flex gap-4 pt-2")}>
            <Button type="submit" className={cn("flex-1 h-11")}>
              {editingId ? t("updateOffer") : t("saveOffer")}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                className={cn("flex-1 h-11")}
              >
                {t("cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
