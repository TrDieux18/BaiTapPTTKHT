import { getProductById, updateProduct } from "@/services/ProductService";
import type { Product, ProductForm } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import ProductFormComponent from "@/components/ProductForm";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    discountPercentage: 0,
    rating: 5,
    stock: "",
    thumbnail: "",
    isActive: true,
    slug: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const response: ApiResponse<Product> = await getProductById(id!);
        if (response.success && response.data) {
          const product = response.data;
          setFormData({
            title: product.title,
            description: product.description || "",
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            stock: product.stock,
            thumbnail: product.thumbnail || "",
            isActive: product.isActive,
            slug: product.slug,
          });
        }
      } catch (error) {
        alert("Không thể tải thông tin sản phẩm!");
        navigate("/admin/products");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.price || !formData.stock) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      const productData = {
        ...formData,
        _id: id,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
      };

      const response = await updateProduct(productData);

      if (!response.success) {
        alert("Cập nhật sản phẩm thất bại, vui lòng thử lại!");
        return;
      }

      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <ProductFormComponent
      mode="edit"
      formData={formData}
      loading={loading}
      onFormDataChange={setFormData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditProduct;
