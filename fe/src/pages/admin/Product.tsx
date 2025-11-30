import { deleteProduct, getAllProducts } from "@/services/ProductService";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Product[]> = await getAllProducts();
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting product with id:", id);
    if (!id) return;
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (confirmDelete) {
      try {
        const response = await deleteProduct(id);
        if (!response.success) {
          alert("Xóa sản phẩm thất bại, vui lòng thử lại!");
          return;
        }
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        alert("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Xóa sản phẩm thất bại, vui lòng thử lại!");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase()
  );

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
            Quản lý sản phẩm
          </h2>
          <p className="text-slate-400 mt-1">
            Tổng số: {filteredProducts.length} sản phẩm
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-2 bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
        >
          <MdAdd size={20} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-100">
                      {product.title}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-100">
                      {formatPrice(product.price)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-slate-100 font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 20
                          ? "bg-green-900/20 text-green-400 border border-green-800"
                          : product.stock > 0
                          ? "bg-yellow-900/20 text-yellow-400 border border-yellow-800"
                          : "bg-red-900/20 text-red-400 border border-red-800"
                      }`}
                    >
                      {product.stock} sp
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg">
                Không tìm thấy sản phẩm nào
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
