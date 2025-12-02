import { loginUser } from "@/services/UserService";
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user") navigate("/home");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response: ApiResponse<User> = await loginUser(username, password);
      if (response.success && response.data) {
        dispatch(setUser(response.data));

        const cartResponse = await CartService.getCart();
        if (cartResponse.success && cartResponse.data) {
          dispatch(setCart(cartResponse.data));
        }
      }
    } catch (error: any) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-center font-bold text-slate-100">
          Đăng nhập
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
          />

          <Input
            type="password"
            id="password"
            name="password"
            label="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu của bạn"
          />

          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-3 rounded-lg font-semibold transition-colors"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
