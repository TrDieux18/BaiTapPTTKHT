import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser, updateUser } from "@/services/UserService";
import * as InvoiceService from "@/services/InvoiceService";
import type { User } from "@/types/User";
import type { Invoice } from "@/types/Invoice";
import type { ApiResponse } from "@/types/Response";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";
import { formatPrice } from "@/helpers/formatPrice";
import { getStatusBadge } from "@/helpers/getStatusBadge";
import {
  MdEdit,
  MdDelete,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdReceipt,
  MdAdd,
} from "react-icons/md";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user" as "user" | "admin",
  });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedUserInvoices, setSelectedUserInvoices] = useState<Invoice[]>(
    []
  );
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        };

        if (debouncedSearchTerm) params.search = debouncedSearchTerm;

        const response: ApiResponse<User[]> = await getAllUsers(params);
        if (response.success && response.data) {
          setUsers(response.data);
          if (response.totalPages) {
            setTotalPages(response.totalPages);
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedSearchTerm]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await updateUser(editingUser._id, {
        username: editingUser.username,
        role: editingUser.role,
        isActive: editingUser.isActive,
      });

      if (response.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? response.data : u))
        );
        setEditingUser(null);
        alert("Cập nhật người dùng thành công!");
      }
    } catch (error) {
      alert("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!id) return;
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng "${username}"?`
    );
    if (confirmDelete) {
      try {
        const response = await deleteUser(id);
        if (!response.success) {
          alert("Xóa người dùng thất bại, vui lòng thử lại!");
          return;
        }
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        alert("Xóa người dùng thành công!");
      } catch (error) {
        alert("Xóa người dùng thất bại, vui lòng thử lại!");
      }
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Tạo người dùng thành công!");
        setShowCreateModal(false);
        setNewUser({ username: "", password: "", role: "user" });
        setCurrentPage(1);
        const params: Record<string, string> = {
          page: "1",
          limit: itemsPerPage.toString(),
        };
        const usersResponse = await getAllUsers(params);
        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data);
          if (usersResponse.totalPages) {
            setTotalPages(usersResponse.totalPages);
          }
        }
      } else {
        alert(data.message || "Tạo người dùng thất bại!");
      }
    } catch (error) {
      alert("Tạo người dùng thất bại, vui lòng thử lại!");
    }
  };

  const handleViewInvoices = async (userId: string) => {
    try {
      setLoadingInvoices(true);
      setShowInvoiceModal(true);
      const response = await InvoiceService.getInvoicesByUser(userId);
      if (response.success && response.data) {
        setSelectedUserInvoices(response.data);
      }
    } catch (error) {
      alert("Không thể tải hóa đơn!");
      setShowInvoiceModal(false);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedUserInvoices([]);
    setSelectedInvoice(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Quản lý người dùng
          </h2>
          <p className="text-slate-400 mt-1">
            Tổng số: {users.length} người dùng
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <MdAdd size={20} />
          Tạo người dùng
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm theo tên đăng nhập..."
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tên đăng nhập
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Hóa đơn
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {editingUser?._id === user._id ? (
                      <input
                        type="text"
                        value={editingUser.username}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            username: e.target.value,
                          })
                        }
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-slate-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-slate-400" size={20} />
                        <span className="font-semibold text-slate-100">
                          {user.username}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingUser?._id === user._id ? (
                      <select
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value as "admin" | "user",
                          })
                        }
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-slate-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-900/20 text-purple-400 border border-purple-800"
                            : "bg-blue-900/20 text-blue-400 border border-blue-800"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingUser?._id === user._id ? (
                      <select
                        value={editingUser.isActive ? "active" : "inactive"}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            isActive: e.target.value === "active",
                          })
                        }
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-slate-500"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Vô hiệu</option>
                      </select>
                    ) : (
                      <span className="flex items-center gap-2">
                        {user.isActive ? (
                          <>
                            <MdCheckCircle
                              className="text-green-400"
                              size={18}
                            />
                            <span className="text-green-400 text-sm">
                              Hoạt động
                            </span>
                          </>
                        ) : (
                          <>
                            <MdCancel className="text-red-400" size={18} />
                            <span className="text-red-400 text-sm">
                              Vô hiệu
                            </span>
                          </>
                        )}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-sm">
                      {formatDate(user.createdAt)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleViewInvoices(user._id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Xem hóa đơn"
                      >
                        <MdReceipt size={18} />
                        Xem
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingUser?._id === user._id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(user._id, user.username)
                            }
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <MdDelete size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg">
                Không tìm thấy người dùng nào
              </div>
            </div>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              Tạo người dùng mới
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-slate-500"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-slate-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Vai trò
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as "user" | "admin",
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-slate-500"
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateUser}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Tạo
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewUser({ username: "", password: "", role: "user" });
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseInvoiceModal}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-100">
                Danh sách hóa đơn ({selectedUserInvoices.length})
              </h3>
              <button
                onClick={handleCloseInvoiceModal}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {loadingInvoices ? (
                <div className="text-center py-12 text-slate-400">
                  Đang tải hóa đơn...
                </div>
              ) : selectedUserInvoices.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  Người dùng chưa có hóa đơn nào
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800 border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                          Mã đơn hàng
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                          Ngày đặt
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">
                          Tổng tiền
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">
                          Chi tiết
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedUserInvoices.map((invoice) => (
                        <tr
                          key={invoice._id}
                          className="hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-slate-100 font-medium">
                              #{invoice._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-400 text-sm">
                              {new Date(
                                invoice.createdAt || ""
                              ).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">
                              {invoice.products.length} sản phẩm
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-slate-100 font-semibold">
                              {formatPrice(invoice.totalAmount)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center">
                              {getStatusBadge(invoice.status)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center">
                              <button
                                onClick={() => setSelectedInvoice(invoice)}
                                className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                              >
                                Xem
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        showUserInfo={false}
      />
    </div>
  );
};

export default UserPage;
