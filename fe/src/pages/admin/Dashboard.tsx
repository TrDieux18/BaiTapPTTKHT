import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ProductService from "@/services/ProductService";
import * as InvoiceService from "@/services/InvoiceService";
import { formatPrice } from "@/helpers/formatPrice";
import {
  MdInventory,
  MdReceipt,
  MdTrendingUp,
  MdShoppingCart,
  MdAttachMoney,
} from "react-icons/md";
import type { Product } from "@/types/Product";
import type { Invoice } from "@/types/Invoice";

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, invoicesRes] = await Promise.all([
          ProductService.getAllProducts({ limit: "100" }),
          InvoiceService.getAllInvoices(),
        ]);

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data);
        }

        if (invoicesRes.success && invoicesRes.data) {
          setInvoices(invoicesRes.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const productSales = products.map((product) => {
    const soldQuantity = invoices.reduce((total, invoice) => {
      const productInInvoice = invoice.products.find((item) => {
        const id =
          typeof item.productId === "string"
            ? item.productId
            : item.productId._id;
        return id === product._id;
      });
      return total + (productInInvoice?.quantity || 0);
    }, 0);

    return { ...product, soldQuantity };
  });

  const topProducts = productSales
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 5);

  const recentInvoices = [...invoices]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400 text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-400">Tổng quan hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500/10 p-2.5 rounded-lg">
              <MdInventory size={24} className="text-blue-400" />
            </div>
            <span className="text-slate-400 text-xs">Tổng số</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-100">{totalProducts}</p>
            <p className="text-slate-400 text-xs">Sản phẩm</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500/10 p-2.5 rounded-lg">
              <MdReceipt size={24} className="text-green-400" />
            </div>
            <span className="text-slate-400 text-xs">Tổng số</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-100">{totalInvoices}</p>
            <p className="text-slate-400 text-xs">Đơn hàng</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500/10 p-2.5 rounded-lg">
              <MdAttachMoney size={24} className="text-purple-400" />
            </div>
            <span className="text-slate-400 text-xs">Tổng</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-100">
              {formatPrice(totalRevenue)}
            </p>
            <p className="text-slate-400 text-xs">Doanh thu</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-500/10 p-2.5 rounded-lg">
              <MdTrendingUp size={24} className="text-red-400" />
            </div>
            <span className="text-slate-400 text-xs">Cảnh báo</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-100">
              {lowStockProducts}
            </p>
            <p className="text-slate-400 text-xs">Sản phẩm tồn kho thấp</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-100">
              Top 5 Sản phẩm bán chạy
            </h2>
            <MdShoppingCart size={24} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-slate-700 w-10 h-10 rounded-lg flex items-center justify-center text-slate-100 font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-100 font-medium truncate">
                      {product.title}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-slate-100 font-bold">
                    {product.soldQuantity}
                  </p>
                  <p className="text-slate-400 text-xs">đã bán</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-100">
              Đơn hàng gần đây
            </h2>
            <MdReceipt size={24} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => navigate("/admin/invoices")}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-slate-100 font-medium text-sm">
                      #{invoice._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <p className="text-slate-100 font-bold">
                    {formatPrice(invoice.totalAmount)}
                  </p>
                </div>
                <p className="text-slate-400 text-xs">
                  {invoice.products.length} sản phẩm
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/products/new")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MdInventory size={20} />
            Thêm sản phẩm mới
          </button>
          <button
            onClick={() => navigate("/admin/products")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MdShoppingCart size={20} />
            Quản lý sản phẩm
          </button>
          <button
            onClick={() => navigate("/admin/invoices")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MdReceipt size={20} />
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
