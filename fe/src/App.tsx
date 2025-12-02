import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HomePage from "@/pages/client/Home";
import Login from "@/pages/common/Login";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Product from "./pages/admin/Product";
import EditProduct from "./pages/admin/EditProduct";
import CreateProduct from "./pages/admin/CreateProduct";

import CartPage from "@/pages/client/Cart";
import ProductDetail from "./pages/client/ProductDetail";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Route>

      {user?.role === "admin" && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/new" element={<CreateProduct />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
