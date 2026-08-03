import { cn } from "../../utils/cn";
import { useOffersLogic } from "./AdminOffers/useOffersLogic";
import { OffersList } from "./AdminOffers/OffersList";
import { OfferForm } from "./AdminOffers/OfferForm";

export const AdminOffersPage = () => {
  const logic = useOffersLogic();

  return (
    <div>
      <h1 className={cn("text-3xl font-bold text-gray-900 mb-8")}>
        Manage Promotional Offers
      </h1>

      <OffersList {...logic} />

      <OfferForm {...logic} />
    </div>
  );
};
