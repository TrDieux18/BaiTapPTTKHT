import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LuFacebook,
  LuInstagram,
  LuLayoutDashboard,
  LuShoppingBag,
  LuTwitter,
  LuUser,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/UserReducer";

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition-all">
                <LuShoppingBag className="text-slate-100" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-slate-100">My Shop</h1>
            </NavLink>

            {/* <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-3 px-5 pr-12 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 text-slate-100 p-2 rounded-lg hover:bg-slate-600 transition-colors">
                  <LuSearch size={20} />
                </button>
              </div>
            </div> */}

            <div className="flex items-center gap-6">
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-slate-300  hover:text-slate-100 transition-colors flex items-center gap-1 bg-slate-500 px-2 py-2 rounded-full"
                >
                  <LuLayoutDashboard size={20} /> Trang quản trị
                </button>
              )}

              <button
                onClick={() => (user ? handleLogout() : navigate("/login"))}
                className="text-slate-300  hover:text-slate-100 transition-colors flex items-center gap-1 bg-slate-500 px-2 py-2 rounded-full"
              >
                <LuUser size={20} /> {user ? "Đăng xuất" : "Đăng nhập"}
              </button>
            </div>
          </div>

          <nav className="hidden md:block mt-4 border-t border-slate-800 pt-4">
            <ul className="flex gap-8 justify-center text-slate-300 font-medium">
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-slate-100 transition-colors ${
                      isActive ? "text-slate-100" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Trang chủ
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-100" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-slate-100 transition-colors ${
                      isActive ? "text-slate-100" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Giỏ hàng
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-100" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-slate-100 transition-colors ${
                      isActive ? "text-slate-100" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Giới thiệu
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-100" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <section className="bg-slate-900 border-y border-slate-800 text-slate-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Đăng ký nhận bản tin</h2>
          <p className="mb-6 text-slate-400">
            Nhận các ưu đãi và cập nhật mới nhất gửi trực tiếp đến hộp thư của
            bạn
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 py-3 px-5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
            />
            <button className="bg-slate-100 text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-white transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-slate-100 font-bold text-lg mb-4">
                Về chúng tôi
              </h3>
              <p className="text-sm leading-relaxed">
                Điểm đến mua sắm trực tuyến đáng tin cậy của bạn với các sản
                phẩm chất lượng và giá cả hợp lý.
              </p>
            </div>

            <div>
              <h3 className="text-slate-100 font-bold text-lg mb-4">
                Liên kết nhanh
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Thông tin vận chuyển
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-100 font-bold text-lg mb-4">
                Dịch vụ khách hàng
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Hoàn trả
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Điều khoản & Điều kiện
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Theo dõi đơn hàng
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-100 font-bold text-lg mb-4">
                Theo dõi chúng tôi
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-slate-900 p-3 text-center rounded-lg hover:bg-slate-800 transition-colors border border-slate-800"
                >
                  <LuFacebook size={20} />
                </a>
                <a
                  href="#"
                  className="bg-slate-900 p-3 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800"
                >
                  <LuTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="bg-slate-900 p-3 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800"
                >
                  <LuInstagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 My Shop. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
