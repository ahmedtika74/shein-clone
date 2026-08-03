import { cn } from "../../../utils/cn";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui";
import { Input } from "../../../components/ui";
import { Button } from "../../../components/ui";

export const OfferForm = ({
  editingId,
  title,
  setTitle,
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
  return (
    <Card className={cn("max-w-lg")}>
      <CardHeader>
        <CardTitle>
          {editingId ? `Edit Offer #${editingId}` : "+ Create New Offer"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={cn("space-y-4")}>
          <Input
            label="Offer Title"
            placeholder="e.g. Weekend Flash Deal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className={cn("flex gap-4")}>
            <div className={cn("flex-1")}>
              <Input
                label="Discount Value"
                type="number"
                placeholder="e.g. 25"
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
                Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className={cn(
                  "w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors",
                )}
              >
                <option value="%">% Percentage</option>
                <option value="EGP">EGP Fixed</option>
              </select>
            </div>
          </div>

          <Input
            label="Promo Code (Optional)"
            placeholder="e.g. FLASH25"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Input
            label="Expiration Date (Optional)"
            type="date"
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
          />

          <div className={cn("flex gap-4 pt-2")}>
            <Button type="submit" className={cn("flex-1 h-11")}>
              {editingId ? "Update Offer" : "Save Offer"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                className={cn("flex-1 h-11")}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
