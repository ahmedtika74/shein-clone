import { cn } from "../../../utils/cn";
import { Input, Button } from "../../../components/ui";

export const ShippingRateForm = ({
  handleAdd,
  govName,
  setGovName,
  price,
  setPrice,
  deliveryDays,
  setDeliveryDays,
}) => {
  return (
    <form
      onSubmit={handleAdd}
      className={cn("mb-8 flex flex-col md:flex-row gap-4 items-start")}
    >
      <Input
        value={govName}
        onChange={(e) => setGovName(e.target.value)}
        placeholder="Government (e.g. Cairo)"
        className={cn("flex-1")}
        required
      />
      <Input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (EGP)"
        min="0"
        step="0.01"
        className={cn("w-full md:w-32")}
        required
      />
      <Input
        value={deliveryDays}
        onChange={(e) => setDeliveryDays(e.target.value)}
        placeholder="Delivery Days (e.g. 2-3 Days)"
        className={cn("w-full md:w-48")}
        required
      />
      <Button type="submit" className={cn("h-[46px]")}>
        Add Rate
      </Button>
    </form>
  );
};
