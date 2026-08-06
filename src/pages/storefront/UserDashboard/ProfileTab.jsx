import { cn } from "../../../utils/cn";
import { useTranslation } from "react-i18next";
import { AddressFormModal } from "../../../components/common/AddressFormModal";
import { Button } from "../../../components/ui/Button";
import { ScrollToTop } from "../../../components/ScrollToTop";

export const ProfileTab = ({
  user,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  shippingRates,
  saveMessage,
  handleUpdateProfile,
  showAddressModal,
  setShowAddressModal,
  editingAddress,
  onSaveAddress,
  handleEditAddressClick,
  handleAddNewAddressClick,
  handleDeleteAddress,
  handleSetDefault,
}) => {
  const { t } = useTranslation(["storefront", "common"]);
  const addresses = user?.addresses || [];

  return (
    <>
      <ScrollToTop />
      <div
        className={cn(
          "bg-white p-8 rounded-2xl shadow-xs border border-gray-200 max-w-2xl",
        )}
      >
        <h2
          className={cn("text-xl font-bold mb-6 text-gray-900 border-b pb-3")}
        >
          {t("personalInfo")}
        </h2>
        <form
          onSubmit={handleUpdateProfile}
          className={cn("space-y-4 text-sm")}
        >
          <div>
            <label
              className={cn("block text-gray-500 font-medium text-xs mb-1")}
            >
              {t("fullName")}
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={cn(
                "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none text-gray-800 font-medium focus:border-black",
              )}
              required
            />
          </div>

          <div>
            <label
              className={cn("block text-gray-500 font-medium text-xs mb-1")}
            >
              {t("email")}
            </label>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className={cn(
                "w-full bg-white border border-gray-300 rounded-lg p-3 outline-none text-gray-800 font-medium focus:border-black",
              )}
              required
            />
          </div>

          <div className={cn("pt-4 flex items-center gap-4")}>
            <button
              type="submit"
              className={cn(
                "bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors",
              )}
            >
              {t("saveChanges")}
            </button>
            {saveMessage && (
              <span className={cn("text-green-600 font-bold text-sm")}>
                <i className={cn("fa-solid fa-check me-1")}></i> {saveMessage}
              </span>
            )}
          </div>
        </form>

        <h3
          className={cn(
            "text-xl font-bold mb-6 text-gray-900 border-b pb-3 mt-10",
          )}
        >
          {t("shippingAddresses")}
        </h3>

        <div className={cn("space-y-4")}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={cn(
                "border rounded-xl p-4 flex flex-col gap-3",
                addr.isDefault ? "border-black shadow-sm" : "border-gray-200",
              )}
            >
              <div className={cn("flex justify-between items-start")}>
                <div>
                  <div className={cn("flex items-center gap-2 mb-1")}>
                    <span className={cn("font-bold text-gray-900")}>
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span
                        className={cn(
                          "text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold",
                        )}
                      >
                        {t("default")}
                      </span>
                    )}
                  </div>
                  <p className={cn("text-sm text-gray-600")}>
                    {addr.street}, {addr.city}
                  </p>
                  <p className={cn("text-sm text-gray-600")}>
                    {addr.government}
                  </p>
                  <p className={cn("text-sm text-gray-600 mt-1")}>
                    <i className={cn("fa-solid fa-phone text-xs me-1")}></i>{" "}
                    {addr.phone}
                  </p>
                </div>
                <div className={cn("flex flex-col gap-2")}>
                  <button
                    onClick={() => handleEditAddressClick(addr)}
                    className={cn(
                      "text-sm text-blue-600 font-bold hover:underline text-end",
                    )}
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className={cn(
                      "text-sm text-red-600 font-bold hover:underline text-end",
                    )}
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className={cn(
                    "text-sm text-gray-600 hover:text-black font-bold text-start",
                  )}
                >
                  {t("setAsDefault")}
                </button>
              )}
            </div>
          ))}

          {addresses.length < 3 && (
            <Button
              onClick={handleAddNewAddressClick}
              variant="secondary"
              className={cn("w-full py-3 border-dashed border-2")}
            >
              {t("addNewAddress")}
            </Button>
          )}
          {addresses.length >= 3 && (
            <p className={cn("text-sm text-orange-600 font-medium mt-2")}>
              {t("maxAddresses")}
            </p>
          )}
        </div>
      </div>

      <AddressFormModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={onSaveAddress}
        shippingRates={shippingRates}
        initialAddress={editingAddress}
      />
    </>
  );
};
