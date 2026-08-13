import { cn } from "../../utils/cn";
import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdminLoggedIn } from "../../store/authSlice";
import { AdminSidebar } from "./AdminSidebar";
import { SEO } from "../common/SEO";

export const AdminLayout = () => {
  const isAdminLoggedIn = useSelector(selectIsAdminLoggedIn);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div
      className={cn(
        "admin-layout flex min-h-screen bg-[#f8f8f8] relative overflow-hidden",
      )}
    >
      <SEO title="Admin Panel" noindex={true} />
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className={cn("flex-1 flex flex-col min-w-0 h-screen")}>
        <div
          className={cn(
            "md:hidden flex items-center justify-between bg-[#111] text-white p-4 sticky top-0 z-40",
          )}
        >
          <div
            className={cn(
              "font-bold text-lg flex items-center gap-2 uppercase",
            )}
          >
            <i className={cn("fa-solid fa-shop text-[#e60023]")}></i>
            Admin
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={cn("text-white p-2 cursor-pointer")}
            aria-label="Toggle Menu"
          >
            <i className={cn("fa-solid fa-bars text-xl")}></i>
          </button>
        </div>

        <main
          className={cn(
            "content flex-1 p-4 md:p-10 bg-[#f8f8f8] overflow-x-auto overflow-y-auto",
          )}
        >
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity",
          )}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
