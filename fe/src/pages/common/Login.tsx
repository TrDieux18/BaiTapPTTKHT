import { loginUser } from "@/services/UserService";
import type { AppDispatch, RootState } from "@/store/store";
import { setUser } from "@/store/UserReducer";
import type { ApiResponse } from "@/types/Response";
import type { User } from "@/types/User";

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
      }
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-center font-bold text-slate-100">
          Đăng nhập
        </h1>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-200"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 py-2 px-3 text-slate-100 placeholder-slate-400"
              placeholder="Nhập tên đăng nhập của bạn"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 py-2 px-3 text-slate-100 placeholder-slate-400"
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>

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
