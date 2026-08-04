import { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export const AddressFormModal = ({
  isOpen,
  onClose,
  onSave,
  shippingRates,
  initialAddress,
}) => {
  const [address, setAddress] = useState({
    label: "",
    government: "",
    city: "",
    street: "",
    phone: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialAddress) {
        setAddress(initialAddress);
      } else {
        setAddress({
          label: "",
          government: "",
          city: "",
          street: "",
          phone: "",
        });
      }
    }
  }, [isOpen, initialAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(address);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialAddress ? "Edit Address" : "Add New Address"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className={cn("space-y-4 text-sm mt-4")}>
        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            Label (e.g. Home, Work)
          </label>
          <input
            type="text"
            required
            value={address.label}
            onChange={(e) => setAddress({ ...address, label: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder="Address Label"
          />
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            Government
          </label>
          <select
            required
            value={address.government}
            onChange={(e) =>
              setAddress({ ...address, government: e.target.value })
            }
            className={cn(
              "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white",
            )}
          >
            <option value="">Select Government</option>
            {shippingRates.map((rate) => (
              <option key={rate.id} value={rate.government}>
                {rate.government}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            City
          </label>
          <input
            type="text"
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder="City"
          />
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            Street Address
          </label>
          <input
            type="text"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder="Street Name, Building, etc."
          />
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            Phone Number
          </label>
          <input
            type="text"
            required
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder="Phone Number"
          />
        </div>

        <div className={cn("flex items-center gap-3 pt-4")}>
          <Button type="submit" className={cn("w-full py-3 rounded-lg")}>
            {initialAddress ? "Save Changes" : "Add Address"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={cn("w-full py-3 rounded-lg")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
