import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getProfile, updateProfile } from "@/services/UserService";
import type { User } from "@/types/User";
import { MdPerson, MdEdit, MdSave, MdCancel } from "react-icons/md";
import Input from "@/components/Input";

const ProfilePage = () => {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?._id) return;

      try {
        setLoading(true);
        const response = await getProfile(currentUser._id);
        if (response.success && response.data) {
          setProfile(response.data);
          setFormData((prev) => ({
            ...prev,
            username: response.data.username,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: profile?.username || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSave = async () => {
    if (!currentUser?._id) return;

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const updateData: any = {
        username: formData.username,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await updateProfile(currentUser._id, updateData);

      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        setFormData({
          username: response.data.username,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại!"
      );
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">
          Không tìm thấy thông tin người dùng
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <MdPerson className="text-slate-400" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">
                Thông tin cá nhân
              </h2>
              <p className="text-slate-400 mt-1">
                Quản lý thông tin tài khoản của bạn
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <MdEdit size={18} />
              Chỉnh sửa
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Tên đăng nhập
              </label>
              {isEditing ? (
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Tên đăng nhập"
                />
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100">
                  {profile.username}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Vai trò
              </label>
              <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.role === "admin"
                      ? "bg-purple-900/20 text-purple-400 border border-purple-800"
                      : "bg-blue-900/20 text-blue-400 border border-blue-800"
                  }`}
                >
                  {profile.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <>
              <div className="border-t border-slate-800 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Đổi mật khẩu (không bắt buộc)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-slate-800 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Ngày tạo tài khoản
                </label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100">
                  {formatDate(profile.createdAt)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Cập nhật lần cuối
                </label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100">
                  {formatDate(profile.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <MdSave size={20} />
                Lưu thay đổi
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <MdCancel size={20} />
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
