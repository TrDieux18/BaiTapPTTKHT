import { useEffect, useState } from "react";

import type { Invoice } from "@/types/Invoice";
import * as InvoiceService from "@/services/InvoiceService";
import { formatPrice } from "@/helpers/formatPrice";
import { getStatusBadge } from "@/helpers/getStatusBadge";
import {
  MdReceipt,
  MdShoppingBag,
  MdPerson,
  MdVisibility,
} from "react-icons/md";
import SearchInput from "@/components/SearchInput";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";

const AdminInvoice = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedInvoice(null), 300);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await InvoiceService.getAllInvoices();
        if (response.success && response.data) {
          setInvoices(response.data);
          setFilteredInvoices(response.data);
        }
      } catch (error) {
        alert("Không thể tải danh sách hóa đơn!");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = invoices.filter((invoice) => {
      const invoiceId = invoice._id.slice(-8).toUpperCase();
      const username =
        typeof invoice.userId === "string"
          ? ""
          : (invoice.userId as any).username || "";

      return (
        invoiceId.includes(searchLower.toUpperCase()) ||
        username.toLowerCase().includes(searchLower)
      );
    });

    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleStatusChange = async (
    invoiceId: string,
    newStatus: "pending" | "paid" | "cancelled"
  ) => {
    try {
      const response = await InvoiceService.updateInvoiceStatus(
        invoiceId,
        newStatus
      );
      if (response.success) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv._id === invoiceId ? { ...inv, status: newStatus } : inv
          )
        );
        alert("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400 text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-800 p-3 rounded-lg">
          <MdReceipt size={32} className="text-slate-100" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Quản lý hóa đơn</h1>
          <p className="text-slate-400">
            Tổng số {filteredInvoices.length} hóa đơn
            {searchTerm && ` (lọc từ ${invoices.length})`}
          </p>
        </div>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Tìm theo mã đơn hàng hoặc tên người dùng..."
      />

      {filteredInvoices.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdShoppingBag size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">
            {searchTerm ? "Không tìm thấy hóa đơn" : "Chưa có hóa đơn nào"}
          </h3>
          <p className="text-slate-400">
            {searchTerm
              ? "Không có hóa đơn nào khớp với từ khóa tìm kiếm"
              : "Chưa có đơn hàng nào trong hệ thống"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
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
                  <div className="flex items-center gap-2 mb-2">
                    <MdPerson size={20} className="text-slate-400" />
                    <span className="text-slate-400 text-sm">
                      {typeof invoice.userId === "string"
                        ? `User ID: ${invoice.userId}`
                        : `Khách hàng: ${(invoice.userId as any).username}`}
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
                  <div className="mt-2">{getStatusBadge(invoice.status)}</div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-slate-100 font-semibold">
                    Sản phẩm ({invoice.products.length})
                  </h4>
                  <button
                    onClick={() => openModal(invoice)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    <MdVisibility size={18} />
                    Xem chi tiết
                  </button>
                </div>
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

              <div className="border-t border-slate-800 pt-4 mt-4">
                <label className="block text-slate-400 text-sm mb-2">
                  Cập nhật trạng thái:
                </label>
                <select
                  value={invoice.status}
                  onChange={(e) =>
                    handleStatusChange(
                      invoice._id,
                      e.target.value as "pending" | "paid" | "cancelled"
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-slate-500"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={showModal}
        onClose={closeModal}
        showUserInfo={true}
      />
    </div>
  );
};

export default AdminInvoice;
