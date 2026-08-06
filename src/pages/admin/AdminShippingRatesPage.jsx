import { cn } from "../../utils/cn";
import { useShippingRatesLogic } from "./AdminShippingRates/useShippingRatesLogic";
import { FreeShippingToggle } from "./AdminShippingRates/FreeShippingToggle";
import { ShippingRateForm } from "./AdminShippingRates/ShippingRateForm";
import { ShippingRatesList } from "./AdminShippingRates/ShippingRatesList";
import { useTranslation } from "react-i18next";

export const AdminShippingRatesPage = () => {
  const { t } = useTranslation("admin");
  const logic = useShippingRatesLogic();

  return (
    <div className={cn("bg-white p-6 rounded-[10px] shadow-[0_2px_10px_#ddd]")}>
      <h2 className={cn("text-2xl font-bold mb-6 text-gray-900 border-b pb-4")}>
        {t("manageShippingRates")}
      </h2>

      <FreeShippingToggle {...logic} />

      <ShippingRateForm {...logic} />

      <ShippingRatesList {...logic} />
    </div>
  );
};
