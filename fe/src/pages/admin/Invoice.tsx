import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
import Pagination from "@/components/Pagination";

const AdminInvoice = () => {
  const [searchParams] = useSearchParams();
  const userIdFilter = searchParams.get("userId");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    if (!searchTerm.trim() && !userIdFilter) {
      setFilteredInvoices(invoices);
      return;
    }

    let filtered = invoices;

    if (userIdFilter) {
      filtered = filtered.filter((invoice) => {
        const userId =
          typeof invoice.userId === "string"
            ? invoice.userId
            : invoice.userId._id;
        return userId === userIdFilter;
      });
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((invoice) => {
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
    }

    setFilteredInvoices(filtered);
  }, [searchTerm, invoices, userIdFilter]);

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

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

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
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginatedInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MdReceipt size={18} className="text-slate-400" />
                        <span className="text-slate-100 font-medium">
                          #{invoice._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MdPerson size={18} className="text-slate-400" />
                        <span className="text-slate-300">
                          {typeof invoice.userId === "string"
                            ? `User ID: ${invoice.userId.slice(-8)}`
                            : (invoice.userId as any).username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-sm">
                        {new Date(invoice.createdAt || "").toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">
                        {invoice.products.length} sản phẩm
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-100 font-semibold">
                        {formatPrice(invoice.totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {getStatusBadge(invoice.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <select
                          value={invoice.status}
                          onChange={(e) =>
                            handleStatusChange(
                              invoice._id,
                              e.target.value as "pending" | "paid" | "cancelled"
                            )
                          }
                          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 text-sm focus:outline-none focus:border-slate-500"
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="paid">Đã thanh toán</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                        <button
                          onClick={() => openModal(invoice)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <MdVisibility size={18} />
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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
