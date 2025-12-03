import { loginUser, registerUser } from "@/services/UserService";
import * as CartService from "@/services/CartService";
import type { AppDispatch, RootState } from "@/store/store";
import { setUser } from "@/store/UserReducer";
import { setCart } from "@/store/CartReducer";
import type { ApiResponse } from "@/types/Response";
import type { User } from "@/types/User";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user") navigate("/home");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }
      if (password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        const response: ApiResponse<User> = await loginUser(username, password);
        if (response.success && response.data) {
          dispatch(setUser(response.data));

          const cartResponse = await CartService.getCart();
          if (cartResponse.success && cartResponse.data) {
            dispatch(setCart(cartResponse.data));
          }
        }
      } else {
        const response: ApiResponse<User> = await registerUser(
          username,
          password
        );
        if (response.success && response.data) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          setIsLogin(true);
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          (isLogin ? "Đăng nhập thất bại!" : "Đăng ký thất bại!")
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-center font-bold text-slate-100">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h1>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="username"
            name="username"
            label="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập của bạn"
            required
          />

          <Input
            type="password"
            id="password"
            name="password"
            label="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu của bạn"
            required
          />

          {!isLogin && (
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu của bạn"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <button
              onClick={toggleMode}
              className="ml-2 text-slate-100 font-semibold hover:underline"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
