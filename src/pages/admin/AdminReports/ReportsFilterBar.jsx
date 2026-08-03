import { cn } from "../../../utils/cn";

export const ReportsFilterBar = ({
  filterYear,
  setFilterYear,
  filterMonth,
  setFilterMonth,
  filterProductId,
  setFilterProductId,
  isProductDropdownOpen,
  setIsProductDropdownOpen,
  productSearch,
  setProductSearch,
  dropdownRef,
  filteredProductsForSearch,
  selectedProduct,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-4 mb-8 bg-white p-5 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-gray-100",
      )}
    >
      <div className={cn("flex-1")}>
        <label
          className={cn(
            "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2",
          )}
        >
          Filter by Year
        </label>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className={cn(
            "w-full p-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 outline-none focus:border-black bg-gray-50 hover:bg-gray-100 transition-colors",
          )}
        >
          <option value="all">All Years</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </div>
      <div className={cn("flex-1")}>
        <label
          className={cn(
            "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2",
          )}
        >
          Filter by Month
        </label>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className={cn(
            "w-full p-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 outline-none focus:border-black bg-gray-50 hover:bg-gray-100 transition-colors",
          )}
        >
          <option value="all">All Months</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
      </div>
      <div className={cn("flex-[2]")} ref={dropdownRef}>
        <label
          className={cn(
            "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2",
          )}
        >
          Filter by Product
        </label>
        <div className={cn("relative")}>
          <div
            onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
            className={cn(
              "w-full p-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 outline-none bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex justify-between items-center",
              isProductDropdownOpen && "border-black",
            )}
          >
            <span className={cn("truncate mr-2")}>
              {filterProductId === "all"
                ? "All Products"
                : selectedProduct?.name || "Unknown Product"}
            </span>
            <i
              className={cn("fa-solid fa-chevron-down text-gray-400 text-xs")}
            ></i>
          </div>

          {isProductDropdownOpen && (
            <div
              className={cn(
                "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden",
              )}
            >
              <div
                className={cn(
                  "p-2 border-b border-gray-100 sticky top-0 bg-white",
                )}
              >
                <div className={cn("relative")}>
                  <i
                    className={cn(
                      "fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs",
                    )}
                  ></i>
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-black transition-colors",
                    )}
                  />
                </div>
              </div>
              <div className={cn("max-h-60 overflow-y-auto")}>
                <div
                  onClick={() => {
                    setFilterProductId("all");
                    setIsProductDropdownOpen(false);
                    setProductSearch("");
                  }}
                  className={cn(
                    "px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors",
                    filterProductId === "all"
                      ? "bg-gray-100 font-bold text-black"
                      : "text-gray-700 font-medium",
                  )}
                >
                  All Products
                </div>
                {filteredProductsForSearch.length === 0 ? (
                  <div
                    className={cn(
                      "px-4 py-3 text-sm text-gray-500 text-center",
                    )}
                  >
                    No products found.
                  </div>
                ) : (
                  filteredProductsForSearch.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setFilterProductId(p.id.toString());
                        setIsProductDropdownOpen(false);
                        setProductSearch("");
                      }}
                      className={cn(
                        "px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors truncate",
                        filterProductId === p.id.toString()
                          ? "bg-gray-100 font-bold text-black"
                          : "text-gray-700 font-medium",
                      )}
                    >
                      {p.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
