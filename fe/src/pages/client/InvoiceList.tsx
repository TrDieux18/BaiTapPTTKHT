import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import type { Invoice } from "@/types/Invoice";
import * as InvoiceService from "@/services/InvoiceService";
import { formatPrice } from "@/helpers/formatPrice";
import { MdArrowBack, MdReceipt, MdShoppingBag } from "react-icons/md";

const InvoiceList = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await InvoiceService.getInvoicesByUser(user._id);
        if (response.success && response.data) {
          setInvoices(response.data);
        }
      } catch (error) {
        alert("Không thể tải danh sách hóa đơn!");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400 text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
      >
        <MdArrowBack size={24} />
        <span>Quay lại</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-800 p-3 rounded-lg">
          <MdReceipt size={32} className="text-slate-100" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Đơn hàng của tôi
          </h1>
          <p className="text-slate-400">{invoices.length} đơn hàng</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdShoppingBag size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-slate-400 mb-6">
            Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MdReceipt size={20} className="text-slate-400" />
                    <span className="text-slate-400 text-sm">
                      Mã đơn hàng: #{invoice._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {new Date(invoice.createdAt || "").toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm mb-1">Tổng tiền</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {formatPrice(invoice.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-slate-100 font-semibold mb-3">
                  Sản phẩm ({invoice.products.length})
                </h4>
                <div className="space-y-2">
                  {invoice.products.map((item, index) => {
                    const isPopulated = typeof item.productId !== "string";

                    const productTitle = isPopulated
                      ? (item.productId as any).title
                      : `SP #${(item.productId as string)
                          .slice(-8)
                          .toUpperCase()}`;

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-slate-800 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <p className="text-slate-300 text-sm font-medium">
                            {productTitle}
                          </p>
                          <p className="text-slate-400 text-xs">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-100 font-semibold">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-slate-400 text-xs">
                            Thành tiền:{" "}
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
