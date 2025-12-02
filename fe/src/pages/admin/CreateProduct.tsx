import { createProduct } from "@/services/ProductService";
import type { ProductForm } from "@/types/Product";
import ProductFormComponent from "@/components/ProductForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
      };

      const response = await createProduct(productData);

      if (response.success && response.data) {
        alert("Tạo sản phẩm thành công!");
        navigate("/admin/products");
      } else {
        alert("Tạo sản phẩm thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductFormComponent
      mode="create"
      formData={formData}
      loading={loading}
      onFormDataChange={setFormData}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateProduct;
