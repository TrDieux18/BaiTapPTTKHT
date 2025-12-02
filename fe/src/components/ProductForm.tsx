import { formatPrice } from "@/helpers/formatPrice";
import { generateSlug } from "@/helpers/generateSlug";
import type { ProductForm as ProductFormType } from "@/types/Product";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { MdArrowBack, MdSave, MdImage } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface ProductFormProps {
  mode: "create" | "edit";
  formData: ProductFormType;
  loading: boolean;
  onFormDataChange: (formData: ProductFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProductForm = ({
  mode,
  formData,
  loading,
  onFormDataChange,
  onSubmit,
}: ProductFormProps) => {
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      onFormDataChange({
        ...formData,
        [name]: checked,
      });
    } else {
      onFormDataChange({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    onFormDataChange({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {mode === "create" ? "Tạo sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </h2>
          <p className="text-slate-400 mt-1">
            {mode === "create"
              ? "Điền thông tin sản phẩm"
              : "Cập nhật thông tin sản phẩm"}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-3">
                Thông tin cơ bản
              </h3>

              <Input
                type="text"
                name="title"
                label="Tên sản phẩm"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="VD: Áo thun đen basic"
                required
              />

              <Input
                type="text"
                name="slug"
                label="Đường dẫn (Slug)"
                value={formData.slug}
                onChange={handleChange}
                placeholder="ao-thun-den-basic"
                helperText="Tự động tạo từ tên sản phẩm"
              />

              <TextArea
                name="description"
                label="Mô tả"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-3">
                Giá & Khuyến mãi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  name="price"
                  label="Giá bán (VNĐ)"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1800000"
                  min="0"
                  required
                />

                <Input
                  type="number"
                  name="discountPercentage"
                  label="Giảm giá (%)"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  placeholder="12"
                  min="0"
                  max="100"
                />
              </div>

              {formData.price && Number(formData.price) > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Giá sau giảm:</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-100">
                        {formatPrice(
                          Number(formData.price) -
                            (Number(formData.price) *
                              Number(formData.discountPercentage)) /
                              100
                        )}
                      </div>
                      {Number(formData.discountPercentage) > 0 && (
                        <div className="text-sm text-slate-500 line-through">
                          {formatPrice(Number(formData.price))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-3">
                Tồn kho & Đánh giá
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  name="stock"
                  label="Số lượng tồn kho"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="40"
                  min="0"
                  required
                />

                <Input
                  type="number"
                  name="rating"
                  label="Đánh giá (1-5 sao)"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="4.8"
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-3">
                Trạng thái
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-slate-100 focus:ring-2 focus:ring-slate-600"
                />
                <div>
                  <div className="text-slate-100 font-medium">
                    Hiển thị sản phẩm
                  </div>
                  <div className="text-sm text-slate-400">
                    Sản phẩm sẽ xuất hiện trên trang chủ
                  </div>
                </div>
              </label>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-3">
                Hình ảnh
              </h3>

              <Input
                type="url"
                name="thumbnail"
                label="URL hình ảnh"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

              {formData.thumbnail ? (
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-800">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <MdImage className="mx-auto text-slate-600" size={48} />
                    <p className="mt-2 text-sm text-slate-500">
                      Chưa có hình ảnh
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave size={20} />
                {loading
                  ? mode === "create"
                    ? "Đang lưu..."
                    : "Đang cập nhật..."
                  : mode === "create"
                  ? "Tạo sản phẩm"
                  : "Cập nhật sản phẩm"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="w-full px-6 py-3 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
