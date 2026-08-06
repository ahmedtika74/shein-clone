import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { Input, Button } from "../../../components/ui";

export const ShippingRateForm = ({
  handleAdd,
  govNameEn,
  setGovNameEn,
  govNameAr,
  setGovNameAr,
  price,
  setPrice,
  deliveryDays,
  setDeliveryDays,
}) => {
  const { t } = useTranslation("admin");
  return (
    <form
      onSubmit={handleAdd}
      className={cn("mb-8 flex flex-col lg:flex-row gap-4 items-start")}
    >
      <div className={cn("flex-1 w-full flex flex-col sm:flex-row gap-4")}>
        <Input
          value={govNameEn}
          onChange={(e) => setGovNameEn(e.target.value)}
          placeholder={`${t("governmentPlaceholder")} (EN)`}
          className={cn("flex-1")}
          required
        />
        <Input
          value={govNameAr}
          onChange={(e) => setGovNameAr(e.target.value)}
          placeholder={`${t("governmentPlaceholder")} (AR)`}
          className={cn("flex-1")}
          required
        />
      </div>
      <div className={cn("flex-1 w-full flex flex-col sm:flex-row gap-4")}>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={t("priceEGP")}
          min="0"
          step="0.01"
          className={cn("flex-1")}
          required
        />
        <Input
          value={deliveryDays}
          onChange={(e) => setDeliveryDays(e.target.value)}
          placeholder={t("deliveryDaysPlaceholder")}
          className={cn("flex-2")}
          required
        />
        <Button type="submit" className={cn("h-[46px] w-full sm:w-auto")}>
          {t("addRate")}
        </Button>
      </div>
    </form>
  );
};
