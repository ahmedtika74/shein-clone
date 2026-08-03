import { cn } from "../../../utils/cn";

export const ProfileTab = ({
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  address,
  setAddress,
  shippingRates,
  saveMessage,
  handleUpdateProfile,
}) => {
  return (
    <div
      className={cn(
        "bg-white p-8 rounded-2xl shadow-xs border border-gray-200 max-w-2xl",
      )}
    >
      <h2 className={cn("text-xl font-bold mb-6 text-gray-900 border-b pb-3")}>
        Personal Information
      </h2>
      <form onSubmit={handleUpdateProfile} className={cn("space-y-4 text-sm")}>
        <div>
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            Full Name
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
          <label className={cn("block text-gray-500 font-medium text-xs mb-1")}>
            Email Address
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

        <div>
          <h3 className={cn("text-gray-900 font-bold mb-3 mt-6")}>
            Default Shipping Address
          </h3>
          <div className={cn("space-y-3")}>
            <select
              value={address.government}
              onChange={(e) =>
                setAddress({ ...address, government: e.target.value })
              }
              className={cn(
                "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black",
              )}
            >
              <option value="">Select Government</option>
              {shippingRates.map((rate) => (
                <option key={rate.id} value={rate.government}>
                  {rate.government}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className={cn(
                "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black",
              )}
            />
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className={cn(
                "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black",
              )}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              className={cn(
                "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black",
              )}
            />
          </div>
        </div>

        <div className={cn("pt-4 flex items-center gap-4")}>
          <button
            type="submit"
            className={cn(
              "bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors",
            )}
          >
            Save Changes
          </button>
          {saveMessage && (
            <span className={cn("text-green-600 font-bold text-sm")}>
              <i className={cn("fa-solid fa-check mr-1")}></i> {saveMessage}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
