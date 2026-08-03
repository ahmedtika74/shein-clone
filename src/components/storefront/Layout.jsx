import { cn } from "../../utils/cn";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileDrawer } from "./MobileDrawer";
import { BottomNav } from "./BottomNav";

export const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <div
      className={cn("min-h-screen flex flex-col bg-white pb-[60px] md:pb-0")}
    >
      <MobileDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className={cn("md:hidden fixed inset-0 z-[60] bg-white")}>
          <div className={cn("flex items-center p-4 border-b border-gray-100")}>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className={cn("mr-4 text-gray-500 hover:text-black")}
            >
              <i className={cn("fa-solid fa-arrow-left text-xl")}></i>
            </button>
            <form
              onSubmit={handleMobileSearch}
              className={cn("flex-1 relative")}
            >
              <i
                className={cn(
                  "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                )}
              ></i>
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full bg-gray-100 h-10 rounded-full pl-10 pr-4 outline-none text-sm",
                )}
              />
            </form>
          </div>
        </div>
      )}

      {/* Sticky Header Navigation Bar */}
      <div
        className={cn(
          "sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm",
        )}
      >
        <Topbar />
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <Navbar />
      </div>

      {/* Main Page Outlet */}
      <main className={cn("flex-grow flex flex-col")}>
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </main>

      {/* Footer */}
      <Footer />

      <BottomNav
        isMobileSearchOpen={isMobileSearchOpen}
        setIsMobileSearchOpen={setIsMobileSearchOpen}
      />
    </div>
  );
};
