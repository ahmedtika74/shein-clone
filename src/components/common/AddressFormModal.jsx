import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { getLocalizedString } from "../../utils/localization";
import { shippingRateValue } from "../../utils/shipping";

export const AddressFormModal = ({
  isOpen,
  onClose,
  onSave,
  shippingRates,
  initialAddress,
}) => {
  const { t, i18n } = useTranslation(["storefront", "common"]);
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
      title={initialAddress ? t("editAddress") : t("addNewAddress")}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className={cn("space-y-4 text-sm mt-4")}>
        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            {t("addressLabel")}
          </label>
          <input
            type="text"
            required
            value={address.label}
            onChange={(e) => setAddress({ ...address, label: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder={t("addressLabelPlaceholder")}
          />
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            {t("government")}
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
            <option value="">{t("selectGovernment")}</option>
            {shippingRates.map((rate) => (
              <option key={rate.id} value={shippingRateValue(rate)}>
                {getLocalizedString(rate, "government", i18n.language)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            {t("city")}
          </label>
          <input
            type="text"
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder={t("city")}
          />
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            {t("streetAddress")}
          </label>
          <input
            type="text"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder={t("streetAddressPlaceholder")}
          />
        </div>

        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            {t("phone")}
          </label>
          <input
            type="text"
            required
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className={cn(
              "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-black",
            )}
            placeholder={t("phone")}
          />
        </div>

        <div className={cn("flex items-center gap-3 pt-4")}>
          <Button type="submit" className={cn("w-full py-3 rounded-lg")}>
            {initialAddress ? t("saveChanges") : t("addAddress")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={cn("w-full py-3 rounded-lg")}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
