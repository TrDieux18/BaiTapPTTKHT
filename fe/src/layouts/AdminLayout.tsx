import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdLogout,
  MdMenu,
  MdClose,
  MdPerson,
  MdHome,
  MdAdminPanelSettings,
  MdReceipt,
  MdInventory2,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "@/store/UserReducer";
import { clearCart } from "@/store/CartReducer";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="bg-slate-800 p-2 rounded-lg">
                  <MdAdminPanelSettings className="text-slate-100" size={24} />
                </div>
                <span className="text-xl font-bold text-slate-100">Admin</span>
              </div>
            ) : (
              <div className="bg-slate-800 p-2 rounded-lg mx-auto">
                <MdAdminPanelSettings className="text-slate-100" size={24} />
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            <MdDashboard size={20} />
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            <MdInventory2 size={20} />
            {sidebarOpen && <span className="font-medium">Sản phẩm</span>}
          </NavLink>

          <NavLink
            to="/admin/invoices"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            <MdReceipt size={20} />
            {sidebarOpen && <span className="font-medium">Hóa đơn</span>}
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            <MdPerson size={20} />
            {sidebarOpen && <span className="font-medium">Người dùng</span>}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-400 transition-all w-full"
          >
            <MdHome size={20} />
            {sidebarOpen && <span className="font-medium">Về trang chủ</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all w-full"
          >
            <MdLogout size={20} />
            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 h-[72.4px]">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-400 hover:text-slate-100 transition-colors"
              >
                {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
              </button>
              <h1 className="text-xl font-semibold text-slate-100">
                Quản lý sản phẩm
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6">
          <div className="text-center text-slate-400 text-sm">
            &copy; 2025 Admin Dashboard. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
