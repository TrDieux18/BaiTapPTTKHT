import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HomePage from "@/pages/client/Home";
import Auth from "@/pages/common/Auth";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Product from "./pages/admin/Product";
import EditProduct from "./pages/admin/EditProduct";
import CreateProduct from "./pages/admin/CreateProduct";
import UserManagement from "./pages/admin/User";

import CartPage from "@/pages/client/Cart";
import ProductDetail from "./pages/client/ProductDetail";
import InvoiceList from "./pages/client/InvoiceList";
import ProfilePage from "./pages/client/Profile";
import AboutPage from "./pages/client/About";
import Dashboard from "./pages/admin/Dashboard";
import AdminInvoice from "./pages/admin/Invoice";

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/login" element={<Navigate to="/auth" />} />
      <Route path="/register" element={<Navigate to="/auth" />} />

      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {user?.role === "admin" && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="invoices" element={<AdminInvoice />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
