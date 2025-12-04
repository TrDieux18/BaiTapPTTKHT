import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUser } from "@/services/UserService";
import type { User } from "@/types/User";
import type { ApiResponse } from "@/types/Response";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import {
  MdEdit,
  MdDelete,
  MdPerson,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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
    </div>
  );
};

export default UserPage;
