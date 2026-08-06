import { cn } from "../../utils/cn";
import { usePaymentMethodsLogic } from "./AdminPaymentMethods/usePaymentMethodsLogic";
import { PaymentMethodForm } from "./AdminPaymentMethods/PaymentMethodForm";
import { PaymentMethodsList } from "./AdminPaymentMethods/PaymentMethodsList";
import { useTranslation } from "react-i18next";

export const AdminPaymentMethodsPage = () => {
  const { t } = useTranslation("admin");
  const logic = usePaymentMethodsLogic();

  return (
    <div className={cn("bg-white p-6 rounded-[10px] shadow-[0_2px_10px_#ddd]")}>
      <h2 className={cn("text-2xl font-bold mb-6 text-gray-900 border-b pb-4")}>
        {t("managePaymentMethods")}
      </h2>

      <PaymentMethodForm {...logic} />

      <PaymentMethodsList {...logic} />
    </div>
  );
};
